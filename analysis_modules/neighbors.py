"""
Neighbors — Core functionality for Neighbors

Overview:
    This module provides functionality for point cloud neighbor computation and CSV data reading.
    It serves as a bridge between the frontend-uploaded CSV files and the core mGFD algorithms,
    processing coordinates, regions, and classifications to find the proper nearest neighbors
    for each node, respecting regional boundaries and ensuring proper indexing.

Public API:
    read_cloud_data
    compute_neighbors_from_file

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

## Library importation.
import os                                                                                                                               # OS path operations
import csv                                                                                                                              # CSV file parsing module
import logging                                                                                                                          # Error and info logging system
import numpy as np                                                                                                                      # Fast array manipulation

def read_cloud_data(file_path: str):
    """
    read_cloud_data
    Reads point cloud data from a CSV file.
    
    This function processes a CSV file containing coordinate points, extracting
    their 'x' and 'y' locations, as well as their associated 'region' and
    'classification' tags. It handles numeric and string representations of regions
    and properly formats the outputs as numpy arrays for downstream algorithmic consumption.
    
    Input:
        file_path       str             Path to the CSV file to be read.
    
    Output:
        points          np.ndarray      m x 2 array with the (x, y) coordinates of the points.
        regions         np.ndarray      Array of length m containing region identifiers for each point.
        classifications np.ndarray      Array of length m containing classification strings (e.g., 'boundary', 'interior').
    """
    # 1. Variable initialization
    points          = []                                                                                                                # Empty list to accumulate (x,y) points
    regions         = []                                                                                                                # Empty list to accumulate region IDs
    classifications = []                                                                                                                # Empty list to accumulate classification tags

    # 2. File processing
    try:                                                                                                                                # Wrap in try-except block for safe I/O
        if not os.path.exists(file_path):                                                                                               # Verify the CSV file exists in disk
            logging.error(f"File not found: {file_path}")                                                                               # Log an error if not found
            return None, None, None                                                                                                     # Return early with Nones

        with open(file_path, 'r', newline='', encoding='utf-8-sig') as f:                                                               # Open the file handling BOM characters
            reader = csv.DictReader(f)                                                                                                  # Create a dictionary reader for columns

            if reader.fieldnames:                                                                                                       # Verify the CSV is not empty
                reader.fieldnames = [field.strip() for field in reader.fieldnames]                                                      # Clean whitespace from column names
            else:                                                                                                                       # If there are no fieldnames
                logging.error(f"Empty CSV file: {file_path}")                                                                           # Log an error of empty file
                return None, None, None                                                                                                 # Return early

            # 3. Column validation
            required_cols = {'x', 'y', 'region', 'classification'}                                                                      # Set of columns we strictly require
            if not required_cols.issubset(set(reader.fieldnames)):                                                                      # Check if all required columns are present
                logging.error(f"Missing required columns in {file_path}. Found: {reader.fieldnames}. Required: {required_cols}")        # Log missing columns
                return None, None, None                                                                                                 # Return early

            # 4. Data extraction
            for row in reader:                                                                                                          # Loop over each row in the CSV
                try:                                                                                                                    # Try block per row in case of bad formatting
                    x = float(row['x'])                                                                                                 # Extract the X coordinate as a float
                    y = float(row['y'])                                                                                                 # Extract the Y coordinate as a float

                    region_str = str(row['region']).strip()                                                                             # Read region as a string and strip whitespace
                    try:                                                                                                                # Try parsing the region as an integer
                        region = int(float(region_str))                                                                                 # Try float first in case it is "1.0", then int
                    except (ValueError, TypeError):                                                                                     # If parsing fails, it's a string ID
                        region = region_str                                                                                             # Keep as string identifier

                    classification = row['classification'].strip()                                                                      # Extract classification and strip whitespace

                    points.append([x, y])                                                                                               # Append the validated coordinate pair
                    regions.append(region)                                                                                              # Append the resolved region
                    classifications.append(classification)                                                                              # Append the classification
                except (ValueError, KeyError) as e:                                                                                     # If row parsing fails
                    logging.warning(f"Skipping invalid row: {row}. Error: {e}")                                                         # Log warning but continue processing
                    continue                                                                                                            # Skip this iteration

        # 5. Output generation
        if not points:                                                                                                                  # Verify points were actually accumulated
            logging.warning(f"No valid points found in {file_path}")                                                                    # Log warning if no points parsed
            return None, None, None                                                                                                     # Return early

        return np.array(points), np.array(regions), np.array(classifications)                                                           # Return points, regions and class as numpy arrays

    except Exception as e:                                                                                                              # Global catch-all for I/O and logical errors
        logging.error(f"Error reading {file_path}: {e}")                                                                                # Log the unhandled error
        return None, None, None                                                                                                         # Return safely

def compute_neighbors_from_file(file_path: str, nvec: int = 9):
    """
    compute_neighbors_from_file
    Computes neighbors for a point cloud file, respecting region boundaries.
    
    This function reads a point cloud from disk, groups the nodes by their 'region',
    and computes neighbors independently for each region using the mGFD compute_neighbors
    module. This ensures that nodes from one region are never considered as neighbors
    for nodes in another region. The results are finally mapped back to their original
    global indices to provide a coherent neighbor matrix.
    
    Input:
        file_path       str             Path to the CSV file with the point cloud.
        nvec            int             Target number of neighbors to find per node. Default 9.
    
    Output:
        all_neighbors   np.ndarray      m x nvec array where each row holds indices of neighbors, padded with -1.
    """
    # 1. Data loading
    points, regions, classifications = read_cloud_data(file_path)                                                                       # Extract arrays from the CSV

    if points is None:                                                                                                                  # Check if data loading failed
        return None                                                                                                                     # Abort neighbor computation

    # 2. Variable initialization
    num_points     = len(points)                                                                                                        # Total number of nodes in the cloud
    all_neighbors  = np.full((num_points, nvec), -1, dtype=int)                                                                         # Global matrix of neighbors, initialized with -1
    unique_regions = np.unique(regions)                                                                                                 # Extract unique region identifiers

    # 3. Import external dependencies
    try:                                                                                                                                # Attempt to import mGFD core module
        from mGFD.spatial.neighbors import compute_neighbors                                                                            # Import nearest neighbors calculator
    except ImportError:                                                                                                                 # Catch missing dependency
        logging.error("mGFD package is required but not installed.")                                                                    # Log fatal error
        return None                                                                                                                     # Abort execution

    # 4. Regional neighbor computation
    for region in unique_regions:                                                                                                       # Iterate over each distinct region
        region_indices = np.where(regions == region)[0]                                                                                 # Get the global row indices for this region

        if len(region_indices) == 0:                                                                                                    # Sanity check for empty index arrays
            continue                                                                                                                    # Skip to next region if empty

        region_points          = points[region_indices]                                                                                 # Extract coordinates only for this region
        region_classifications = classifications[region_indices]                                                                        # Extract classifications only for this region

        p                      = np.zeros((len(region_points), 3))                                                                      # Create 3-column array for mGFD function (x, y, bd)
        p[:, :2]               = region_points                                                                                          # Set X and Y columns
        boundary_mask          = (region_classifications == 'boundary')                                                                 # Create a boolean mask identifying boundary nodes
        p[boundary_mask, 2]    = 1                                                                                                      # Mark boundary nodes with 1 in the third column

        local_neighbors = compute_neighbors(p, nvec)                                                                                    # Compute nearest neighbors using mGFD within this region

        # 5. Global index mapping
        for i, global_idx in enumerate(region_indices):                                                                                 # Loop through each node's neighbors within the region
            local_row               = local_neighbors[i]                                                                                # Get the list of local neighbor indices

            valid_mask              = local_row != -1                                                                                   # Mask out padded -1 values (no neighbor)
            valid_local_indices     = local_row[valid_mask]                                                                             # Keep only the valid neighbor indices

            global_neighbor_indices = region_indices[valid_local_indices]                                                               # Map the local neighbor indices to global cloud indices

            all_neighbors[global_idx, :len(global_neighbor_indices)] = global_neighbor_indices                                          # Store global neighbor indices in the output matrix

    return all_neighbors                                                                                                                # Return the complete global neighbor index matrix
