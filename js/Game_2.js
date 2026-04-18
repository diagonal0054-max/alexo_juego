// js/Game_2.js - ALEXO Nueva Arcadia INTRO v2
// Intro con Alexo robot + rambla + niños saludando

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let frame = 0;
let gameState = 'intro'; // intro, dialogue, playing
let currentDialogue = 0;
let showDialogueBox = false;

// --- CONSTANTES ESCENARIO ---
const RAMBLA_Y = 450;
const MAR_Y = 480;

// --- ALEXO ROBOT ---
const alexo = {
    x: 100, y: RAMBLA_Y - 90, w: 50, h: 90,
    vx: 1.2, frameWalk: 0, eyeGlow: 0,
    direction: 'side' // NUEVO: 'side', 'front', 'back'
};

// --- NIÑOS ---
const ninos = [
    { x: 300, y: RAMBLA_Y - 40, w: 30, h: 40, color: '#ff6b6b', waving: false },
    { x: 450, y: RAMBLA_Y - 40, w: 30, h: 40, color: '#4ecdc4', waving: false },
    { x: 600, y: RAMBLA_Y - 40, w: 30, h: 40, color: '#ffe66d', waving: false }
];

// --- DIÁLOGOS INTRO ---
const dialogues = [
    { speaker: "Niño 1", text: "¡Miren! ¡Es Alexo!" },
    { speaker: "Niño 2", text: "¡Alexo! ¡Volviste!" },
    { speaker: "Alexo", text: "Hola, pequeños. El mar está calmo hoy." },
    { speaker: "Narrador", text: "Alexo no recuerda por qué los protege. Solo sabe que debe hacerlo." }
];

// --- CONTROLES ---
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        if (gameState === 'dialogue' && showDialogueBox) {
            nextDialogue();
        } else if (gameState === 'intro') {
            startDialogue();
        }
    }
});

canvas.addEventListener('click', () => {
    if (gameState === 'dialogue' && showDialogueBox) {
        nextDialogue();
    } else if (gameState === 'intro') {
        startDialogue();
    }
});

function startDialogue() {
    gameState = 'dialogue';
    currentDialogue = 0;
    showDialogueBox = true;
    alexo.vx = 0;
}

function nextDialogue() {
    currentDialogue++;
    if (currentDialogue >= dialogues.length) {
        showDialogueBox = false;
        gameState = 'playing';
        alexo.vx = 1.2;
        // Si querés que arranque de frente, descomentá la línea de abajo:
        // alexo.direction = 'front';
    }
}

// --- DIBUJO FONDO ---
function drawBackground() {
    // Cielo
    const skyGrad = ctx.createLinearGradient(0, 0, 0, RAMBLA_Y);
    skyGrad.addColorStop(0, '#1a1a2e');
    skyGrad.addColorStop(1, '#16213e');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, RAMBLA_Y);

    // Estrellas
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i = 0; i < 50; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 23) % 200;
        ctx.fillRect(x, y, 1, 1);
    }

    // Mar
    const marGrad = ctx.createLinearGradient(0, MAR_Y, 0, canvas.height);
    marGrad.addColorStop(0, '#0f3460');
    marGrad.addColorStop(1, '#0a1929');
    ctx.fillStyle = marGrad;
    ctx.fillRect(0, MAR_Y, canvas.width, canvas.height - MAR_Y);

    // Olas
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, MAR_Y + 10 + i * 15);
        for (let x = 0; x < canvas.width; x += 20) {
            ctx.lineTo(x, MAR_Y + 10 + i * 15 + Math.sin(frame * 0.05 + x * 0.1 + i) * 3);
        }
        ctx.stroke();
    }

    // Rambla
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, RAMBLA_Y, canvas.width, 30);

    // Línea de la rambla
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, RAMBLA_Y);
    ctx.lineTo(canvas.width, RAMBLA_Y);
    ctx.stroke();

    // Baranda
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, RAMBLA_Y - 15);
    ctx.lineTo(canvas.width, RAMBLA_Y - 15);
    ctx.stroke();

    for (let x = 40; x < canvas.width; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, RAMBLA_Y - 15);
        ctx.lineTo(x, RAMBLA_Y);
        ctx.stroke();
    }
}

// --- DIBUJO NIÑOS ---
function drawNinos() {
    ninos.forEach((nino, i) => {
        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(nino.x + nino.w/2, RAMBLA_Y + 3, nino.w/2, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cuerpo
        ctx.fillStyle = nino.color;
        ctx.fillRect(nino.x, nino.y, nino.w, nino.h);

        // Cabeza
        ctx.fillStyle = '#fdbcb4';
        ctx.beginPath();
        ctx.arc(nino.x + nino.w/2, nino.y - 10, 12, 0, Math.PI * 2);
        ctx.fill();

        // Ojos
        ctx.fillStyle = '#000';
        ctx.fillRect(nino.x + nino.w/2 - 5, nino.y - 12, 2, 2);
        ctx.fillRect(nino.x + nino.w/2 + 3, nino.y - 12, 2, 2);

        // Saludando si Alexo está cerca
        if (!nino.waving) {
            // Distancia a Alexo
            const dist = Math.abs((alexo.x + alexo.w/2) - (nino.x + nino.w/2));
            if (dist < 150) nino.waving = true;
        }

        if (nino.waving) {
            const wave = Math.sin(frame * 0.3 + i) * 10;
            ctx.strokeStyle = nino.color;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(nino.x + nino.w, nino.y + 10);
            ctx.lineTo(nino.x + nino.w + 15, nino.y + wave);
            ctx.stroke();
        }
    });
}

// --- DIBUJO ALEXO ROBOT ---
function drawAlexo() {
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(alexo.x + alexo.w/2, RAMBLA_Y + 3, alexo.w/2, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    if (alexo.direction === 'side') {
        // VISTA DE COSTADO
        const legMove = Math.sin(alexo.frameWalk) * 4;
        ctx.fillStyle = '#1a3a52';
        ctx.fillRect(alexo.x + 12, alexo.y + 60, 8, 30 + legMove);
        ctx.fillRect(alexo.x + 30, alexo.y + 60, 8, 30 - legMove);

        ctx.fillStyle = '#2a4a62';
        ctx.beginPath();
        ctx.arc(alexo.x + 16, alexo.y + 75 + legMove, 4, 0, Math.PI * 2);
        ctx.arc(alexo.x + 34, alexo.y + 75 - legMove, 4, 0, Math.PI * 2);
        ctx.fill();

        const torsoGrad = ctx.createLinearGradient(alexo.x, alexo.y + 25, alexo.x + alexo.w, alexo.y + 25);
        torsoGrad.addColorStop(0, '#2a5a7a');
        torsoGrad.addColorStop(0.5, '#3a7a9a');
        torsoGrad.addColorStop(1, '#2a5a7a');
        ctx.fillStyle = torsoGrad;
        ctx.fillRect(alexo.x + 8, alexo.y + 25, 34, 35);

        ctx.strokeStyle = '#4a8aaa';
        ctx.lineWidth = 2;
        ctx.strokeRect(alexo.x + 8, alexo.y + 25, 34, 35);
        ctx.beginPath();
        ctx.moveTo(alexo.x + 8, alexo.y + 42);
        ctx.lineTo(alexo.x + 42, alexo.y + 42);
        ctx.stroke();

        ctx.fillStyle = '#3a6a8a';
        ctx.fillRect(alexo.x + 12, alexo.y, 26, 25);

        alexo.eyeGlow = 0.5 + Math.sin(frame * 0.1) * 0.5;
        ctx.fillStyle = `rgba(0, 255, 255, ${alexo.eyeGlow})`;
        ctx.fillRect(alexo.x + 16, alexo.y + 8, 18, 6);
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(alexo.x + 18, alexo.y + 9, 6, 4);
        ctx.fillRect(alexo.x + 26, alexo.y + 9, 6, 4);

        ctx.strokeStyle = '#4a8aaa';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(alexo.x + 25, alexo.y);
        ctx.lineTo(alexo.x + 25, alexo.y - 8);
        ctx.stroke();

        ctx.fillStyle = '#ff3300';
        ctx.beginPath();
        ctx.arc(alexo.x + 25, alexo.y - 8, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (alexo.direction === 'front') {
        // VISTA DE FRENTE
        const legMove = Math.sin(alexo.frameWalk) * 3;
        ctx.fillStyle = '#1a3a52';
        ctx.fillRect(alexo.x + 8, alexo.y + 60, 12, 30 + legMove);
        ctx.fillRect(alexo.x + 30, alexo.y + 60, 12, 30 - legMove);

        ctx.fillStyle = '#2a4a62';
        ctx.beginPath();
        ctx.arc(alexo.x + 14, alexo.y + 75 + legMove, 5, 0, Math.PI * 2);
        ctx.arc(alexo.x + 36, alexo.y + 75 - legMove, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3a7a9a';
        ctx.fillRect(alexo.x, alexo.y + 25, 50, 35);
        ctx.strokeStyle = '#4a8aaa';
        ctx.lineWidth = 2;
        ctx.strokeRect(alexo.x, alexo.y + 25, 50, 35);

        ctx.fillStyle = '#3a6a8a';
        ctx.fillRect(alexo.x + 12, alexo.y, 26, 25);

        alexo.eyeGlow = 0.5 + Math.sin(frame * 0.1) * 0.5;
        ctx.fillStyle = `rgba(0, 255, 255, ${alexo.eyeGlow})`;
        ctx.fillRect(alexo.x + 14, alexo.y + 8, 22, 6);
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(alexo.x + 16, alexo.y + 9, 6, 4);
        ctx.fillRect(alexo.x + 28, alexo.y + 9, 6, 4);

        ctx.strokeStyle = '#4a8aaa';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(alexo.x + 25, alexo.y);
        ctx.lineTo(alexo.x + 25, alexo.y - 8);
        ctx.stroke();
        ctx.fillStyle = '#ff3300';
        ctx.beginPath();
        ctx.arc(alexo.x + 25, alexo.y - 8, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// --- DIBUJO DIÁLOGO ---
function drawDialogueBox() {
    if (!showDialogueBox) return;

    const boxH = 120;
    const boxY = canvas.height - boxH - 20;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(40, boxY, canvas.width - 80, boxH);

    ctx.strokeStyle = '#4a8aaa';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, boxY, canvas.width - 80, boxH);

    const dialogue = dialogues[currentDialogue];

    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(dialogue.speaker, 60, boxY + 35);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    const words = dialogue.text.split(' ');
    let line = '';
    let y = boxY + 65;
    const maxWidth = canvas.width - 120;

    words.forEach(word => {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > maxWidth) {
            ctx.fillText(line, 60, y);
            line = word + ' ';
            y += 25;
        } else {
            line = testLine;
        }
    });
    ctx.fillText(line, 60, y);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '12px Arial';
    ctx.fillText('Presiona ESPACIO o haz click para continuar...', canvas.width - 300, boxY + boxH - 15);
}

// --- UPDATE ---
function update() {
    frame++;

    if (gameState === 'intro' || gameState === 'playing') {
        if (alexo.vx!== 0) {
            alexo.x += alexo.vx;
            alexo.frameWalk += 0.2;

            // Trigger diálogo cuando llega a los niños
            if (alexo.x > 400 && alexo.x < 405 && currentScene === 0) {
                alexo.vx = 0;
                startDialogue();
            }

            // Sale de pantalla
            if (alexo.x > 700 && currentScene === 1) {
                alexo.vx = 0;
                // Fin de intro, podrías cambiar de escena aquí
            }
        }
    }
}

// --- DRAW ---
function draw() {
    drawBackground();
    drawNinos();
    drawAlexo();
    drawDialogueBox();
}

// --- LOOP ---
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// --- INICIAR ---
let currentScene = 0;
gameLoop();