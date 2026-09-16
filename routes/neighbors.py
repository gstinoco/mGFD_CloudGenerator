"""
Neighbors — Core functionality for Neighbors

Overview:
    This module provides functionality related to Neighbors.

Public API:
    allowed_file
    allowed_csv_file
    neighbors
    upload_neighbors

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

import os                                                                                                                               # System paths
import csv                                                                                                                              # Serialization functions
import numpy as np                                                                                                                      # Matrix manipulation

from datetime import datetime                                                                                                           # Clock tracking
from werkzeug.utils import secure_filename                                                                                              # String validation
from flask import render_template, request, jsonify, current_app, url_for                                                               # Flask handler stack

from mGFD.cloud_generator.viz.visualization import render_neighbors_graph                                                               # Plotter bridge
from analysis_modules.neighbors import compute_neighbors_from_file, read_cloud_data                                                     # Worker algorithm

from . import neighbors_bp                                                                                                              # Module namespace

ALLOWED_EXTENSIONS     = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}                                                                           # Raster permissions
ALLOWED_CSV_EXTENSIONS = {'csv'}                                                                                                        # Data permissions

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
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in extensions                                                         # Execute set filter check

def allowed_csv_file(filename):                                                                                                         # Define function declaration structure signature
    """
    allowed_csv_file
    Check if the uploaded file has an allowed CSV extension.

    Input:
        filename      str             Name of the file to validate.

    Output:
        allowed       bool            True if file extension is 'csv', False otherwise.
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_CSV_EXTENSIONS                                             # Execute CSV limit filter

@neighbors_bp.route('/neighbors')                                                                                                       # Bind routing endpoint decorator URI handler
def neighbors():                                                                                                                        # Define function declaration structure signature
    """
    neighbors
    Render the neighbors calculator page.

    Input:
        None

    Output:
        str           str             Rendered HTML template for the neighbors interface.
    """
    return render_template('neighbors.html')                                                                                            # Send client template UI layout

@neighbors_bp.route('/upload_neighbors', methods=['POST'])                                                                              # Bind routing endpoint decorator URI handler
def upload_neighbors():                                                                                                                 # Define function declaration structure signature
    """
    upload_neighbors
    Handle CSV file upload and calculate neighbors.

    Input:
        None (Uses request.files)

    Output:
        response      JSON            JSON response with neighbors CSV URL and visualization or error message.
    """
    try:                                                                                                                                # Try neighbors workflow sequence block
        if 'file' not in request.files:                                                                                                 # Ensure user provided file input stream
            return jsonify({'success': False, 'error': 'No file part'})                                                                 # Deny process on missing argument check

        file = request.files['file']                                                                                                    # Store file transmission object reference
        if file.filename == '':                                                                                                         # Ensure valid filename stream character length
            return jsonify({'success': False, 'error': 'No selected file'})                                                             # Reject null name string pass parameter

        if file and allowed_csv_file(file.filename):                                                                                    # Proceed valid CSV security extension pass check
            filename        = secure_filename(file.filename)                                                                            # Clean potentially dangerous filesystem name input
            timestamp       = datetime.now().strftime("%Y%m%d_%H%M%S")                                                                  # Fetch unique numerical string clock timestamp
            unique_filename = f"neighbors_{timestamp}_{filename}"                                                                       # Assign explicit namespace ID string format suffix
            input_path      = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)                                        # Establish safe storage execution target context directory
            output_base     = os.path.splitext(input_path)[0]                                                                           # Extract string path filename structure without extension

            nvec_str        = request.form.get('nvec', '9')                                                                             # Request number of neighbor nodes integer parameter
            try:                                                                                                                        # Try string digit character parser conversion logic
                nvec = int(nvec_str)                                                                                                    # Validate casting sequence from string digit object
            except ValueError:                                                                                                          # On failure format text characters parse condition map
                nvec = 9                                                                                                                # Provide safe baseline execution integer configuration

            file.save(input_path)                                                                                                       # Commit data array payload OS disk system write

            neighbors_indices = compute_neighbors_from_file(input_path, nvec=nvec)                                                      # Invoke analysis algorithm worker core execution instance

            if neighbors_indices is None:                                                                                               # Evaluate engine response logic calculation condition flag
                return jsonify({                                                                                                        # Return JSON with the following key-value pairs
                    'success': False,                                                                                                   # Set success flag to False
                    'error': 'Failed to compute neighbors'                                                                              # Set error message to False
                })                                                                                                                      # Alert UI process worker engine exception system trigger

            neighbors_csv_path = f"{output_base}_neighbors.csv"                                                                         # Format result index structure matrix output mapping file
            with open(neighbors_csv_path, 'w', newline='') as f:                                                                        # Prepare IO stream process byte transfer loop sequence
                writer = csv.writer(f)                                                                                                  # Link CSV handler driver instance formatting execution write
                header = ['point_idx'] + [f'neighbor_{i+1}' for i in range(neighbors_indices.shape[1])]                                 # Set dynamic column array headers integer limit list
                writer.writerow(header)                                                                                                 # Write title index sequence array string first record
                for i, row in enumerate(neighbors_indices):                                                                             # Step loop array structure values extraction list pass
                    writer.writerow([i] + row.tolist())                                                                                 # Dump node values to target record target execution file

            points, regions, classifications = read_cloud_data(input_path)                                                              # Deserialize output information structures from raw sequence array

            total_points             = len(points)                                                                                      # Extract node scale length limits target index
            unique_regions           = len(np.unique(regions))                                                                          # Compute region count sequence target calculation string index

            neighbors_found          = np.sum(neighbors_indices != -1)                                                                  # Find positive hits against padding boolean logic mask array
            total_possible_neighbors = neighbors_indices.size                                                                           # Gather max theoretical density volume dimension count integer
            avg_neighbors            = neighbors_found / total_points                                                                   # Derive connectivity metric arithmetic density volume sum count

            filename_base     = os.path.basename(output_base)                                                                           # Get absolute path format endpoint path link url map location
            neighbors_csv_url = url_for('contour.uploaded_file', filename=f"{filename_base}_neighbors.csv")                             # Pass parameter generation web handler lookup mapping sequence structure

            graph_generated   = render_neighbors_graph(points, neighbors_indices, regions, output_base)                                 # Pass variable state context plotter renderer logic array execution engine

            response_data     = {                                                                                                       # Aggregate output variable context structures serialization format response target
                'success':           True,                                                                                                        # Inform response OK state bit response logic loop process termination
                'neighbors_csv_url': neighbors_csv_url,                                                                                 # Supply data set endpoint network stream mapping parameter variable UI
                'points':            points.tolist() if isinstance(points, np.ndarray) else points,                                     # Export standard object structure list data transmission serialize execution
                'regions':           regions.tolist() if isinstance(regions, np.ndarray) else regions,                                  # Export standard object structure list data transmission serialize execution
                'classifications':   classifications.tolist() if isinstance(classifications, np.ndarray) else classifications,          # Export standard object structure list data transmission serialize execution
                'neighbors_indices': neighbors_indices.tolist() if isinstance(neighbors_indices, np.ndarray) else neighbors_indices,    # Export standard object structure list data transmission serialize execution
                'stats': {                                                                                                              # Prepare sub-dictionary context node object map
                    'total_points':  total_points,                                                                                      # Export static metrics context mapping variable index
                    'total_regions': unique_regions,                                                                                    # Export static metrics context mapping variable index
                    'avg_neighbors': round(avg_neighbors, 2),                                                                           # Format metric output length variable string execution output
                    'max_neighbors': neighbors_indices.shape[1]                                                                         # Link highest possible dimension length structure logic sequence
                }                                                                                                                       # Execution sequence map object logic
            }                                                                                                                           # Execution sequence map object logic

            if graph_generated:                                                                                                         # Include image references mapping if execution generation completed flag OK
                response_data['png_url'] = url_for('contour.uploaded_file', filename=f"{filename_base}.png")                            # Append raster URI string logic node dictionary structure property reference
                response_data['svg_url'] = url_for('contour.uploaded_file', filename=f"{filename_base}.svg")                            # Append vector URI string logic node dictionary structure property reference

            return jsonify(response_data)                                                                                               # Submit payload package payload data serialization target API caller route

        else:                                                                                                                           # File test execution validation check string extension fail flag
            return jsonify({                                                                                                            # Initialize payload package
                'success': False,                                                                                                       # Inform response OK state bit response logic loop process termination
                'error':   'Invalid file type. Please upload a CSV file.'                                                               # Return validation error condition payload package logic exit status
            })                                                                                                                          # Return validation error condition payload package logic exit status

    except Exception as e:                                                                                                              # Trace python error runtime exception failure variable event node trigger
        current_app.logger.error(f"Error in upload_neighbors: {str(e)}")                                                                # Spool trace logic target backend string logging text warning message
        return jsonify({                                                                                                                # Initialize payload package
            'success': False,                                                                                                           # Inform response OK state bit response logic loop process termination
            'error':   str(e)                                                                                                           # Return validation error condition payload package logic exit status
        })                                                                                                                              # Format client HTTP package JSON structure serialization return map



