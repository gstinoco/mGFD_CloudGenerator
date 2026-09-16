"""
Init — Core functionality for Init

Overview:
    This module provides functionality related to Init.

Public API:
    None

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

from flask import Blueprint                                                                                                             # Import Blueprint class for modular routing

                                                                                                                                        # Initialize Blueprints
main_bp      = Blueprint('main', __name__)                                                                                              # Initialize blueprint for root-level views
cloud_bp     = Blueprint('cloud', __name__)                                                                                             # Initialize blueprint for cloud generation
viewer_bp    = Blueprint('viewer', __name__)                                                                                            # Initialize blueprint for visualization
contour_bp   = Blueprint('contour', __name__)                                                                                           # Initialize blueprint for image processing
neighbors_bp = Blueprint('neighbors', __name__)                                                                                         # Initialize blueprint for connectivity algorithms
                                                                                                                                        # Import routes to register them with the blueprints
from . import contour, cloud, viewer, neighbors, main                                                                                   # Import endpoint handlers recursively


