// js/Game_2.js - ALEXO Nueva Arcadia INTRO v2
(function() {
    // --- SETUP ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const RAMBLA_Y = 420; // altura del veredón
    const AGUA_Y = RAMBLA_Y + 80;

    // --- ELEMENTOS UI ---
    const startBtn = document.getElementById('start-btn');
    const titleScreen = document.getElementById('title-screen');
    const dialogBox = document.getElementById('dialog-box');
    const speakerName = document.getElementById('speaker-name');
    const dialogText = document.getElementById('dialog-text');
    const promptIndicator = document.getElementById('prompt-indicator');

    // --- ESTADO ---
    let gameState = 'menu';
    let frame = 0;

    // --- ALEXO ROBOT ---
    const alexo = {
        x: -60,
        y: RAMBLA_Y - 90,
        w: 50,
        h: 90,
        vx: 1.2,
        frameWalk: 0,
        eyeGlow: 0
    };

    // --- NIÑOS QUE SALUDAN ---
    const ninos = [
        { x: 250, y: RAMBLA_Y - 50, w: 25, h: 50, saludando: false, brazo: 0 },
        { x: 450, y: RAMBLA_Y - 55, w: 28, h: 55, saludando: false, brazo: 0 },
        { x: 650, y: RAMBLA_Y - 48, w: 24, h: 48, saludando: false, brazo: 0 }
    ];

    // --- ESCENAS INTRO ---
    const scenes = [
        { speaker: "Narrador", text: "Nueva Arcadia, 2150. La rambla vacía al amanecer." },
        { speaker: "Niño 1", text: "¡Miren! ¡Es Alexo!" },
        { speaker: "Niño 2", text: "¡Alexo! ¡Volviste!" },
        { speaker: "Alexo", text: "Hola, pequeños. El mar está calmo hoy." },
        { speaker: "Narrador", text: "Alexo no recuerda por qué los protege. Solo sabe que debe hacerlo." }
    ];
    let currentScene = 0;
    let charIndex = 0;
    let typing = false;

    // --- DIBUJO FONDO ---
    function drawBackground() {
        // Cielo amanecer
        const sky = ctx.createLinearGradient(0, 0, 0, RAMBLA_Y);
        sky.addColorStop(0, '#FF8C42');
        sky.addColorStop(0.5, '#87CEEB');
        sky.addColorStop(1, '#B0E0E6');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, RAMBLA_Y);

        // Sol
        ctx.fillStyle = 'rgba(255, 223, 0, 0.7)';
        ctx.beginPath();
        ctx.arc(W - 120, 100, 50, 0, Math.PI * 2);
        ctx.fill();

        // Nubes
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        drawCloud(150, 80, 40);
        drawCloud(500, 120, 35);
        drawCloud(750, 70, 45);

        // Agua
        const agua = ctx.createLinearGradient(0, AGUA_Y, 0, H);
        agua.addColorStop(0, '#4A90E2');
        agua.addColorStop(1, '#2E5C8A');
        ctx.fillStyle = agua;
        ctx.fillRect(0, AGUA_Y, W, H - AGUA_Y);

        // Reflejo del sol en el agua
        ctx.fillStyle = 'rgba(255, 223, 0, 0.3)';
        for(let i = 0; i < 8; i++) {
            ctx.fillRect(W - 140 + i * 4, AGUA_Y, 2, 15 + Math.sin(frame * 0.05 + i) * 5);
        }

        // Olas
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2;
        for(let i = 0; i < W; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, AGUA_Y + 10 + Math.sin(frame * 0.02 + i * 0.1) * 3);
            ctx.quadraticCurveTo(i + 20, AGUA_Y + 5 + Math.sin(frame * 0.02 + i * 0.1) * 3, i + 40, AGUA_Y + 10 + Math.sin(frame * 0.02 + i * 0.1) * 3);
            ctx.stroke();
        }

        // Rambla - veredón
        ctx.fillStyle = '#A9A9A9';
        ctx.fillRect(0, RAMBLA_Y, W, AGUA_Y - RAMBLA_Y);

        // Líneas del veredón
        ctx.strokeStyle = '#808080';
        ctx.lineWidth = 1;
        for(let i = 0; i < W; i += 60) {
            ctx.beginPath();
            ctx.moveTo(i, RAMBLA_Y);
            ctx.lineTo(i, AGUA_Y);
            ctx.stroke();
        }

        // Baranda
        ctx.strokeStyle = '#5A5A5A';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, RAMBLA_Y);
        ctx.lineTo(W, RAMBLA_Y);
        ctx.stroke();

        // Postes de baranda
        for(let i = 30; i < W; i += 80) {
            ctx.fillStyle = '#5A5A5A';
            ctx.fillRect(i, RAMBLA_Y - 25, 4, 25);
        }
    }

    function drawCloud(x, y, s) {
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.arc(x + s * 0.6, y, s * 0.8, 0, Math.PI * 2);
        ctx.arc(x - s * 0.6, y, s * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }

    // --- DIBUJO NIÑOS ---
    function drawNinos() {
        ninos.forEach(nino => {
            // Distancia a Alexo
            const dist = Math.abs((alexo.x + alexo.w/2) - (nino.x + nino.w/2));
            nino.saludando = dist < 120;

            if (nino.saludando) {
                nino.brazo = Math.sin(frame * 0.3) * 0.8;
            } else {
                nino.brazo = 0;
            }

            ctx.save();

            // Sombra
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.beginPath();
            ctx.ellipse(nino.x + nino.w/2, RAMBLA_Y + 2, nino.w/2, 5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Cuerpo
            ctx.fillStyle = '#FF6B6B';
            ctx.fillRect(nino.x + 5, nino.y + 15, nino.w - 10, 25);

            // Cabeza
            ctx.fillStyle = '#FDBCB4';
            ctx.beginPath();
            ctx.arc(nino.x + nino.w/2, nino.y + 8, 10, 0, Math.PI * 2);
            ctx.fill();

            // Pelo
            ctx.fillStyle = '#3E2723';
            ctx.beginPath();
            ctx.arc(nino.x + nino.w/2, nino.y + 5, 11, Math.PI, 0);
            ctx.fill();

            // Brazo saludando
            ctx.strokeStyle = '#FDBCB4';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(nino.x + nino.w - 3, nino.y + 20);
            ctx.lineTo(nino.x + nino.w + 5, nino.y + 15 + nino.brazo * 10);
            ctx.stroke();

            ctx.restore();
        });
    }

    // --- DIBUJO ALEXO ROBOT ---
    function drawAlexo() {
        ctx.save();

        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.ellipse(alexo.x + alexo.w/2, RAMBLA_Y + 3, alexo.w/2, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Piernas robot
        ctx.fillStyle = '#4A4A4A';
        const legMove = Math.sin(alexo.frameWalk) * 4;
        ctx.fillRect(alexo.x + 12, alexo.y + 60, 8, 30 + legMove);
        ctx.fillRect(alexo.x + 30, alexo.y + 60, 8, 30 - legMove);

        // Articulaciones rodilla
        ctx.fillStyle = '#6A6A6A';
        ctx.beginPath();
        ctx.arc(alexo.x + 16, alexo.y + 75 + legMove, 4, 0, Math.PI * 2);
        ctx.arc(alexo.x + 34, alexo.y + 75 - legMove, 4, 0, Math.PI * 2);
        ctx.fill();

        // Torso metálico
        const torsoGrad = ctx.createLinearGradient(alexo.x, alexo.y + 25, alexo.x + alexo.w, alexo.y + 25);
        torsoGrad.addColorStop(0, '#5A5A5A');
        torsoGrad.addColorStop(0.5, '#7A7A7A');
        torsoGrad.addColorStop(1, '#5A5A5A');
        ctx.fillStyle = torsoGrad;
        ctx.fillRect(alexo.x + 8, alexo.y + 25, 34, 35);

        // Detalles del torso
        ctx.strokeStyle = '#3A3A3A';
        ctx.lineWidth = 2;
        ctx.strokeRect(alexo.x + 8, alexo.y + 25, 34, 35);
        ctx.beginPath();
        ctx.moveTo(alexo.x + 8, alexo.y + 42);
        ctx.lineTo(alexo.x + 42, alexo.y + 42);
        ctx.stroke();

        // Cabeza robot
        ctx.fillStyle = '#6A6A6A';
        ctx.fillRect(alexo.x + 12, alexo.y, 26, 25);

        // Visor/Ojos LED
        alexo.eyeGlow = 0.5 + Math.sin(frame * 0.1) * 0.5;
        ctx.fillStyle = `rgba(0, 255, 255, ${alexo.eyeGlow})`;
        ctx.fillRect(alexo.x + 16, alexo.y + 8, 18, 6);
        ctx.fillStyle = '#00FFFF';
        ctx.fillRect(alexo.x + 18, alexo.y + 9, 6, 4);
        ctx.fillRect(alexo.x + 26, alexo.y + 9, 6, 4);

        // Antena
        ctx.strokeStyle = '#4A4A4A';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(alexo.x + 25, alexo.y);
        ctx.lineTo(alexo.x + 25, alexo.y - 8);
        ctx.stroke();
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(alexo.x + 25, alexo.y - 8, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // --- DIÁLOGOS ---
    function showDialog() {
        if (currentScene >= scenes.length) {
            dialogBox.style.display = 'none';
            promptIndicator.style.opacity = '0';
            gameState = 'playing';
            return;
        }

        const scene = scenes[currentScene];
        dialogBox.style.display = 'block';
        speakerName.textContent = scene.speaker;
        dialogText.textContent = '';
        charIndex = 0;
        typing = true;
        gameState = 'dialog';
        typeWriter(scene.text);
    }

    function typeWriter(text) {
        if (charIndex < text.length) {
            dialogText.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(() => typeWriter(text), 35);
        } else {
            typing = false;
            promptIndicator.style.opacity = '1';
        }
    }

    function nextDialog() {
        if (typing) {
            dialogText.textContent = scenes[currentScene].text;
            charIndex = scenes[currentScene].text.length;
            typing = false;
            promptIndicator.style.opacity = '1';
        } else {
            currentScene++;
            promptIndicator.style.opacity = '0';
            showDialog();
        }
    }

    // --- LOOP ---
    function gameLoop() {
        ctx.clearRect(0, 0, W, H);
        drawBackground();
        drawNinos();

        if (gameState === 'playing') {
            alexo.x += alexo.vx;
            alexo.frameWalk += 0.2;

            // Cuando llega al medio, para y habla
            if (alexo.x > 400 && alexo.x < 405 && currentScene === 0) {
                alexo.vx = 0;
                setTimeout(() => showDialog(), 500);
            }

            // Cuando pasa a los niños, saludan
            if (alexo.x > 700 && currentScene === 1) {
                alexo.vx = 0;
                setTimeout(() => showDialog(), 300);
            }
        }

        drawAlexo();
        frame++;
        requestAnimationFrame(gameLoop);
    }

    // --- EVENTOS ---
    startBtn.onclick = () => {
        titleScreen.style.display = 'none';
        gameState = 'playing';
        gameLoop();
    };

    canvas.onclick = () => {
        if (gameState === 'dialog') nextDialog();
        else if (gameState === 'playing' && alexo.vx === 0) {
            alexo.vx = 1.2; // Reanuda caminar después del diálogo
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            if (gameState === 'dialog') nextDialog();
            else if (gameState === 'playing' && alexo.vx === 0) alexo.vx = 1.2;
        }
    });

})();