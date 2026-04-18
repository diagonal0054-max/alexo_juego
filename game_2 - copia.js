<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Salón de Fiestas</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0a14;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
        }
        canvas {
            border: 2px solid #c9a84c40;
            border-radius: 4px;
            image-rendering: auto;
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <script src="game.js"></script>
</body>
</html>