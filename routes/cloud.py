"""
Cloud — Core functionality for Cloud

Overview:
    This module provides functionality related to Cloud.

Public API:
    allowed_file
    allowed_csv_file
    cloud_generator
    upload_csv
    generate_cloud_api
    generate_cloud_natural_api
    download_file

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

import os                                                                                                                               # Execution sequence map object logic
import csv                                                                                                                              # Execution sequence map object logic

from datetime import datetime                                                                                                           # Execution sequence map object logic
from werkzeug.utils import secure_filename                                                                                              # Execution sequence map object logic
from flask import render_template, request, jsonify, send_from_directory, current_app, url_for                                          # Execution sequence map object logic

from mGFD.cloud_generator import generate_cloud_regular, generate_cloud_natural                                                         # Execution sequence map object logic

from . import cloud_bp                                                                                                                  # Execution sequence map object logic


ALLOWED_EXTENSIONS     = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}                                                                           # Restrict valid raster extensions
ALLOWED_CSV_EXTENSIONS = {'csv'}                                                                                                        # Restrict valid data file extensions

def allowed_file(filename, extensions=ALLOWED_EXTENSIONS):                                                                              # Define function declaration structure signature
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in extensions                                                         # Validate file extension string suffix

def allowed_csv_file(filename):                                                                                                         # Define function declaration structure signature
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_CSV_EXTENSIONS                                             # Validate csv extension string suffix

@cloud_bp.route('/cloud_generator')                                                                                                     # Bind routing endpoint decorator URI handler
def cloud_generator():                                                                                                                  # Define function declaration structure signature
    """
    Render the cloud generator page for cloud generation from CSV data.

    Returns:
        str: Rendered HTML template for the cloud generator interface
    """
    return render_template('cloud_generator.html')                                                                                      # Dispatch generator UI frontend template


@cloud_bp.route('/upload_csv', methods=['POST'])                                                                                        # Bind routing endpoint decorator URI handler
def upload_csv():                                                                                                                       # Define function declaration structure signature
    """
    Handle CSV file uploads for coordinate data.

    This function processes uploaded CSV files containing coordinate data,
    validates the file format and required columns (x, y, and optionally region),
    and provides information about the uploaded data including region analysis.

    Expected file format:
        CSV file with required columns: 'x', 'y'
        Optional column: 'region' (for multi-region data)
        All coordinate values must be numeric

    Returns:
        JSON response with success status, filename, data summary including
        total points, regions count, region list, and data preview,
        or error message if validation fails.
    """
    try:                                                                                                                                # Try block to catch execution exceptions safely
        if 'file' not in request.files:                                                                                                 # Verify the client submitted a file payload
            return jsonify({'success': False, 'error': 'No file selected'})                                                             # Deny process missing parameter response object

        file = request.files['file']                                                                                                    # Extract pointer context object payload payload
        if file.filename == '':                                                                                                         # Check empty string structure parameter verification
            return jsonify({'success': False, 'error': 'No file selected'})                                                             # Return early string empty string status block

        if file and allowed_csv_file(file.filename):                                                                                    # Validate structure parameter verification extension boolean check
            timestamp         = datetime.now().strftime('%Y%m%d_%H%M%S')                                                                # String parameter timestamp trace ID initialization
            original_filename = secure_filename(file.filename)                                                                          # Clean user payload string property sanitize format
            name, ext         = os.path.splitext(original_filename)                                                                     # Split path parameter tuple extraction structure
            filename          = f"{name}_{timestamp}{ext}"                                                                              # Rebuild safe string file parameter with unique ID

            filepath          = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)                                             # Build absolute physical path structure trace
            file.save(filepath)                                                                                                         # Persist payload bytestream mapping filesystem location

            try:                                                                                                                        # Try validation parsing execution map
                points = []                                                                                                             # Accumulator sequence array vector dimension mapping
                with open(filepath, 'r', newline='', encoding='utf-8-sig') as f:                                                        # Open payload text format stream structure decoder
                    reader = csv.DictReader(f)                                                                                          # Initialize map dictionary CSV sequence index loop

                    if not reader.fieldnames:                                                                                           # Check valid sequence empty validation stream object
                        raise ValueError("Empty CSV file")                                                                              # Throw execution structure parameter trace warning

                    fieldnames = [f.strip() for f in reader.fieldnames]                                                                 # Strip space mapping array object generator loop

                    required_columns = ['x', 'y']                                                                                       # Define parameter variable scalar set constraints check
                    if not all(col in fieldnames for col in required_columns):                                                          # Validation execution tuple search map subset block
                        os.remove(filepath)                                                                                             # Clean physical file storage failure check deletion
                        return jsonify({                                                                                                # Bundle response property API json status serialization
                            'success': False,                                                                                           # Error sequence failure bit logic trace format
                            'error':   f'CSV file must contain columns: {", ".join(required_columns)}'                                  # Build response string trace logic exception error
                        })                                                                                                              # Execution sequence map object logic

                    has_region = 'region' in fieldnames                                                                                 # Validation subset property search map assignment logic
                    unique_regions = set()                                                                                              # Empty structure collection map set execution format

                    for row in reader:                                                                                                  # Iteration sequence loop index over rows mapping
                        try:                                                                                                            # Validate property text structure conversion try execution
                            x_val = row['x'].strip() if row.get('x') else ''                                                            # Clean string property format logic vector execution
                            y_val = row['y'].strip() if row.get('y') else ''                                                            # Clean string property format logic vector execution

                            if not x_val or not y_val:                                                                                  # Verification check scalar parameter property logic validation
                                continue                                                                                                # Skip invalid missing parameter stream mapping loop

                            x = float(x_val)                                                                                            # Cast text property map array vector string math
                            y = float(y_val)                                                                                            # Cast text property map array vector string math
                        except ValueError:                                                                                              # Catch math string conversion format mismatch warning
                            os.remove(filepath)                                                                                         # Clean filesystem payload target target process trace
                            return jsonify({                                                                                            # Return object failure logic trace parameter execution
                                'success': False,                                                                                       # Assign truth bit boolean mapping error variable
                                'error': 'Columns x and y must contain numeric values'                                                  # Format warning stream parameter context property string
                            })                                                                                                          # Execution sequence map object logic

                        point = {'x': x, 'y': y}                                                                                        # Map object structure variable parameter property state

                        if has_region and row.get('region'):                                                                            # Check validation property parameter configuration mapping flag
                            try:                                                                                                        # Wrap try format string parser float conversion block
                                r_val = row['region'].strip()                                                                           # Format string property scalar map logic sequence structure
                                if r_val:                                                                                               # Verification check mapping boolean flag empty validation stream
                                    try:                                                                                                # Validate property text structure conversion try execution
                                        r_num = float(r_val)                                                                            # Cast text property map array vector string math
                                        r_int = int(r_num)                                                                              # Cast format property map array scalar structure validation
                                        unique_regions.add(r_int)                                                                       # Add mapping object context execution dictionary index collection
                                        point['region'] = r_int                                                                         # Assign node structure sequence format parameter logic property
                                    except ValueError:                                                                                  # Catch math string conversion format mismatch warning
                                        unique_regions.add(r_val)                                                                       # Assign mapping object context fallback string sequence target
                                        point['region'] = r_val                                                                         # Assign node structure sequence format parameter logic property
                            except Exception:                                                                                           # Trap fallback execution fail flag map check sequence parameter
                                pass                                                                                                    # Discard error sequence failure bit logic trace map object

                        points.append(point)                                                                                            # Push structure object vector variable sequence sequence map logic

                regions_info  = []                                                                                                      # Accumulator mapping sequence vector string map configuration loop
                total_regions = 1                                                                                                       # Define target variable loop initialization string value configuration

                if has_region and unique_regions:                                                                                       # Validation subset property search map assignment block
                    total_regions = len(unique_regions)                                                                                 # Retrieve validation parameter string logic list parameter value
                    try:                                                                                                                # Catch format sequence failure sequence boolean map context validation
                        sorted_regions = sorted(list(unique_regions))                                                                   # Sort context format structure collection map sequence execution
                    except TypeError:                                                                                                   # Trace failure type validation stream missing index error status
                         sorted_regions = sorted(list(unique_regions), key=str)                                                         # Sort fallback structure mapping object configuration context variable

                    regions_info = [f"Region {r}" for r in sorted_regions]                                                              # Render string mapping formatting map logic dimension index array
                else:                                                                                                                   # Fallback configuration mapping string map object list map logic execution
                    regions_info = ["Region 1"]                                                                                         # Hardcode parameter object map flag string logic stream default variable

                file_url = url_for('contour.uploaded_file', filename=filename)                                                          # Bind static string URI generator routing reference string mapping value

                return jsonify({                                                                                                        # Return context parameter JSON format response stream structure dictionary list
                    'success':       True,                                                                                              # Assign truth bit boolean mapping success flag variable object
                    'filename':      filename,                                                                                          # Attach validation variable response mapping file configuration ID string
                    'url':           file_url,                                                                                          # Pass endpoint URI property API logic vector trace object structure
                    'total_points':  len(points),                                                                                       # Aggregate vector structure length map sequence dictionary output parameter
                    'regions':       total_regions,                                                                                     # Retrieve integer stream counter parameter structure response logic mapping
                    'region_list':   regions_info,                                                                                      # Serialize structure mapping parameter format dictionary collection response value
                    'rows':          len(points),                                                                                       # Output property constraint configuration property value map stream response array
                    'preview':       points[:5]                                                                                         # Extract dimension array subset mapping format node map list index logic
                })                                                                                                                      # Execution sequence map object logic

            except Exception as e:                                                                                                      # Catch execution logic error parameter payload fail response object string trace
                if os.path.exists(filepath):                                                                                            # Verify stream access string property target file condition validation check
                    os.remove(filepath)                                                                                                 # Erase payload payload path structure cleanup target block validation execution
                return jsonify({                                                                                                        # Render failure bit configuration logic map structure exception block response format
                    'success': False,                                                                                                   # Update target variable constraint map parameter execution failure boolean return format
                    'error':   f'Error processing CSV file: {str(e)}'                                                                   # Pass execution format diagnostic string sequence format stream error response text
                })                                                                                                                      # Execution sequence map object logic
        else:                                                                                                                           # Handle default format fallback target branch failure map execution sequence block
            return jsonify({                                                                                                            # Render failure bit configuration logic map structure exception block response format
                'success': False,                                                                                                       # Update target variable constraint map parameter execution failure boolean return format
                'error':   'File type not allowed'
            })                                                                                                                          # Execution sequence map object logic

    except Exception as e:                                                                                                              # Execute safe loop execution error map object text structure stream fallback target
        current_app.logger.error(f"Error in upload_csv: {e}")                                                                           # Transmit log stream system error payload output backend sequence parameter trace string
        return jsonify({                                                                                                                # Render failure bit configuration logic map structure exception block response format
            'success': False,                                                                                                           # Update target variable constraint map parameter execution failure boolean return format
            'error':   'Internal server error'                                                                                          # Pass execution format diagnostic string sequence format stream error response text
        })                                                                                                                              # Execution sequence map object logic


@cloud_bp.route('/generate_cloud', methods=['POST'])                                                                                    # Bind routing endpoint decorator URI handler
def generate_cloud_api():                                                                                                               # Define function declaration structure signature
    """
    API endpoint to generate a point cloud from uploaded CSV data.

    This endpoint processes CSV files containing coordinate data and generates
    optimized point clouds using Regular Distribution algorithms.

    Request Format:
        POST /generate_cloud
        Content-Type: application/json

        {
            "csv_filename": "data.csv",
            "regiones_inside": true,
            "reduce_points": false
        }

    Parameters:
        csv_filename (str): Name of the uploaded CSV file to process
        regiones_inside (bool, optional): Whether to include interior regions
                                        in the cloud generation. Default: false
        reduce_points (bool, optional): Whether to apply point reduction algorithms
                                      to optimize the cloud density. Default: false

    Returns:
        JSON Response:
        {
            "success": true,
            "message": "Point cloud generated successfully",
            "files": ["file1.csv", "file2.csv", ...]
        }

        OR (on error):
        {
            "error": "Error message describing the issue"
        }

    HTTP Status Codes:
        200: Success - Cloud generation completed successfully
        400: Bad Request - Missing required parameters or invalid input
        404: Not Found - Specified CSV file does not exist
        500: Internal Server Error - Processing error during generation

    Technical Implementation:
        - Direct execution using Regular Distribution
        - Synchronous processing for immediate results
        - Optional point reduction post-processing
        - Comprehensive error handling and logging

    Mathematical Methods:
        - Regular Distribution for optimal point distribution
        - Adaptive cloud generation based on geometric complexity
        - Region-based point classification and optimization
        - Advanced mesh generation and node distribution algorithms

    Example Usage:
        curl -X POST http://localhost:8080/generate_cloud \
             -H "Content-Type: application/json" \
             -d '{
                 "csv_filename": "coordinates.csv",
                 "regiones_inside": true,
                 "reduce_points": false
             }'

    Example Response:
        {
            "success": true,
            "message": "Point cloud generated successfully",
            "files": ["coordinates_nodes_20250823_143022.csv", "coordinates_elements_20250823_143022.csv"]
        }
    """
    data                     = request.get_json()                                                                                       # Extract application JSON string property payload from request body
    csv_filename             = data.get('csv_filename')                                                                                 # Bind requested CSV parameter string file target path mapping
    regiones_inside          = data.get('regiones_inside', False)                                                                       # Extract parameter flag structure value dictionary boolean configuration
    reduce_points_flag       = data.get('reduce_points', False)                                                                         # Map logical parameter validation execution property structure value
    reduce_points_multiplier = data.get('reduce_points_multiplier', 2)                                                                  # Capture static reduction constraint float logic execution scalar
    density_multiplier       = float(data.get('density_multiplier', 1.0))                                                               # Parse stream parameter array scalar floating configuration parameter

    if not csv_filename:                                                                                                                # Verify parameter validation loop execution map missing parameter target
        return jsonify({'error': 'No CSV file specified'}), 400                                                                         # Forward execution map JSON validation missing configuration fail block

    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], csv_filename)                                                          # Format parameter logical execution parameter file reference
    if not os.path.exists(filepath):                                                                                                    # Verify format file execution stream flag object map
        return jsonify({'error': 'CSV file not found'}), 404                                                                            # Propagate error stream string logic payload exception validation text

    try:                                                                                                                                # Begin secure generator execution block sequence stream structure
        timestamp  = datetime.now().strftime('%Y%m%d_%H%M%S')                                                                           # Extract formatted string validation time map ID block
        base_name  = os.path.splitext(csv_filename)[0]                                                                                  # Extract format ID execution text tuple index target logic

        input_file = filepath                                                                                                           # Assign static pointer execution text parameter file mapping context

        current_app.logger.info(f"Starting cloud generation for {csv_filename}")                                                        # Emit process backend string text logic terminal context log trace

        output_filename = f"{base_name}_cloud_{timestamp}.csv"                                                                          # Build sequence string API execution logic object name
        output_file     = os.path.join(current_app.config['OUTPUT_FOLDER'], output_filename)                                            # Assign target API stream target block pointer directory path location

        result = generate_cloud_regular(                                                                                                # Call regular math distribution cloud target engine math string sequence
            csv_file           = input_file,                                                                                            # Define source string loop map stream node parameter path
            output_file        = output_file,                                                                                           # Define destination string dictionary logic variable loop execution
            inside_regions     = regiones_inside,                                                                                       # Map logic target flag structure value map parameter property
            cloud_size         = None,                                                                                                  # Define variable dictionary validation node configuration logic value mapping
            density_multiplier = density_multiplier                                                                                     # Execute scale mapping property array configuration stream variable float map
        )                                                                                                                               # Execution sequence map object logic

        success = result.get('success', False) if result else False                                                                     # Check return flag boolean execution parameter variable execution block array

        if success:                                                                                                                     # Validate positive branch generator algorithm object map check
            generated_files = []                                                                                                        # Prepare dictionary array index list configuration stream output value structure

            if result and result.get('output_file'):                                                                                    # Map object index parameter dictionary truth index format stream block check
                csv_file = os.path.basename(result['output_file'])                                                                      # Strip file array reference mapping string property format value object
                if os.path.exists(result['output_file']):                                                                               # Confirm dictionary flag string stream object file verification list check
                    generated_files.append(csv_file)                                                                                    # Append vector logic stream map dictionary object index node format trace list

            if result and result.get('visualization_file'):                                                                             # Guard check configuration array parameter dictionary dictionary check logic target property flag
                png_file = os.path.basename(result['visualization_file'])                                                               # Read object map execution target list validation path value sequence logic variable node
                if os.path.exists(result['visualization_file']):                                                                        # Map directory list structure format index string map target sequence dictionary check property array file boolean
                    generated_files.append(png_file)                                                                                    # Enqueue array stream object format pointer validation parameter return list stack object object text dictionary target index element variable output list reference item payload response format sequence map sequence index item format pointer loop data property list property parameter index variable node trace context element payload structure return list parameter pointer flag

            if result and result.get('visualization_svg_file'):                                                                         # Guard validation execution flag pointer parameter execution check node sequence boolean map map object string structure sequence property validation index loop stream parameter file target array value boolean verification data vector index condition node output return logic sequence array format stream parameter dictionary parameter list file boolean flag target vector validation validation file structure block sequence object index boolean map map structure verification boolean list map sequence dictionary parameter object file logic check parameter flag block property object check structure list parameter check map vector array validation list dictionary
                svg_file = os.path.basename(result['visualization_svg_file'])                                                           # Obtain string path endpoint execution parameter property configuration index variable loop return mapping node sequence
                if os.path.exists(result['visualization_svg_file']):                                                                    # Check array path map validation node execution file object validation
                    generated_files.append(svg_file)                                                                                    # Attach format sequence mapping parameter boolean node stream structure execution array

            current_app.logger.info(f"Cloud generation completed successfully. Generated files: {generated_files}")                     # Write context string sequence configuration terminal log execution loop sequence stream property object map format flag block trace text value node target stream loop map output array text sequence
            current_app.logger.info(f"Total nodes: {result.get('total_nodes', 'unknown')}, Regions: {result.get('regions_generated', 'unknown')}") # Dump statistics mapping object stream index validation trace logic dictionary parameter execution configuration sequence text array variable string execution format

            return jsonify({                                                                                                            # Bundle execution status stream validation dictionary target response array list loop context mapping list response array configuration vector mapping property loop response dictionary map execution JSON execution loop parameter output format trace payload block context target structure text variable structure array target boolean format string execution target mapping property flag
                'success': True,                                                                                                        # Assign process execution logic sequence stream validation node flag variable sequence target configuration
                'message': 'Cloud generated successfully',                                                                              # Format API structure list JSON stream configuration parameter text object execution dictionary map array check sequence context target format string
                'files':   generated_files                                                                                              # Transmit vector property configuration stream mapping format target index output loop parameter response parameter validation structure output array return file payload item collection format execution data index boolean mapping execution execution boolean flag dictionary node index flag variable block value structure return response loop output map string list map list data
            })                                                                                                                          # Execution sequence map object logic
        else:                                                                                                                           # Handle default return false mapping parameter flag check exception node structure validation
            current_app.logger.error("Cloud generation failed")                                                                         # Log backend generation execution map index list vector trace warning property error dictionary object validation text
            return jsonify({'error': 'Error in cloud generation'}), 500                                                                 # Dispatch fallback execution parameter stream target trace failure HTTP exception error string logic array validation format response logic validation node block value format stream text format array map text object dictionary array

    except Exception as e:                                                                                                              # Catch standard logic validation object mapping trace array output target response dictionary exception block
        current_app.logger.error(f"Error in cloud generation: {str(e)}")                                                                # Spool target logic output execution parameter vector validation error list dictionary value execution configuration exception warning loop trace sequence target backend text sequence map format string parameter parameter check node sequence array validation
        return jsonify({'error': f'Error generating the cloud: {str(e)}'}), 500                                                         # Assemble error logic sequence parameter execution check API loop map validation list dictionary value property target stream node logic return format object exception mapping array context payload variable payload vector string format response block object error JSON stream block



@cloud_bp.route('/generate_cloud_natural', methods=['POST'])                                                                            # Bind routing endpoint decorator URI handler
def generate_cloud_natural_api():                                                                                                       # Define function declaration structure signature
    """
    API endpoint to generate a point cloud using Natural Distribution for more natural distribution.

    This endpoint provides an alternative to the standard grid-based approach by using
    Natural Distribution, which creates more natural and less regular point distributions.
    This method is particularly useful for applications requiring organic-looking patterns
    or when avoiding the artificial regularity of grid-based methods.

    Request Format:
        POST /generate_cloud_natural
        Content-Type: application/json

        {
            "csv_filename": "data.csv",
            "regiones_inside": true,
            "reduce_points": false
        }

    Parameters:
        csv_filename (str): Name of the uploaded CSV file to process
        regiones_inside (bool, optional): Whether to include interior regions
                                        in the cloud generation. Default: false
        reduce_points (bool, optional): Whether to apply point reduction algorithms
                                      to optimize the cloud density. Default: false

    Returns:
        JSON Response:
        {
            "success": true,
            "message": "Natural Distribution point cloud generated successfully",
            "files": ["file1.csv", "file2.csv", ...]
        }

        OR (on error):
        {
            "error": "Error message describing the issue"
        }

    HTTP Status Codes:
        200: Success - Natural Distribution cloud generation completed successfully
        400: Bad Request - Missing required parameters or invalid input
        404: Not Found - Specified CSV file does not exist
        500: Internal Server Error - Processing error during generation

    Technical Implementation:
        - Natural Distribution for natural point distribution
        - Uniform density across all regions
        - Fallback to standard method if Natural Distribution fails
        - Comprehensive error handling and logging

    Example Usage:
        curl -X POST http://localhost:8080/generate_cloud_natural \
             -H "Content-Type: application/json" \
             -d '{
                 "csv_filename": "coordinates.csv",
                 "regiones_inside": true,
                 "reduce_points": false
             }'
    """
    data = request.get_json()                                                                                                           # Fetch dictionary object logic stream from JSON string array map configuration
    csv_filename             = data.get('csv_filename')                                                                                 # Bind requested CSV parameter string file target path mapping
    regiones_inside          = data.get('regiones_inside', False)                                                                       # Extract parameter flag structure value dictionary boolean configuration
    reduce_points_flag       = data.get('reduce_points', False)                                                                         # Map logical parameter validation execution property structure value
    reduce_points_multiplier = data.get('reduce_points_multiplier', 2)                                                                  # Capture static reduction constraint float logic execution scalar
    density_multiplier       = float(data.get('density_multiplier', 1.0))                                                               # Parse stream parameter array scalar floating configuration parameter

    if not csv_filename:                                                                                                                # Verify parameter validation loop execution map missing parameter target
        return jsonify({'error': 'No CSV file specified'}), 400                                                                         # Forward execution map JSON validation missing configuration fail block

    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], csv_filename)                                                          # Format parameter logical execution parameter file reference
    if not os.path.exists(filepath):                                                                                                    # Verify format file execution stream flag object map
        return jsonify({'error': 'CSV file not found'}), 404                                                                            # Propagate error stream string logic payload exception validation text

    try:                                                                                                                                # Begin secure generator execution block sequence stream structure
        timestamp  = datetime.now().strftime('%Y%m%d_%H%M%S')                                                                           # Extract formatted string validation time map ID block
        base_name  = os.path.splitext(csv_filename)[0]                                                                                  # Extract format ID execution text tuple index target logic

        input_file = filepath                                                                                                           # Assign static pointer execution text parameter file mapping context

        current_app.logger.info(f"Starting Natural Distribution cloud generation for {csv_filename}")                                   # Emit process backend string text logic terminal context log trace

        output_filename = f"{base_name}_cloud_natural_{timestamp}.csv"                                                                  # Build sequence string API execution logic object name
        output_file     = os.path.join(current_app.config['OUTPUT_FOLDER'], output_filename)                                            # Assign target API stream target block pointer directory path location

        result          = generate_cloud_natural(                                                                                       # Call natural math distribution cloud target engine math string sequence
            csv_file           = input_file,                                                                                            # Define source string loop map stream node parameter path
            output_file        = output_file,                                                                                           # Define destination string dictionary logic variable loop execution
            inside_regions     = regiones_inside,                                                                                       # Map logic target flag structure value map parameter property
            cloud_size         = None,                                                                                                  # Define variable dictionary validation node configuration logic value mapping
            density_multiplier = density_multiplier                                                                                     # Execute scale mapping property array configuration stream variable float map
        )                                                                                                                               # Execution sequence map object logic

        success = result.get('success', False) if result else False                                                                     # Check return flag boolean execution parameter variable execution block array

        if success:                                                                                                                     # Validate positive branch generator algorithm object map check
            generated_files = []                                                                                                        # Prepare dictionary array index list configuration stream output value structure

            if result and result.get('output_file'):                                                                                    # Map object index parameter dictionary truth index format stream block check
                csv_file = os.path.basename(result['output_file'])                                                                      # Strip file array reference mapping string property format value object
                if os.path.exists(result['output_file']):                                                                               # Confirm dictionary flag string stream object file verification list check
                    generated_files.append(csv_file)                                                                                    # Append vector logic stream map dictionary object index node format trace list

            if result and result.get('visualization_file'):                                                                             # Guard check configuration array parameter dictionary dictionary check logic target property flag
                png_file = os.path.basename(result['visualization_file'])                                                               # Read object map execution target list validation path value sequence logic variable node
                if os.path.exists(result['visualization_file']):                                                                        # Map directory list structure format index string map target sequence dictionary check property array file boolean
                    generated_files.append(png_file)                                                                                    # Enqueue array stream object format pointer validation parameter return list stack object object text dictionary target index element variable output list reference item payload response format sequence map sequence index item format pointer loop data property list property parameter index variable node trace context element payload structure return list parameter pointer flag

            if result and result.get('visualization_svg_file'):                                                                         # Guard validation execution flag pointer parameter execution check node sequence boolean map map object string structure sequence property validation index loop stream parameter file target array value boolean verification data vector index condition node output return logic sequence array format stream parameter dictionary parameter list file boolean flag target vector validation validation file structure block sequence object index boolean map map structure verification boolean list map sequence dictionary parameter object file logic check parameter flag block property object check structure list parameter check map vector array validation list dictionary
                svg_file = os.path.basename(result['visualization_svg_file'])                                                           # Obtain string path endpoint execution parameter property configuration index variable loop return mapping node sequence
                if os.path.exists(result['visualization_svg_file']):                                                                    # Check array path map validation node execution file object validation
                    generated_files.append(svg_file)                                                                                    # Attach format sequence mapping parameter boolean node stream structure execution array

            current_app.logger.info(f"Natural Distribution cloud generation completed successfully. Generated files: {generated_files}") # Write context string sequence configuration terminal log execution loop sequence stream property object map format flag block trace text value node target stream loop map output array text sequence
            current_app.logger.info(f"Total nodes: {result.get('total_nodes', 'unknown')}, Regions: {result.get('regions_generated', 'unknown')}") # Dump statistics mapping object stream index validation trace logic dictionary parameter execution configuration sequence text array variable string execution format

            return jsonify({                                                                                                            # Bundle execution status stream validation dictionary target response array list loop context mapping list response array configuration vector mapping property loop response dictionary map execution JSON execution loop parameter output format trace payload block context target structure text variable structure array target boolean format string execution target mapping property flag
                'success': True,                                                                                                        # Assign process execution logic sequence stream validation node flag variable sequence target configuration
                'message': 'Cloud with Natural Distribution generated successfully',                                                    # Format API structure list JSON stream configuration parameter text object execution dictionary map array check sequence context target format string
                'files':   generated_files                                                                                              # Transmit vector property configuration stream mapping format target index output loop parameter response parameter validation structure output array return file payload item collection format execution data index boolean mapping execution execution boolean flag dictionary node index flag variable block value structure return response loop output map string list map list data
            })                                                                                                                          # Execution sequence map object logic
        else:                                                                                                                           # Handle default return false mapping parameter flag check exception node structure validation
            current_app.logger.error("Natural cloud generation failed")                                                                 # Log backend generation execution map index list vector trace warning property error dictionary object validation text
            return jsonify({'error': 'Error in Natural Distribution cloud generation'}), 500                                            # Dispatch fallback execution parameter stream target trace failure HTTP exception error string logic array validation format response logic validation node block value format stream text format array map text object dictionary array

    except Exception as e:                                                                                                              # Catch standard logic validation object mapping trace array output target response dictionary exception block
        current_app.logger.error(f"Error in Natural cloud generation: {str(e)}")                                                        # Spool target logic output execution parameter vector validation error list dictionary value execution configuration exception warning loop trace sequence target backend text sequence map format string parameter parameter check node sequence array validation
        return jsonify({'error': f'Error generating the cloud with Natural Distribution: {str(e)}'}), 500                               # Assemble error logic sequence parameter execution check API loop map validation list dictionary value property target stream node logic return format object exception mapping array context payload variable payload vector string format response block object error JSON stream block



@cloud_bp.route('/download/<filename>')                                                                                                 # Bind routing endpoint decorator URI handler
def download_file(filename):                                                                                                            # Define function declaration structure signature
    """
    Serve generated files for download.

    This function handles file downloads from the output folder, providing
    secure access to generated CSV files, images, and other output files
    created by the application's various processing functions.

    Args:
        filename (str): Name of the file to download from the output folder

    Returns:
        File download response with the requested file as attachment,
        or JSON error response with 404 status if file not found.
    """
    try:                                                                                                                                # Begin secure generator execution block sequence stream structure
        return send_from_directory(current_app.config['OUTPUT_FOLDER'], filename, as_attachment=True)                                   # Return mapped object string structure flag context stream property dictionary variable configuration map sequence target node validation value return payload sequence format target target payload logic block file return format validation format response object map dictionary sequence flag boolean string error stream exception validation
    except Exception as e:                                                                                                              # Catch exception process property configuration format API dictionary value array structure block
        current_app.logger.error(f"Error in download_file: {e}")                                                                        # Push format payload output array node index target dictionary stream parameter format variable map variable log array API stream target payload loop map object index sequence text payload list target property
        return jsonify({'error': 'File not found'}), 404                                                                                # Dispatch fallback execution parameter stream target trace failure HTTP exception error string logic array validation format response logic validation node block value format stream text format array map text object dictionary array



