"""
Detection — Core functionality for Detection

Overview:
    This module provides computer vision functionality for detecting and segmenting regions
    from images. It relies primarily on OpenCV algorithms like FloodFill, Bilateral Filtering,
    GrabCut, and Morphological operations to detect regions of interest starting from seed
    points, bounding boxes, or interactive brush strokes.

Public API:
    detect_region_at_point
    interactive_segmentation_with_seeds
    grabcut_interactive
    refine_mask_with_brush

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

import cv2                                                                                                                              # OpenCV for computer vision tasks
import logging                                                                                                                          # Standard logging module
import numpy as np                                                                                                                      # Core library for numerical operations

# Configure logging
logging.basicConfig(level=logging.INFO)                                                                                                 # Initialize logging system to INFO level
logger = logging.getLogger(__name__)                                                                                                    # Get a named logger for this module

def detect_region_at_point(image, click_x, click_y, tolerance=30):
    """
    detect_region_at_point
    Detects a single connected region starting from a seed point using optimized Flood Fill.
    
    This algorithm employs an edge-preserving bilateral filter to smooth noise while keeping
    boundaries sharp. It then calculates local texture variance (std dev) around the seed
    to dynamically adjust the FloodFill tolerance, allowing it to seamlessly handle both flat
    and textured image regions.
    
    Input:
        image         np.ndarray      Input image array (can be BGR or grayscale).
        click_x       int             X pixel coordinate of the seed point.
        click_y       int             Y pixel coordinate of the seed point.
        tolerance     int             Base tolerance for pixel similarity (default 30).
    
    Output:
        result_mask   np.ndarray      Binary mask (uint8) where 255 indicates the detected region and 0 is background.
    """
    try:                                                                                                                                # Catch runtime exceptions during processing
        # 1. Preprocessing
        if len(image.shape) == 3:                                                                                                       # Verify if the image has color channels
            work_image = cv2.bilateralFilter(image, d=9, sigmaColor=75, sigmaSpace=75)                                                  # Apply edge-preserving bilateral filter
            gray       = cv2.cvtColor(work_image, cv2.COLOR_BGR2GRAY)                                                                   # Convert to grayscale for texture analysis
        else:                                                                                                                           # If it's already grayscale
            work_image = cv2.bilateralFilter(image, d=9, sigmaColor=75, sigmaSpace=75)                                                  # Apply bilateral filter directly
            gray       = work_image.copy()                                                                                              # Copy to gray variable

        h, w = work_image.shape[:2]                                                                                                     # Extract height and width of the image
        mask = np.zeros((h + 2, w + 2), np.uint8)                                                                                       # FloodFill requires a mask padded by +2 pixels

        # Clamp coordinates
        click_x = max(0, min(click_x, w - 1))                                                                                           # Clamp the X coordinate to image bounds
        click_y = max(0, min(click_y, h - 1))                                                                                           # Clamp the Y coordinate to image bounds

        # 2. Adaptive Tolerance Calculation
        window_size = 9                                                                                                                 # Define a small 9x9 neighborhood window
        x1          = max(0, click_x - window_size)                                                                                     # Calculate left bound of window
        y1          = max(0, click_y - window_size)                                                                                     # Calculate top bound of window
        x2          = min(w, click_x + window_size + 1)                                                                                 # Calculate right bound of window
        y2          = min(h, click_y + window_size + 1)                                                                                 # Calculate bottom bound of window

        local_region = gray[y1:y2, x1:x2]                                                                                               # Extract the local pixel neighborhood
        if local_region.size > 0:                                                                                                       # Ensure the window is not empty
            local_std = np.std(local_region)                                                                                            # Calculate standard deviation as texture metric
        else:                                                                                                                           # Fallback for degenerate bounds
            local_std = 0                                                                                                               # Assume zero variance

        if local_std < 5:                                                                                                               # Low variance indicates a very uniform color
            lo_diff = (max(tolerance, 10),) * 3                                                                                         # Use strict lower bound based on tolerance
            up_diff = (max(tolerance, 10),) * 3                                                                                         # Use strict upper bound based on tolerance
        elif local_std < 15:                                                                                                            # Moderate variance indicates slight texture
            adj     = int(tolerance + local_std * 0.5)                                                                                  # Adjust tolerance slightly higher based on std
            lo_diff = (adj,) * 3                                                                                                        # Apply adjusted lower bound
            up_diff = (adj,) * 3                                                                                                        # Apply adjusted upper bound
        else:                                                                                                                           # High variance indicates strong texture or noise
            adj     = int(tolerance + local_std * 1.0)                                                                                  # Increase tolerance significantly
            lo_diff = (adj,) * 3                                                                                                        # Apply permissive lower bound
            up_diff = (adj,) * 3                                                                                                        # Apply permissive upper bound

        # 3. Apply Flood Fill
        flags = 4 | (255 << 8) | cv2.FLOODFILL_FIXED_RANGE | cv2.FLOODFILL_MASK_ONLY                                                    # Setup flags for 4-connectivity and mask output only

        cv2.floodFill(work_image, mask, (click_x, click_y), (255, 255, 255), lo_diff, up_diff, flags)                                   # Execute the floodfill algorithm natively

        # Crop mask to original size
        result_mask = mask[1:-1, 1:-1]                                                                                                  # Strip the +2 pixel padding required by OpenCV

        # 4. Post-processing (Morphology)
        kernel      = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))                                                              # Define a 5x5 elliptical structuring element
        result_mask = cv2.morphologyEx(result_mask, cv2.MORPH_CLOSE, kernel)                                                            # Close small internal holes and smooth borders

        return result_mask                                                                                                              # Return the polished binary mask

    except Exception as e:                                                                                                              # Handle exceptions gracefully
        logger.error(f"Error in detect_region_at_point: {str(e)}")                                                                      # Log the caught error
        return np.zeros(image.shape[:2], dtype=np.uint8)                                                                                # Return a blank, safe mask on failure

def interactive_segmentation_with_seeds(image, positive_seeds, negative_seeds, tolerance=30):
    """
    interactive_segmentation_with_seeds
    Interactive segmentation using positive and negative seed points.
    
    This function processes multiple seed points. It calculates a region for each positive
    seed using FloodFill and unions them. It then calculates regions for negative seeds
    and subtracts them from the unioned result. This allows interactive foreground/background
    segmentation refinement.
    
    Input:
        image          np.ndarray     Input image array.
        positive_seeds list           List of (x, y) coordinates marking the foreground region.
        negative_seeds list           List of (x, y) coordinates marking the background region.
        tolerance      int            Base tolerance for region growing.
    
    Output:
        final_mask     np.ndarray     Combined binary mask representing the segmented foreground.
    """
    h, w       = image.shape[:2]                                                                                                        # Extract image dimensions
    final_mask = np.zeros((h, w), dtype=np.uint8)                                                                                       # Initialize an empty accumulator mask

    if not positive_seeds:                                                                                                              # Early return if no positive seeds provided
        return final_mask                                                                                                               # Return blank mask

    # 1. Process positive seeds (Union)
    for px, py in positive_seeds:                                                                                                       # Iterate through all foreground seed points
        region_mask = detect_region_at_point(image, px, py, tolerance)                                                                  # Run adaptive floodfill on each seed
        final_mask  = cv2.bitwise_or(final_mask, region_mask)                                                                           # Union the result with the accumulator mask

    # 2. Process negative seeds (Subtraction)
    for nx, ny in negative_seeds:                                                                                                       # Iterate through all background seed points
        neg_region_mask = detect_region_at_point(image, nx, ny, tolerance)                                                              # Floodfill the negative region

        cv2.circle(neg_region_mask, (nx, ny), 5, 255, -1)                                                                               # Explicitly mask a hard circle around the click point

        final_mask = cv2.bitwise_and(final_mask, cv2.bitwise_not(neg_region_mask))                                                      # Subtract the negative mask from the accumulator

    return final_mask                                                                                                                   # Return the refined segmented mask

def grabcut_interactive(image, rect=None, mask=None, iterations=5):
    """
    grabcut_interactive
    Interactive GrabCut segmentation using graph-cut optimization.
    
    A wrapper around OpenCV's GrabCut algorithm. It can initialize using either a bounding
    rectangle (where everything outside is hard background) or a pre-defined mask. It uses
    a Gaussian Mixture Model (GMM) to estimate color distributions and solve the min-cut.
    
    Input:
        image         np.ndarray      Input BGR image array.
        rect          tuple           Bounding rectangle (x, y, width, height) or None.
        mask          np.ndarray      Initial mask for seeding or None.
        iterations    int             Number of iterative refinements (default 5).
    
    Output:
        mask2         np.ndarray      Binary mask (0 or 255) derived from the GrabCut result.
    """
    if rect is None and mask is None:                                                                                                   # Check for missing initialization inputs
        return None                                                                                                                     # GrabCut requires at least a rect or a mask

    h, w = image.shape[:2]                                                                                                              # Extract the image dimensions

    # 1. Initialize mask
    if mask is None:                                                                                                                    # If no mask was provided, build one from the rect
        mask = np.zeros((h, w), np.uint8)                                                                                               # Initialize mask as completely background
        x, y, width, height = rect                                                                                                      # Unpack the bounding rectangle coordinates
        mask[y:y+height, x:x+width] = cv2.GC_PR_FGD                                                                                     # Mark inside the rectangle as probable foreground

    bgd_model = np.zeros((1, 65), np.float64)                                                                                           # Allocate memory for the background GMM (65 floats)
    fgd_model = np.zeros((1, 65), np.float64)                                                                                           # Allocate memory for the foreground GMM (65 floats)

    try:                                                                                                                                # Wrap GrabCut in a try block for safety
        if rect is not None:                                                                                                            # If initializing with a bounding rectangle
            cv2.grabCut(image, mask, rect, bgd_model, fgd_model, iterations, cv2.GC_INIT_WITH_RECT)                                     # Run GrabCut rectangle mode
        else:                                                                                                                           # If initializing with a provided mask
            cv2.grabCut(image, mask, None, bgd_model, fgd_model, iterations, cv2.GC_INIT_WITH_MASK)                                     # Run GrabCut mask mode

        mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')                                                               # Convert GrabCut output (0-3 flags) to binary (0, 1)
        return mask2 * 255                                                                                                              # Scale binary mask up to 255 for visualization

    except Exception as e:                                                                                                              # Catch algorithm failures
        logger.error(f"Error in GrabCut segmentation: {str(e)}")                                                                        # Log the failure reason
        return None                                                                                                                     # Return None to indicate failure

def refine_mask_with_brush(current_mask, brush_strokes):
    """
    refine_mask_with_brush
    Refine a segmentation mask using interactive brush strokes.
    
    Takes a set of vector brush strokes (points, sizes, addition/removal modes)
    and rasterizes them using OpenCV drawing primitives (circles and lines) onto
    the current segmentation mask, allowing manual touch-ups of regions.
    
    Input:
        current_mask  np.ndarray      The current binary segmentation mask.
        brush_strokes list            List of stroke dictionaries (points, mode, size).
    
    Output:
        refined_mask  np.ndarray      The manually refined binary mask.
    """
    if current_mask is None:                                                                                                            # Guard against missing input masks
        return None                                                                                                                     # Fail gracefully

    refined_mask = current_mask.copy()                                                                                                  # Create a working copy of the input mask

    # 1. Process each stroke
    for stroke in brush_strokes:                                                                                                        # Iterate over the stroke definitions
        points = stroke.get('points', [])                                                                                               # Extract the coordinate path of the stroke
        mode   = stroke.get('mode', 'add')                                                                                              # Check if stroke adds to or removes from region
        size   = stroke.get('size', 10)                                                                                                 # Extract the stroke radius/thickness

        if not points:                                                                                                                  # Skip empty strokes
            continue                                                                                                                    # Move to next stroke

        stroke_mask = np.zeros_like(refined_mask)                                                                                       # Allocate an empty mask for this specific stroke

        if len(points) == 1:                                                                                                            # Handle simple single-click dot strokes
            pt = (int(points[0][0]), int(points[0][1]))                                                                                 # Extract discrete integer pixel coordinates
            cv2.circle(stroke_mask, pt, size // 2, 255, -1)                                                                             # Draw a solid filled circle at the point
        else:                                                                                                                           # Handle connected continuous strokes
            for i in range(len(points) - 1):                                                                                            # Iterate over point pairs in the path
                pt1 = (int(points[i][0]), int(points[i][1]))                                                                            # Extract starting coordinate for segment
                pt2 = (int(points[i + 1][0]), int(points[i + 1][1]))                                                                    # Extract ending coordinate for segment
                cv2.line(stroke_mask, pt1, pt2, 255, size)                                                                              # Draw a thick connecting line between points

        # 2. Composite the stroke mask
        if mode == 'add':                                                                                                               # If mode is additive
            refined_mask = cv2.bitwise_or(refined_mask, stroke_mask)                                                                    # Union the stroke with the main mask
        elif mode == 'remove':                                                                                                          # If mode is subtractive
            refined_mask = cv2.bitwise_and(refined_mask, cv2.bitwise_not(stroke_mask))                                                  # Erase the stroke from the main mask

    return refined_mask                                                                                                                 # Return the fully composited image mask