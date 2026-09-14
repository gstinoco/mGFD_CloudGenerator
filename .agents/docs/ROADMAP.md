# Mapa de Ruta (Roadmap) y Futuro de mGFD CloudGenerator

## Objetivos a Corto Plazo (Post-v2.0)
- **Estandarización y Re-arquitectura del Backend:**
  - Cambiar gran parte de la arquitectura y el código duro del backend para que consuma directamente la librería `mGFD` de Python que ya está publicada en PyPI.
  - El objetivo principal es que mGFD CloudGenerator sirva como una Interfaz Gráfica (GUI) fidedigna para los cálculos oficiales que provee el paquete.
  - Eliminar código redundante de generación de fronteras, análisis matemáticos, o equidistancia que ya existan en la librería `mGFD` oficial.
- **Limpieza Post-Migración:**
  - Aislar cualquier función "mágica" (como detección FloodFill de imagen) para que se envíe inmediatamente como input estandarizado a las clases de `mGFD`.
  - Asegurar la compatibilidad total de los CSV generados con las entradas que requiere la librería.

## Objetivos a Mediano y Largo Plazo
- **Gestión Avanzada de Entornos de Nubes de Puntos:**
  - Expandir las herramientas a soportar el análisis nativo de nubes de puntos 3D si la librería mGFD base lo permite o requiere en el futuro.
- **Herramientas de Colaboración / Exportación Directa:**
  - Soporte de múltiples formatos (por ej., exportación directa a scripts de Python utilizando `mGFD`).
  - Creación de perfiles o configuración persistente de usuario (guardar tamaño de pincel, tolerancias de color, idiomas preferidos).
