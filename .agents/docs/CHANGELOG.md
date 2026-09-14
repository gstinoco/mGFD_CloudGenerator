# Historial de Cambios (Changelog)

## v2.0 - Refinamiento Total de Interfaz y Producción

- **Internacionalización Segura (Flask-Babel):**
  - Se eliminó la inyección directa de variables Jinja2 en los atributos y llamadas JS, evitando errores de sintaxis (Uncaught SyntaxError) y escapes de comillas incorrectos.
  - Implementación de un bloque seguro `<script type="application/json">` que exporta el catálogo de traducciones y es consumido limpiamente a través de `window.I18N`.
  - Se tradujeron exitosamente elementos faltantes de notificaciones, retención de nodos (Node Retention) y alertas del sistema de archivos al Español.

- **Herramientas de Refinación de Región (Pincel):**
  - Se corrigió el flujo de refinamiento para que los trazos de edición operen correctamente sobre la región *temporal* (antes de confirmar la selección) sin pisar el estado de regiones guardadas previas.
  - Se limitó el tamaño de los pinceles a un rango funcional de 1 a 20 píxeles.

- **Manejo Estricto de Densidad (Nodos):**
  - Se integró una entrada numérica para escribir la cantidad "Exacta" de nodos deseados en la frontera.
  - La visualización del porcentaje de retención se formateó a 2 decimales para estética y claridad.
  - Se igualó y perfeccionó el estilo de las entradas (UI clara/nativa) de Node Retention, logrando consistencia Premium en todo el componente visual de ContourCreator.

## v1.0 - Funcionalidad Base (MVP)
- Implementación de algoritmos de Computer Vision (OpenCV) para la auto-detección con clic de semillas (FloodFill).
- Funciones básicas de exportación a `.csv` y procesamiento general de Canvas interactivo en Vanilla JS.
- Estructura base de Blueprints en Flask.
