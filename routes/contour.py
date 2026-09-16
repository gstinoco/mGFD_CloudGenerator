"""
Contour — Core functionality for Contour

Overview:
    This module provides functionality related to Contour.

Public API:
    allowed_file
    calculate_export_scale
    transform_coordinate
    contour_creator
    upload_file
    uploaded_file
    detect_region
    interactive_segmentation
    grabcut_segmentation
    refine_with_brush
    save_coordinates
    export_single_region
    save_all_coordinates

Credits:
    All the codes presented below were developed by:
        Dr. Gerardo Tinoco-Guerrero
        Dr. Francisco Javier Domínguez-Mota
        Dr. José Alberto Guzmán-Torres
        Universidad Michoacana de San Nicolás de Hidalgo
        gerardo.tinoco@umich.mx

    With the funding of:
        Secretary of Science, Humanities, Technology and Innovation, SECIHTI (Secretaria de Ciencia, Humanidades, Tecnología e Innovación). México.
        Coordination of Scientific Research, CIC-UMSNH (Coordinación de la Investigación Científica de la Universidad Michoacana de San Nicolás de Hidalgo, CIC-UMSNH). México.
        Aula CIMNE-Morelia. México.
        SIIIA-MATH: Soluciones de Ingeniería. México.

Date:
    March, 2026.
Last Modification:
    September, 2026.
"""

import os                                                                                                                               # OS path manipulation
import re                                                                                                                               # Regular expressions
import csv                                                                                                                              # CSV data export
import cv2                                                                                                                              # Computer Vision processing
import numpy as np                                                                                                                      # Matrix manipulation

from datetime import datetime                                                                                                           # Date formatting
from werkzeug.utils import secure_filename                                                                                              # Secure upload naming
from flask import render_template, request, jsonify, send_from_directory, current_app, url_for                                          # Flask request handlers

from contour_modules import detection as contour_detection                                                                              # Core vision algorithms

from . import contour_bp                                                                                                                # Import local blueprint

ALLOWED_EXTENSIONS     = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}                                                                           # Define safe image formats
ALLOWED_CSV_EXTENSIONS = {'csv'}                                                                                                        # Define safe export formats

def allowed_file(filename, extensions=ALLOWED_EXTENSIONS):                                                                              # Define function declaration structure signature
    """
    allowed_file
    Check if the uploaded file has an allowed image extension.

    Input:
        filename      str             Name of the file to validate.
        extensions    set             Set of allowed extensions.

    Output:
        allowed       bool            True if file extension is allowed, False otherwise.
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in extensions                                                         # Validate against set

def calculate_export_scale(w, h, config=None):                                                                                          # Define function declaration structure signature
    """
    calculate_export_scale
    Calculate scaling factors based on image dimensions and configuration.

    Input:
        w             int             Image width.
        h             int             Image height.
        config        dict            Scaling configuration. Defaults to None.

    Output:
        scales        tuple           (scale_x, scale_y) floats.
    """
    if config is None:                                                                                                                  # Default empty config
        config = {}                                                                                                                     # Create dictionary

    method = config.get('method', 'preserve_aspect_ratio')                                                                              # Extract user method

    if method == 'custom':                                                                                                              # If explicit override
        return float(config.get('custom_x', 1.0)), float(config.get('custom_y', 1.0))                                                   # Return exact inputs

    if method == 'stretch':                                                                                                             # If stretching to unit square
        return 1.0, 1.0                                                                                                                 # Return unit scales

    max_dim = max(w, h)                                                                                                                 # Find longest axis
    if max_dim > 0:                                                                                                                     # Avoid division by zero
        return w / max_dim, h / max_dim                                                                                                 # Return normalized ratios

    return 1.0, 1.0                                                                                                                     # Fallback

def transform_coordinate(point, scale_x, scale_y):                                                                                      # Define function declaration structure signature
    """
    transform_coordinate
    Transform a single coordinate point with scaling and safety clamping.

    Input:
        point         dict            Point object with 'x' and 'y' keys (normalized [0,1]).
        scale_x       float           Scaling factor for X axis.
        scale_y       float           Scaling factor for Y axis.

    Output:
        coords        tuple           (final_x, inverted_y) floats in range [0,1].
    """
    final_x    = point['x'] * scale_x                                                                                                   # Apply X scale
    inverted_y = (1.0 - point['y']) * scale_y                                                                                           # Apply Y scale and flip axis for math

    final_x    = max(0.0, min(1.0, final_x))                                                                                            # Hard clamp X to [0,1]
    inverted_y = max(0.0, min(1.0, inverted_y))                                                                                         # Hard clamp Y to [0,1]

    return final_x, inverted_y                                                                                                          # Return packed tuple

@contour_bp.route('/contour_creator')                                                                                                   # Bind routing endpoint decorator URI handler
def contour_creator():                                                                                                                  # Define function declaration structure signature
    """
    contour_creator
    Render the contour creator page for image processing and region detection.

    Input:
        None

    Output:
        str           str             Rendered HTML template for the contour creator interface.
    """
    return render_template('contour_creator.html')                                                                                      # Serve primary application view

@contour_bp.route('/upload', methods=['POST'])                                                                                          # Bind routing endpoint decorator URI handler
def upload_file():                                                                                                                      # Define function declaration structure signature
    """
    upload_file
    Handle image file uploads with validation and secure storage.

    Input:
        None (Uses request.files)

    Output:
        response      JSON            Response containing success status, filename, and URL.
    """
    try:                                                                                                                                # Sandbox upload block
        if 'file' not in request.files:                                                                                                 # Verify form data
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'No file selected'                                                                                           # Set error message
                })                                                                                                                      # Reject missing file

        file = request.files['file']                                                                                                    # Extract file object
        if file.filename == '':                                                                                                         # Verify name
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'No file selected'                                                                                           # Set error message
                })                                                                                                                      # Reject empty name

        if file and allowed_file(file.filename):                                                                                        # Validate extension
            timestamp         = datetime.now().strftime('%Y%m%d_%H%M%S')                                                                # Get current time string
            original_filename = secure_filename(file.filename)                                                                          # Sanitize user string
            name, ext         = os.path.splitext(original_filename)                                                                     # Split parts
            filename          = f"{name}_{timestamp}{ext}"                                                                              # Append timestamp

            filepath          = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)                                             # Construct local save path
            file.save(filepath)                                                                                                         # Dump file to disk

            file_url          = url_for('contour.uploaded_file', filename=filename)                                                     # Dynamically generate serve URL

            return jsonify({                                                                                                            # Success payload
                'success':  True,                                                                                                       # Flag ok
                'filename': filename,                                                                                                   # Internal reference
                'url':      file_url                                                                                                    # Frontend src URL
            })                                                                                                                          # Execution sequence map object logic
        else:                                                                                                                           # Invalid file
            return jsonify({                                                                                                            # Failure payload
                'success': False,                                                                                                       # Flag bad
                'error':   'File type not allowed'                                                                                      # Reason
                })                                                                                                                      # Reject

    except Exception as e:                                                                                                              # Server fault
        current_app.logger.error(f"Error in upload_file: {e}")                                                                          # Log issue
        return jsonify({                                                                                                                # Failure payload
            'success': False,                                                                                                           # Flag bad
            'error':   'Internal server error'                                                                                          # Reason
            })                                                                                                                          # Send generic error

@contour_bp.route('/uploads/<filename>')                                                                                                # Bind routing endpoint decorator URI handler
def uploaded_file(filename):                                                                                                            # Define function declaration structure signature
    """
    uploaded_file
    Serve uploaded files from the upload directory.

    Input:
        filename      str             Name of the file to serve.

    Output:
        Response      Response        File response for the requested uploaded file.
    """
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)                                                           # Pipe static file to client

@contour_bp.route('/detect_region', methods=['POST'])                                                                                   # Bind routing endpoint decorator URI handler
def detect_region():                                                                                                                    # Define function declaration structure signature
    """
    detect_region
    Detect region in image using optimized single-region segmentation.

    Input:
        None (Uses request.get_json())

    Output:
        response      JSON            Response containing success status, normalized contour points, and algorithm.
    """
    try:                                                                                                                                # Try floodfill detection
        data = request.get_json()                                                                                                       # Parse JSON payload

        if not data or 'filename' not in data or 'x' not in data or 'y' not in data:                                                    # Ensure minimum args
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'Incomplete data'                                                                                            # Set error message
                })                                                                                                                      # Reject

        filename  = data['filename']                                                                                                    # Fetch target image
        x         = int(data['x'])                                                                                                      # Seed X coordinate
        y         = int(data['y'])                                                                                                      # Seed Y coordinate
        tolerance = int(data.get('tolerance', 30))                                                                                      # Floodfill threshold

        filepath  = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)                                                         # Get actual path
        if not os.path.exists(filepath):                                                                                                # Check file
            return jsonify({                                                                                                            # Failure payload
                'success': False,                                                                                                       # Flag bad
                'error':   'File not found'                                                                                             # Reason
                })                                                                                                                      # Reject

        image = cv2.imread(filepath)                                                                                                    # Load matrix
        if image is None:                                                                                                               # Verify load
            return jsonify({                                                                                                            # Failure payload
                'success': False,                                                                                                       # Flag bad
                'error':   'Error loading image'                                                                                        # Reason
                })                                                                                                                      # Reject

        mask           = contour_detection.detect_region_at_point(image, x, y, tolerance)                                               # Execute detection engine
        algorithm_used = 'floodfill'                                                                                                    # Tag algorithm type

        if mask is not None:                                                                                                            # If engine succeeded
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)                                              # Extract geometric contours

            if contours:                                                                                                                # If shapes found
                best_contour = max(contours, key=cv2.contourArea)                                                                       # Isolate largest area (noise filter)

                contour_points = []                                                                                                     # Point accumulator
                for point in best_contour:                                                                                              # Iterate native points
                    contour_points.append({                                                                                             # Map to JSON format
                        'x': int(point[0][0]) / image.shape[1],                                                                         # Normalize by width
                        'y': int(point[0][1]) / image.shape[0]                                                                          # Normalize by height
                    })                                                                                                                  # Execution sequence map object logic

                return jsonify({                                                                                                        # Dispatch output
                    'success':        True,                                                                                             # Flag ok
                    'contour_points': contour_points,                                                                                   # Path nodes
                    'algorithm':      algorithm_used or 'combined'                                                                      # Metadata
                })                                                                                                                      # Execution sequence map object logic

        return jsonify({                                                                                                                # Soft failure
            'success': False,                                                                                                           # Flag fail
            'error':   'Could not detect region'                                                                                        # Message
        })                                                                                                                              # Execution sequence map object logic

    except Exception as e:                                                                                                              # Hard failure
        current_app.logger.error(f"Error in detect_region: {e}")                                                                        # Trace
        return jsonify({                                                                                                                # Dispatch error
            'success': False,                                                                                                           # Flag fail
            'error':   'Internal server error'                                                                                          # Message
        })                                                                                                                              # Execution sequence map object logic

@contour_bp.route('/interactive_segmentation', methods=['POST'])                                                                        # Bind routing endpoint decorator URI handler
def interactive_segmentation():                                                                                                         # Define function declaration structure signature
    """
    interactive_segmentation
    Perform interactive segmentation using positive and negative seed markers.

    Input:
        None (Uses request.get_json())

    Output:
        response      JSON            Response containing success status, normalized contour points, and algorithm.
    """
    try:                                                                                                                                # Try seeded detection
        data = request.get_json()                                                                                                       # Parse JSON

        if not data or 'filename' not in data:                                                                                          # Validate payload
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'Incomplete data'                                                                                            # Set error message
                })                                                                                                                      # Reject

        filename       = data['filename']                                                                                               # Locate image
        positive_seeds = data.get('positive_seeds', [])                                                                                 # Array of 'keep' points
        negative_seeds = data.get('negative_seeds', [])                                                                                 # Array of 'discard' points
        tolerance      = int(data.get('tolerance', 30))                                                                                 # Algorithm sensitivity

        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)                                                          # Get file path
        if not os.path.exists(filepath):                                                                                                # Ensure exists
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'File not found'                                                                                             # Set error message
                })                                                                                                                      # Reject

        image = cv2.imread(filepath)                                                                                                    # Load matrix
        if image is None:                                                                                                               # Guard read
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'Error loading image'                                                                                        # Set error message
                })                                                                                                                      # Reject

        h, w         = image.shape[:2]                                                                                                  # Extract pixel dimensions
        pos_seeds_px = [(int(seed['x'] * w), int(seed['y'] * h)) for seed in positive_seeds]                                            # Un-normalize positive array
        neg_seeds_px = [(int(seed['x'] * w), int(seed['y'] * h)) for seed in negative_seeds]                                            # Un-normalize negative array

        mask = contour_detection.interactive_segmentation_with_seeds(                                                                   # Dispatch engine
            image, pos_seeds_px, neg_seeds_px, tolerance                                                                                # Pass params
        )                                                                                                                               # Execution sequence map object logic

        if mask is not None:                                                                                                            # Engine ran
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)                                              # Extract vector shapes

            if contours:                                                                                                                # If shapes exist
                best_contour = max(contours, key=cv2.contourArea)                                                                       # Filter noise

                contour_points = []                                                                                                     # Result array
                for point in best_contour:                                                                                              # Iterate vertex list
                    contour_points.append({                                                                                             # Map format
                        'x': int(point[0][0]) / w,                                                                                      # Scale to screen
                        'y': int(point[0][1]) / h                                                                                       # Scale to screen
                    })                                                                                                                  # Execution sequence map object logic

                return jsonify({                                                                                                        # Push results
                    'success':        True,                                                                                             # Pass
                    'contour_points': contour_points,                                                                                   # Array
                    'algorithm':      'interactive_seeds'                                                                               # Tag
                })                                                                                                                      # Execution sequence map object logic

        return jsonify({                                                                                                                # Notify failure
            'success': False,                                                                                                           # Fail
            'error':   'Could not generate segmentation'                                                                                # Message
        })                                                                                                                              # Execution sequence map object logic

    except Exception as e:                                                                                                              # Trap error
        current_app.logger.error(f"Error in interactive_segmentation: {e}")                                                             # Trace
        return jsonify({                                                                                                                # Reject
            'success': False,                                                                                                           # Fail
            'error':   'Internal server error'                                                                                          # Message
        })                                                                                                                              # Execution sequence map object logic

@contour_bp.route('/grabcut_segmentation', methods=['POST'])                                                                            # Bind routing endpoint decorator URI handler
def grabcut_segmentation():                                                                                                             # Define function declaration structure signature
    """
    grabcut_segmentation
    Perform interactive segmentation using GrabCut algorithm.

    Input:
        None (Uses request.get_json())

    Output:
        response      JSON            Response containing success status, normalized contour points, and algorithm.
    """
    try:                                                                                                                                # Try grabcut box
        data = request.get_json()                                                                                                       # Unpack json

        if not data or 'filename' not in data:                                                                                          # Validate requirement
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'Incomplete data'                                                                                            # Set error message
                })                                                                                                                      # Reject

        filename   = data['filename']                                                                                                   # Name
        rect       = data.get('rect')                                                                                                   # {x, y, width, height} normalized
        iterations = int(data.get('iterations', 5))                                                                                     # GC cycles

        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)                                                          # Form local path
        if not os.path.exists(filepath):                                                                                                # Check
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'File not found'                                                                                             # Set error message
                })                                                                                                                      # Reject

        image = cv2.imread(filepath)                                                                                                    # Read matrix
        if image is None:                                                                                                               # Check
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'Error loading image'                                                                                        # Set error message
                })                                                                                                                      # Reject

        rect_px = None                                                                                                                  # Init pixel rect
        if rect:                                                                                                                        # If box exists
            h, w = image.shape[:2]                                                                                                      # Fetch max scale
            rect_px = (                                                                                                                 # Calculate tuple
                int(rect['x'] * w),                                                                                                     # Corner X
                int(rect['y'] * h),                                                                                                     # Corner Y
                int(rect['width'] * w),                                                                                                 # Span X
                int(rect['height'] * h)                                                                                                 # Span Y
            )                                                                                                                           # Execution sequence map object logic

        mask = contour_detection.grabcut_interactive(image, rect_px, iterations=iterations)                                             # Pass to worker

        if mask is not None:                                                                                                            # Result checking
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)                                              # Vectorize

            if contours:                                                                                                                # Subchecking
                best_contour = max(contours, key=cv2.contourArea)                                                                       # Strip noise

                h, w           = image.shape[:2]                                                                                        # Re-fetch dims
                contour_points = []                                                                                                     # Array
                for point in best_contour:                                                                                              # Iterate
                    contour_points.append({                                                                                             # Map dict
                        'x': int(point[0][0]) / w,                                                                                      # Fraction X
                        'y': int(point[0][1]) / h                                                                                       # Fraction Y
                    })                                                                                                                  # Execution sequence map object logic

                return jsonify({                                                                                                        # Complete
                    'success':        True,                                                                                             # OK
                    'contour_points': contour_points,                                                                                   # Array
                    'algorithm':      'grabcut'                                                                                         # Tag
                })                                                                                                                      # Execution sequence map object logic

        return jsonify({                                                                                                                # Engine fault
            'success': False,                                                                                                           # Fail
            'error':   'Could not generate segmentation'                                                                                # Message
        })                                                                                                                              # Execution sequence map object logic

    except Exception as e:                                                                                                              # Runtime fault
        current_app.logger.error(f"Error in grabcut_segmentation: {e}")                                                                 # Show trace
        return jsonify({                                                                                                                # Send generic
            'success': False,                                                                                                           # Fail
            'error':   'Internal server error'                                                                                          # Message
            })                                                                                                                          # Execution sequence map object logic

@contour_bp.route('/refine_with_brush', methods=['POST'])                                                                               # Bind routing endpoint decorator URI handler
def refine_with_brush():                                                                                                                # Define function declaration structure signature
    """
    refine_with_brush
    Refine segmentation mask using brush strokes.

    Input:
        None (Uses request.get_json())

    Output:
        response      JSON            Response containing success status, refined contour points, and algorithm.
    """
    try:                                                                                                                                # Wrap brush operation
        data = request.get_json()                                                                                                       # Read user strokes

        if not data or 'filename' not in data or 'current_contour' not in data:                                                         # Validate data
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'Incomplete data'                                                                                            # Set error message
                })                                                                                                                      # Abort

        filename        = data['filename']                                                                                              # ID
        current_contour = data['current_contour']                                                                                       # State prior to stroke
        brush_strokes   = data.get('brush_strokes', [])                                                                                 # Stroke data array

        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)                                                          # Target path
        if not os.path.exists(filepath):                                                                                                # Check
            return jsonify({                                                                                                            # Engine fault
                'success': False,                                                                                                       # Fail
                'error':   'File not found'                                                                                             # Message
                })                                                                                                                      # Execution sequence map object logic

        image = cv2.imread(filepath)                                                                                                    # Pull image for dimensions
        if image is None:                                                                                                               # Verify load
            return jsonify({                                                                                                            # Engine fault
                'success': False,                                                                                                       # Fail
                'error':   'Error loading image'                                                                                        # Message
                })                                                                                                                      # Execution sequence map object logic

        h, w         = image.shape[:2]                                                                                                  # Pull sizing
        current_mask = np.zeros((h, w), dtype=np.uint8)                                                                                 # Allocate empty mask canvas

        if current_contour:                                                                                                             # If region exists
            contour_px = np.array([                                                                                                     # Rescale polygon from fractions
                [[int(pt['x'] * w), int(pt['y'] * h)]] for pt in current_contour                                                        # Scale iteration
            ], dtype=np.int32)                                                                                                          # Enforce CV2 datatype
            cv2.fillPoly(current_mask, [contour_px], 255)                                                                               # Burn original mask into canvas

        brush_strokes_px = []                                                                                                           # Stroke array
        for stroke in brush_strokes:                                                                                                    # Process all actions
            stroke_px = {                                                                                                               # Remap stroke object
                'points': [(int(pt['x'] * w), int(pt['y'] * h)) for pt in stroke.get('points', [])],                                    # Un-normalize path
                'mode':   stroke.get('mode', 'add'),                                                                                    # Add vs Erase
                'size':   int(stroke.get('size', 10))                                                                                   # Brush radius
            }                                                                                                                           # Execution sequence map object logic
            brush_strokes_px.append(stroke_px)                                                                                          # Save sequence

        refined_mask = contour_detection.refine_mask_with_brush(current_mask, brush_strokes_px)                                         # Execute pixel-level operations

        if refined_mask is not None:                                                                                                    # Check validity
            contours, _ = cv2.findContours(refined_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)                                      # Re-vectorize boundaries

            if contours:                                                                                                                # Verify presence
                best_contour = max(contours, key=cv2.contourArea)                                                                       # Ensure largest single blob

                contour_points = []                                                                                                     # Allocate
                for point in best_contour:                                                                                              # Loop vertices
                    contour_points.append({                                                                                             # Map node
                        'x': int(point[0][0]) / w,                                                                                      # Re-normalize
                        'y': int(point[0][1]) / h                                                                                       # Re-normalize
                    })                                                                                                                  # Execution sequence map object logic

                return jsonify({                                                                                                        # Success payload
                    'success':        True,                                                                                             # Truth
                    'contour_points': contour_points,                                                                                   # Data
                    'algorithm':      'brush_refined'                                                                                   # Tagging
                })                                                                                                                      # Execution sequence map object logic

        return jsonify({                                                                                                                # Failure payload
            'success': False,                                                                                                           # Falsehood
            'error':   'Could not refine mask'                                                                                          # Error message string
        })                                                                                                                              # Brush erased everything or failed

    except Exception as e:                                                                                                              # System fault
        current_app.logger.error(f"Error in refine_with_brush: {e}")                                                                    # Notice log
        return jsonify({                                                                                                                # Failure payload
            'success': False,                                                                                                           # Falsehood
            'error':   'Internal server error'                                                                                          # Error message string
        })                                                                                                                              # Send generic

@contour_bp.route('/save_coordinates', methods=['POST'])                                                                                # Bind routing endpoint decorator URI handler
def save_coordinates():                                                                                                                 # Define function declaration structure signature
    """
    save_coordinates
    Save contour coordinates to CSV file format.

    Input:
        None (Uses request.get_json())

    Output:
        response      JSON            Response containing success status, filename, and download URL.
    """
    try:                                                                                                                                # Try safe serialization
        data = request.get_json()                                                                                                       # Get payload

        if not data or 'coordinates' not in data:                                                                                       # Validate array exists
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'No coordinates provided'                                                                                    # Set error message
                })                                                                                                                      # Abort

        coordinates = data['coordinates']                                                                                               # Extract array
        region_name = data.get('region_name', f'region_{datetime.now().strftime("%Y%m%d_%H%M%S")}')                                     # Check for custom naming

        timestamp   = datetime.now().strftime('%Y%m%d_%H%M%S')                                                                          # Generate stamp
        filename    = f"{region_name}_{timestamp}.csv"                                                                                  # Suffix file
        filepath    = os.path.join(current_app.config['OUTPUT_FOLDER'], filename)                                                       # Target directory

        with open(filepath, 'w', newline='', encoding='utf-8') as f:                                                                    # Open for CSV write
            writer = csv.writer(f)                                                                                                      # Initialize writer
            writer.writerow(['x', 'y'])                                                                                                 # Print header row
            for coord in coordinates:                                                                                                   # Cycle points
                if isinstance(coord, dict):                                                                                             # Dictionary format
                    writer.writerow([coord.get('x'), coord.get('y')])                                                                   # Extract map
                elif isinstance(coord, (list, tuple)) and len(coord) >= 2:                                                              # Tuple/Array format
                    writer.writerow(coord[:2])                                                                                          # Extract indices

        return jsonify({                                                                                                                # Broadcast success
            'success':      True,                                                                                                       # OK
            'filename':     filename,                                                                                                   # Name for backend
            'download_url': f'/download/{filename}'                                                                                     # Endpoint for frontend
        })                                                                                                                              # Execution sequence map object logic

    except Exception as e:                                                                                                              # Check IO errors
        current_app.logger.error(f"Error in save_coordinates: {e}")                                                                     # Log fault
        return jsonify({                                                                                                                # Abort softly
            'success': False,                                                                                                           # Flag fail
            'error':   'Error saving coordinates'                                                                                       # Tell UI
        })                                                                                                                              # Execution sequence map object logic

@contour_bp.route('/export_single_region', methods=['POST'])                                                                            # Bind routing endpoint decorator URI handler
def export_single_region():                                                                                                             # Define function declaration structure signature
    """
    export_single_region
    Export a single detected region to a CSV file.

    Input:
        None (Uses request.get_json())

    Output:
        response      JSON            Response containing success status, output filename, and download URL.
    """
    try:                                                                                                                                # Wrap region export
        data = request.get_json()                                                                                                       # Fetch JSON stream

        if not data or 'contour_points' not in data:                                                                                    # Validate data chunk
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'No contour points provided'                                                                                 # Set error message
                })                                                                                                                      # Fail safely

        contour_points = data['contour_points']                                                                                         # Extract node list
        region_name    = data.get('region_name', f'region_{datetime.now().strftime("%Y%m%d_%H%M%S")}')                                  # Fallback naming
        filename       = data.get('filename', '')                                                                                       # Reference image file
        scaling_config = data.get('scaling_config', {})                                                                                 # Sizing options
        normalize      = data.get('normalize', True)                                                                                    # Unitary normalization flag

        if not contour_points or len(contour_points) == 0:                                                                              # Check array
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'No contour points to export'                                                                                # Set error message
                })                                                                                                                      # Skip generation

        scale_x = 1.0                                                                                                                   # Init scale tracker
        scale_y = 1.0                                                                                                                   # Init scale tracker

        if filename:                                                                                                                    # If image linked
            filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)                                                      # Resolve real path
            if os.path.exists(filepath):                                                                                                # Check if file remains
                image = cv2.imread(filepath)                                                                                            # Load strictly to query matrix dimensions
                if image is not None:                                                                                                   # Guard against corruption
                    h, w = image.shape[:2]                                                                                              # Isolate geometry sizes
                    scale_x, scale_y = calculate_export_scale(w, h, scaling_config)                                                     # Call mathematical scaling module

        coordinates   = []                                                                                                              # Master container for CSV dump
        region_number = 1                                                                                                               # Presume region ID
        if region_name and 'region' in region_name.lower():                                                                             # Parse name string
            try:                                                                                                                        # Safe parse
                match = re.search(r'(\d+)', region_name)                                                                                # RegEx match for digits
                if match:                                                                                                               # Valid digit string
                    region_number = int(match.group(1))                                                                                 # Register ID
            except:                                                                                                                     # Fail RegEx
                region_number = 1                                                                                                       # Default

        for point in contour_points:                                                                                                    # Process all vertex structures
            final_x, inverted_y = transform_coordinate(point, scale_x, scale_y)                                                         # Format and scale point
            coordinates.append([final_x, inverted_y, region_number])                                                                    # Tag and append point

        if coordinates and normalize:                                                                                                   # Post-process global bounds mapping
            min_x = min(c[0] for c in coordinates)                                                                                      # Calculate minimum extent X
            max_x = max(c[0] for c in coordinates)                                                                                      # Calculate maximum extent X
            min_y = min(c[1] for c in coordinates)                                                                                      # Calculate minimum extent Y
            max_y = max(c[1] for c in coordinates)                                                                                      # Calculate maximum extent Y

            range_x = max_x - min_x                                                                                                     # Span X
            range_y = max_y - min_y                                                                                                     # Span Y
            max_range = max(range_x, range_y)                                                                                           # Enforce uniform scale divisor
            if max_range == 0:                                                                                                          # Trap zero dimension division
                max_range = 1.0                                                                                                         # Bypass

            for c in coordinates:                                                                                                       # Loop array references
                c[0] = (c[0] - min_x) / max_range                                                                                       # Rebase X to origin
                c[1] = (c[1] - min_y) / max_range                                                                                       # Rebase Y to origin

        timestamp        = datetime.now().strftime('%Y%m%d_%H%M%S')                                                                     # Clock stamp for file saving
        safe_region_name = secure_filename(region_name) if region_name else 'region'                                                    # Ensure safe string formatting
        output_filename  = f"{safe_region_name}_{timestamp}.csv"                                                                         # Concat string parts
        filepath         = os.path.join(current_app.config['OUTPUT_FOLDER'], output_filename)                                           # Find output absolute address

        with open(filepath, 'w', newline='', encoding='utf-8') as f:                                                                    # Prepare to write bytes
            writer = csv.writer(f)                                                                                                      # Initialize writer class
            writer.writerow(['x', 'y', 'region'])                                                                                       # Title format column set
            writer.writerows(coordinates)                                                                                               # Dump massive array

        return jsonify({                                                                                                                # Forward link variables
            'success':      True,                                                                                                       # Result truth
            'filename':     output_filename,                                                                                            # Filename generated
            'download_url': f'/download/{output_filename}'                                                                              # URI reference for download
        })                                                                                                                              # Execution sequence map object logic

    except Exception as e:                                                                                                              # Check disk and memory fault states
        current_app.logger.error(f"Error in export_single_region: {e}")                                                                 # Warn console operators
        return jsonify({                                                                                                                # Drop logic chain
            'success': False,                                                                                                           # Negative boolean cast
            'error':   'Error exporting region'                                                                                         # Reason string output
        })                                                                                                                              # Execution sequence map object logic

@contour_bp.route('/save_all_coordinates', methods=['POST'])                                                                            # Bind routing endpoint decorator URI handler
def save_all_coordinates():                                                                                                             # Define function declaration structure signature
    """
    save_all_coordinates
    Save coordinates from multiple regions to a single CSV file.

    Input:
        None (Uses request.get_json())

    Output:
        response      JSON            Response containing success status, output filename, and download URL.
    """
    try:                                                                                                                                # Open multiple-region export pipeline
        data = request.get_json()                                                                                                       # Parse incoming object stream

        if not data or 'regions' not in data:                                                                                           # Intercept null definitions
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'No regions provided'                                                                                        # Set error message
                })                                                                                                                      # Return negative output

        regions        = data['regions']                                                                                                # Store main JSON segment
        filename       = data.get('filename', '')                                                                                       # Request original target asset
        scaling_config = data.get('scaling_config', {})                                                                                 # Define mathematical scale state
        normalize      = data.get('normalize', True)                                                                                    # Fetch true/false normalization flag

        if not regions or len(regions) == 0:                                                                                            # Assess payload array count size
            return jsonify({                                                                                                            # Return JSON response
                'success': False,                                                                                                       # Set success to False
                'error':   'No regions to save'                                                                                         # Set error message
                })                                                                                                                      # Prevent blind logic triggers

        scale_x = 1.0                                                                                                                   # Reset ratio dimension variable
        scale_y = 1.0                                                                                                                   # Reset ratio dimension variable

        if filename:                                                                                                                    # Detect link to file asset state
            filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)                                                      # Concat local machine directory string
            if os.path.exists(filepath):                                                                                                # Prove path resolves safely
                image = cv2.imread(filepath)                                                                                            # Boot matrix parser engine
                if image is not None:                                                                                                   # Confirm memory allocation clear
                    h, w = image.shape[:2]                                                                                              # Siphon image raster matrix parameters
                    scale_x, scale_y = calculate_export_scale(w, h, scaling_config)                                                     # Delegate output generation calculation

        all_coordinates = []                                                                                                            # Spawn massive dump container array

        for i, region in enumerate(regions):                                                                                            # Process chunk blocks internally
            if 'contour_points' in region and region['contour_points']:                                                                 # Guard array iteration loops
                region_name = region.get('name', f'region_{i+1}')                                                                       # Pull default name fallback string

                region_number = i + 1                                                                                                   # Establish base index integer
                if region_name and 'region' in region_name.lower():                                                                     # Evaluate possible RegEx pattern string
                    try:                                                                                                                # Soft-fail RegEx attempt sequence
                        match = re.search(r'(\d+)', region_name)                                                                        # Run numeric extraction regex string
                        if match:                                                                                                       # Ensure boolean truth check
                            region_number = int(match.group(1))                                                                         # Hardcode digit match format
                    except:                                                                                                             # Fallback to string loop counter
                        region_number = i + 1                                                                                           # Append iteration number parameter

                for point in region['contour_points']:                                                                                  # Enumerate points directly for scale
                    final_x, inverted_y = transform_coordinate(point, scale_x, scale_y)                                                 # Call individual formatter module block
                    all_coordinates.append([final_x, inverted_y, region_number])                                                        # Build tuple array

        if not all_coordinates:                                                                                                         # Re-evaluate complete array existence
            return jsonify({                                                                                                            # Forward link variables
                'success': False,                                                                                                       # Drop logic chain
                'error':   'No coordinates to save'                                                                                     # Drop logic chain
            })                                                                                                                          # Execution sequence map object logic

        if normalize:                                                                                                                   # Read configuration matrix command flag
            min_x     = min(c[0] for c in all_coordinates)                                                                              # Find X bounding constraint box edge
            max_x     = max(c[0] for c in all_coordinates)                                                                              # Find X bounding constraint box edge
            min_y     = min(c[1] for c in all_coordinates)                                                                              # Find Y bounding constraint box edge
            max_y     = max(c[1] for c in all_coordinates)                                                                              # Find Y bounding constraint box edge

            range_x   = max_x - min_x                                                                                                   # Build mathematical subtraction box
            range_y   = max_y - min_y                                                                                                   # Build mathematical subtraction box
            max_range = max(range_x, range_y)                                                                                           # Seek true max distance multiplier
            if max_range == 0:                                                                                                          # Preempt math divide error logic
                max_range = 1.0                                                                                                         # Disable divisor function dynamically

            for c in all_coordinates:                                                                                                   # Iterate through final structure elements
                c[0] = (c[0] - min_x) / max_range                                                                                       # Re-assign variables with computation
                c[1] = (c[1] - min_y) / max_range                                                                                       # Re-assign variables with computation

        timestamp       = datetime.now().strftime('%Y%m%d_%H%M%S')                                                                      # Run time sequence logic generator module
        safe_filename   = secure_filename(filename) if filename else 'regions'                                                          # Purify characters in system string input
        output_filename = f"{safe_filename}_all_regions_{timestamp}.csv"                                                                # Stitch filename using standard templates
        filepath        = os.path.join(current_app.config['OUTPUT_FOLDER'], output_filename)                                            # Create system path URL format string

        with open(filepath, 'w', newline='', encoding='utf-8') as f:                                                                    # Start streaming procedure sequence chunk
            writer = csv.writer(f)                                                                                                      # Spin up file writer engine configuration
            writer.writerow(['x', 'y', 'region'])                                                                                       # Stamp schema layout format string title
            writer.writerows(all_coordinates)                                                                                           # Transfer variable arrays straight to disk

        return jsonify({                                                                                                                # Final exit response wrapper formatting
            'success':      True,                                                                                                       # Signal successful completion operation
            'filename':     output_filename,                                                                                            # Serve string key identifying export file
            'download_url': f'/download/{output_filename}'                                                                              # Expose REST URL pathway to end user client
        })                                                                                                                              # Execution sequence map object logic

    except Exception as e:                                                                                                              # Check failure mode conditions execution
        current_app.logger.error(f"Error in save_all_coordinates: {e}")                                                                 # Relay alert log level stream backend print
        return jsonify({                                                                                                                # Provide safe wrapper output return array
            'success': False,                                                                                                           # Send logical false bit value transmission
            'error': 'Error saving coordinates'                                                                                         # Present diagnostic information to clients
        })                                                                                                                              # Execution sequence map object logic



