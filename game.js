// ============================================
// MI JUEGO - SALÓN DE FIESTAS
// ============================================

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;

// ============================================
// ESTADOS DEL JUEGO
// ============================================
var Estado = {
    INTRO: 'intro',
    EXPLORAR: 'explorar',
    DIALOGO: 'dialogo',
    PUZZLE: 'puzzle',
    MINIJUEGO: 'minijuego',
    CREDITOS: 'creditos',
    PANEO_CINEMATOGRAFICO: 'paneo_cinematografico'
};

// ============================================
// JUEGO PRINCIPAL
// ============================================
var juego = {
    estado: Estado.EXPLORAR,
    paneo: {
        activo: false,
        indicePunto: 0,
        puntos: [
            { nombre: 'Rincón de las Luces', x: 150, y: 120, zoom: 1.8, duracion: 4000,
              descripcion: 'Las luces doradas bailan como luciérnagas encantadas sobre la pista de baile' },
            { nombre: 'Cortinas y Elegancia', x: 850, y: 100, zoom: 1.6, duracion: 4500,
              descripcion: 'Cortinas de terciopelo rojo enmarcan ventanas que dejan ver un cielo estrellado' },
            { nombre: 'La Obra Maestra', x: 500, y: 80, zoom: 2.0, duracion: 5000,
              descripcion: 'Un cuadro al óleo del salón en sus años dorados preside la pared principal' }
        ],
        timer: 0,
        progreso: 0,
        desdeX: 0, desdeY: 0, desdeZoom: 1,
        haciaX: 0, haciaY: 0, haciaZoom: 1,
        fadeIn: 0,
        textoAlpha: 0,
        textoTimer: 0,
        esperandoClick: false,
        iniciado: false
    },
    intro: {
        alpha: 1,
        tituloAlpha: 0,
        subtituloAlpha: 0,
        fadeOut: 0,
        timer: 0
    },
    textoFlotante: null,
    jugador: {
        x: 500, y: 450,
        ancho: 30, alto: 50,
        velocidad: 3,
        direccion: 'abajo',
        animFrame: 0,
        animTimer: 0,
        moviendo: false
    },
    npcs: [],
    objetosInteractivos: [],
    puertas: [],
    currentRoom: 'salon_principal',
    dialogoActivo: null,
    puzzleActivo: null,
    inventario: [],
    flags: {},
    camara: { x: 0, y: 0 },
    teclas: {},
    tiempo: 0
};

// ============================================
// NPCs
// ============================================
juego.npcs = [
    {
        id: 'ian',
        nombre: 'Ian',
        x: 350, y: 380,
        ancho: 30, alto: 50,
        colorPiel: '#e8c39e',
        colorPelo: '#3a2a1a',
        colorCamisa: '#2c5f8a',
        direccion: 'abajo',
        dialogos: [
            { texto: 'Ian: ¡Bienvenido al salón! ¿Buscás algo especial?', respuestas: [
                { texto: '¿Qué hay para hacer?', siguiente: 1 },
                { texto: 'Solo mirando, gracias.', siguiente: 2 }
            ]},
            { texto: 'Ian: Tenés la pista de baile, el bufé, y podrías hablar con los invitados...', respuestas: [
                { texto: 'Gracias por la info.', siguiente: -1 }
            ]},
            { texto: 'Ian: ¡Disfrutá la fiesta!', respuestas: [
                { texto: '¡Gracias!', siguiente: -1 }
            ]}
        ],
        dialogoIndex: 0,
        interactuable: true
    },
    {
        id: 'maria',
        nombre: 'María',
        x: 650, y: 350,
        ancho: 28, alto: 48,
        colorPiel: '#d4a574',
        colorPelo: '#1a0f0a',
        colorCamisa: '#8e1e4f',
        direccion: 'abajo',
        dialogos: [
            { texto: 'María: ¡Qué linda noche para bailar!', respuestas: [
                { texto: '¿Bailás?', siguiente: 1 },
                { texto: 'Saludos.', siguiente: -1 }
            ]},
            { texto: 'María: ¡Por supuesto! La música me pone...', respuestas: [
                { texto: '¡Animáte!', siguiente: -1 }
            ]}
        ],
        dialogoIndex: 0,
        interactuable: true
    }
];

// ============================================
// OBJETOS INTERACTIVOS
// ============================================
juego.objetosInteractivos = [
    { id: 'pista_baile', x: 420, y: 280, ancho: 160, alto: 80, tipo: 'pista', nombre: 'Pista de Baile' },
    { id: 'bufe', x: 480, y: 510, ancho: 60, alto: 40, tipo: 'bufe', nombre: 'Bufé' },
    { id: 'cuadro', x: 470, y: 60, ancho: 60, alto: 40, tipo: 'cuadro', nombre: 'El Salón Dorado' }
];

// ============================================
// TEXTOS FLOTANTES
// ============================================
function mostrarTexto(texto, duracion) {
    juego.textoFlotante = { texto: texto, timer: duracion || 3000, alpha: 1 };
}

// ============================================
// DIBUJO DE PAREDES
// ============================================
function dibujarParedes(ctx) {
    // Pared de fondo
    var grad = ctx.createLinearGradient(0, 40, 0, 180);
    grad.addColorStop(0, '#d4c5a9');
    grad.addColorStop(1, '#c4b599');
    ctx.fillStyle = grad;
    ctx.fillRect(10, 40, 980, 140);
    // Línea superior
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(10, 38, 980, 4);
}

// ============================================
// DIBUJO DE TECHO
// ============================================
function dibujarTecho(ctx) {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 1000, 42);
}

// ============================================
// LUCES DECORATIVAS
// ============================================
function dibujarLucesDecorativas(ctx) {
    var coloresLuces = ['#ffdb4d', '#ff6b6b', '#4ecdc4', '#f39c12', '#e74c6f', '#9b59b6'];
    for (var g = 0; g < 5; g++) {
        var startX = 100 + g * 180, startY = 55, endX = startX + 140, midY = 85 + Math.sin(g * 1.2) * 15;
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo((startX + endX) / 2, midY, endX, startY);
        ctx.stroke();
        for (var i = 0; i <= 8; i++) {
            var t = i / 8;
            var bx = (1-t)*(1-t)*startX + 2*(1-t)*t*((startX+endX)/2) + t*t*endX;
            var by = (1-t)*(1-t)*startY + 2*(1-t)*t*midY + t*t*startY;
            var ci = (g*3+i) % coloresLuces.length;
            var grad = ctx.createRadialGradient(bx, by, 0, bx, by, 12);
            grad.addColorStop(0, coloresLuces[ci] + '60');
            grad.addColorStop(1, coloresLuces[ci] + '00');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(bx, by, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = coloresLuces[ci];
            ctx.beginPath();
            ctx.arc(bx, by + 3, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff90';
            ctx.beginPath();
            ctx.arc(bx - 1, by + 2, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    var lampX = 500, lampY = 30;
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lampX, 0);
    ctx.lineTo(lampX, lampY);
    ctx.stroke();
    ctx.fillStyle = '#f5e6cc';
    ctx.beginPath();
    ctx.ellipse(lampX, lampY, 30, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d4a574';
    ctx.lineWidth = 2;
    ctx.stroke();
    var lampGrad = ctx.createRadialGradient(lampX, lampY + 10, 5, lampX, lampY + 30, 80);
    lampGrad.addColorStop(0, 'rgba(255,220,150,0.3)');
    lampGrad.addColorStop(0.5, 'rgba(255,200,100,0.1)');
    lampGrad.addColorStop(1, 'rgba(255,200,100,0)');
    ctx.fillStyle = lampGrad;
    ctx.beginPath();
    ctx.ellipse(lampX, lampY + 40, 80, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    for (var j = 0; j < 12; j++) {
        var angle = (Math.PI * 2 / 12) * j;
        var ccx = lampX + Math.cos(angle) * 25;
        var ccy = lampY + Math.sin(angle) * 10;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.ellipse(ccx, ccy + 5, 2, 5, angle, 0, Math.PI * 2);
        ctx.fill();
    }
}


// ============================================
// CORTINAS DECORATIVAS
// ============================================
function dibujarCortinasDecorativas(ctx) {
    var ventanaX = [130, 830];
    ventanaX.forEach(function(wx) {
        ctx.fillStyle = '#3a2510';
        ctx.fillRect(wx - 52, 60, 104, 110);
        ctx.fillStyle = '#0a0a2e';
        ctx.fillRect(wx - 48, 64, 96, 102);
        var seed = wx * 7;
        for (var i = 0; i < 15; i++) {
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            var sx = wx - 45 + (seed % 90);
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            var sy = 66 + (seed % 95);
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            var sr = 0.5 + (seed % 15) / 15;
            ctx.fillStyle = 'rgba(255,255,220,' + (0.4 + (seed % 60) / 100) + ')';
            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#f0e68c';
        ctx.beginPath();
        ctx.arc(wx + 25, 85, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0a0a2e';
        ctx.beginPath();
        ctx.arc(wx + 29, 83, 8, 0, Math.PI * 2);
        ctx.fill();
        for (var c = 0; c < 8; c++) {
            var ox = c * 3;
            var shade = 140 + c * 8;
            ctx.fillStyle = 'rgb(' + shade + ',' + Math.floor(shade*0.15) + ',' + Math.floor(shade*0.18) + ')';
            ctx.beginPath();
            ctx.moveTo(wx - 52 - ox, 60);
            ctx.quadraticCurveTo(wx - 40 - ox + Math.sin(c*0.8)*5, 110, wx - 45 - ox + Math.sin(c*1.2)*8, 170);
            ctx.lineTo(wx - 52 - ox - 3, 170);
            ctx.quadraticCurveTo(wx - 48 - ox + Math.sin(c*0.6)*3, 110, wx - 58 - ox, 60);
            ctx.fill();
        }
        for (var c2 = 0; c2 < 8; c2++) {
            var ox2 = c2 * 3;
            var shade2 = 140 + c2 * 8;
            ctx.fillStyle = 'rgb(' + shade2 + ',' + Math.floor(shade2*0.15) + ',' + Math.floor(shade2*0.18) + ')';
            ctx.beginPath();
            ctx.moveTo(wx + 52 + ox2, 60);
            ctx.quadraticCurveTo(wx + 40 + ox2 - Math.sin(c2*0.8)*5, 110, wx + 45 + ox2 - Math.sin(c2*1.2)*8, 170);
            ctx.lineTo(wx + 52 + ox2 + 3, 170);
            ctx.quadraticCurveTo(wx + 48 + ox2 - Math.sin(c2*0.6)*3, 110, wx + 58 + ox2, 60);
            ctx.fill();
        }
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(wx - 60, 55, 120, 8);
        ctx.fillStyle = '#a0791a';
        ctx.fillRect(wx - 58, 56, 116, 3);
        for (var r = 0; r < 5; r++) {
            var rx = wx - 50 + r * 25;
            ctx.fillStyle = '#c9a84c';
            ctx.beginPath(); ctx.arc(rx, 59, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#a0791a';
            ctx.beginPath(); ctx.arc(rx, 59, 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = '#c9a84c';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(wx-50,63); ctx.quadraticCurveTo(wx-58,72,wx-50,80); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(wx-50,63); ctx.quadraticCurveTo(wx-42,72,wx-50,80); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(wx+50,63); ctx.quadraticCurveTo(wx+58,72,wx+50,80); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(wx+50,63); ctx.quadraticCurveTo(wx+42,72,wx+50,80); ctx.stroke();
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(wx-50,80); ctx.quadraticCurveTo(wx-53,90,wx-48,100); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(wx+50,80); ctx.quadraticCurveTo(wx+53,90,wx+48,100); ctx.stroke();
    });
}

// ============================================
// CUADRO OBRA MAESTRA
// ============================================
function dibujarCuadroObraMaestra(ctx) {
    var cx = 500, cy = 95, cw = 160, ch = 100;
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(cx - cw/2 + 4, cy - ch/2 + 4, cw, ch);
    var marcoGrad = ctx.createLinearGradient(cx - cw/2 - 8, cy - ch/2 - 8, cx + cw/2 + 8, cy + ch/2 + 8);
    marcoGrad.addColorStop(0, '#d4a017');
    marcoGrad.addColorStop(0.3, '#f5d442');
    marcoGrad.addColorStop(0.5, '#c9960c');
    marcoGrad.addColorStop(0.7, '#f5d442');
    marcoGrad.addColorStop(1, '#b8860b');
    ctx.fillStyle = marcoGrad;
    ctx.fillRect(cx - cw/2 - 8, cy - ch/2 - 8, cw + 16, ch + 16);
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - cw/2 - 6, cy - ch/2 - 6, cw + 12, ch + 12);
    ctx.strokeRect(cx - cw/2 - 3, cy - ch/2 - 3, cw + 6, ch + 6);
    var ornSize = 12;
    var esquinas = [[cx-cw/2-4,cy-ch/2-4],[cx+cw/2+4,cy-ch/2-4],[cx-cw/2-4,cy+ch/2+4],[cx+cw/2+4,cy+ch/2+4]];
    esquinas.forEach(function(e) {
        ctx.fillStyle = '#f5d442';
        ctx.beginPath(); ctx.arc(e[0],e[1],ornSize/2,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#d4a017';
        ctx.beginPath(); ctx.arc(e[0],e[1],ornSize/3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#f5d442';
        ctx.beginPath(); ctx.arc(e[0],e[1],ornSize/5,0,Math.PI*2); ctx.fill();
    });
    var lienzoGrad = ctx.createLinearGradient(cx-cw/2,cy-ch/2,cx-cw/2,cy+ch/2);
    lienzoGrad.addColorStop(0,'#2c1810');
    lienzoGrad.addColorStop(0.4,'#3a2218');
    lienzoGrad.addColorStop(0.6,'#2c1810');
    lienzoGrad.addColorStop(1,'#1a0f0a');
    ctx.fillStyle = lienzoGrad;
    ctx.fillRect(cx-cw/2,cy-ch/2,cw,ch);
    ctx.fillStyle = '#4a3520';
    ctx.fillRect(cx-cw/2+5,cy+ch/2-35,cw-10,30);
    for (var i = 0; i < 8; i++) {
        ctx.strokeStyle = 'rgba(60,40,25,0.5)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(cx-cw/2+5+i*(cw-10)/8,cy+ch/2-35);
        ctx.lineTo(cx-cw/2+5+i*(cw-10)/8,cy+ch/2-5);
        ctx.stroke();
    }
    ctx.fillStyle = '#d4c5a9';
    ctx.fillRect(cx-cw/2+5,cy-ch/2+5,cw-10,ch/2-35);
    for (var li = 0; li < 6; li++) {
        var lx = cx-cw/2+15+li*(cw-30)/5;
        ctx.fillStyle = '#ffdb4d80';
        ctx.beginPath(); ctx.arc(lx,cy-ch/2+12,2,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.3;
        ctx.beginPath(); ctx.moveTo(lx-12,cy-ch/2+8); ctx.lineTo(lx+12,cy-ch/2+8); ctx.stroke();
    }
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(cx-30,cy+ch/2-42,20,8);
    ctx.fillRect(cx+10,cy+ch/2-42,20,8);
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath(); ctx.arc(cx-2,cy+ch/2-55,3,0,Math.PI*2); ctx.fill();
    ctx.fillRect(cx-4,cy+ch/2-52,5,12);
    ctx.beginPath(); ctx.arc(cx+5,cy+ch/2-54,3,0,Math.PI*2); ctx.fill();
    ctx.fillRect(cx+3,cy+ch/2-51,5,12);
    ctx.globalAlpha = 0.08;
    for (var pi = 0; pi < 40; pi++) {
        var ppx = cx-cw/2+Math.random()*cw;
        var ppy = cy-ch/2+Math.random()*ch;
        ctx.fillStyle = Math.random()>0.5?'#fff':'#000';
        ctx.fillRect(ppx,ppy,2+Math.random()*4,0.5);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#c9a84c';
    ctx.fillRect(cx-30,cy+ch/2+12,60,14);
    ctx.fillStyle = '#1a0f0a';
    ctx.font = '7px serif';
    ctx.textAlign = 'center';
    ctx.fillText('"El Salón Dorado"',cx,cy+ch/2+22);
    ctx.font = '5px serif';
    ctx.fillText('Anónimo, circa 1952',cx,cy+ch/2+29);
    var spotGrad = ctx.createRadialGradient(cx,cy-ch/2-15,3,cx,cy,cw*0.7);
    spotGrad.addColorStop(0,'rgba(255,240,200,0.15)');
    spotGrad.addColorStop(1,'rgba(255,240,200,0)');
    ctx.fillStyle = spotGrad;
    ctx.beginPath();
    ctx.moveTo(cx-5,cy-ch/2-20);
    ctx.lineTo(cx-cw/2-15,cy+ch/2+10);
    ctx.lineTo(cx+cw/2+15,cy+ch/2+10);
    ctx.lineTo(cx+5,cy-ch/2-20);
    ctx.fill();
}

// ============================================
// DETALLES DECORATIVOS
// ============================================
function dibujarDetallesDecorativos(ctx) {
    ctx.fillStyle = '#6a4c2a';
    ctx.fillRect(50, 140, 15, 25);
    ctx.fillRect(935, 140, 15, 25);
    var floreros = [[50, 140], [935, 140]];
    floreros.forEach(function(f) {
        ctx.fillStyle = '#2d5a27';
        ctx.beginPath(); ctx.ellipse(f[0]+7,f[1]-5,8,4,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#e74c6f';
        ctx.beginPath(); ctx.arc(f[0]+3,f[1]-10,3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#f39c12';
        ctx.beginPath(); ctx.arc(f[0]+7,f[1]-12,3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#3498db';
        ctx.beginPath(); ctx.arc(f[0]+11,f[1]-10,3,0,Math.PI*2); ctx.fill();
    });
    ctx.strokeStyle = 'rgba(201,168,76,0.25)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4, 2, 4]);
    ctx.beginPath();
    ctx.moveTo(20, 55);
    ctx.lineTo(980, 55);
    ctx.stroke();
    ctx.setLineDash([]);
    var zocaloGrad = ctx.createLinearGradient(0, 170, 0, 178);
    zocaloGrad.addColorStop(0, '#5a3a1a');
    zocaloGrad.addColorStop(0.5, '#7a5a3a');
    zocaloGrad.addColorStop(1, '#4a2a10');
    ctx.fillStyle = zocaloGrad;
    ctx.fillRect(10, 170, 980, 8);
    ctx.strokeStyle = 'rgba(201,168,76,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, 171);
    ctx.lineTo(990, 171);
    ctx.stroke();
}

// ============================================
// PISTA DE BAILE
// ============================================
function dibujarPista(ctx) {
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(420, 280, 160, 80);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    for (var i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(500, 320, 10 + i * 10, 0, Math.PI * 2);
        ctx.stroke();
    }
    var brillo = 0.05 + Math.sin(juego.tiempo * 2) * 0.03;
    ctx.fillStyle = 'rgba(255,255,255,' + brillo + ')';
    ctx.fillRect(420, 280, 160, 80);
}

// ============================================
// MESA REDONDA DECORADA
// ============================================
function dibujarMesaRedonda(ctx, x, y, rx, ry) {
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(x + 3, y + 3, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    // Superficie
    var mesaGrad = ctx.createRadialGradient(x - 10, y - 5, 5, x, y, rx);
    mesaGrad.addColorStop(0, '#8B6914');
    mesaGrad.addColorStop(1, '#6a4c2a');
    ctx.fillStyle = mesaGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    // Borde
    ctx.beginPath();
    ctx.ellipse(x, y, rx + 3, ry + 3, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#5a3a1a';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Mantel
    ctx.beginPath();
    ctx.ellipse(x, y + 2, rx + 8, ry + 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,248,240,0.5)';
    ctx.fill();
    ctx.strokeStyle = '#d4c5a9';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Florero
    ctx.beginPath();
    ctx.ellipse(x, y - 5, 6, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#c0c0c0';
    ctx.fill();
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.strokeStyle = '#2d5a27';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x-2,y-8); ctx.lineTo(x-3,y-18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+1,y-8); ctx.lineTo(x+2,y-20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+3,y-8); ctx.lineTo(x+5,y-16); ctx.stroke();
    ctx.fillStyle = '#e74c6f';
    ctx.beginPath(); ctx.arc(x-3,y-19,3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#f39c12';
    ctx.beginPath(); ctx.arc(x+2,y-21,3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#9b59b6';
    ctx.beginPath(); ctx.arc(x+5,y-17,2.5,0,Math.PI*2); ctx.fill();
    // Velitas
    for (var i = 0; i < 4; i++) {
        var angle = (Math.PI*2/4)*i + Math.PI/4;
        var vx = x + Math.cos(angle)*(rx*0.5);
        var vy = y + Math.sin(angle)*(ry*0.35) - 2;
        ctx.fillStyle = '#f5e6cc';
        ctx.fillRect(vx-2, vy-2, 4, 6);
        ctx.strokeStyle = '#d4a574';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(vx-2, vy-2, 4, 6);
        ctx.fillStyle = '#ffdb4d';
        ctx.beginPath(); ctx.ellipse(vx,vy-5,1.5,3,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff8e1';
        ctx.beginPath(); ctx.ellipse(vx,vy-5.5,0.7,1.5,0,0,Math.PI*2); ctx.fill();
    }
    // Platos
    for (var p = 0; p < 6; p++) {
        var pa = (Math.PI*2/6)*p;
        var px = x + Math.cos(pa)*(rx*0.72);
        var py = y + Math.sin(pa)*(ry*0.5);
        ctx.beginPath();
        ctx.ellipse(px, py, 8, 5, pa*0.3, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fill();
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.strokeStyle = '#c0c0c0';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px+9,py-3); ctx.lineTo(px+9,py+5); ctx.stroke();
    }
}

// ============================================
// MESA RECTANGULAR DECORADA
// ============================================
function dibujarMesaRectangular(ctx, x, y, w, h) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(x - w/2 + 3, y - h/2 + 3, w, h);
    var mesaGrad = ctx.createLinearGradient(x - w/2, y, x + w/2, y);
    mesaGrad.addColorStop(0, '#6a4c2a');
    mesaGrad.addColorStop(0.5, '#8B6914');
    mesaGrad.addColorStop(1, '#6a4c2a');
    ctx.fillStyle = mesaGrad;
    ctx.fillRect(x - w/2, y - h/2, w, h);
    ctx.strokeStyle = '#5a3a1a';
    ctx.lineWidth = 3;
    ctx.strokeRect(x - w/2 - 2, y - h/2 - 2, w + 4, h + 4);
    // Mantel
    ctx.fillStyle = 'rgba(255,248,240,0.4)';
    ctx.fillRect(x-w/2-6,y-h/2-4,w+12,h+8);
    ctx.strokeStyle = '#d4c5a9';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x-w/2-6,y-h/2-4,w+12,h+8);
    ctx.setLineDash([4,3]);
    ctx.strokeStyle = 'rgba(180,160,130,0.4)';
    ctx.strokeRect(x-w/2-4,y-h/2-2,w+8,h+4);
    ctx.setLineDash([]);
    // Ramo
    var cx = x, cy = y - 5;
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(cx-5,cy,10,8);
    ctx.fillStyle = '#2d5a27';
    for (var i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.ellipse(cx+i*4,cy-5-Math.abs(i)*2,3,6,i*0.15,0,Math.PI*2);
        ctx.fill();
    }
    var fc = ['#e74c6f','#f1c40f','#3498db','#e67e22','#9b59b6'];
    for (var fi = -2; fi <= 2; fi++) {
        ctx.fillStyle = fc[fi+2];
        ctx.beginPath(); ctx.arc(cx+fi*5,cy-10-Math.abs(fi)*3,3.5,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#f9e79f';
        ctx.beginPath(); ctx.arc(cx+fi*5,cy-10-Math.abs(fi)*3,1.5,0,Math.PI*2); ctx.fill();
    }
    // Velas
    ctx.fillStyle = '#b8860b';
    ctx.fillRect(cx-20,cy+2,4,10);
    ctx.fillRect(cx+16,cy+2,4,10);
    ctx.fillStyle = '#f5e6cc';
    ctx.fillRect(cx-19,cy-4,2,7);
    ctx.fillRect(cx+17,cy-4,2,7);
    ctx.fillStyle = '#ffdb4d';
    ctx.beginPath(); ctx.ellipse(cx-18,cy-7,1.5,3,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx+18,cy-7,1.5,3,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff8e1';
    ctx.beginPath(); ctx.ellipse(cx-18,cy-7.5,0.7,1.5,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx+18,cy-7.5,0.7,1.5,0,0,Math.PI*2); ctx.fill();
    // Platos
    var np = Math.floor(w/30);
    for (var pi = 0; pi < np; pi++) {
        var px = x-w/2+20+pi*(w-40)/Math.max(1,np-1);
        var py = y+h/2-15;
        ctx.beginPath(); ctx.ellipse(px,py,9,6,0,0,Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fill();
        ctx.strokeStyle = '#bbb'; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.beginPath(); ctx.ellipse(px,py,6,4,0,0,Math.PI*2);
        ctx.strokeStyle = 'rgba(200,180,160,0.5)'; ctx.stroke();
        ctx.strokeStyle = '#c0c0c0'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(px+10,py-4); ctx.lineTo(px+10,py+4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px+12,py-3); ctx.lineTo(px+12,py+4); ctx.stroke();
    }
    // Servilletas
    for (var si = 0; si < np-1; si++) {
        var sx = x-w/2+30+si*(w-40)/Math.max(1,np-1);
        var sy = y+h/2-15;
        ctx.fillStyle = 'rgba(230,220,200,0.6)';
        ctx.beginPath();
        ctx.moveTo(sx,sy-5); ctx.lineTo(sx+4,sy); ctx.lineTo(sx,sy+5); ctx.lineTo(sx-4,sy);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(180,160,140,0.4)'; ctx.lineWidth = 0.3; ctx.stroke();
    }
}

// ============================================
// DIBUJAR SALÓN COMPLETO
// ============================================
function dibujarSalon(ctx) {
    // Piso
    var pisoGrad = ctx.createLinearGradient(0, 180, 0, 600);
    pisoGrad.addColorStop(0, '#4a3520');
    pisoGrad.addColorStop(1, '#3a2510');
    ctx.fillStyle = pisoGrad;
    ctx.fillRect(10, 180, 980, 420);
    // Tablas del piso
    ctx.strokeStyle = 'rgba(60,40,25,0.3)';
    ctx.lineWidth = 1;
    for (var i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(10 + i * 50, 180);
        ctx.lineTo(10 + i * 50, 600);
        ctx.stroke();
    }
    for (var j = 0; j < 8; j++) {
        ctx.beginPath();
        ctx.moveTo(10, 200 + j * 55);
        ctx.lineTo(990, 200 + j * 55);
        ctx.stroke();
    }
    dibujarParedes(ctx);
    dibujarTecho(ctx);
    dibujarLucesDecorativas(ctx);
    dibujarCortinasDecorativas(ctx);
    dibujarCuadroObraMaestra(ctx);
    dibujarDetallesDecorativos(ctx);
    dibujarPista(ctx);
    // Mesas
    dibujarMesaRedonda(ctx, 200, 350, 55, 30);
    dibujarMesaRedonda(ctx, 400, 400, 55, 30);
    dibujarMesaRedonda(ctx, 600, 400, 55, 30);
    dibujarMesaRedonda(ctx, 800, 350, 55, 30);
    dibujarMesaRectangular(ctx, 500, 520, 180, 50);
}

// ============================================
// DIBUJAR NPC (IAN CON DOS OJOS)
// ============================================
function dibujarNPC(ctx, npc) {
    var x = npc.x, y = npc.y;
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(x, y + 25, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cuerpo
    ctx.fillStyle = npc.colorCamisa;
    ctx.fillRect(x - 10, y - 5, 20, 25);
    // Cabeza
    ctx.fillStyle = npc.colorPiel;
    ctx.beginPath();
    ctx.arc(x, y - 15, 12, 0, Math.PI * 2);
    ctx.fill();
    // Pelo
    ctx.fillStyle = npc.colorPelo;
    ctx.beginPath();
    ctx.arc(x, y - 20, 12, Math.PI, Math.PI * 2);
    ctx.fill();
    // Ojo izquierdo
    ctx.beginPath();
    ctx.arc(x - 4, y - 16, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 3.5, y - 16, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    // Ojo derecho
    ctx.beginPath();
    ctx.arc(x + 4, y - 16, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 4.5, y - 16, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    // Boca
    ctx.strokeStyle = '#a0705a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y - 10, 3, 0.1, Math.PI - 0.1);
    ctx.stroke();
    // Nombre
    if (npc.interactuable) {
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f5d442';
        ctx.fillText(npc.nombre, x, y - 32);
    }
}

// ============================================
// DIBUJAR JUGADOR
// ============================================
function dibujarJugador(ctx) {
    var j = juego.jugador;
    var x = j.x, y = j.y;
    
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(x, y + 25, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cuerpo (traje oscuro)
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x - 10, y - 5, 20, 26);
    // Solapa
    ctx.fillStyle = '#1a252f';
    ctx.beginPath();
    ctx.moveTo(x, y - 5);
    ctx.lineTo(x - 5, y + 5);
    ctx.lineTo(x, y + 15);
    ctx.lineTo(x + 5, y + 5);
    ctx.closePath();
    ctx.fill();
    // Corbata
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.moveTo(x, y - 3);
    ctx.lineTo(x - 2, y + 5);
    ctx.lineTo(x, y + 12);
    ctx.lineTo(x + 2, y + 5);
    ctx.closePath();
    ctx.fill();
    
    // Cabeza
    ctx.fillStyle = '#e8c39e';
    ctx.beginPath();
    ctx.arc(x, y - 15, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Pelo
    ctx.fillStyle = '#2c1810';
    ctx.beginPath();
    ctx.arc(x, y - 20, 12, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 12, y - 20, 24, 4);
    
    // Ojos (según dirección)
    var ojX = 0, ojY = -16;
    if (j.direccion === 'izquierda') ojX = -2;
    else if (j.direccion === 'derecha') ojX = 2;
    else if (j.direccion === 'arriba') ojY = -18;
    
    // Ojo izquierdo
    ctx.beginPath();
    ctx.arc(x - 4 + ojX, y + ojY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 3.5 + ojX, y + ojY, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    
    // Ojo derecho
    ctx.beginPath();
    ctx.arc(x + 4 + ojX, y + ojY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 4.5 + ojX, y + ojY, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    
    // Boca
    ctx.strokeStyle = '#a0705a';
    ctx.lineWidth = 1;
    if (j.moviendo) {
        ctx.beginPath();
        ctx.arc(x, y - 9, 2, 0, Math.PI);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.arc(x, y - 10, 3, 0.1, Math.PI - 0.1);
        ctx.stroke();
    }
    
    // Piernas con animación
    var paso = j.moviendo ? Math.sin(j.animFrame * 0.3) * 5 : 0;
    ctx.fillStyle = '#1a252f';
    ctx.fillRect(x - 7, y + 21, 6, 10 + paso * 0.5);
    ctx.fillRect(x + 1, y + 21, 6, 10 - paso * 0.5);
    // Zapatos
    ctx.fillStyle = '#1a0f0a';
    ctx.fillRect(x - 8, y + 30 + paso * 0.3, 8, 4);
    ctx.fillRect(x, y + 30 - paso * 0.3, 8, 4);
    
    // Indicador de interacción (si hay algo cercano)
    if (getObjetoCercano()) {
        var indicY = y - 38 + Math.sin(juego.tiempo * 4) * 3;
        ctx.fillStyle = '#f5d442';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('▼', x, indicY);
    }
}

// ============================================
// OBTENER OBJETO CERCANO
// ============================================
function getObjetoCercano() {
    var j = juego.jugador;
    var rango = 50;
    
    // NPCs
    for (var i = 0; i < juego.npcs.length; i++) {
        var n = juego.npcs[i];
        var dx = j.x - n.x, dy = j.y - n.y;
        if (Math.sqrt(dx * dx + dy * dy) < rango) return n;
    }
    
    // Objetos interactivos
    for (var i = 0; i < juego.objetosInteractivos.length; i++) {
        var o = juego.objetosInteractivos[i];
        var ox = o.x + o.ancho / 2, oy = o.y + o.alto / 2;
        var dx = j.x - ox, dy = j.y - oy;
        if (Math.sqrt(dx * dx + dy * dy) < rango + 30) return o;
    }
    
    return null;
}

// ============================================
// SISTEMA DE DIÁLOGOS
// ============================================
function dibujarDialogo(ctx) {
    var d = juego.dialogoActivo;
    if (!d) return;
    
    var boxW = 700, boxH = 140;
    var boxX = (1000 - boxW) / 2, boxY = 600 - boxH - 20;
    
    // Fondo oscuro
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, 1000, 600);
    
    // Caja de diálogo
    ctx.fillStyle = 'rgba(20,15,10,0.95)';
    ctx.strokeStyle = '#c9a84c';
    ctx.lineWidth = 3;
    
    // Esquinas decorativas
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 8);
    ctx.fill();
    ctx.stroke();
    
    // Línea dorada interior
    ctx.strokeStyle = 'rgba(201,168,76,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(boxX + 6, boxY + 6, boxW - 12, boxH - 12, 5);
    ctx.stroke();
    
    // Nombre del hablante
    var nombre = '';
    if (d.npcId) {
        var npc = juego.npcs.find(function(n) { return n.id === d.npcId; });
        if (npc) nombre = npc.nombre;
    }
    
    ctx.font = 'bold 16px Georgia';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f5d442';
    ctx.fillText(nombre, boxX + 20, boxY + 28);
    
    // Línea bajo nombre
    ctx.strokeStyle = 'rgba(201,168,76,0.4)';
    ctx.beginPath();
    ctx.moveTo(boxX + 20, boxY + 34);
    ctx.lineTo(boxX + 200, boxY + 34);
    ctx.stroke();
    
    // Texto del diálogo
    ctx.font = '15px Georgia';
    ctx.fillStyle = '#e8dcc8';
    
    // Texto con efecto maquinilla
    var textoMostrar = d.texto.substring(0, d.charIndex);
    wrapText(ctx, textoMostrar, boxX + 20, boxY + 55, boxW - 40, 20);
    
    // Respuestas
    if (d.charIndex >= d.texto.length && d.respuestas) {
        for (var i = 0; i < d.respuestas.length; i++) {
            var ry = boxY + boxH - 20 - (d.respuestas.length - i) * 22;
            var resp = d.respuestas[i];
            
            // Fondo hover
            if (d.hoverIndex === i) {
                ctx.fillStyle = 'rgba(201,168,76,0.15)';
                ctx.beginPath();
                ctx.roundRect(boxX + 30, ry - 14, boxW - 60, 20, 4);
                ctx.fill();
                ctx.fillStyle = '#f5d442';
            } else {
                ctx.fillStyle = '#b8a88a';
            }
            
            ctx.font = '13px Georgia';
            ctx.fillText('► ' + resp.texto, boxX + 35, ry);
        }
    }
    
    // Indicador de continuar
    if (d.charIndex < d.texto.length) {
        var blinkAlpha = 0.5 + Math.sin(juego.tiempo * 6) * 0.5;
        ctx.fillStyle = 'rgba(245,212,66,' + blinkAlpha + ')';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('▼', boxX + boxW - 20, boxY + boxH - 10);
    }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var lineY = y;
    
    for (var i = 0; i < words.length; i++) {
        var testLine = line + words[i] + ' ';
        var metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, x, lineY);
            line = words[i] + ' ';
            lineY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, lineY);
}

// ============================================
// PANTALLA DE INTRO
// ============================================
function dibujarIntro(ctx) {
    var intro = juego.intro;
    
    // Fondo oscuro
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, 1000, 600);
    
    // Partículas de fondo
    ctx.globalAlpha = 0.3;
    for (var i = 0; i < 50; i++) {
        var px = (i * 137.5 + juego.tiempo * 10) % 1000;
        var py = (i * 97.3 + juego.tiempo * 5) % 600;
        var ps = 1 + Math.sin(juego.tiempo + i) * 0.5;
        ctx.fillStyle = '#f5d442';
        ctx.beginPath();
        ctx.arc(px, py, ps, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    // Título
    ctx.globalAlpha = intro.tituloAlpha;
    ctx.font = 'bold 52px Georgia';
    ctx.textAlign = 'center';
    
    // Sombra del título
    ctx.fillStyle = 'rgba(201,168,76,0.3)';
    ctx.fillText('Salón de Fiestas', 502, 252);
    
    // Título principal
    ctx.fillStyle = '#f5d442';
    ctx.fillText('Salón de Fiestas', 500, 250);
    
    // Subtítulo
    ctx.globalAlpha = intro.subtituloAlpha;
    ctx.font = '18px Georgia';
    ctx.fillStyle = '#b8a88a';
    ctx.fillText('Una noche de misterio y elegancia', 500, 290);
    ctx.globalAlpha = 1;
    
    // Instrucción
    var blinkAlpha = 0.4 + Math.sin(juego.tiempo * 3) * 0.4;
    ctx.globalAlpha = blinkAlpha * intro.subtituloAlpha;
    ctx.font = '14px Georgia';
    ctx.fillStyle = '#c9a84c';
    ctx.fillText('Haz clic para comenzar', 500, 400);
    ctx.globalAlpha = 1;
    
    // Decoración inferior
    ctx.strokeStyle = 'rgba(201,168,76,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(350, 320);
    ctx.lineTo(650, 320);
    ctx.stroke();
    
    // Ornamentos
    ctx.fillStyle = '#c9a84c';
    ctx.beginPath(); ctx.arc(350, 320, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(650, 320, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(500, 320, 4, 0, Math.PI * 2); ctx.fill();
}

function actualizarIntro(dt) {
    var intro = juego.intro;
    intro.timer += dt;
    
    if (intro.timer > 0.5 && intro.tituloAlpha < 1) {
        intro.tituloAlpha = Math.min(1, intro.tituloAlpha + dt * 1.5);
    }
    if (intro.timer > 1.5 && intro.subtituloAlpha < 1) {
        intro.subtituloAlpha = Math.min(1, intro.subtituloAlpha + dt * 1.2);
    }
}

// ============================================
// PANEO CINEMATOGRÁFICO
// ============================================
function actualizarPaneo(dt) {
    var p = juego.paneo;
    
    if (!p.iniciado) {
        p.iniciado = true;
        p.fadeIn = 1;
        p.timer = 0;
        p.indicePunto = 0;
        iniciarTransicionPaneo();
    }
    
    // Fade in inicial
    if (p.fadeIn > 0) {
        p.fadeIn = Math.max(0, p.fadeIn - dt * 0.8);
        return;
    }
    
    p.timer += dt;
    p.progreso = Math.min(1, p.timer / 2);
    
    // Suavizar con ease in-out
    var t = p.progreso;
    t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    
    juego.camara.x = p.desdeX + (p.haciaX - p.desdeX) * t;
    juego.camara.y = p.desdeY + (p.haciaY - p.desdeY) * t;
    juego.camara.zoom = p.desdeZoom + (p.haciaZoom - p.desdeZoom) * t;
    
    // Texto descriptivo
    if (p.progreso > 0.3 && p.textoAlpha < 1) {
        p.textoAlpha = Math.min(1, p.textoAlpha + dt * 2);
    }
    
    if (p.progreso >= 1) {
        p.textoTimer += dt;
        
        if (p.textoTimer > 2.5) {
            p.textoAlpha = Math.max(0, p.textoAlpha - dt * 2);
        }
        
        if (p.textoTimer > 3.5) {
            p.indicePunto++;
            if (p.indicePunto < p.puntos.length) {
                iniciarTransicionPaneo();
            } else {
                p.esperandoClick = true;
            }
        }
    }
}

function iniciarTransicionPaneo() {
    var p = juego.paneo;
    var punto = p.puntos[p.indicePunto];
    
    p.desdeX = juego.camara.x || 500;
    p.desdeY = juego.camara.y || 300;
    p.desdeZoom = juego.camara.zoom || 1;
    p.haciaX = punto.x;
    p.haciaY = punto.y;
    p.haciaZoom = punto.zoom;
    p.timer = 0;
    p.progreso = 0;
    p.textoTimer = 0;
    p.textoAlpha = 0;
}

function dibujarPaneo(ctx) {
    var p = juego.paneo;
    var punto = p.puntos[Math.min(p.indicePunto, p.puntos.length - 1)];
    
    // Texto del lugar
    if (p.textoAlpha > 0) {
        ctx.globalAlpha = p.textoAlpha;
        
        // Fondo del texto
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath();
        ctx.roundRect(250, 480, 500, 70, 10);
        ctx.fill();
        ctx.strokeStyle = 'rgba(201,168,76,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Nombre del lugar
        ctx.font = 'bold 18px Georgia';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f5d442';
        ctx.fillText(punto.nombre, 500, 508);
        
        // Descripción
        ctx.font = '13px Georgia';
        ctx.fillStyle = '#d4c5a9';
        ctx.fillText(punto.descripcion, 500, 535);
        
        ctx.globalAlpha = 1;
    }
    
    // Mensaje de continuar
    if (p.esperandoClick) {
        var blink = 0.4 + Math.sin(juego.tiempo * 3) * 0.4;
        ctx.globalAlpha = blink;
        ctx.font = '14px Georgia';
        ctx.fillStyle = '#c9a84c';
        ctx.textAlign = 'center';
        ctx.fillText('Haz clic para explorar el salón', 500, 570);
        ctx.globalAlpha = 1;
    }
    
    // Fade in/out
    if (p.fadeIn > 0) {
        ctx.fillStyle = 'rgba(0,0,0,' + p.fadeIn + ')';
        ctx.fillRect(0, 0, 1000, 600);
    }
}

// ============================================
// MOVIMIENTO Y COLISIONES
// ============================================
function actualizarJugador(dt) {
    var j = juego.jugador;
    var dx = 0, dy = 0;
    
    if (juego.teclas['ArrowLeft'] || juego.teclas['a'] || juego.teclas['A']) { dx = -1; j.direccion = 'izquierda'; }
    if (juego.teclas['ArrowRight'] || juego.teclas['d'] || juego.teclas['D']) { dx = 1; j.direccion = 'derecha'; }
    if (juego.teclas['ArrowUp'] || juego.teclas['w'] || juego.teclas['W']) { dy = -1; j.direccion = 'arriba'; }
    if (juego.teclas['ArrowDown'] || juego.teclas['s'] || juego.teclas['S']) { dy = 1; j.direccion = 'abajo'; }
    
    // Normalizar diagonal
    if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
    }
    
    j.moviendo = (dx !== 0 || dy !== 0);
    
    if (j.moviendo) {
        var nuevoX = j.x + dx * j.velocidad;
        var nuevoY = j.y + dy * j.velocidad;
        
        // Colisiones con bordes
        nuevoX = Math.max(30, Math.min(970, nuevoX));
        nuevoY = Math.max(195, Math.min(570, nuevoY));
        
        // Colisión con objetos sólidos
        var puedeMover = true;
        var objetosSolidos = juego.objetosInteractivos.filter(function(o) {
            return o.tipo === 'mesa' || o.tipo === 'pista';
        });
        
        for (var i = 0; i < objetosSolidos.length; i++) {
            var o = objetosSolidos[i];
            if (nuevoX + 12 > o.x && nuevoX - 12 < o.x + o.ancho &&
                nuevoY + 25 > o.y && nuevoY - 15 < o.y + o.alto) {
                puedeMover = false;
                break;
            }
        }
        
        // Colisión con NPCs
        for (var i = 0; i < juego.npcs.length; i++) {
            var n = juego.npcs[i];
            var ndx = nuevoX - n.x, ndy = nuevoY - n.y;
            if (Math.sqrt(ndx * ndx + ndy * ndy) < 30) {
                puedeMover = false;
                break;
            }
        }
        
        if (puedeMover) {
            j.x = nuevoX;
            j.y = nuevoY;
        }
        
        // Animación
        j.animTimer += dt;
        if (j.animTimer > 0.1) {
            j.animTimer = 0;
            j.animFrame++;
        }
    }
}

// ============================================
// ACTUALIZAR DIÁLOGO
// ============================================
function actualizarDialogo(dt) {
    var d = juego.dialogoActivo;
    if (!d) return;
    
    // Efecto maquinilla
    if (d.charIndex < d.texto.length) {
        d.charTimer += dt;
        if (d.charTimer > 0.03) {
            d.charTimer = 0;
            d.charIndex++;
        }
    }
}

// ============================================
// INTERACTUAR
// ============================================
function interactuar() {
    if (juego.dialogoActivo) {
        // Avanzar diálogo o seleccionar respuesta
        var d = juego.dialogoActivo;
        if (d.charIndex < d.texto.length) {
            d.charIndex = d.texto.length;
            return;
        }
        if (d.respuestas && d.respuestas.length > 0) {
            var resp = d.respuestas[d.hoverIndex || 0];
            if (resp.siguiente === -1) {
                juego.dialogoActivo = null;
                juego.estado = Estado.EXPLORAR;
            } else {
                var npc = juego.npcs.find(function(n) { return n.id === d.npcId; });
                if (npc && npc.dialogos[resp.siguiente]) {
                    iniciarDialogo(npc, resp.siguiente);
                }
            }
        } else {
            juego.dialogoActivo = null;
            juego.estado = Estado.EXPLORAR;
        }
        return;
    }
    
    var obj = getObjetoCercano();
    if (!obj) return;
    
    // Es un NPC
    if (obj.dialogos) {
        iniciarDialogo(obj, 0);
        return;
    }
    
    // Es un objeto interactivo
    switch (obj.tipo) {
        case 'pista':
            mostrarTexto('🎵 La pista de baile invita a moverse...', 2500);
            break;
        case 'bufe':
            mostrarTexto('🍽️ Un bufé con platos exquisitos. ¡Huele genial!', 2500);
            break;
        case 'cuadro':
            mostrarTexto('🖼️ "El Salón Dorado" - Una obra que captura la esencia de este lugar.', 3000);
            break;
    }
}

function iniciarDialogo(npc, index) {
    var dlg = npc.dialogos[index];
    juego.dialogoActivo = {
        npcId: npc.id,
        texto: dlg.texto,
        respuestas: dlg.respuestas || null,
        charIndex: 0,
        charTimer: 0,
        hoverIndex: 0
    };
    juego.estado = Estado.DIALOGO;
}

// ============================================
// TEXTO FLOTANTE
// ============================================
function actualizarTextoFlotante(dt) {
    if (!juego.textoFlotante) return;
    juego.textoFlotante.timer -= dt * 1000;
    if (juego.textoFlotante.timer < 500) {
        juego.textoFlotante.alpha = juego.textoFlotante.timer / 500;
    }
    if (juego.textoFlotante.timer <= 0) {
        juego.textoFlotante = null;
    }
}

function dibujarTextoFlotante(ctx) {
    if (!juego.textoFlotante) return;
    var tf = juego.textoFlotante;
    
    ctx.globalAlpha = tf.alpha;
    ctx.font = '14px Georgia';
    ctx.textAlign = 'center';
    
    // Fondo
    var metrics = ctx.measureText(tf.texto);
    var tw = metrics.width + 30;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath();
    ctx.roundRect(500 - tw/2, 15, tw, 30, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(201,168,76,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.fillStyle = '#f5e6cc';
    ctx.fillText(tf.texto, 500, 35);
    ctx.globalAlpha = 1;
}

// ============================================
// INDICADOR DE INTERACCIÓN
// ============================================
function dibujarIndicador(ctx) {
    if (juego.estado !== Estado.EXPLORAR) return;
    var obj = getObjetoCercano();
    if (!obj) return;
    
    var nombre = obj.nombre || '¿?';
    ctx.font = '12px Georgia';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    var nw = ctx.measureText('[E] ' + nombre).width + 16;
    ctx.beginPath();
    ctx.roundRect(juego.jugador.x - nw/2, juego.jugador.y - 58, nw, 20, 5);
    ctx.fill();
    ctx.fillStyle = '#f5d442';
    ctx.fillText('[E] ' + nombre, juego.jugador.x, juego.jugador.y - 44);
}

// ============================================
// MINIMAPA
// ============================================
function dibujarMinimapa(ctx) {
    var mx = 15, my = 15, mw = 120, mh = 72;
    
    // Fondo
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.roundRect(mx, my, mw, mh, 5);
    ctx.fill();
    ctx.strokeStyle = 'rgba(201,168,76,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Salón
    ctx.fillStyle = 'rgba(74,53,32,0.8)';
    ctx.fillRect(mx + 5, my + 5, mw - 10, mh - 10);
    
    // Pista de baile
    ctx.fillStyle = 'rgba(60,60,60,0.9)';
    ctx.fillRect(mx + 50, my + 30, 20, 10);
    
    // NPCs
    ctx.fillStyle = '#4ecdc4';
    juego.npcs.forEach(function(n) {
        var nx = mx + 5 + (n.x / 1000) * (mw - 10);
        var ny = my + 5 + (n.y / 600) * (mh - 10);
        ctx.beginPath();
        ctx.arc(nx, ny, 2, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Jugador
    ctx.fillStyle = '#f5d442';
    var jx = mx + 5 + (juego.jugador.x / 1000) * (mw - 10);
    var jy = my + 5 + (juego.jugador.y / 600) * (mh - 10);
    ctx.beginPath();
    ctx.arc(jx, jy, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Borde brillante del jugador
    ctx.strokeStyle = 'rgba(245,212,66,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(jx, jy, 5 + Math.sin(juego.tiempo * 3) * 1, 0, Math.PI * 2);
    ctx.stroke();
}

// ============================================
// HUD
// ============================================
function dibujarHUD(ctx) {
    // Inventario
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.roundRect(860, 15, 125, 35, 5);
    ctx.fill();
    ctx.strokeStyle = 'rgba(201,168,76,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.font = '11px Georgia';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#b8a88a';
    ctx.fillText('🎒 Inventario: ' + juego.inventario.length, 870, 37);
    
    // Controles
    if (juego.estado === Estado.EXPLORAR && !juego.flags.mostradoControles) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.roundRect(400, 560, 200, 30, 5);
        ctx.fill();
        ctx.font = '10px Georgia';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#8a7a6a';
        ctx.fillText('WASD/Flechas: Mover | E: Interactuar', 500, 580);
    }
}

// ============================================
// CRÉDITOS
// ============================================
function dibujarCreditos(ctx) {
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, 1000, 600);
    
    ctx.font = 'bold 36px Georgia';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f5d442';
    ctx.fillText('Créditos', 500, 200);
    
    ctx.font = '18px Georgia';
    ctx.fillStyle = '#b8a88a';
    ctx.fillText('Juego creado con Canvas', 500, 270);
    ctx.fillText('Arte y programación: Tú', 500, 300);
    ctx.fillText('¡Gracias por jugar!', 500, 370);
    
    var blink = 0.4 + Math.sin(juego.tiempo * 3) * 0.4;
    ctx.globalAlpha = blink;
    ctx.font = '14px Georgia';
    ctx.fillStyle = '#c9a84c';
    ctx.fillText('Haz clic para volver', 500, 450);
    ctx.globalAlpha = 1;
}

// ============================================
// LOOP PRINCIPAL
// ============================================
var ultimoTiempo = 0;

function gameLoop(timestamp) {
    var dt = Math.min(0.05, (timestamp - ultimoTiempo) / 1000);
    ultimoTiempo = timestamp;
    juego.tiempo += dt;
    
    // Limpiar
    ctx.clearRect(0, 0, 1000, 600);
    
    switch (juego.estado) {
        case Estado.INTRO:
            actualizarIntro(dt);
            dibujarIntro(ctx);
            break;
            
        case Estado.PANEO_CINEMATOGRAFICO:
            actualizarPaneo(dt);
            ctx.save();
            // Aplicar zoom
            var zoom = juego.camara.zoom || 1;
            ctx.translate(500, 300);
            ctx.scale(zoom, zoom);
            ctx.translate(-500 + (500 - juego.camara.x) * (1 - 1/zoom), 
                         -300 + (300 - juego.camara.y) * (1 - 1/zoom));
            dibujarSalon(ctx);
            juego.npcs.forEach(function(n) { dibujarNPC(ctx, n); });
            ctx.restore();
            dibujarPaneo(ctx);
            break;
            
        case Estado.EXPLORAR:
            actualizarJugador(dt);
            actualizarTextoFlotante(dt);
            dibujarSalon(ctx);
            // Dibujar NPCs (ordenado por Y para profundidad)
            var entidades = [];
            entidades.push({ tipo: 'jugador', y: juego.jugador.y });
            juego.npcs.forEach(function(n) { entidades.push({ tipo: 'npc', data: n, y: n.y }); });
            entidades.sort(function(a, b) { return a.y - b.y; });
            entidades.forEach(function(e) {
                if (e.tipo === 'jugador') dibujarJugador(ctx);
                else dibujarNPC(ctx, e.data);
            });
            dibujarIndicador(ctx);
            dibujarTextoFlotante(ctx);
            dibujarMinimapa(ctx);
            dibujarHUD(ctx);
            break;
            
        case Estado.DIALOGO:
            actualizarDialogo(dt);
            dibujarSalon(ctx);
            juego.npcs.forEach(function(n) { dibujarNPC(ctx, n); });
            dibujarJugador(ctx);
            dibujarDialogo(ctx);
            break;
            
        case Estado.CREDITOS:
            dibujarCreditos(ctx);
            break;
    }
    
    requestAnimationFrame(gameLoop);
}

// ============================================
// EVENTOS
// ============================================
document.addEventListener('keydown', function(e) {
    juego.teclas[e.key] = true;
    
    if (e.key === 'e' || e.key === 'E') {
        if (juego.estado === Estado.EXPLORAR) {
            interactuar();
        }
    }
    
    if (e.key === 'Escape') {
        if (juego.estado === Estado.DIALOGO) {
            juego.dialogoActivo = null;
            juego.estado = Estado.EXPLORAR;
        }
    }
    
    // Navegar respuestas con flechas en diálogo
    if (juego.estado === Estado.DIALOGO && juego.dialogoActivo) {
        var d = juego.dialogoActivo;
        if (d.charIndex >= d.texto.length && d.respuestas) {
            if (e.key === 'ArrowUp') {
                d.hoverIndex = Math.max(0, (d.hoverIndex || 0) - 1);
            }
            if (e.key === 'ArrowDown') {
                d.hoverIndex = Math.min(d.respuestas.length - 1, (d.hoverIndex || 0) + 1);
            }
            if (e.key === 'Enter') {
                interactuar();
            }
        } else if (e.key === 'Enter' || e.key === ' ') {
            interactuar();
        }
    }
    
    e.preventDefault();
});

document.addEventListener('keyup', function(e) {
    juego.teclas[e.key] = false;
});

canvas.addEventListener('click', function(e) {
    switch (juego.estado) {
        case Estado.INTRO:
            if (juego.intro.timer > 2) {
                juego.estado = Estado.PANEO_CINEMATOGRAFICO;
            }
            break;
            
        case Estado.PANEO_CINEMATOGRAFICO:
            if (juego.paneo.esperandoClick) {
                juego.estado = Estado.EXPLORAR;
                juego.camara = { x: 500, y: 300, zoom: 1 };
                juego.flags.mostradoControles = false;
                setTimeout(function() { juego.flags.mostradoControles = true; }, 5000);
                mostrarTexto('¡Explorá el salón! Hablá con Ian o María.', 4000);
            }
            break;
            
        case Estado.DIALOGO:
            interactuar();
            break;
            
        case Estado.CREDITOS:
            juego.estado = Estado.INTRO;
            juego.intro = { alpha: 1, tituloAlpha: 0, subtituloAlpha: 0, fadeOut: 0, timer: 0 };
            break;
    }
});

// Hover en respuestas de diálogo
canvas.addEventListener('mousemove', function(e) {
    if (juego.estado !== Estado.DIALOGO || !juego.dialogoActivo) return;
    var d = juego.dialogoActivo;
    if (d.charIndex < d.texto.length || !d.respuestas) return;
    
    var rect = canvas.getBoundingClientRect();
    var my = (e.clientY - rect.top) * (600 / rect.height);
    var boxY = 600 - 140 - 20;
    var boxH = 140;
    
    for (var i = 0; i < d.respuestas.length; i++) {
        var ry = boxY + boxH - 20 - (d.respuestas.length - i) * 22;
        if (my > ry - 16 && my < ry + 6) {
            d.hoverIndex = i;
            return;
        }
    }
});

// ============================================
// INICIAR JUEGO
// ============================================
juego.estado = Estado.INTRO;
requestAnimationFrame(gameLoop);