// --- VARIABLES GLOBALES ---
var listaVectores = [];
var historialOperaciones = [];
var UNIT = 30;
var offsetX = 0;
var offsetY = 0;

// FUNCIÓN PARA VOLVER AL ORIGEN
window.resetCamara = () => {
    offsetX = 0;
    offsetY = 0;
    UNIT = 30;
};

const sketch = (p) => {
    p.setup = () => {
        let container = document.getElementById('canvas-holder');
        let w = container.offsetWidth - 2;
        let cnv = p.createCanvas(w, 340);
        cnv.parent('canvas-holder');
    };

    p.mouseWheel = (event) => {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            UNIT -= event.delta * 0.1;
            UNIT = p.constrain(UNIT, 10, 150);
            return false;
        }
    };

    p.mouseDragged = () => {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            offsetX += p.mouseX - p.pmouseX;
            offsetY += p.mouseY - p.pmouseY;
            return false;
        }
    };

    p.draw = () => {
        p.background(255);
        p.translate(p.width/2 + offsetX, p.height/2 + offsetY);

        // Grilla
        p.stroke(245); p.strokeWeight(1);
        let limit = 5000; // Grilla extendida para no ver el borde al mover
        for(let i = -limit; i < limit; i += UNIT) {
            p.line(i, -limit, i, limit);
            p.line(-limit, i, limit, i);
        }

        // Ejes
        p.stroke(180); p.strokeWeight(1.5);
        p.line(-limit, 0, limit, 0);
        p.line(0, -limit, 0, limit);
        p.fill(150); // Color gris para las letras
        p.noStroke();
        p.textSize(14);
        p.text("X", p.width/2 - 20 - offsetX, -10); // Sigue el movimiento del eje
        p.text("Y", 10, -p.height/2 + 20 - offsetY);

        // Vectores
        listaVectores.forEach((v, i) => {
            let col = v.color || (i === 0 ? '#1e293b' : '#3b82f6');
            p.stroke(col); p.strokeWeight(2.2);
            let vx = v.x * UNIT;
            let vy = -v.y * UNIT;
            p.line(0, 0, vx, vy);
            
            p.push();
            p.translate(vx, vy);
            p.rotate(p.atan2(vy, vx));
            let sz = 8;
            p.line(0,0, -sz, -sz/2); p.line(0,0, -sz, sz/2);
            p.pop();
            
            p.fill(col); p.noStroke(); p.textSize(12);
            p.text(v.nombre, vx+5, vy-5);
        });
    };
};

new p5(sketch);

// --- MANEJO DE INTERFAZ (EVENTOS) ---
document.addEventListener('change', (e) => {
    if (e.target.name === "coord-type") {
        document.getElementById('cart-inputs').style.display = e.target.value === 'cart' ? 'block' : 'none';
        document.getElementById('polar-inputs').style.display = e.target.value === 'polar' ? 'block' : 'none';
    }
});

// --- OPERACIONES ---
window.agregarVector = function() {
    const selector = document.querySelector('input[name="coord-type"]:checked');
    if(!selector) return;
    
    const modo = selector.value;
    const nombre = document.getElementById('vec-name').value || "V" + (listaVectores.length + 1);
    let x, y;

    if (modo === 'cart') {
        x = parseFloat(document.getElementById('cart-x').value);
        y = parseFloat(document.getElementById('cart-y').value);
    } else {
        const m = parseFloat(document.getElementById('pol-mag').value);
        const a = parseFloat(document.getElementById('pol-ang').value) * (Math.PI/180);
        x = m * Math.cos(a); y = m * Math.sin(a);
    }

    if (!isNaN(x) && !isNaN(y)) {
        listaVectores.push({ nombre, x, y });
        actualizarUI();
    } else {
        alert("Ingresa valores válidos");
    }
};

window.operar = function(tipo) {
    if (listaVectores.length < 2) return;
    let v1 = listaVectores[0];
    let v2 = listaVectores[1];

    if (tipo === 'sumar') {
        listaVectores.push({ nombre: 'Suma', x: v1.x + v2.x, y: v1.y + v2.y, color: '#10b981' });
    } else if (tipo === 'restar') {
        listaVectores.push({ nombre: 'Resta', x: v1.x - v2.x, y: v1.y - v2.y, color: '#f59e0b' });
    } else if (tipo === 'punto') {
        let pto = (v1.x * v2.x + v1.y * v2.y).toFixed(2);
        historialOperaciones.push(`V1 · V2 = ${pto}`);
    } else if (tipo === 'cruz') {
        let cruz = (v1.x * v2.y - v1.y * v2.x).toFixed(2);
        historialOperaciones.push(`V1 x V2 = ${cruz} k̂`);
    }
    actualizarUI();
};

window.limpiarSim = () => { 
    listaVectores = []; 
    historialOperaciones = [];
    actualizarUI(); 
};

function actualizarUI() {
    const res = document.getElementById('resultados-sim');
    if(!res) return;
    
    let html = historialOperaciones.map(op => 
        `<div style="background:#e0e7ff; color:#1e40af; padding:5px; border-radius:4px; margin-bottom:5px; font-weight:bold; font-size:0.85rem">${op}</div>`
    ).join('');
    
    html += listaVectores.map(v => `<div style="padding:4px 0; border-bottom:1px solid #eee; font-size:0.85rem"><b>${v.nombre}:</b> ${v.x.toFixed(1)}î + ${v.y.toFixed(1)}ĵ</div>`).join('');
    res.innerHTML = html;
}