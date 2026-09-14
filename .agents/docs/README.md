# mGFD CloudGenerator

Bienvenido a la documentación central de mGFD CloudGenerator, la interfaz web diseñada para complementar y potenciar los algoritmos matemáticos del paquete mGFD.

## Arquitectura Actual (v2.0)

La aplicación utiliza un enfoque de separación clara entre el backend y frontend para maximizar el rendimiento al procesar imágenes, manteniendo la interactividad fluida sin recargas.

### Backend (Flask & Python)
- Funciona como el núcleo de procesamiento matemático e imagen (Computer Vision usando OpenCV).
- **Módulos Principales:**
  - `contour_modules`: Contiene la lógica para la auto-detección de regiones basada en clics mágicos (algoritmo FloodFill), cálculo de tolerancias, y simplificación de contornos.
  - `cloud_modules`: Gestión y manipulación de datos de nubes de puntos (Cloud Data), exportación de coordenadas.
  - `analysis_modules`: Módulos enfocados en el cálculo de distancias (vecinos cercanos) y análisis analítico espacial.
- **Internacionalización:** Utiliza `Flask-Babel`. Detecta el idioma del cliente vía *cookies* (`lang`) y traduce las cadenas en el backend antes de renderizar la plantilla.

### Frontend (Vanilla JS & HTML5 Canvas)
- **Cero Dependencias de Frameworks:** No utiliza React ni Vue. Todo el DOM y el Canvas interactivo es controlado por código nativo optimizado, ubicado en `static/js/contour_creator.js`.
- **Canvas Rendering:** Muestra la imagen subida de fondo y dibuja capas encima (el contorno detectado temporal, las regiones guardadas con sus bordes, los cursores de las herramientas).
- **Gestión del Estado:** JavaScript mantiene el estado local del arreglo `detectedRegions` y se sincroniza con la UI automáticamente tras cada operación (guardar, refinar, eliminar).
- **Internacionalización Dinámica:** Las cadenas traducidas por el backend son inyectadas limpiamente en un bloque de script `application/json` (`id="i18n-data"`) y puestas a disposición de los scripts a través de `window.I18N`.

## Flujo Principal
1. El usuario sube una imagen (`/upload`).
2. El usuario hace clic en el Canvas (`/detect_region`) para detectar los bordes de la textura seleccionada automáticamente.
3. Se refinan los bordes si es necesario usando el **Modo de Pincel** (agregar/eliminar áreas) y se envía el área refinada para recalcular los contornos.
4. Se ajusta la **Retención de Nodos** (ya sea como porcentaje o estableciendo el número exacto de nodos permitidos para la región).
5. Se guardan las regiones.
6. Se exportan los datos (`.csv`) de los bordes procesados y suavizados para uso en otras herramientas o en la librería mGFD principal.
