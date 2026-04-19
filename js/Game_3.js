// js/Game_3.js - ALEXO Nueva Arcadia v3 FINAL ESTABLE
// Fix: DOMContentLoaded para que el botón exista. Fondo completo. Alexo perfil. Niños con brazos.

let canvas;
let ctx;

const mariposa = {
    x: 0, y: 0, 
    targetX: 0, targetY: 0,
    angle: 0, wingAngle: 0,
    active: true, perched: false
};

let frame = 0;
let gameState = 'menu';
let currentDialogue = 0;
let showDialogueBox = false;
let dialogueTriggered = false;

const RAMBLA_Y = 450;
const MAR_Y = 480;
const CIELO_H = 300;

const alexo = {
    x: 100, y: RAMBLA_Y - 90, w: 50, h: 90,
    vx: 1.2, vy: 0, frameWalk: 0, eyeGlow: 0,
    direction: 'side'
};

const ninos = [
    { x: 650, y: RAMBLA_Y - 60, w: 35, h: 60, color: '#FF6B6B', waving: false, pelo: '#3A3A3A' },
    { x: 720, y: RAMBLA_Y - 60, w: 35, h: 60, color: '#4ECDC4', waving: false, pelo: '#8B4513' },
    { x: 790, y: RAMBLA_Y - 60, w: 35, h: 60, color: '#FFE66D', waving: false, pelo: '#2A2A2A' }
];

const nubes = [
    { x: 100, y: 80, w: 120, speed: 0.3 },
    { x: 400, y: 120, w: 90, speed: 0.2 },
    { x: 700, y: 60, w: 140, speed: 0.4 }
];

const dialogues = [
    { speaker: "Alexo", text: "¡Hola! Soy Alexo, un robot explorador de Nueva Arcadia." },
    { speaker: "Niño 1", text: "¡Guau! ¿Cómo es el futuro?" },
    { speaker: "Alexo", text: "Está lleno de aventuras. ¿Quieren venir?" }
];

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

function drawBackground() {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CIELO_H);
    skyGrad.addColorStop(0, '#0a0a2e');
    skyGrad.addColorStop(0.5, '#1a1a3e');
    skyGrad.addColorStop(1, '#2a2a5e');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, CIELO_H);

    // Fondo para la zona de los edificios (evita el rastro de Alexo)
    ctx.fillStyle = '#1a1a3e';
    ctx.fillRect(0, CIELO_H, canvas.width, RAMBLA_Y - CIELO_H);

    const sunGlow = 0.7 + Math.sin(frame * 0.05) * 0.3;
    ctx.fillStyle = `rgba(255, 255, 0, ${sunGlow * 0.3})`;
    ctx.shadowColor = '#FFFF00';
    ctx.shadowBlur = 40 * sunGlow;
    ctx.beginPath();
    ctx.arc(canvas.width - 100, 100, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    nubes.forEach(nube => {
        nube.x += nube.speed;
        if (nube.x > canvas.width + nube.w) nube.x = -nube.w;
        ctx.beginPath();
        ctx.arc(nube.x, nube.y, nube.w * 0.3, 0, Math.PI * 2);
        ctx.arc(nube.x + nube.w * 0.3, nube.y - 10, nube.w * 0.25, 0, Math.PI * 2);
        ctx.arc(nube.x + nube.w * 0.6, nube.y, nube.w * 0.3, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = '#0f0f2e';
    for (let i = 0; i < canvas.width; i += 80) {
        const h = 150 + Math.sin(i * 0.05) * 50;
        ctx.fillRect(i, CIELO_H - h, 60, h);
        for (let y = CIELO_H - h + 10; y < CIELO_H - 10; y += 15) {
            for (let x = i + 5; x < i + 55; x += 15) {
                // Luces fijas por edificio
                if (Math.sin(i * 10 + x + y) > 0.4) {
                    ctx.fillStyle = 'rgba(255, 255, 100, 0.4)';
                    ctx.fillRect(x, y, 8, 8);
                }
            }
        }
        ctx.fillStyle = '#0f0f2e';
    }

    const marGrad = ctx.createLinearGradient(0, MAR_Y, 0, canvas.height);
    marGrad.addColorStop(0, '#0a3460');
    marGrad.addColorStop(1, '#052040');
    ctx.fillStyle = marGrad;
    ctx.fillRect(0, MAR_Y, canvas.width, canvas.height - MAR_Y);

    ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 20) {
            const y = MAR_Y + i * 20 + Math.sin((x + frame * 2) * 0.02) * 5;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // Rambla antigua comentada según reglas
    // ctx.fillStyle = '#2c3e50';
    // ctx.fillRect(0, RAMBLA_Y, canvas.width, MAR_Y - RAMBLA_Y);
    // ctx.strokeStyle = '#FFD700';
    // ctx.lineWidth = 3;
    // ctx.setLineDash([20, 15]);
    // ctx.beginPath();
    // ctx.moveTo(0, RAMBLA_Y + (MAR_Y - RAMBLA_Y) / 2);
    // ctx.lineTo(canvas.width, RAMBLA_Y + (MAR_Y - RAMBLA_Y) / 2);
    // ctx.stroke();
    // ctx.setLineDash([]);
}

function drawNinos() {
    ninos.forEach((nino, i) => {
        const cx = nino.x + nino.w / 2;
        const cy = nino.y;
        const skin = '#fdbcb4';
        const outline = 'rgba(0,0,0,0.3)';

        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.ellipse(cx, RAMBLA_Y + 4, nino.w * 0.4, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = outline;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.fillStyle = '#2C3E50';
        const legW = nino.w * 0.28;
        const legH = nino.h * 0.4;
        ctx.fillRect(cx - legW - 2, cy + nino.h * 0.6, legW, legH);
        ctx.strokeRect(cx - legW - 2, cy + nino.h * 0.6, legW, legH);
        ctx.fillRect(cx + 2, cy + nino.h * 0.6, legW, legH);
        ctx.strokeRect(cx + 2, cy + nino.h * 0.6, legW, legH);

        ctx.fillStyle = '#1A1A1A';
        roundRect(ctx, cx - legW - 2, cy + nino.h * 0.6 + legH, legW + 2, 5, 2);
        ctx.fill();
        ctx.stroke();
        roundRect(ctx, cx + 2, cy + nino.h * 0.6 + legH, legW + 2, 5, 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = nino.color;
        const torsoH = nino.h * 0.6;
        const torsoW = nino.w * 0.8;
        roundRect(ctx, cx - torsoW/2, cy, torsoW, torsoH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.arc(cx, cy - 8, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = nino.pelo;
        ctx.beginPath();
        ctx.arc(cx, cy - 14, 11, Math.PI, 0);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(cx - 4, cy - 9, 1.5, 0, Math.PI * 2);
        ctx.arc(cx + 4, cy - 9, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy - 6, 4, 0, Math.PI);
        ctx.stroke();

        const shoulderY = cy + torsoH * 0.25;
        const leftShoulderX = cx - torsoW/2;
        const rightShoulderX = cx + torsoW/2;
        const armW = 5;

        if (!nino.waving) {
            const dist = Math.abs((alexo.x + alexo.w / 2) - cx);
            if (dist < 180) nino.waving = true;
        }

        function drawArm(x1, y1, x2, y2, x3, y3) {
            ctx.strokeStyle = skin;
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.stroke();
            
            ctx.strokeStyle = outline;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        if (nino.waving) {
            drawArm(leftShoulderX, shoulderY, leftShoulderX - 2, shoulderY + 10, leftShoulderX - 3, shoulderY + 18);
            ctx.fillStyle = skin;
            ctx.beginPath();
            ctx.arc(leftShoulderX - 3, shoulderY + 20, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            const waveAngle = Math.sin(frame * 0.15 + i) * 0.8 - 0.5;
            const handX = rightShoulderX + Math.cos(waveAngle) * 22;
            const handY = shoulderY + Math.sin(waveAngle) * 22;
            
            ctx.strokeStyle = skin;
            ctx.lineWidth = 7;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(rightShoulderX, shoulderY);
            ctx.lineTo(handX, handY);
            ctx.stroke();
            
            ctx.fillStyle = skin;
            ctx.beginPath();
            ctx.arc(handX, handY, 5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            drawArm(leftShoulderX, shoulderY, leftShoulderX - 2, shoulderY + 10, leftShoulderX - 3, shoulderY + 18);
            ctx.fillStyle = skin;
            ctx.beginPath();
            ctx.arc(leftShoulderX - 3, shoulderY + 20, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            drawArm(rightShoulderX, shoulderY, rightShoulderX + 2, shoulderY + 10, rightShoulderX + 3, shoulderY + 18);
            ctx.fillStyle = skin;
            ctx.beginPath();
            ctx.arc(rightShoulderX + 3, shoulderY + 20, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        ctx.restore();
    });
}

function drawAlexo() {
    const cx = alexo.x + alexo.w / 2;
    const outline = 'rgba(0,0,0,0.35)';

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(cx, RAMBLA_Y + 4, alexo.w * 0.35, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = outline;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const legMove = Math.sin(alexo.frameWalk) * 8;
    const armMove = Math.sin(alexo.frameWalk) * 5;

    // Pierna de atrás
    ctx.fillStyle = '#112a3d';
    ctx.fillRect(alexo.x + 20, alexo.y + 60, 10, 30 - legMove);
    ctx.strokeRect(alexo.x + 20, alexo.y + 60, 10, 30 - legMove);

    // Brazo de atrás
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#1a3a52';
    ctx.beginPath();
    ctx.moveTo(cx - 2, alexo.y + 35);
    ctx.lineTo(cx - 12 + armMove, alexo.y + 55);
    ctx.stroke();

    // Cuerpo (Perfil)
    const torsoGrad = ctx.createLinearGradient(alexo.x, alexo.y, alexo.x + alexo.w, alexo.y);
    torsoGrad.addColorStop(0, '#2a5a7a');
    torsoGrad.addColorStop(1, '#3a7a9a');
    ctx.fillStyle = torsoGrad;
    roundRect(ctx, alexo.x + 10, alexo.y + 25, 25, 38, 5);
    ctx.fill();
    ctx.stroke();

    // Pierna de adelante
    ctx.fillStyle = '#2a5a7a';
    ctx.fillRect(alexo.x + 15, alexo.y + 60, 10, 30 + legMove);
    ctx.strokeRect(alexo.x + 15, alexo.y + 60, 10, 30 + legMove);

    // Brazo de adelante
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#3a7a9a';
    ctx.beginPath();
    ctx.moveTo(cx + 2, alexo.y + 35);
    ctx.lineTo(cx + 12 - armMove, alexo.y + 55);
    ctx.stroke();

    // Cabeza de Perfil
    ctx.fillStyle = '#3a6a8a';
    roundRect(ctx, alexo.x + 12, alexo.y, 24, 25, 4);
    ctx.fill();
    ctx.stroke();

    // Visor de perfil
    alexo.eyeGlow = 0.5 + Math.sin(frame * 0.1) * 0.5;
    ctx.fillStyle = '#003333';
    ctx.fillRect(alexo.x + 22, alexo.y + 6, 14, 8);
    
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10 * alexo.eyeGlow;
    ctx.fillRect(alexo.x + 28, alexo.y + 8, 6, 4);
    ctx.shadowBlur = 0;

    // Antena
    ctx.strokeStyle = '#4a8aaa';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(alexo.x + 22, alexo.y);
    ctx.lineTo(alexo.x + 22, alexo.y - 8);
    ctx.stroke();

    const antennaGlow = 0.6 + Math.sin(frame * 0.15) * 0.4;
    ctx.fillStyle = `rgba(255, 51, 0, ${antennaGlow})`;
    ctx.shadowColor = '#ff3300';
    ctx.shadowBlur = 6 * antennaGlow;
    ctx.beginPath();
    ctx.arc(alexo.x + 22, alexo.y - 8, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
}

function drawMariposa() {
    if (!mariposa.active) return;
    
    ctx.save();
    ctx.translate(mariposa.x, mariposa.y);
    
    const w = 6;
    const wingSize = 8 * Math.abs(Math.sin(frame * 0.2));
    
    ctx.fillStyle = '#FF00FF'; // Color mariposa
    // Ala izquierda
    ctx.beginPath();
    ctx.ellipse(-w, 0, wingSize, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ala derecha
    ctx.beginPath();
    ctx.ellipse(w, 0, wingSize, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cuerpo mariposa
    ctx.fillStyle = '#000';
    ctx.fillRect(-1, -4, 2, 8);
    
    ctx.restore();
}

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
    if (!dialogue) return;

    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(dialogue.speaker, 60, boxY + 35);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    const words = dialogue.text.split(' ');
    let line = '';
    let lineY = boxY + 65;
    const maxWidth = canvas.width - 120;

    words.forEach(word => {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > maxWidth) {
            ctx.fillText(line, 60, lineY);
            line = word + ' ';
            lineY += 25;
        } else {
            line = testLine;
        }
    });
    ctx.fillText(line, 60, lineY);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '12px Arial';
    ctx.fillText('Presioná ESPACIO o click para continuar...', canvas.width - 320, boxY + boxH - 15);
}

function drawRamblaMejorada() {
    if (!ctx) return;
    
    try {
        // Suelo de la rambla
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, RAMBLA_Y, canvas.width, MAR_Y - RAMBLA_Y);

        // Grietas fijas (seed basado en posición para evitar parpadeo)
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 150) {
            ctx.beginPath();
            ctx.moveTo(x, RAMBLA_Y);
            let curX = x;
            let curY = RAMBLA_Y;
            for (let j = 0; j < 5; j++) {
                let seed = Math.sin(x + j) * 10;
                curX += seed;
                curY += (MAR_Y - RAMBLA_Y) / 5;
                ctx.lineTo(curX, curY);
            }
            ctx.stroke();
        }

        // Charcos de agua (reflejos azulados)
        for (let i = 100; i < canvas.width; i += 300) {
            ctx.fillStyle = 'rgba(100, 150, 255, 0.2)';
            ctx.beginPath();
            ctx.ellipse(i, RAMBLA_Y + 15, 40, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Faroles cada 200px
        for (let i = 0; i < canvas.width; i += 200) {
            const farolX = i + 50;
            // Poste
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(farolX, RAMBLA_Y - 80, 4, 80);
            
            // Luz del farol con parpadeo suave
            const glow = 0.8 + Math.sin(frame * 0.05 + i) * 0.2;
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15 * glow;
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(farolX + 2, RAMBLA_Y - 85, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Reflejo cálido en el suelo bajo el farol
            ctx.fillStyle = `rgba(255, 215, 0, ${0.15 * glow})`;
            ctx.beginPath();
            ctx.ellipse(farolX + 2, RAMBLA_Y + 10, 35, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Línea amarilla original (mejorada)
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.setLineDash([15, 20]);
        ctx.beginPath();
        ctx.moveTo(0, RAMBLA_Y + (MAR_Y - RAMBLA_Y) / 2);
        ctx.lineTo(canvas.width, RAMBLA_Y + (MAR_Y - RAMBLA_Y) / 2);
        ctx.stroke();
        ctx.setLineDash([]);
    } catch (e) {
        console.error("Error en drawRamblaMejorada:", e);
    }
}

function draw() {
    drawBackground();
    drawRamblaMejorada();
    drawNinos();
    drawAlexo();
    drawMariposa();
    drawDialogueBox();
}

function update() {
    frame++;
    alexo.frameWalk += 0.15;

    // Lógica mariposa
    if (mariposa.active) {
        if (!mariposa.perched) {
            mariposa.targetX = alexo.x + 22 + Math.sin(frame * 0.05) * 40;
            mariposa.targetY = alexo.y - 20 + Math.cos(frame * 0.05) * 20;
            mariposa.x += (mariposa.targetX - mariposa.x) * 0.05;
            mariposa.y += (mariposa.targetY - mariposa.y) * 0.05;
            
            if (gameState === 'dialogue') mariposa.perched = true;
        } else {
            mariposa.x = alexo.x + 22;
            mariposa.y = alexo.y - 12;
            if (gameState === 'playing') mariposa.perched = false;
        }
    }

    if (gameState === 'playing') {
        alexo.x += alexo.vx;

        if (!dialogueTriggered && alexo.x >= 250 && alexo.x <= 350) {
            dialogueTriggered = true;
            startDialogue();
        }
    }
}

function startDialogue() {
    gameState = 'dialogue';
    currentDialogue = 0;
    showDialogueBox = true;
    alexo.vx = 0;
    alexo.direction = 'side';
    alexo.frameWalk = 0;
}

function nextDialogue() {
    currentDialogue++;
    if (currentDialogue >= dialogues.length) {
        showDialogueBox = false;
        gameState = 'playing';
        alexo.vx = 1.2;
        alexo.direction = 'side';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && showDialogueBox) nextDialogue();
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function iniciarJuego() {
    gameState = 'playing';
    alexo.direction = 'side';
    alexo.vx = 1.2;
    alexo.vy = 0;
    alexo.frameWalk = 0;
    dialogueTriggered = false;
    const ts = document.getElementById('title-screen');
    if (ts) ts.style.display = 'none';
    
    // Iniciar mariposa cerca
    mariposa.x = alexo.x;
    mariposa.y = alexo.y - 100;
    
    gameLoop();
}

// FIX CRÍTICO: esperar a que el DOM cargue antes de buscar el botón
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('gameCanvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        canvas.width = 1000;
        canvas.height = 600;
        
        canvas.addEventListener('click', () => {
            if (showDialogueBox) nextDialogue();
        });
    }

    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', iniciarJuego);
    } else {
        console.error('No se encontró #start-btn. Revisa el HTML.');
    }
});