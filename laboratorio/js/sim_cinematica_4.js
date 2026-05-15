(function() {
    let x0=0, y0=0, v0=0, ang=0, a_val=9.8, t=0, lanzado=false, pausado=false;
    let trayect=[], historial=[], UNIT=25, offX=0, offY=0, modoActual="TO", charts={}, tf_limit=0;

    const sketch = (p) => {
        p.setup = () => {
            document.getElementById('main-content').innerHTML = `
                <div class="lab-container" style="display: grid; grid-template-columns: 280px 1fr 300px; gap: 20px; padding: 20px; height: 90vh;">
                    <div id="controles-dinamicos" class="glass-card"></div>
                    
                    <div class="canvas-area">
                        <div id="canvas-container" style="width:100%; height:550px; background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.1); overflow:hidden; position:relative;"></div>
                        <div id="dashboard-control" style="margin-top:20px; display:grid; grid-template-columns: repeat(4, 1fr); gap:15px;"></div>
                    </div>

                    <div class="charts-column" style="display: flex; flex-direction: column; gap: 10px; overflow-y: auto; padding-right:5px;">
                        <div class="chart-box"><canvas id="chartPos"></canvas></div>
                        <div class="chart-box"><canvas id="chartHeight"></canvas></div>
                        <div class="chart-box"><canvas id="chartVel"></canvas></div>
                        <div class="chart-box"><canvas id="chartAcc"></canvas></div>
                    </div>
                </div>
            `;

            let container = document.getElementById('canvas-container');
            p.createCanvas(container.offsetWidth, 550).parent('canvas-container');
            setupUI();
            setTimeout(() => initCharts(), 150);
        };

        p.draw = () => {
            p.background(255);
            p.push();
            p.translate(p.width/4 + offX, p.height * 0.75 + offY);
            
            dibujarCuadricula(p);

            // Dibujar Historial
            historial.forEach(h => {
                p.noFill(); p.stroke(200, 200, 200, 100); p.strokeWeight(1);
                p.beginShape(); h.forEach(pt => p.vertex(pt.mx * UNIT, -pt.my * UNIT)); p.endShape();
            });

            if(lanzado && !pausado) {
                let vox = v0 * p.cos(p.radians(ang));
                let voy = v0 * p.sin(p.radians(ang));
                let ax = (modoActual === 'MRUV') ? a_val : 0;
                let ay = (modoActual === 'TO' || modoActual === 'CL') ? -a_val : 0;

                let x = x0 + vox * t + 0.5 * ax * p.pow(t, 2);
                let y = y0 + voy * t + 0.5 * ay * p.pow(t, 2);
                let vx = vox + ax * t;
                let vy = voy + ay * t;
                let vTotal = p.sqrt(vx*vx + vy*vy);

                if ((modoActual !== 'MRU' && modoActual !== 'MRUV' && y <= 0 && t > 0.1) || (tf_limit > 0 && t >= tf_limit)) {
                    if(y < 0) y = 0;
                    lanzado = false;
                    historial.push([...trayect]);
                } else {
                    t += 0.05;
                    trayect.push({mx: x, my: y, vx: vx, vy: vy, vt: vTotal});
                    updateCharts(t, x, y, vTotal, (modoActual==='MRU'?0:a_val));
                    actualizarDashboard(x, y, vx, vy, vTotal, t);
                }
            }

            // Dibujo de la trayectoria actual
            p.noFill(); p.stroke(79, 70, 229); p.strokeWeight(3);
            p.beginShape(); trayect.forEach(pt => p.vertex(pt.mx * UNIT, -pt.my * UNIT)); p.endShape();
            
            if(trayect.length > 0) {
                let last = trayect[trayect.length-1];
                p.fill(239, 68, 68); p.stroke(255); p.strokeWeight(2);
                p.ellipse(last.mx * UNIT, -last.my * UNIT, 16, 16);

                // Etiquetas de seguimiento sobre la partícula
                p.fill(0); p.noStroke(); p.textSize(12); p.textStyle(p.BOLD);
                p.text(`x: ${last.mx.toFixed(1)}m`, last.mx * UNIT + 15, -last.my * UNIT - 15);
                p.text(`y: ${last.my.toFixed(1)}m`, last.mx * UNIT + 15, -last.my * UNIT);
                p.fill(16, 185, 129);
                p.text(`v: ${last.vt.toFixed(1)}m/s`, last.mx * UNIT + 15, -last.my * UNIT + 15);
            }
            p.pop();
            dibujarNombresEjes(p);
        };

        function dibujarCuadricula(p) {
            p.stroke(240); p.strokeWeight(1);
            for (let i = -100; i < 500; i += 2) {
                p.line(i * UNIT, -2000, i * UNIT, 2000);
                p.line(-2000, -i * UNIT, 5000, -i * UNIT);
            }
            p.stroke(180); p.strokeWeight(2);
            p.line(-2000, 0, 5000, 0); // Eje X
            p.line(0, -2000, 0, 2000); // Eje Y
        }

        function dibujarNombresEjes(p) {
            p.fill(100); p.noStroke(); p.textSize(14); p.textStyle(p.BOLD);
            p.text("X (m)", p.width - 80, p.height * 0.75 + offY + 20);
            p.text("Y (m)", p.width/4 + offX - 60, 30);
        }

        function setupUI() {
            const style = document.createElement('style');
            style.innerHTML = `
                .chart-box { background: white; padding: 10px; border-radius: 8px; height: 150px; border: 1px solid #e2e8f0; }
                .btn-mod { padding: 8px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; background: white; font-weight: 600; }
                .btn-mod.active { background: #4f46e5 !important; color: white; transform: translateY(3px); box-shadow: inset 0 3px 5px rgba(0,0,0,0.2); }
                .btn-iniciar { background: #10b981; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 800; cursor: pointer; }
                .btn-iniciar:active { transform: translateY(3px); filter: brightness(0.9); }
                .btn-detener { background: #ef4444; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 800; cursor: pointer; }
                .btn-detener:active { transform: translateY(3px); }
                .dash-card { background: white; padding: 12px; border-radius: 10px; border-left: 4px solid #4f46e5; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                .dash-card small { color: #64748b; display: block; font-size: 0.7rem; text-transform: uppercase; }
                .dash-card span { font-size: 1.1rem; font-weight: 800; color: #1e293b; }
            `;
            document.head.appendChild(style);

            document.getElementById('controles-dinamicos').innerHTML = `
                <div style="padding: 15px">
                    <button onclick="window.resetSim()" style="width:100%; padding:10px; margin-bottom:15px; border-radius:8px; border:1px solid #ddd; cursor:pointer;">REINICIAR ⟲</button>
                    
                    <h4 style="margin-bottom:10px">Modelos</h4>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px">
                        <button id="b-MRU" class="btn-mod" onclick="window.setM('MRU')">MRU</button>
                        <button id="b-MRUV" class="btn-mod" onclick="window.setM('MRUV')">MRUV</button>
                        <button id="b-CL" class="btn-mod" onclick="window.setM('CL')">Caída</button>
                        <button id="b-TO" class="btn-mod" onclick="window.setM('TO')">Tiro</button>
                    </div>

                    <h4 style="margin:15px 0 10px 0">Gravedad / Acel.</h4>
                    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:5px">
                        <button class="btn-mod" style="font-size:0.7rem" onclick="window.setG(9.8)">Tierra</button>
                        <button class="btn-mod" style="font-size:0.7rem" onclick="window.setG(1.6)">Luna</button>
                        <button class="btn-mod" style="font-size:0.7rem" onclick="window.setG(24.8)">Júpiter</button>
                    </div>

                    <div class="grid-inputs" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:15px;">
                        <label>x₀ (m)<input type="number" id="ix0" value="0" style="width:100%"></label>
                        <label>y₀ (m)<input type="number" id="iy0" value="0" style="width:100%"></label>
                        <label>v₀ (m/s)<input type="number" id="iv0" value="30" style="width:100%"></label>
                        <label>θ (deg)<input type="number" id="iang" value="45" style="width:100%"></label>
                        <label>a/g (m/s²)<input type="number" id="ia" value="9.8" style="width:100%"></label>
                        <label>t-fin (s)<input type="number" id="itf" value="0" style="width:100%"></label>
                    </div>

                    <div style="display:grid; grid-template-columns: 2fr 1fr; gap:10px; margin-top:20px;">
                        <button onclick="window.lanzar()" class="btn-iniciar">INICIAR</button>
                        <button id="btn-pause" onclick="window.togglePause()" class="btn-detener">PAUSA</button>
                    </div>

                    <div id="eq-box" style="margin-top:15px; font-size:1.1rem; text-align:center; color:#4f46e5; font-weight:bold; background:#f0f4ff; padding:10px; border-radius:6px; min-height:40px"></div>
                </div>
            `;
            window.setM('TO');
        }

        window.setG = (val) => { document.getElementById('ia').value = val; };

        window.togglePause = () => {
            pausado = !pausado;
            document.getElementById('btn-pause').innerHTML = pausado ? "SEGUIR" : "PAUSA";
            document.getElementById('btn-pause').style.background = pausado ? "#f59e0b" : "#ef4444";
        };

        window.setM = (m) => {
            modoActual = m;
            document.querySelectorAll('.btn-mod').forEach(b => b.classList.remove('active'));
            let btn = document.getElementById('b-' + m);
            if(btn) btn.classList.add('active');
            
            const eq = document.getElementById('eq-box');
            if(m==='MRU') { iv0.value=15; ia.value=0; iang.value=0; eq.innerHTML="x = x₀ + v·t"; }
            if(m==='MRUV') { iv0.value=0; ia.value=2; iang.value=0; eq.innerHTML="x = x₀ + ½at²"; }
            if(m==='CL') { iv0.value=0; ia.value=9.8; iang.value=-90; iy0.value=50; eq.innerHTML="y = y₀ - ½gt²"; }
            if(m==='TO') { iv0.value=35; ia.value=9.8; iang.value=45; eq.innerHTML="y = y₀ + v₀y·t - ½gt²"; }
        };

        window.lanzar = () => { 
            x0=parseFloat(ix0.value); y0=parseFloat(iy0.value);
            v0=parseFloat(iv0.value); ang=parseFloat(iang.value); 
            a_val=parseFloat(ia.value); tf_limit = parseFloat(itf.value);
            t=0; trayect=[]; lanzado=true; pausado=false;
        };

        window.resetSim = () => { t=0; trayect=[]; lanzado=false; pausado=false; historial=[]; offX=0; offY=0; };

        function initCharts() {
            const cfg = (title, color, unit) => ({
                type: 'line', 
                data: { labels: [], datasets: [{ label: title, data: [], borderColor: color, borderWidth: 2, pointRadius: 0, fill: false }] },
                options: { 
                    responsive: true, maintainAspectRatio: false, animation: false,
                    plugins: { legend: { labels: { boxWidth: 10, font: { size: 10 } } } },
                    scales: { 
                        x: { title: { display: true, text: 't (s)', font: { size: 10 } } },
                        y: { title: { display: true, text: unit, font: { size: 10 } } }
                    }
                }
            });
            
            charts.p = new Chart(document.getElementById('chartPos').getContext('2d'), cfg('Posición x(t)', '#4f46e5', 'm'));
            charts.h = new Chart(document.getElementById('chartHeight').getContext('2d'), cfg('Altura y(t)', '#ec4899', 'm'));
            charts.v = new Chart(document.getElementById('chartVel').getContext('2d'), cfg('Velocidad v(t)', '#10b981', 'm/s'));
            charts.a = new Chart(document.getElementById('chartAcc').getContext('2d'), cfg('Aceleración a(t)', '#f59e0b', 'm/s²'));
        }

        function updateCharts(t, x, y, v, a) {
            const datasets = [
                {c: charts.p, val: x}, {c: charts.h, val: y}, 
                {c: charts.v, val: v}, {c: charts.a, val: a}
            ];
            datasets.forEach(item => {
                if(item.c) {
                    item.c.data.labels.push(t.toFixed(1));
                    item.c.data.datasets[0].data.push(item.val);
                    if(item.c.data.labels.length > 40) { item.c.data.labels.shift(); item.c.data.datasets[0].data.shift(); }
                    item.c.update('none');
                }
            });
        }

        function actualizarDashboard(x, y, vx, vy, vt, t) {
            const dash = document.getElementById('dashboard-control');
            if(dash) {
                dash.innerHTML = `
                    <div class="dash-card"><small>Tiempo</small><span>${t.toFixed(2)} s</span></div>
                    <div class="dash-card" style="border-left-color: #4f46e5"><small>Posición (x, y)</small><span>${x.toFixed(1)}, ${y.toFixed(1)} m</span></div>
                    <div class="dash-card" style="border-left-color: #10b981"><small>Velocidad Total</small><span>${vt.toFixed(1)} m/s</span></div>
                    <div class="dash-card" style="border-left-color: #f59e0b"><small>Componentes V</small><span>${vx.toFixed(1)}x, ${vy.toFixed(1)}y</span></div>
                `;
            }
        }

        p.mouseDragged = () => { if(p.mouseX > 0 && p.mouseX < p.width) { offX += p.mouseX - p.pmouseX; offY += p.mouseY - p.pmouseY; } };
        p.mouseWheel = (e) => { if(p.mouseX > 0 && p.mouseX < p.width) { UNIT = p.constrain(UNIT - e.delta*0.05, 5, 150); return false; } };
    };
    new p5(sketch);
})();