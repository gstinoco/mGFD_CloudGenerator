"""
App — Core functionality for App

Overview:
    This module provides the core initialization and configuration for the Flask application.
    It establishes server bindings, configures logging (file/stream), schedules cleanup tasks,
    and registers all functional routing Blueprints.

Public API:
    get_locale
    cleanup_old_files
    cleanup_scheduler
    start_cleanup_scheduler
    allowed_file
    allowed_csv_file
    calculate_export_scale
    transform_coordinate

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

import os                                                                                                                               # OS abstraction paths
import time                                                                                                                             # Timer utilities
import logging                                                                                                                          # Standard logging tools
import tempfile                                                                                                                         # Temporary storage structures
import threading                                                                                                                        # Concurrency thread module
import matplotlib                                                                                                                       # Plotting library
matplotlib.use('Agg')                                                                                                                   # Force headless backend for server usage

from datetime import datetime                                                                                                           # Calendar/Time structs
from logging.handlers import RotatingFileHandler                                                                                        # Log rolling handlers
from flask import Flask, request, jsonify, send_from_directory, url_for                                                                 # Core Flask objects

# Import project-specific modules

from flask_babel import Babel                                                                                                           # Localization suite library

app = Flask(__name__, static_url_path='/static')                                                                                        # Boot application instance

def get_locale():
    """
    get_locale
    Retrieves the locale from the request cookies.
    
    Input:
        None
    
    Output:
        locale        str             The locale string, default 'en'.
    """
    return request.cookies.get('lang', 'en')                                                                                            # Return browser requested language

babel    = Babel(app, locale_selector=get_locale)                                                                                       # Initialize translations

BASE_DIR = os.path.dirname(os.path.abspath(__file__))                                                                                   # Determine true operating path

if os.environ.get('VERCEL'):                                                                                                            # Check Vercel serverless context
    LOG_DIR                     = os.path.join(tempfile.gettempdir(), 'logs')                                                           # Remap to ephemeral storage
    app.config['UPLOAD_FOLDER'] = os.path.join(tempfile.gettempdir(), 'uploads')                                                        # Remap to ephemeral storage
    app.config['OUTPUT_FOLDER'] = os.path.join(tempfile.gettempdir(), 'output')                                                         # Remap to ephemeral storage
else:                                                                                                                                   # Running in standard state
    LOG_DIR                     = os.environ.get('LOG_DIR', os.path.join(BASE_DIR, 'logs'))                                             # Fallback or override log path
    app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER', os.path.join(BASE_DIR, 'uploads'))                                    # Fallback or override upload path
    app.config['OUTPUT_FOLDER'] = os.environ.get('OUTPUT_FOLDER', os.path.join(BASE_DIR, 'output'))                                     # Fallback or override output path

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024                                                                                     # Disallow uploads > 16MB
app.secret_key                   = 'mGFD_CloudGenerator_2026'                                                                           # Session cookie signature

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)                                                                                 # Ensure structure
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)                                                                                 # Ensure structure
os.makedirs(LOG_DIR, exist_ok=True)                                                                                                     # Ensure structure

if not app.debug:                                                                                                                       # Production routing mode
    if os.environ.get('VERCEL'):                                                                                                        # Vercel mode limits
        stream_handler = logging.StreamHandler()                                                                                        # Push to stdout
        stream_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))           # Basic info layout
        stream_handler.setLevel(logging.INFO)                                                                                           # Standard filter
        app.logger.addHandler(stream_handler)                                                                                           # Register
        app.logger.setLevel(logging.INFO)                                                                                               # Restrict severity
    else:                                                                                                                               # Native mode
        file_handler = RotatingFileHandler(                                                                                             # Write strictly to file
            os.path.join(LOG_DIR, 'mGFD_CloudGenerator.log'),                                                                           # Set path
            maxBytes    = 10240000,                                                                                                     # 10MB chunking limit
            backupCount = 10                                                                                                            # Retain 10 archives
        )
        file_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))             # Basic info layout
        file_handler.setLevel(logging.INFO)                                                                                             # Standard filter
        app.logger.addHandler(file_handler)                                                                                             # Register
        app.logger.setLevel(logging.INFO)                                                                                               # Restrict severity
else:                                                                                                                                   # Debug routing mode
    if os.environ.get('VERCEL'):                                                                                                        # Debug on serverless
        stream_handler = logging.StreamHandler()                                                                                        # Push stdout
        stream_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))           # Detailed layout
        stream_handler.setLevel(logging.DEBUG)                                                                                          # Verbose output
        app.logger.addHandler(stream_handler)                                                                                           # Register
        app.logger.setLevel(logging.DEBUG)                                                                                              # Lower barrier
    else:                                                                                                                               # Native debug mode
        file_handler = RotatingFileHandler(                                                                                             # Trace file
            os.path.join(LOG_DIR, 'mGFD_CloudGenerator_debug.log'),                                                                     # Target trace file
            maxBytes    = 10240000,                                                                                                     # 10MB threshold
            backupCount = 5                                                                                                             # Track less
        )
        file_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))             # Detailed layout
        file_handler.setLevel(logging.DEBUG)                                                                                            # Verbose output
        app.logger.addHandler(file_handler)                                                                                             # Register
        app.logger.setLevel(logging.DEBUG)                                                                                              # Lower barrier

app.logger.info(f"App started. BASE_DIR: {BASE_DIR}")                                                                                   # Mark start lifecycle
app.logger.info(f"LOG_DIR: {LOG_DIR}")                                                                                                  # Announce parameters
app.logger.info(f"UPLOAD_FOLDER: {app.config['UPLOAD_FOLDER']}")                                                                        # Announce variables

ALLOWED_EXTENSIONS     = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}                                                                           # Valid images
ALLOWED_CSV_EXTENSIONS = {'csv'}                                                                                                        # Valid datasets

FILE_CLEANUP_INTERVAL  = 600                                                                                                            # Cleanup runs 10 mins
FILE_MAX_AGE           = 3600                                                                                                           # Delete after 60 mins

def cleanup_old_files():
    """
    cleanup_old_files
    Clean old files from uploads and output folders based on file age.
    
    Input:
        None
    
    Output:
        None
    """
    try:                                                                                                                                # Test safety block
        current_time = time.time()                                                                                                      # Grab global clock time

        for folder in [app.config['UPLOAD_FOLDER'], app.config['OUTPUT_FOLDER']]:                                                       # Scan system repositories
            if os.path.exists(folder):                                                                                                  # Ensure presence
                for filename in os.listdir(folder):                                                                                     # Query contents
                    file_path = os.path.join(folder, filename)                                                                          # Build absolute format link
                    if os.path.isfile(file_path):                                                                                       # Ensure valid system data file
                        file_age = current_time - os.path.getmtime(file_path)                                                           # Calc age metric delta format
                        if file_age > FILE_MAX_AGE:                                                                                     # Threshold violation condition test
                            try:                                                                                                        # Wrap file IO delete phase
                                os.remove(file_path)                                                                                    # Execute filesystem clear process
                                app.logger.info(f"File deleted: {file_path}")                                                           # Log successful clearance state variable
                            except Exception as e:                                                                                      # File locked IO trace condition status
                                app.logger.error(f"Error deleting file {file_path}: {e}")                                               # Forward lock error trace alert string
    except Exception as e:                                                                                                              # Catch logic execution string failure state
        app.logger.error(f"Error in cleanup_old_files: {e}")                                                                            # Emit generic module failure message string

def cleanup_scheduler():
    """
    cleanup_scheduler
    Continuous file cleanup scheduler that runs in an infinite loop.
    
    Input:
        None
    
    Output:
        None
    """
    while True:                                                                                                                         # Setup eternal background execution thread loop
        time.sleep(FILE_CLEANUP_INTERVAL)                                                                                               # Halts sequence timing execution process module
        cleanup_old_files()                                                                                                             # Dispatches call function execution condition target

def start_cleanup_scheduler():
    """
    start_cleanup_scheduler
    Start the file cleanup scheduler in a separate daemon thread.
    
    Input:
        None
    
    Output:
        None
    """
    cleanup_thread = threading.Thread(target=cleanup_scheduler, daemon=True)                                                            # Assemble asynchronous process background container sequence
    cleanup_thread.start()                                                                                                              # Trigger parallel logic execution environment routine
    app.logger.info("Cleanup scheduler started")                                                                                        # Record operational event flag sequence marker format

def allowed_file(filename):
    """
    allowed_file
    Check if the uploaded file has an allowed image extension.
    
    Input:
        filename      str             Name of the file to validate.
    
    Output:
        allowed       bool            True if file extension is allowed, False otherwise.
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS                                                 # Boolean return map filter sequence validation string

def allowed_csv_file(filename):
    """
    allowed_csv_file
    Check if the uploaded file has an allowed CSV extension.
    
    Input:
        filename      str             Name of the file to validate.
    
    Output:
        allowed       bool            True if file extension is 'csv', False otherwise.
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_CSV_EXTENSIONS                                             # Boolean return map filter sequence validation string

def calculate_export_scale(w, h, config=None):
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
    if config is None:                                                                                                                  # Intercept none value parameter injection condition
        config = {}                                                                                                                     # Set default map

    method = config.get('method', 'preserve_aspect_ratio')                                                                              # Check configuration array logic requirement block

    if method == 'custom':                                                                                                              # Detect explicit math scaling variable flag set
        return float(config.get('custom_x', 1.0)), float(config.get('custom_y', 1.0))                                                   # Revert manual control dimension metrics variable list

    if method == 'stretch':                                                                                                             # Detect uniform scale logic mapping condition value
        return 1.0, 1.0                                                                                                                 # Pass true mapping parameters

    max_dim = max(w, h)                                                                                                                 # Enact standard constraint value function lookup index
    if max_dim > 0:                                                                                                                     # Execute constraint bounds filter check loop
        return w / max_dim, h / max_dim                                                                                                 # Execute mathematical transform computation process value

    return 1.0, 1.0                                                                                                                     # Pass true mapping parameters default safe state

def transform_coordinate(point, scale_x, scale_y):
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
    final_x    = point['x'] * scale_x                                                                                                   # Compute true spatial scale index target string
    inverted_y = (1.0 - point['y']) * scale_y                                                                                           # Inverse mapping logic value cartesian domain block

    final_x    = max(0.0, min(1.0, final_x))                                                                                            # Hard limit execution bounds scale target property
    inverted_y = max(0.0, min(1.0, inverted_y))                                                                                         # Hard limit execution bounds scale target property

    return final_x, inverted_y                                                                                                          # Resolve list payload return event data node

# Main application routes

from routes import main_bp, contour_bp, cloud_bp, viewer_bp, neighbors_bp                                                               # Include child blueprint configuration node sequences

app.register_blueprint(main_bp)                                                                                                         # Attach handler process endpoint logic mapping block
app.register_blueprint(contour_bp)                                                                                                      # Attach handler process endpoint logic mapping block
app.register_blueprint(cloud_bp)                                                                                                        # Attach handler process endpoint logic mapping block
app.register_blueprint(viewer_bp)                                                                                                       # Attach handler process endpoint logic mapping block
app.register_blueprint(neighbors_bp)                                                                                                    # Attach handler process endpoint logic mapping block

if __name__ == '__main__':                                                                                                              # Evaluate system module context execution run logic
    cleanup_thread = threading.Thread(target=cleanup_scheduler, daemon=True)                                                            # Declare garbage collection daemon loop parameters format
    cleanup_thread.start()                                                                                                              # Dispatch background worker daemon logic stream run
    app.logger.info("Started background file cleanup task")                                                                             # Announce success process startup operation message log

    app.run(host='0.0.0.0', port=5001, debug=False)                                                                                     # Initialize application networking bind protocol port stream
