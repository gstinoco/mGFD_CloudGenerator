# Workspace Context: mGFD CloudGenerator

## Propósito del Proyecto
mGFD CloudGenerator es una aplicación web full-stack diseñada para la detección, edición y extracción de nubes de puntos o contornos 2D a partir de imágenes, particularmente enfocada en geometrías analíticas e investigación.
Permite a los usuarios subir imágenes, auto-detectar regiones usando algoritmos de visión (OpenCV), refinar esas regiones manualmente con pincel, suavizar sus contornos, y exportar las coordenadas finales generadas.

## Branding y Terminología
- **mGFD**: Marca base del paquete principal y algoritmos matemáticos en Python. **No debe traducirse**.
- **ContourCreator**: Módulo/App de Frontend para la creación visual de los contornos. **No debe traducirse**.

## Interacciones Frontend/Backend
El frontend está impulsado por plantillas **Jinja2** renderizadas desde un servidor **Flask**.
El frontend se comunica de manera asíncrona mediante peticiones `fetch` al backend de Flask para operaciones computacionalmente costosas (ej. detección de contorno con tolerancia, subida de archivos), y maneja todo el estado intermedio de edición en JavaScript Vanilla dentro del navegador, sin dependencias externas como React o Vue.
