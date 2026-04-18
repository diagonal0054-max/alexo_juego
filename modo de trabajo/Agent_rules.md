# AGENT_RULES - Reglas de contribución para este juego

## 1. Principio de no regresión
Nunca modificar archivos en `/src/core/` sin abrir un issue explicando por qué. Si una feature nueva rompe tests o el juego no arranca, se hace revert.

## 2. Contenido vs Código
- Nueva historia, niveles, items, diálogos: SOLO editar archivos en `/src/content/`. 
- Prohibido hardcodear textos o stats dentro de `.js`.
- Formato: cada entrada en .json debe tener `id` único.

## 3. Para agregar arte/dibujos
- Subir assets a `/src/assets/img/` con nombre `entidad_estado.png`. Ej: `player_idle.png`, `player_run.png`.
- Registrar el asset en `AssetLoader.js` en el array `IMAGES_TO_LOAD`.
- Nunca usar rutas directas en otros archivos. Siempre pedir el asset con `assets.get('player_idle')`.

## 4. Nuevas entidades
- Crear `NuevaEntidad.js` en `/src/entities/` extendiendo `Entity.js`.
- Debe implementar `update(delta)` y `render(ctx)`. No acceder a `Game` directo, recibir lo que necesita por parámetros.
- Registrarla en `EntityFactory.js` para que los niveles puedan usarla por `type: "NuevaEntidad"`.

## 5. Estilo de código
- ES Modules: `import/export`. Nada de variables globales.
- Constantes en MAYUSCULAS_ARRIBA al inicio del archivo.
- Funciones < 40 líneas. Si crece, dividir.
- Commits: `feat: agrega nivel 3` | `fix: colisión player vs muro` | `content: nuevo diálogo cap 2`

## 6. Testing antes de merge
El juego debe: 
1. Cargar sin errores en consola
2. Pasar del menú a jugar y volver
3. Completar nivel 1 sin romper
Si algo falla, no se mergea.

## 7. Comunicación
Al proponer un cambio, el agente debe responder con:
1. Qué archivo toca
2. Por qué no rompe las reglas 1-6
3. Cómo probar que sigue funcionando