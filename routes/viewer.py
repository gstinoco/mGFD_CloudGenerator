"""
Viewer — Core functionality for Viewer

Overview:
    This module provides functionality related to Viewer.

Public API:
    allowed_file
    allowed_csv_file
    viewer
    upload_viewer

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

import os                                                                                                                               # Disk traversal methods

from datetime import datetime                                                                                                           # Calendar objects
from werkzeug.utils import secure_filename                                                                                              # Filename sanitization
from flask import render_template, request, jsonify, current_app                                                                        # Flask routing tools

from analysis_modules.neighbors import read_cloud_data                                                                                  # Parsing utility handlers

from . import viewer_bp                                                                                                                 # Controller namespace


ALLOWED_EXTENSIONS     = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}                                                                           # Static array for rasters
ALLOWED_CSV_EXTENSIONS = {'csv'}                                                                                                        # Static array for files

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
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in extensions                                                         # Trigger boolean cast

def allowed_csv_file(filename):                                                                                                         # Define function declaration structure signature
    """
    allowed_csv_file
    Check if the uploaded file has an allowed CSV extension.

    Input:
        filename      str             Name of the file to validate.

    Output:
        allowed       bool            True if file extension is 'csv', False otherwise.
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_CSV_EXTENSIONS                                             # Trigger boolean cast

@viewer_bp.route('/viewer')                                                                                                             # Bind routing endpoint decorator URI handler
def viewer():                                                                                                                           # Define function declaration structure signature
    """
    viewer
    Render the cloud/contour viewer page.

    Input:
        None

    Output:
        str           str             Rendered HTML template for the viewer interface.
    """
    return render_template('viewer.html')                                                                                               # Transmit frontend UI page

@viewer_bp.route('/upload_viewer', methods=['POST'])                                                                                    # Bind routing endpoint decorator URI handler
def upload_viewer():                                                                                                                    # Define function declaration structure signature
    """
    upload_viewer
    Handle CSV file upload and generate visualization for the viewer.

    Input:
        None (Uses request.files)

    Output:
        response      JSON            JSON response with image URLs or error message.
    """
    try:                                                                                                                                # Try safe extraction execution
        if 'file' not in request.files:                                                                                                 # Guard against empty transmission
            return jsonify({                                                                                                            # Send warning parameter fail
                'success': False,                                                                                                       # Boolean falsy state
                'error':   'No file part'                                                                                               # String error message
                })                                                                                                                      # Return object error fail

        file = request.files['file']                                                                                                    # Establish direct pointer context
        if file.filename == '':                                                                                                         # Guard against invalid naming logic
            return jsonify({                                                                                                            # Send string string missing property
                'success': False,                                                                                                       # Boolean falsy state
                'error':   'No selected file'                                                                                           # String error message
                })                                                                                                                      # Return object error fail

        if file and allowed_csv_file(file.filename):                                                                                    # Proceed valid payload stream validation
            filename        = secure_filename(file.filename)                                                                            # Filter unsafe string parameters logic
            timestamp       = datetime.now().strftime("%Y%m%d_%H%M%S")                                                                  # Get sequence string timestamp ID logic
            unique_filename = f"viewer_{timestamp}_{filename}"                                                                          # Rebuild clean filename reference object
            input_path      = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)                                        # Target output environment format structure
            output_base     = os.path.splitext(input_path)[0]                                                                           # Remove extension string mapping array chunk

            file.save(input_path)                                                                                                       # Dump payload stream raw state data bytes

            points, regions, classifications = read_cloud_data(input_path)                                                              # Delegate string parsing matrix array engine

            if points is None or len(points) == 0:                                                                                      # Monitor array execution data truth length
                return jsonify({'success': False, 'error': 'Failed to load points from CSV or file is empty'})                          # Forward system runtime fail data variable state

            return jsonify({                                                                                                            # Bundle success process package transmission API wrapper
                'success':         True,                                                                                                # Truth tag state verification process map string logic
                'points':          points.tolist() if hasattr(points, 'tolist') else points,                                            # Data string transmission array list serialized node mapping
                'regions':         regions.tolist() if hasattr(regions, 'tolist') else regions,                                         # Topological state definition property string configuration array
                'classifications': classifications.tolist() if hasattr(classifications, 'tolist') else classifications,                 # Metadata flag parameter boolean sequence reference node format
                'total_points':    len(points)                                                                                          # Pass raw scalar dimension parameter list constraint configuration
            })                                                                                                                          # Execution sequence map object logic

        else:                                                                                                                           # File test execution validation check string extension fail flag
            return jsonify({                                                                                                            # Bundle error condition
                'success': False,                                                                                                       # Boolean falsy state
                'error':   'Invalid file type. Please upload a CSV file.'                                                               # Return validation error condition payload package logic exit status
                })                                                                                                                      # Return object

    except Exception as e:                                                                                                              # Trace error process string log level stream execution sequence
        current_app.logger.error(f"Error in upload_viewer: {str(e)}")                                                                   # Emit stack information parameter payload warning target server console
        return jsonify({                                                                                                                # Bundle error condition
            'success': False,                                                                                                           # Boolean falsy state
            'error':   str(e)                                                                                                           # Present array logic boolean false diagnostic text property array output
            })                                                                                                                          # Return object



