<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alexo: Versión Definitiva (Edición de Montaje)</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

        :root {
            --primary: #00FF88; /* Manteniendo el acento original si aplica, o ajustando al estilo ilustrado */
            --accent: #d4af37;
            --text: #2c2c2c;
            --bg-ui: rgba(255, 250, 240, 0.95); /* Estilo Página de Libro */
        }

        body {
            background-color: #1a1a1a;
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Lora', serif;
            overflow: hidden;
            color: var(--text);
            user-select: none;
        }

        #game-container {
            position: relative;
            width: 1024px;
            height: 640px; 
            box-shadow: 0 0 80px rgba(0, 0, 0, 0.5);
            background: #fdfbf7; /* Color papel */
            overflow: hidden;
            cursor: pointer;
            border: 12px solid #2c2c2c; /* Marco tipo cuadro */
            box-sizing: border-box;
        }

        canvas {
            display: block;
            width: 100%;
            height: 100%;
        }

        /* UI Layer */
        #ui-layer {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding-bottom: 40px;
            z-index: 10;
        }

        #dialog-box {
            background: var(--bg-ui);
            border-top: 4px solid var(--accent);
            padding: 20px 50px;
            min-height: 100px;
            display: none;
            text-align: center;
            pointer-events: none;
            box-shadow: 0 -5px 20px rgba(0,0,0,0.1);
            margin: 0 40px 20px 40px;
            border-radius: 2px;
        }

        #speaker-name {
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            color: #5a5a5a;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 5px;
        }

        #dialog-text {
            font-family: 'Lora', serif;
            font-size: 20px;
            color: #000;
            line-height: 1.5;
        }

        #prompt-indicator {
            position: absolute;
            bottom: 30px;
            right: 50px;
            color: #888;
            font-family: 'Playfair Display', serif;
            font-size: 12px;
            animation: pulse 2.5s infinite;
            opacity: 0;
            transition: opacity 0.5s;
        }

        #title-screen {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: #fdfbf7;
            z-index: 100;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            pointer-events: auto;
        }

        h1 {
            font-family: 'Playfair Display', serif;
            font-size: 70px;
            color: var(--text);
            margin: 0;
            letter-spacing: -2px;
        }

        .btn-start {
            margin-top: 50px;
            background: var(--text);
            color: #fff;
            border: none;
            padding: 15px 50px;
            font-family: 'Playfair Display', serif;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .btn-start:hover { background: var(--accent); color: #fff; transform: translateY(-2px); }

        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        
        /* Grain Overlay (Base) */
        .film-grain {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
            pointer-events: none; z-index: 50; opacity: 0.4;
        }
    </style>
</head>
<body>

    <main id="game-container" role="main">
        <canvas id="g" width="1024" height="640"></canvas>
        <div class="film-grain"></div>

        <section id="title-screen">
            <h1>ALEXO</h1>
            <p style="color: #666; font-style: italic; margin-top: 10px;">Protocolo: Empatía</p>
            <button class="btn-start" id="start-btn">Iniciar Historia</button>
        </section>

        <section id="ui-layer">
            <div id="dialog-box">
                <div id="speaker-name"></div>
                <div id="dialog-text"></div>
            </div>
            <div id="prompt-indicator">Continuar ▼</div>
        </section>
    </main>

<script>
/**
 * ALEXO: FINAL CUT
 * Base: Illustrated Style (Beret/Suit).
 * Logic: Kid Handoff, Extended Script, Visual Details.
 */
class CinematicGame {
    constructor() {
        this.canvas = document.getElementById('g');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.floorY = 450; 

        // Camera System
        this.camera = { x: this.width/2, y: this.height/2, targetX: this.width/2, targetY: this.height/2, shake: 0 };

        // UI
        this.uiTitle = document.getElementById('title-screen');
        this.uiDialog = document.getElementById('dialog-box');
        this.elSpeaker = document.getElementById('speaker-name');
        this.elText = document.getElementById('dialog-text');
        this.uiPrompt = document.getElementById('prompt-indicator');

        // State
        this.state = 'TITLE'; 
        this.stepIndex = 0;
        this.waitingForInput = false;
        
        // Entities
        this.alexo = { x: 200, y: this.floorY, state: 'IDLE', facing: 1, frame: 0, animState: 'WORK' };
        this.ian = { x: this.width + 100, y: this.floorY, visible: false, holdingPaper: false };
        this.kid = { x: 0, y: 0, visible: false, state: 'HIDING', owner: 'NONE' }; 
        this.rescuers = [];

        // Environment
        this.ambience = { fire: 0, siren: false, perceptionGlitch: false, murkiness: 0 };
        this.time = 0;

        // Particles / Details
        this.seagulls = [];
        for(let i=0; i<5; i++) this.seagulls.push({ x: Math.random()*1024, y: Math.random()*200, vx: 1, vy: Math.random()*0.2 });

        // Script (Expanded and Paced)
        this.script = this.getDirectorScript();

        // Init
        document.getElementById('start-btn').addEventListener('click', () => this.start());
        document.getElementById('game-container').addEventListener('click', () => this.handleInput());
        
        this.loop = this.loop.bind(this);
    }

    start() {
        this.uiTitle.style.display = 'none';
        this.state = 'PLAYING';
        this.runStep();
        requestAnimationFrame(this.loop);
    }

    // === GUION COMPLETO Y RITMADO ===
    getDirectorScript() {
        return [
            // --- ACTO 1: SALÓN DE FIESTAS (EXPANDIDO) ---
            { 
                type: 'SCENE', 
                bg: 'SALON', 
                cam: { x: 300, y: 400 }, 
                action: () => { 
                    this.alexo.x = 100; 
                    this.alexo.state = 'WALK'; 
                    this.ian.visible = false;
                } 
            },
            { type: 'MOVE', actor: 'ALEXO', x: 400, y: this.floorY, speed: 1.5 }, // Alexo entra
            { type: 'CAMERA_MOVE', x: 400, y: 350, speed: 0.01 }, // Plano medio
            { type: 'DIALOG', text: "Alexo recorre el salón. Todo parece estar en orden.", speaker: "" },
            
            // DETALLE: FLORAL
            { type: 'CAMERA_MOVE', x: 600, y: 380, speed: 0.01 }, // Zoom a mesa
            { type: 'WAIT', frames: 100 },
            { type: 'DIALOG', text: "Los adornos florales están perfectamente dispuestos.", speaker: "" },

            // DETALLE: ARTE
            { type: 'CAMERA_MOVE', x: 850, y: 300, speed: 0.01 }, // Pan a cuadro
            { type: 'WAIT', frames: 80 },
            { type: 'DIALOG', text: "La iluminación realza la obra de arte en la pared.", speaker: "" },
            
            // DETALLE: PLANTAS / IAN
            { type: 'CAMERA_MOVE', x: 400, y: 350, speed: 0.01 }, // Regreso al centro
            { type: 'ACTION', name: 'IAN_ENTER' },
            { type: 'WAIT', frames: 60 },
            { type: 'DIALOG', text: "Ian ultimando detalles en su sector.", speaker: "" },
            
            // INTERACCIÓN
            { type: 'MOVE', actor: 'ALEXO', x: 500, y: this.floorY, speed: 1 },
            { type: 'ACTION', name: 'IAN_PAPER' }, // Ian saca papel
            { type: 'DIALOG', text: "Ian se acerca y saca un manuscrito de su bolsillo.", speaker: "" },
            { type: 'CAMERA_MOVE', x: 500, y: 320, speed: 0.005 }, // Primer plano
            { type: 'WAIT', frames: 50 },
            
            { type: 'DIALOG', text: "¿Qué buscan comunicar tus historias?", speaker: "ALEXO" },
            { type: 'WAIT', frames: 60 }, // Espacio para pensar
            { type: 'DIALOG', text: "Emociones que, a veces, no se ven a simple vista.", speaker: "IAN" },
            { type: 'WAIT', frames: 60 },
            { type: 'DIALOG', text: "Se ve que tienes una gran habilidad para construir historias creativas.", speaker: "ALEXO" },
            { type: 'WAIT', frames: 80 }, // Pausa elegante

            // --- ACTO 2: VENTANA (DETALLADA) ---
            { 
                type: 'SCENE', 
                bg: 'WINDOW', 
                cam: { x: 512, y: 320 }, 
                action: () => { 
                    this.ian.visible = false; 
                    this.alexo.x = 800; // Cerca de ventana
                    this.alexo.facing = -1; 
                } 
            },
            { type: 'CAMERA_MOVE', x: 700, y: 320, speed: 0.005 }, // Suave paneo
            { type: 'DIALOG', text: "Qué bella se ve el agua del río.", speaker: "ALEXO" },
            { type: 'WAIT', frames: 120 }, // Contemplación
            
            // DETALLES VENTANA
            { type: 'CAMERA_MOVE', x: 900, y: 300, speed: 0.005 }, // Zoom a horizonte
            { type: 'WAIT', frames: 100 }, // Ver gaviotas, barcos
            { type: 'DIALOG', text: "Las luces de los barcos dibujan caminos en la oscuridad.", speaker: "" },

            // FORESHADOWING
            { type: 'EFFECT', name: 'MURKY_AIR' }, // Aire se enturbia
            { type: 'WAIT', frames: 60 },
            { type: 'DIALOG', text: "El aire se siente... denso del otro lado del dique.", speaker: "ALEXO" },
            { type: 'WAIT', frames: 60 },
            
            // TRANSICIÓN
            { type: 'EFFECT', name: 'SIREN' }, // Sirena
            { type: 'DIALOG', text: "¡Sirena! Un incidente cerca.", speaker: "" },
            { type: 'MOVE', actor: 'ALEXO', x: 500, y: this.floorY, speed: 2 }, // Se gira
            { type: 'ACTION', name: 'IAN_CALL' },
            { type: 'DIALOG', text: "Algo no está bien en la zona. Voy a dar un paseo.", speaker: "ALEXO" },
            { type: 'DIALOG', text: "No te pierdas. Vuelve lo antes posible.", speaker: "IAN" },

            // --- ACTO 3: DESPLAZAMIENTO ---
            { type: 'SCENE', bg: 'STREET', cam: { x: 0, y: 400 }, action: () => { this.alexo.x = 100; this.alexo.state = 'FLY'; this.ian.visible = false; } },
            { type: 'MOVE', actor: 'ALEXO', x: 2000, y: this.floorY, speed: 5 }, // Turbinas
            { type: 'CAMERA_MOVE', x: 2000, y: 400, speed: 0.005 },
            { type: 'DIALOG', text: "Alexo avanza flotando hacia la zona de peligro.", speaker: "" },

            // --- ACTO 4: INCENDIO ---
            { type: 'SCENE', bg: 'EXT_BUILDING', cam: { x: 512, y: 400 }, action: () => { this.alexo.x = 512; this.alexo.state = 'WALK'; this.ambience.fire = 1; } },
            { type: 'DIALOG', text: "Llegada al edificio.", speaker: "" },
            { type: 'MOVE', actor: 'ALEXO', x: 512, y: 400, speed: 2 }, // Ingresa
            { type: 'DIALOG', text: "Identificando piso once...", speaker: "ALEXO" },

            { type: 'SCENE', bg: 'HALL_FIRE', cam: { x: 512, y: 350 }, action: () => { this.alexo.x = 512; this.alexo.y = 400; } },
            { type: 'MOVE', actor: 'ALEXO', x: 512, y: 150, speed: 2 }, // Sube escaleras
            { type: 'CAMERA_MOVE', x: 512, y: 150, speed: 0.03 },
            { type: 'DIALOG', text: "Subiendo al piso once.", speaker: "" },

            { type: 'SCENE', bg: 'APARTMENT', cam: { x: 512, y: 350 }, action: () => { this.kid.visible = true; this.kid.x = 700; this.kid.y = this.floorY; } },
            { type: 'DIALOG', text: "Detecto vida bajo la mesa.", speaker: "ALEXO" },
            { type: 'MOVE', actor: 'ALEXO', x: 650, speed: 2 },
            { type: 'DIALOG', text: "No tengas miedo.", speaker: "ALEXO" },
            { type: 'ACTION', name: 'HUG' }, // Alexo toma al niño
            { type: 'WAIT', frames: 100 },

            // --- ACTO 5: RESCATE (CLARIDAD TOTAL) ---
            { type: 'SCENE', bg: 'STAIRS', cam: { x: 512, y: 400 }, action: () => { this.alexo.state = 'CARRY'; this.alexo.y = 150; this.alexo.x = 512; this.kid.owner = 'ALEXO'; } },
            { type: 'DIALOG', text: "Descendiendo con el niño.", speaker: "" },
            { type: 'MOVE', actor: 'ALEXO', x: 512, y: 350, speed: 2 }, // Baja a Piso 3
            
            { type: 'SPAWN_RESCUERS' },
            { type: 'MOVE_RESCUERS', x: 400, y: 350, speed: 2 }, // Rescatistas suben
            
            { type: 'DIALOG', text: "¡Equipo de rescate!", speaker: "" },
            { type: 'ACTION', name: 'RESCUER_REACH' }, // Rescatista extiende brazos
            { type: 'DIALOG', text: "¡Toma al niño!", speaker: "ALEXO" },
            { type: 'TRANSFER_KID' }, // LÓGICA DE ENTREGA
            { type: 'WAIT', frames: 80 }, // Pausa visual
            
            { type: 'DIALOG', text: "Está inconsciente, pero respira.", speaker: "ALEXO" },
            { type: 'DIALOG', text: "Lo tenemos. Gracias...", speaker: "RESCATISTA" },
            
            // SALIDA
            { type: 'ACTION', name: 'EXIT' }, // Alexo se gira
            { type: 'MOVE', actor: 'ALEXO', x: -100, y: 350, speed: 3 },
            { type: 'DIALOG', text: "Alexo se retira por la puerta de servicio.", speaker: "" },
            
            { type: 'SCENE', bg: 'EXIT_DOOR', cam: { x: 512, y: 400 }, action: () => { this.alexo.x = 512; this.alexo.y = 350; } },
            { type: 'FADE_OUT' },
            { type: 'END' }
        ];
    }

    runStep() {
        if (this.stepIndex >= this.script.length) return;
        const step = this.script[this.stepIndex];
        this.uiPrompt.style.opacity = '0';
        this.uiDialog.style.display = 'none';

        switch(step.type) {
            case 'SCENE':
                this.scene = step.bg;
                this.camera.targetX = step.cam.x;
                this.camera.targetY = step.cam.y;
                if (step.action) step.action();
                this.nextStep(); 
                break;
            case 'CAMERA_MOVE':
                this.camera.targetX = step.x;
                this.camera.targetY = step.y;
                this.nextStep();
                break;
            case 'DIALOG':
                this.uiDialog.style.display = 'block';
                this.elSpeaker.innerText = step.speaker || "";
                this.elText.innerText = step.text;
                this.waitingForInput = true;
                this.uiPrompt.style.opacity = '1';
                break;
            case 'MOVE':
                this.handleMovement(step);
                break;
            case 'WAIT':
                setTimeout(() => this.nextStep(), (step.frames / 60) * 1000);
                break;
            case 'ACTION':
                if (step.name === 'IAN_ENTER') { this.ian.visible = true; this.ian.x = 600; }
                if (step.name === 'IAN_PAPER') { this.ian.holdingPaper = true; }
                if (step.name === 'HUG') { this.alexo.state = 'IDLE'; this.kid.x = this.alexo.x; this.kid.owner = 'ALEXO'; }
                if (step.name === 'RESCUER_REACH') { if(this.rescuers[0]) this.rescuers[0].armsUp = true; }
                if (step.name === 'EXIT') { this.alexo.facing = -1; this.alexo.state = 'WALK'; }
                this.nextStep();
                break;
            case 'TRANSFER_KID':
                this.kid.owner = 'RESCUER';
                this.alexo.state = 'IDLE';
                this.nextStep();
                break;
            case 'EFFECT':
                if (step.name === 'MURKY_AIR') this.ambience.murkiness = 1;
                if (step.name === 'SIREN') this.triggerSiren();
                this.nextStep();
                break;
            case 'SPAWN_RESCUERS':
                this.rescuers = [{ x: 200, y: 600, armsUp: false }];
                this.nextStep();
                break;
            case 'MOVE_RESCUERS':
                this.handleRescuerMove(this.rescuers[0], step.x, step.y, step.speed, () => this.nextStep());
                break;
            case 'FADE_OUT':
                this.ctx.fillStyle = "#fdfbf7"; this.ctx.fillRect(0,0,this.width, this.height);
                setTimeout(() => this.nextStep(), 2000);
                break;
            case 'END':
                this.state = 'END';
                this.elText.innerText = "Fin del Acto.";
                this.elSpeaker.innerText = "";
                this.uiDialog.style.display = 'block';
                break;
        }
    }

    handleMovement(step) {
        const actor = step.actor === 'ALEXO' ? this.alexo : (step.actor === 'KID' ? this.kid : this.ian);
        const target = step.x; 
        const animateMove = () => {
            const dx = target - actor.x;
            const dy = (step.y !== undefined ? step.y : actor.y) - actor.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < step.speed) {
                actor.x = target; actor.y = step.y !== undefined ? step.y : actor.y;
                this.nextStep();
            } else {
                actor.x += (dx/dist) * step.speed; actor.y += (dy/dist) * step.speed;
                requestAnimationFrame(animateMove);
            }
        };
        animateMove();
    }

    handleRescuerMove(actor, targetX, targetY, speed, callback) {
        const dx = targetX - actor.x;
        const dy = targetY - actor.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > speed) {
            actor.x += (dx/dist) * speed; actor.y += (dy/dist) * speed;
            requestAnimationFrame(() => this.handleRescuerMove(actor, targetX, targetY, speed, callback));
        } else {
            callback();
        }
    }

    handleInput() {
        if (this.state === 'END') { location.reload(); return; }
        if (this.waitingForInput) {
            this.waitingForInput = false;
            this.stepIndex++;
            this.runStep();
        }
    }

    nextStep() {
        this.stepIndex++;
        this.runStep();
    }

    triggerSiren() {
        let count = 0;
        const flash = () => {
            if(count > 6) return;
            this.ctx.fillStyle = count % 2 === 0 ? "rgba(255,0,0,0.2)" : "rgba(0,0,255,0.2)";
            this.ctx.fillRect(0,0,this.width, this.height);
            count++;
            setTimeout(flash, 100);
        }
        flash();
    }

    loop() {
        this.time++;
        this.update();
        this.draw();
        if(this.state !== 'STOPPED') requestAnimationFrame(this.loop);
    }

    update() {
        this.camera.x += (this.camera.targetX - this.camera.x) * 0.05;
        this.camera.y += (this.camera.targetY - this.camera.y) * 0.05;
        if (this.camera.shake > 0) this.camera.shake *= 0.9;
        this.alexo.frame = Math.sin(this.time * 0.1) * 2;

        this.seagulls.forEach(s => {
            s.x += s.vx;
            s.y += Math.sin(this.time * 0.05) * 0.5;
            if(s.x > 1100) s.x = -100;
        });
    }

    draw() {
        this.ctx.fillStyle = "#fdfbf7"; this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.save();
        const shakeX = (Math.random() - 0.5) * this.camera.shake;
        const shakeY = (Math.random() - 0.5) * this.camera.shake;
        this.ctx.translate(this.width/2 - this.camera.x + shakeX, this.height/2 - this.camera.y + shakeY);

        if (this.scene === 'SALON') this.drawSalon();
        else if (this.scene === 'WINDOW') this.drawWindow();
        else if (this.scene === 'STREET') this.drawStreet();
        else if (this.scene === 'EXT_BUILDING') this.drawExtBuilding();
        else if (this.scene === 'HALL_FIRE') this.drawHall();
        else if (this.scene === 'APARTMENT') this.drawApartment();
        else if (this.scene === 'STAIRS') this.drawStairs();
        else if (this.scene === 'EXIT_DOOR') this.drawExitDoor();

        if (this.alexo.visible !== false) this.drawAlexoIllustrated(this.alexo.x, this.alexo.y, this.alexo.state);
        if (this.ian.visible) this.drawIanIllustrated(this.ian.x, this.ian.y);
        if (this.kid.visible) this.drawKidIllustrated(this.kid.x, this.kid.y);
        if (this.rescuers.length > 0) this.drawRescuer(this.rescuers[0].x, this.rescuers[0].y, this.rescuers[0].armsUp);

        this.ctx.restore();
        this.drawVignette();
    }

    // === ESCENAS (BASE + DETALLES QUIRÚRGICOS) ===
    
    drawSalon() {
        const ctx = this.ctx;
        // Fondo base
        ctx.fillStyle = "#F5F5DC"; ctx.fillRect(0, 0, 1024, 450);
        ctx.fillStyle = "#D7CCC8"; ctx.fillRect(0, 450, 1024, 300);

        // Cortinas
        ctx.fillStyle = "#B71C1C"; 
        const drawCurtain = (x) => {
            ctx.beginPath(); ctx.moveTo(x, 0);
            ctx.bezierCurveTo(x+50, 100, x-50, 200, x, 300);
            ctx.lineTo(x-40, 300);
            ctx.bezierCurveTo(x-20, 200, x-70, 100, x-40, 0);
            ctx.fill();
        };
        drawCurtain(0); drawCurtain(1024);

        // Lámparas
        ctx.fillStyle = "#FFD700"; ctx.shadowColor="#FFD700"; ctx.shadowBlur=20;
        for(let i=0; i<3; i++) { ctx.beginPath(); ctx.arc(200 + i*300, 0, 30, 0, Math.PI*2); ctx.fill(); }
        ctx.shadowBlur=0;

        // Mesas (Base)
        const tables = [300, 600, 850];
        tables.forEach(tx => {
            ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(tx, 450, 60, 20, 0, 0, Math.PI*2); ctx.fill();
            
            // DETALLE: ADORNO FLORAL (Solo en mesas clave)
            if (tx === 600) this.drawFloralDetail(tx, 435);
            else {
                // Copa simple
                ctx.fillStyle = "rgba(200,200,255,0.5)"; ctx.beginPath(); ctx.moveTo(tx-10,445); ctx.lineTo(tx-8,425); ctx.lineTo(tx-2,425); ctx.lineTo(tx,445); ctx.fill();
            }
        });

        // DETALLE: OBRA DE ARTE (Cuadro en pared)
        this.drawPainting(800, 200);

        // DETALLE: PLANTAS (Rincón)
        this.drawPlant(100, 450);
    }

    drawFloralDetail(x, y) {
        const ctx = this.ctx;
        ctx.fillStyle = "#e91e63"; // Rosas
        ctx.beginPath(); ctx.arc(x-10, y, 8, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(x+10, y, 8, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#f06292"; // Centro
        ctx.beginPath(); ctx.arc(x-10, y, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(x+10, y, 3, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#4CAF50"; // Hojas
        ctx.beginPath(); ctx.moveTo(x-20, y); ctx.quadraticCurveTo(x-10, y-10, x, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x+20, y); ctx.quadraticCurveTo(x+10, y-10, x, y); ctx.stroke();
    }

    drawPainting(x, y) {
        const ctx = this.ctx;
        // Marco
        ctx.fillStyle = "#5D4037"; ctx.fillRect(x, y, 100, 120);
        ctx.strokeStyle = "#FFD700"; ctx.lineWidth = 2; ctx.strokeRect(x, y, 100, 120);
        // Lienzo
        ctx.fillStyle = "#EEE"; ctx.fillRect(x+5, y+5, 90, 110);
        // Arte Abstracto
        ctx.fillStyle = "#1976D2"; ctx.beginPath(); ctx.arc(x+45, y+60, 20, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#F44336"; ctx.fillRect(x+25, y+30, 40, 40);
    }

    drawPlant(x, y) {
        const ctx = this.ctx;
        ctx.fillStyle = "#3E2723"; ctx.beginPath(); ctx.moveTo(x-15, y); ctx.lineTo(x+15, y); ctx.lineTo(x+10, y+40); ctx.lineTo(x-10, y+40); ctx.fill();
        ctx.fillStyle = "#2E7D32"; // Hojas
        ctx.beginPath(); ctx.ellipse(x, y-20, 25, 40, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#388E3C"; 
        ctx.beginPath(); ctx.ellipse(x-15, y-20, 15, 30, -0.3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x+15, y-20, 15, 30, 0.3, 0, Math.PI*2); ctx.fill();
    }

    drawWindow() {
        const ctx = this.ctx;
        // Atardecer base
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 450);
        skyGrad.addColorStop(0, "#191970"); skyGrad.addColorStop(0.7, "#FF6347"); skyGrad.addColorStop(1, "#FFD700");
        ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, 1024, 450);

        // DETALLE: AGUA
        ctx.fillStyle = "#0D1B2A"; ctx.fillRect(0, 400, 1024, 300);
        ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth=2;
        for(let i=0; i<20; i++) {
            let ly = 400 + i*15 + Math.sin(this.time*0.02+i)*5;
            ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(1024, ly); ctx.stroke();
        }

        // DETALLE: LUCES DE BARCOS
        const boats = [200, 500, 800];
        boats.forEach(bx => {
            if (Math.random() > 0.95) {
                ctx.fillStyle = "#FFD700"; ctx.beginPath(); ctx.arc(bx, 420 + Math.random()*20, 2, 0, Math.PI*2); ctx.fill();
            }
        });

        // DETALLE: GAVIOTAS
        ctx.fillStyle = "#FFF";
        this.seagulls.forEach(s => {
            ctx.save(); ctx.translate(s.x, s.y);
            ctx.beginPath(); ctx.moveTo(-5, -2); ctx.lineTo(0, 2); ctx.lineTo(5, -2); ctx.stroke();
            ctx.restore();
        });

        // DETALLE: CASAS A LEJOS (Horizonte)
        ctx.fillStyle = "#0a0a0a";
        for(let i=0; i<5; i++) {
            let bx = 200 + i*150;
            ctx.fillRect(bx, 320, 80, 80); // Siluetas simples
        }

        // Marco Ventana
        ctx.strokeStyle = "#2c2c2c"; ctx.lineWidth = 10;
        ctx.strokeRect(600, 50, 300, 400);
        ctx.beginPath(); ctx.moveTo(750, 50); ctx.lineTo(750, 450); ctx.stroke();
        
        // Murkiness (Enturbiamiento sutil)
        if (this.ambience.murkiness > 0) {
            ctx.fillStyle = "rgba(100, 110, 100, 0.3)"; ctx.fillRect(0, 300, 1024, 200); // Niebla en horizonte
        }
    }

    drawStreet() { this.ctx.fillStyle = "#111"; this.ctx.fillRect(0,0,1024,640); }
    drawExtBuilding() { this.ctx.fillStyle = "#333"; this.ctx.fillRect(0,0,1024,640); this.ctx.fillStyle = "#222"; this.ctx.fillRect(300, 100, 424, 540); this.ctx.fillStyle = `rgba(255,69,0,${0.5 + Math.sin(this.time*0.2)*0.2})`; this.ctx.beginPath(); this.ctx.arc(512, 200, 100, 0, Math.PI*2); this.ctx.fill(); }
    drawHall() { this.ctx.fillStyle = "#444"; this.ctx.fillRect(0,0,1024,640); }
    drawApartment() { this.ctx.fillStyle = "#3E2723"; this.ctx.fillRect(0,0,1024,640); this.ctx.fillStyle = "rgba(0,0,0,0.5)"; this.ctx.fillRect(0,0,1024,640); }
    drawStairs() {
        this.ctx.fillStyle = "#111"; this.ctx.fillRect(0,0,1024,640);
        this.ctx.strokeStyle = "#222"; this.ctx.lineWidth = 2;
        for(let i=0; i<12; i++) {
            let y = 50 + i * 45;
            this.ctx.beginPath(); this.ctx.moveTo(300, y); this.ctx.lineTo(660, y); this.ctx.stroke();
        }
        this.ctx.strokeStyle = "#444"; this.ctx.beginPath();
        this.ctx.moveTo(310, 50); this.ctx.lineTo(310, 550);
        this.ctx.moveTo(650, 50); this.ctx.lineTo(650, 550); this.ctx.stroke();
    }
    drawExitDoor() { this.ctx.fillStyle = "#080808"; this.ctx.fillRect(0,0,1024,640); this.ctx.fillStyle = "#222"; this.ctx.fillRect(400, 150, 160, 300); this.ctx.strokeStyle = "#444"; this.ctx.strokeRect(400, 150, 160, 300); this.ctx.fillStyle = "rgba(0, 255, 136, 0.1)"; this.ctx.fillRect(410, 160, 140, 280); }


    // === PERSONAJES (BASE ILLUSTRATED - NO CAMBIOS) ===

    drawAlexoIllustrated(x, y, state) {
        const ctx = this.ctx; ctx.save(); ctx.translate(x, y);
        // Efecto Flotante
        let hoverOffset = 0;
        if (state === 'FLY') { hoverOffset = -20; }
        
        const bob = Math.sin(this.time * (state==='FLY'?0.3:0.1)) * (state === 'FLY' ? 2 : 2);
        
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.beginPath(); ctx.ellipse(0, 45, 40, 10, 0, 0, Math.PI*2); ctx.fill();

        // Turbinas
        if (state === 'FLY') {
            ctx.fillStyle = "rgba(0, 200, 255, 0.6)";
            ctx.beginPath(); ctx.moveTo(-10, 30); ctx.lineTo(-5, 45); ctx.lineTo(0, 30); ctx.fill();
            ctx.beginPath(); ctx.moveTo(10, 30); ctx.lineTo(5, 45); ctx.lineTo(0, 30); ctx.fill();
        }

        // PIES
        ctx.fillStyle = "#000";
        ctx.beginPath(); ctx.ellipse(-15, 45 + bob, 12, 5, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(15, 45 + bob, 12, 5, 0, 0, Math.PI*2); ctx.fill();

        // PANTALÓN
        ctx.fillStyle = "#555";
        ctx.fillRect(-20, -50 + bob + hoverOffset, 15, 100); ctx.fillRect(5, -50 + bob + hoverOffset, 15, 100);

        // SACO (Boina y Saco)
        ctx.fillStyle = "#1a237e"; 
        ctx.beginPath(); ctx.moveTo(-25, -100 + bob + hoverOffset); ctx.lineTo(25, -100 + bob + hoverOffset); ctx.lineTo(20, 0 + bob + hoverOffset); ctx.lineTo(-20, 0 + bob + hoverOffset); ctx.fill();
        ctx.beginPath(); ctx.moveTo(0, -100 + bob + hoverOffset); ctx.lineTo(10, -50 + bob + hoverOffset); ctx.lineTo(0, 0 + bob + hoverOffset); ctx.lineTo(-10, -50 + bob + hoverOffset); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(0, -100 + bob + hoverOffset); ctx.lineTo(5, -80 + bob + hoverOffset); ctx.lineTo(0, -60 + bob + hoverOffset); ctx.lineTo(-5, -80 + bob + hoverOffset); ctx.fill();
        ctx.fillStyle = "#2c2c2c"; ctx.beginPath(); ctx.ellipse(0, -115 + bob + hoverOffset, 22, 8, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(-22, -115 + bob + hoverOffset, 44, 5);

        // Rostro
        ctx.fillStyle = "#cfd8dc"; ctx.beginPath(); ctx.roundRect(-15, -105 + bob + hoverOffset, 30, 35, 5); ctx.fill();
        ctx.fillStyle = "rgba(33, 150, 243, 0.8)";
        ctx.beginPath(); ctx.arc(-5, -95 + bob + hoverOffset, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(5, -95 + bob + hoverOffset, 3, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#78909c"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, -82 + bob + hoverOffset, 4, 0, Math.PI); ctx.stroke();

        // BRAZOS
        const armSwing = Math.sin(this.time * (state==='FLY'?0.2:0.1)) * (state === 'FLY' ? 10 : 5);
        ctx.fillStyle = "#1a237e";
        ctx.save(); ctx.translate(-22, -90 + bob + hoverOffset); ctx.rotate(armSwing * 0.02);
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0, 40); ctx.lineTo(-5, 45); ctx.fill();
        ctx.restore();
        ctx.save(); ctx.translate(22, -90 + bob + hoverOffset); ctx.rotate(-armSwing * 0.02);
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0, 40); ctx.lineTo(5, 45); ctx.fill();
        ctx.restore();

        ctx.fillStyle = "#cfd8dc";
        ctx.beginPath(); ctx.arc(-22 + (armSwing*0.2), -45 + bob + hoverOffset, 5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(22 - (armSwing*0.2), -45 + bob + hoverOffset, 5, 0, Math.PI*2); ctx.fill();

        if (state === 'CARRY') {
             ctx.fillStyle = "#e0ac69"; ctx.beginPath(); ctx.arc(0, -60 + bob + hoverOffset, 12, 0, Math.PI*2); ctx.fill();
             ctx.fillStyle = "#d32f2f"; ctx.fillRect(-10, -48 + bob + hoverOffset, 20, 25);
        }
        ctx.restore();
    }

    drawIanIllustrated(x, y) {
        const ctx = this.ctx; ctx.save(); ctx.translate(x, y);
        const bob = Math.sin(this.time * 0.1) * 2;
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.beginPath(); ctx.ellipse(0, 45, 30, 8, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#000"; ctx.fillRect(-12, -30 + bob, 10, 80); ctx.fillRect(2, -30 + bob, 10, 80);
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(-14, -80 + bob); ctx.lineTo(14, -80 + bob); ctx.lineTo(12, -30 + bob); ctx.lineTo(-12, -30 + bob); ctx.fill();
        ctx.fillStyle = "#000"; ctx.fillRect(-4, -70 + bob, 8, 4); ctx.beginPath(); ctx.arc(0, -72 + bob, 6, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#e0ac69"; ctx.beginPath(); ctx.ellipse(0, -95 + bob, 12, 15, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#3e2723"; ctx.beginPath(); ctx.arc(0, -100 + bob, 12, Math.PI, 0); ctx.fill();
        ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(4, -95 + bob, 1.5, 0, Math.PI*2); ctx.fill();
        if (this.ian.holdingPaper) {
            ctx.save(); ctx.translate(20, -60 + bob); ctx.rotate(-0.2);
            ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 20, 30);
            ctx.fillStyle = "#000"; ctx.font="6px serif"; ctx.fillText("...", 2, 10);
            ctx.restore();
        }
        ctx.restore();
    }

    drawKidIllustrated(x, y) {
        const ctx = this.ctx; ctx.save(); ctx.translate(x, y);
        ctx.fillStyle = "#e0ac69"; ctx.beginPath(); ctx.arc(0, -40, 10, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#d32f2f"; ctx.fillRect(-8, -30, 16, 25);
        ctx.fillStyle = "#3e2723"; ctx.beginPath(); ctx.arc(0, -45, 10, Math.PI, 0); ctx.fill();
        ctx.restore();
    }

    drawRescuer(x, y, armsUp) {
        const ctx = this.ctx; ctx.save(); ctx.translate(x, y);
        ctx.fillStyle = "#FFD700"; ctx.fillRect(-15, -60, 30, 100);
        ctx.fillStyle = "#333"; ctx.beginPath(); ctx.arc(0, -75, 12, 0, Math.PI*2); ctx.fill();
        
        // Brazos extendidos
        ctx.fillStyle = "#FFD700";
        if (armsUp) {
            ctx.save(); ctx.translate(-15, -50); ctx.rotate(-0.6); ctx.fillRect(0, 0, 10, 40); ctx.restore();
            ctx.save(); ctx.translate(15, -50); ctx.rotate(0.6); ctx.fillRect(0, 0, 10, 40); ctx.restore();
        } else {
            ctx.fillRect(-20, -50, 8, 40); ctx.fillRect(12, -50, 8, 40);
        }
        ctx.restore();
    }

    drawVignette() {
        const grad = this.ctx.createRadialGradient(this.width/2, this.height/2, 300, this.width/2, this.height/2, 700);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, "rgba(0,0,0,0.4)");
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0,0,this.width, this.height);
    }
}

window.onload = () => { new CinematicGame(); };
</script>
</body>
</html>