# Reglas de Programación

## Frontend (JavaScript & UI)
- **Vanilla JS:** NO se deben utilizar frameworks reactivos (como React, Angular o Vue). Todo el comportamiento debe realizarse con JavaScript estándar (ES6+), manipulando el DOM directamente.
- **Sin Errores en Linter/Sintaxis:** Está PROHIBIDO inyectar variables generadas desde el servidor directamente dentro del código JavaScript usando plantillas, si esto causa errores de sintaxis o rompe las herramientas de linting (como escapar comillas). Todos los datos y traducciones que el JS necesite deben cargarse desde etiquetas `<script type="application/json">` o exponerse al objeto `window`.
- **Diseño UI/UX (Estética Premium):** 
  - Usar CSS nativo y mantener los colores de la aplicación (incluyendo variables root y estética clara/oscura). No se permiten "estilos rápidos" en línea integrados (`style="..."`) si arruinan la armonía del diseño.
  - Asegurar transiciones suaves y mantener un espaciado coherente.

## Backend (Flask)
- **Estructura:** Seguir la arquitectura modular de Flask (Blueprints).
- **Traducciones:** 
  - Todo el texto del servidor que pueda ser visto por el usuario debe envolverse en `_('Texto')` utilizando `Flask-Babel`.
  - Las traducciones para JavaScript se envían al frontend cargándolas en un JSON que luego el JS consume (`window.I18N`).

## Futura Arquitectura (Roadmap de Transición)
Se planea integrar y reemplazar lógicas matemáticas y de procesamiento manuales por las proporcionadas directamente por la librería `mGFD` oficial en PyPI, estandarizando así el comportamiento y algoritmos entre esta interfaz web y el paquete de Python.
