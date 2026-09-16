"""
Main — Core functionality for Main

Overview:
    This module provides functionality related to Main.

Public API:
    home
    set_language
    examples
    about
    privacy_notice

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

from flask import render_template, request, jsonify, send_from_directory, current_app, send_file, url_for                               # Flask core components

from . import main_bp                                                                                                                   # Import blueprint instance

@main_bp.route('/')                                                                                                                     # Bind routing endpoint decorator URI handler
def home():                                                                                                                             # Define function declaration structure signature
    """
    home
    Render the main homepage of the application.

    Input:
        None

    Output:
        str           str             Rendered HTML template for the home page.
    """
    return render_template('home.html')                                                                                                 # Render and return home template

@main_bp.route('/set_language/<lang>')                                                                                                  # Bind routing endpoint decorator URI handler
def set_language(lang):                                                                                                                 # Define function declaration structure signature
    """
    set_language
    Set the language cookie and redirect back.

    Input:
        lang          str             Language code (e.g., 'en', 'es').

    Output:
        Response      Response        Redirect response with language cookie.
    """
    from flask import redirect, make_response                                                                                           # Import response handlers locally
    if lang not in ['en', 'es']:                                                                                                        # Validate supported language
        lang = 'en'                                                                                                                     # Fallback to English

    referer = request.referrer or url_for('main.home')                                                                                  # Fetch origin URL

    resp    = make_response(redirect(referer))                                                                                          # Build redirect response
    resp.set_cookie('lang', lang, max_age=60*60*24*365)                                                                                 # Write persistent cookie (1 year)
    return resp                                                                                                                         # Dispatch response

@main_bp.route('/examples')                                                                                                             # Bind routing endpoint decorator URI handler
def examples():                                                                                                                         # Define function declaration structure signature
    """
    examples
    Render the Examples page with case studies.

    Input:
        None

    Output:
        str           str             Rendered HTML template for the examples page.
    """
    from flask_babel import gettext as _                                                                                                # Import Babel localizer

    examples_list = [                                                                                                                   # Define static case studies catalog
        {                                                                                                                               # Begin dictionary for specific lake example data
            'name':         'Balkhash',                                                                                                 # Internal identifier for the lake example
            'title':        _('Lake Balkhash'),                                                                                         # Localized display title for the lake example
            'description':  _('One of the largest lakes in Asia, located in southeastern Kazakhstan. Uniquely, its western part is fresh water while the eastern part is saline.'),
                                                                                                                                        # Localized description of the lake example
            'image':        'Balkhash.png',                                                                                             # Filename of the original lake image
            'cloud_image':  'Balkhash_cloud.png',                                                                                       # Filename of the generated point cloud image
            'cloud_svg':    'Balkhash_cloud.svg',                                                                                       # Filename of the generated point cloud SVG
            'contours_csv': 'Balkhash_contours.csv',                                                                                    # Filename of the generated contours CSV data
            'cloud_csv':    'Balkhash_cloud.csv'                                                                                        # Filename of the generated point cloud CSV data
        },                                                                                                                              # End dictionary for lake example data
        {                                                                                                                               # Begin dictionary for specific lake example data
            'name':         'Caspio',                                                                                                   # Internal identifier for the lake example
            'title':        _('Caspian Sea'),                                                                                           # Localized display title for the lake example
            'description':  _('The world\'s largest inland body of water, often described as the world\'s largest lake or a full-fledged sea. It lies between Europe and Asia.'),
                                                                                                                                        # Localized description of the lake example
            'image':        'Caspio.png',                                                                                               # Filename of the original lake image
            'cloud_image':  'Caspio_cloud.png',                                                                                         # Filename of the generated point cloud image
            'cloud_svg':    'Caspio_cloud.svg',                                                                                         # Filename of the generated point cloud SVG
            'contours_csv': 'Caspio_contours.csv',                                                                                      # Filename of the generated contours CSV data
            'cloud_csv':    'Caspio_cloud.csv'                                                                                          # Filename of the generated point cloud CSV data
        },                                                                                                                              # End dictionary for lake example data
        {                                                                                                                               # Begin dictionary for specific lake example data
            'name':         'Catemaco',                                                                                                 # Internal identifier for the lake example
            'title':        _('Lake Catemaco'),                                                                                         # Localized display title for the lake example
            'description':  _('A freshwater lake located in south-central Veracruz, Mexico, formed by natural damming of volcanic origin.'),
                                                                                                                                        # Localized description of the lake example
            'image':        'Catemaco.png',                                                                                             # Filename of the original lake image
            'cloud_image':  'Catemaco_cloud.png',                                                                                       # Filename of the generated point cloud image
            'cloud_svg':    'Catemaco_cloud.svg',                                                                                       # Filename of the generated point cloud SVG
            'contours_csv': 'Catemaco_contours.csv',                                                                                    # Filename of the generated contours CSV data
            'cloud_csv':    'Catemaco_cloud.csv'                                                                                        # Filename of the generated point cloud CSV data
        },                                                                                                                              # End dictionary for lake example data
        {                                                                                                                               # Begin dictionary for specific lake example data
            'name':         'Huron',                                                                                                    # Internal identifier for the lake example
            'title':        _('Lake Huron'),                                                                                            # Localized display title for the lake example
            'description':  _('One of the five Great Lakes of North America, connecting to Lake Michigan by the Straits of Mackinac.'), # Localized description of the lake example
            'image':        'Huron.png',                                                                                                # Filename of the original lake image
            'cloud_image':  'Huron_cloud.png',                                                                                          # Filename of the generated point cloud image
            'cloud_svg':    'Huron_cloud.svg',                                                                                          # Filename of the generated point cloud SVG
            'contours_csv': 'Huron_contours.csv',                                                                                       # Filename of the generated contours CSV data
            'cloud_csv':    'Huron_cloud.csv'                                                                                           # Filename of the generated point cloud CSV data
        },                                                                                                                              # End dictionary for lake example data
        {                                                                                                                               # Begin dictionary for specific lake example data
            'name':         'Malawi',                                                                                                   # Internal identifier for the lake example
            'title':        _('Lake Malawi'),                                                                                           # Localized display title for the lake example
            'description':  _('An African Great Lake and the southernmost lake in the East African Rift system, located between Malawi, Mozambique and Tanzania.'),
                                                                                                                                        # Localized description of the lake example
            'image':        'Malawi.png',                                                                                               # Filename of the original lake image
            'cloud_image':  'Malawi_cloud.png',                                                                                         # Filename of the generated point cloud image
            'cloud_svg':    'Malawi_cloud.svg',                                                                                         # Filename of the generated point cloud SVG
            'contours_csv': 'Malawi_contours.csv',                                                                                      # Filename of the generated contours CSV data
            'cloud_csv':    'Malawi_cloud.csv'                                                                                          # Filename of the generated point cloud CSV data
        },                                                                                                                              # End dictionary for lake example data
        {                                                                                                                               # Begin dictionary for specific lake example data
            'name':         'Patzcuaro',                                                                                                # Internal identifier for the lake example
            'title':        _('Lake Pátzcuaro'),                                                                                        # Localized display title for the lake example
            'description':  _('A lake in Michoacán, Mexico, famous for its cultural significance, islands, and traditional fishing.'),  # Localized description of the lake example
            'image':        'Patzcuaro.png',                                                                                            # Filename of the original lake image
            'cloud_image':  'Patzcuaro_cloud.png',                                                                                      # Filename of the generated point cloud image
            'cloud_svg':    'Patzcuaro_cloud.svg',                                                                                      # Filename of the generated point cloud SVG
            'contours_csv': 'Patzcuaro_contours.csv',                                                                                   # Filename of the generated contours CSV data
            'cloud_csv':    'Patzcuaro_cloud.csv'                                                                                       # Filename of the generated point cloud CSV data
        },                                                                                                                              # End dictionary for lake example data
        {                                                                                                                               # Begin dictionary for specific lake example data
            'name':         'Poopo',                                                                                                    # Internal identifier for the lake example
            'title':        _('Lake Poopó'),                                                                                            # Localized display title for the lake example
            'description':  _('A large saline lake in a shallow depression in the Altiplano Mountains in Bolivia, known for its fluctuating water levels.'),
                                                                                                                                        # Localized description of the lake example
            'image':        'Poopo.png',                                                                                                # Filename of the original lake image
            'cloud_image':  'Poopo_cloud.png',                                                                                          # Filename of the generated point cloud image
            'cloud_svg':    'Poopo_cloud.svg',                                                                                          # Filename of the generated point cloud SVG
            'contours_csv': 'Poopo_contours.csv',                                                                                       # Filename of the generated contours CSV data
            'cloud_csv':    'Poopo_cloud.csv'                                                                                           # Filename of the generated point cloud CSV data
        },                                                                                                                              # End dictionary for lake example data
        {                                                                                                                               # Begin dictionary for specific lake example data
            'name':         'Santa_Maria_del_Oro',                                                                                      # Internal identifier for the lake example
            'title':        _('Santa María del Oro'),                                                                                   # Localized display title for the lake example
            'description':  _('A crater lake located in the crater of a volcano in the state of Nayarit, Mexico.'),                     # Localized description of the lake example
            'image':        'Santa_Maria_del_Oro.png',                                                                                  # Filename of the original lake image
            'cloud_image':  'Santa_Maria_del_Oro_cloud.png',                                                                            # Filename of the generated point cloud image
            'cloud_svg':    'Santa_Maria_del_Oro_cloud.svg',                                                                            # Filename of the generated point cloud SVG
            'contours_csv': 'Santa_Maria_del_Oro_contours.csv',                                                                         # Filename of the generated contours CSV data
            'cloud_csv':    'Santa_Maria_del_Oro_cloud.csv'                                                                             # Filename of the generated point cloud CSV data
        },                                                                                                                              # End dictionary for lake example data
        {                                                                                                                               # Begin dictionary for specific lake example data
            'name':         'Titicaca',                                                                                                 # Internal identifier for the lake example
            'title':        _('Lake Titicaca'),                                                                                         # Localized display title for the lake example
            'description':  _('A large, deep, freshwater lake in the Andes on the border of Bolivia and Peru, often called the highest navigable lake in the world.'),
                                                                                                                                        # Localized description of the lake example
            'image':        'Titicaca.png',                                                                                             # Filename of the original lake image
            'cloud_image':  'Titicaca_cloud.png',                                                                                       # Filename of the generated point cloud image
            'cloud_svg':    'Titicaca_cloud.svg',                                                                                       # Filename of the generated point cloud SVG
            'contours_csv': 'Titicaca_contours.csv',                                                                                    # Filename of the generated contours CSV data
            'cloud_csv':    'Titicaca_cloud.csv'                                                                                        # Filename of the generated point cloud CSV data
        },                                                                                                                              # End dictionary for lake example data
        {                                                                                                                               # Begin dictionary for specific lake example data
            'name':         'Yuriria',                                                                                                  # Internal identifier for the lake example
            'title':        _('Lake Yuriria'),                                                                                          # Localized display title for the lake example
            'description':  _('A man-made lake in Guanajuato, Mexico, constructed in the 16th century, representing the first hydraulic work of the colonial period in America.'),
                                                                                                                                        # Localized description of the lake example
            'image':        'Yuriria.png',                                                                                              # Filename of the original lake image
            'cloud_image':  'Yuriria_cloud.png',                                                                                        # Filename of the generated point cloud image
            'cloud_svg':    'Yuriria_cloud.svg',                                                                                        # Filename of the generated point cloud SVG
            'contours_csv': 'Yuriria_contours.csv',                                                                                     # Filename of the generated contours CSV data
            'cloud_csv':    'Yuriria_cloud.csv'                                                                                         # Filename of the generated point cloud CSV data
        },                                                                                                                              # End dictionary for lake example data
        {                                                                                                                               # Begin dictionary for specific lake example data
            'name':         'Zirahuen',                                                                                                 # Internal identifier for the lake example
            'title':        _('Lake Zirahuén'),                                                                                         # Localized display title for the lake example
            'description':  _('A deep, endorheic basin lake in Michoacán, Mexico, known for its clear blue waters.'),                   # Localized description of the lake example
            'image':        'Zirahuen.png',                                                                                             # Filename of the original lake image
            'cloud_image':  'Zirahuen_cloud.png',                                                                                       # Filename of the generated point cloud image
            'cloud_svg':    'Zirahuen_cloud.svg',                                                                                       # Filename of the generated point cloud SVG
            'contours_csv': 'Zirahuen_contours.csv',                                                                                    # Filename of the generated contours CSV data
            'cloud_csv':    'Zirahuen_cloud.csv'                                                                                        # Filename of the generated point cloud CSV data
        }                                                                                                                               # End dictionary for the final lake example data
    ]                                                                                                                                   # End of static case studies catalog list
    return render_template('examples.html', examples=examples_list)                                                                     # Render and return populated template

@main_bp.route('/about')                                                                                                                # Bind routing endpoint decorator URI handler
def about():                                                                                                                            # Define function declaration structure signature
    """
    about
    Render the about page with application information and documentation.

    Input:
        None

    Output:
        str           str             Rendered HTML template for the about page.
    """
    return render_template('about.html')                                                                                                # Render and return about template

@main_bp.route('/privacy_notice')                                                                                                       # Bind routing endpoint decorator URI handler
def privacy_notice():                                                                                                                   # Define function declaration structure signature
    """
    privacy_notice
    Render the privacy notice page (Aviso de Privacidad) compliant with Mexican law.

    Input:
        None

    Output:
        str           str             Rendered HTML template for the privacy notice page.
    """
    return render_template('privacy_notice.html')                                                                                       # Render and return privacy template



