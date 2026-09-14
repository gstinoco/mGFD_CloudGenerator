# Mapa de Ruta (Roadmap) y Futuro de mGFD CloudGenerator

## v2.1 - Integración con PyPI y Limpieza Backend (Corto Plazo)
- [ ] **Estandarización y Re-arquitectura del Backend:**
  - [ ] Cambiar la arquitectura y el código del backend para consumir directamente la librería `mGFD` de Python publicada en PyPI.
  - [ ] Hacer que mGFD CloudGenerator sirva como una Interfaz Gráfica (GUI) fidedigna para los cálculos oficiales del paquete.
  - [ ] Eliminar código redundante de generación de fronteras, análisis o equidistancia que ya existan en la librería `mGFD` oficial.
- [ ] **Limpieza Post-Migración:**
  - [ ] Aislar funciones "mágicas" (ej. detección FloodFill) para enviarlas como input estandarizado a las clases de `mGFD`.
  - [ ] Asegurar compatibilidad total de los CSV generados con las entradas de la librería.

## v3.0 - Funcionalidades de Investigación a Escala (Mediano Plazo)
- [ ] **Procesamiento en Lote (Batch Processing):**
  - [ ] Permitir subir múltiples imágenes o ZIPs y aplicar auto-detección masiva de contornos exportando un solo CSV/JSON consolidado.
- [ ] **Panel Analítico en Tiempo Real:**
  - [ ] Mostrar estadísticas matemáticas en tiempo real (área, centro de masa, etc.) directamente desde `mGFD` mientras se modifica una región con el pincel o la tolerancia.
- [ ] **Más Formatos de Exportación:**
  - [ ] Incluir exportación a formatos CAD y vectoriales (SVG, GeoJSON, DXF).

## v4.0 - Ecosistema y Colaboración (Largo Plazo)
- [ ] **Modo de Proyectos (Workspaces):**
  - [ ] Funcionalidad de "Guardar Sesión" exportando e importando un archivo de proyecto (`.mgfd`) para retomar el trabajo posteriormente sin perder regiones o configuraciones.
- [ ] **Gestión Avanzada de Nubes de Puntos 3D:**
  - [ ] Soporte para análisis nativo de nubes de puntos en 3D si la librería mGFD lo incorpora.
- [ ] **API Headless y Distribución:**
  - [ ] Exponer una API RESTful de la detección para integración con scripts de otros investigadores.
  - [ ] Dockerización completa de la aplicación para despliegue rápido en laboratorios y servidores.
