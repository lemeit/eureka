(function() {
    let x0=0, y0=0, v0=0, ang=0, a_val=9.8, t=0, lanzado=false;
    let trayect=[], historial=[], UNIT=25, offX=0, offY=0, modoActual="TO", charts={};

    const sketch = (p) => {
        p.setup = () => {
            let container = document.getElementById('canvas-container');
            p.createCanvas(container.offsetWidth, 500).parent('canvas-container');
            setupUI();
            initCharts();
        };

        p.draw = () => {
            p.background(255);
            p.push();
            p.translate(p.width/4 + offX, p.height * 0.75 + offY);
            dibujarEscena(p);

            // Dibujar Historial (Tiros anteriores)
            historial.forEach(h => {
                p.noFill(); p.stroke(200, 200, 200, 150); p.strokeWeight(1);
                p.beginShape(); h.forEach(pt => p.vertex(pt.mx * UNIT, -pt.my * UNIT)); p.endShape();
            });

            if(lanzado) {
                let vox = v0 * p.cos(p.radians(ang));
                let voy = v0 * p.sin(p.radians(ang));
                let ax = (modoActual === 'MRUV') ? a_val : 0;
                let ay = (modoActual === 'TO' || modoActual === 'CL') ? -a_val : 0;

                let x = x0 + vox * t + 0.5 * ax * p.pow(t, 2);
                let y = y0 + voy * t + 0.5 * ay * p.pow(t, 2);
                let vx = vox + ax*t;
                let vy = voy + ay*t;

            // LÓGICA DE PARADA (Suelo, Tiempo o Perpetuo)
            let impactaSuelo = (y <= 0 && t > 0.1);
            let tiempoCumplido = (tf_limit > 0 && t >= tf_limit);

            if (modoActual !== 'MRU' && impactaSuelo) {
                y = 0; // Forzar posición en el suelo
                lanzado = false;
                historial.push([...trayect]);
            } else if (tiempoCumplido) {
                lanzado = false;
                historial.push([...trayect]);
            } else {
                t += 0.05;
                trayect.push({mx: x, my: y});
                // ... actualización de gráficos y HUD
            }

            // Dibujo de trayectoria y partícula
            p.noFill(); p.stroke(79, 70, 229); p.strokeWeight(2.5);
            p.beginShape(); trayect.forEach(pt => p.vertex(pt.mx * UNIT, -pt.my * UNIT)); p.endShape();
            
            if(trayect.length > 0) {
                let last = trayect[trayect.length-1];
                p.fill(239, 68, 68); p.noStroke();
                p.ellipse(last.mx * UNIT, -last.my * UNIT, 14, 14);

                // Valores dinámicos sobre el punto
                p.fill(0); p.textSize(12);
                p.text(`(${last.mx.toFixed(1)}, ${last.my.toFixed(1)}) m`, last.mx * UNIT + 10, -last.my * UNIT - 10);
            }
                
                // ETIQUETAS EN TIEMPO REAL (Lo que pediste)
                p.fill(0); p.noStroke(); p.textSize(12);
                p.text(`y: ${last.my.toFixed(1)}m`, last.mx * UNIT + 12, -last.my * UNIT);
                p.text(`v: ${p.sqrt(p.pow(vx_actual,2)+p.pow(vy_actual,2)).toFixed(1)}m/s`, last.mx * UNIT + 12, -last.my * UNIT + 14);
            }
            p.pop();
            dibujarNombresEjes(p);
        };

        function dibujarEscena(p) {
            p.stroke(245); p.strokeWeight(1);
            for(let i=-20; i<100; i++) {
                p.line(i*UNIT, -5000, i*UNIT, 5000);
                p.line(-5000, i*UNIT, 5000, i*UNIT);
            }
            p.stroke(220); p.line(-5000, 0, 5000, 0); p.line(0, -5000, 0, 5000);
        }

        function dibujarNombresEjes(p) {
            p.fill(180); p.noStroke(); p.textSize(14);
            p.text("X", p.width - 30, p.constrain(p.height * 0.75 + offY - 10, 20, p.height-10));
            p.text("Y", p.constrain(p.width/4 + offX + 10, 10, p.width-40), 25);
        }

        function setupUI() {
            document.getElementById('controles-dinamicos').innerHTML = `
                <div class="sidebar-panel">
                    <div style="display:flex; gap:5px">
                        <button onclick="window.resetSim()" style="flex:2" class="btn-reset">CERO ⟲</button>
                        <button onclick="window.clearHistory()" style="flex:1" class="btn-mini">Limpiar</button>
                    </div>
                    <h4>Modelos</h4>
                    <div class="ops-grid">
                        <button onclick="window.setM('MRU')">MRU</button>
                        <button onclick="window.setM('MRUV')">MRUV</button>
                        <button onclick="window.setM('CL')">Caída</button>
                        <button onclick="window.setM('TO')">Tiro</button>
                    </div>
                    <h4 style="margin-top:10px">Constantes</h4>
                    <div class="ops-grid" style="grid-template-columns: repeat(3, 1fr);">
                        <button class="btn-mini" onclick="window.setG(9.8)">Tierra</button>
                        <button class="btn-mini" onclick="window.setG(1.6)">Luna</button>
                        <button class="btn-mini" onclick="window.setG(24.8)">Júpiter</button>
                    </div>
                    <div class="grid-inputs" style="margin-top:10px">
                        <label>x₀<input type="number" id="ix0" value="0"></label>
                        <label>y₀<input type="number" id="iy0" value="0"></label>
                        <label>v₀<input type="number" id="iv0" value="30"></label>
                        <label>θ°<input type="number" id="iang" value="45"></label>
                        <label>a/g<input type="number" id="ia" value="9.8"></label>
                        <label>tբ (s)<input type="number" id="itf" value="0"></label> </div>
                    <button onclick="window.lanzar()" class="btn-step-action" style="width:100%; margin-top:10px; background:#10b981">LANZAR</button>
                    <div id="eq-display" style="margin-top:15px; background:#f8fafc; padding:10px; border-radius:8px; border:1px solid #e2e8f0; font-size:1rem"></div>
                </div>`;
            window.setM('TO');
        }

        window.setG = (g) => { document.getElementById('ia').value = g; };
        window.clearHistory = () => { historial = []; };
        window.setM = (m) => {
            modoActual = m;
            const eq = document.getElementById('eq-display');
            if(m==='MRU') { iv0.value=15; ia.value=0; iang.value=0; eq.innerHTML="<b>MRU:</b> x = x<sub>i</sub> + v·t"; }
            if(m==='MRUV') { iv0.value=0; ia.value=2; iang.value=0; eq.innerHTML="<b>MRUV:</b> x = x<sub>i</sub> + ½at²"; }
            if(m==='CL') { iv0.value=0; ia.value=9.8; iang.value=-90; iy0.value=50; eq.innerHTML="<b>Caída:</b> y = y<sub>i</sub> - ½gt²"; }
            if(m==='TO') { iv0.value=35; ia.value=9.8; iang.value=45; eq.innerHTML="<b>Tiro:</b> y = y<sub>i</sub> + v<sub>y</sub>t - ½gt²"; }
        };

        window.lanzar = () => { 
            x0=parseFloat(ix0.value); y0=parseFloat(iy0.value);
            v0=parseFloat(iv0.value); ang=parseFloat(iang.value); 
            a_val=parseFloat(ia.value); 
            tf_limit = parseFloat(itf.value); // Capturar límite de tiempo
            t=0; trayect=[]; lanzado=true; 
        };
        window.resetSim = () => { t=0; trayect=[]; lanzado=false; offX=0; offY=0; historial=[]; };


        function initCharts() {
            const cfg = (title, color, unit) => ({
            type: 'line', 
            data: { labels: [], datasets: [{ label: title, data: [], borderColor: color, borderWidth: 2, pointRadius: 0 }] },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { 
                    legend: { display: true, labels: { boxWidth: 10, font: { size: 10 } } } 
                }, 
                scales: { 
                    x: { display: true, title: { display: true, text: 't (s)', font: { size: 10 } } },
                    y: { display: true, title: { display: true, text: unit, font: { size: 10 } } }
                } 
                }
            });
            charts.p = new Chart(document.getElementById('chartPos'), cfg('Posición x(t)', '#4f46e5', 'm'));
            charts.v = new Chart(document.getElementById('chartVel'), cfg('Velocidad v(t)', '#10b981', 'm/s'));
            charts.a = new Chart(document.getElementById('chartAcc'), cfg('Aceleración a(t)', '#f59e0b', 'm/s²'));
        }

        function updateCharts(t, x, v, a) {
            [charts.p, charts.v, charts.a].forEach((c, i) => {
                c.data.labels.push(t.toFixed(1));
                c.data.datasets[0].data.push(i==0?x:i==1?v:a);
                if(c.data.labels.length > 30) { c.data.labels.shift(); c.data.datasets[0].data.shift(); }
                c.update('none');
            });
        }

        function actualizarHUD(x, y, vx, vy, t) {
            document.getElementById('resultados-sim').innerHTML = `
                <div class="res-card-pro">
                    <p><b>t:</b> ${t.toFixed(2)}s | <b>Pos:</b> ${x.toFixed(1)}î + ${y.toFixed(1)}ĵ</p>
                    <p><b>Vel:</b> ${vx.toFixed(1)}î + ${vy.toFixed(1)}ĵ m/s</p>
                </div>`;
        }

        p.mouseDragged = () => { if(p.mouseX > 0 && p.mouseX < p.width) { offX += p.mouseX - p.pmouseX; offY += p.mouseY - p.pmouseY; } };
        p.mouseWheel = (e) => { if(p.mouseX > 0 && p.mouseX < p.width) { UNIT = p.constrain(UNIT - e.delta*0.05, 5, 150); return false; } };
    };
    new p5(sketch);
})();