(function() {
    let x0=0, y0=0, v0=0, ang=0, g_val=9.8, t=0, t_inicio=0, lanzado=false, pausado=false;
    let dt_valor = 0.05;
    let trayect=[], historial=[], UNIT=25, offX=0, offY=0, modoActual="TO", charts={}, tf_limit=0;
    window.seguirParticula = false;

    window.setVel = (val, modo) => {
        dt_valor = val;
        document.querySelectorAll('.btn-v').forEach(b => {
            b.style.background = "white";
            b.style.color = "#4f46e5";
            b.style.border = "1px solid #4f46e5";
        });
        const activo = document.getElementById('v-' + modo);
        activo.style.background = "#4f46e5";
        activo.style.color = "white";
    };
    
    window.setM = (m) => {
        modoActual = m;
        document.querySelectorAll('.btn-mod').forEach(b => b.classList.remove('active'));
        if(document.getElementById('b-' + m)) document.getElementById('b-' + m).classList.add('active');
        const eq = document.getElementById('eq-box');
        const ix0 = document.getElementById('ix0'), iy0 = document.getElementById('iy0');
        const iv0 = document.getElementById('iv0'), iang = document.getElementById('iang');
        
        if(m==='MRU') { ix0.value=0; iy0.value=0; iv0.value=15; iang.value=0; eq.innerHTML="x = x₀ + v·t"; }
        if(m==='MRUV') { ix0.value=0; iy0.value=0; iv0.value=0; iang.value=0; eq.innerHTML="x = x₀ + ½at²"; }
        if(m==='CL') { ix0.value=0; iy0.value=50; iv0.value=0; iang.value=-90; eq.innerHTML="y = y₀ - ½gt²"; }
        if(m==='TO') { ix0.value=0; iy0.value=0; iv0.value=35; iang.value=45; eq.innerHTML="y = y₀ + v₀y·t - ½gt²"; }
    };

    window.setG = (val) => {
        document.getElementById('ia').value = val;
        document.querySelectorAll('.btn-g').forEach(b => b.classList.remove('active'));
        const btn = document.getElementById('g-' + val);
        if(btn) btn.classList.add('active');
        g_val = val;
    };

    window.togglePausa = () => {
        pausado = !pausado;
        const btn = document.getElementById('btn-pause');
        btn.innerHTML = pausado ? "CONTINUAR" : "PAUSAR";
        btn.style.background = pausado ? "#f59e0b" : "#ef4444";
    };

    window.lanzar = () => { 
            // Si ya había una trayectoria, la guardamos como historial antes de borrarla
        if (trayect.length > 0) {
            historial.push([...trayect]); // Guardamos la anterior
            if (historial.length > 3) historial.shift(); // Solo dejamos las últimas 3 para no saturar
        }
            x0 = parseFloat(document.getElementById('ix0').value) || 0; 
            y0 = parseFloat(document.getElementById('iy0').value) || 0; 
            v0 = parseFloat(document.getElementById('iv0').value) || 0;
            ang = parseFloat(document.getElementById('iang').value) || 0; 
            g_val = parseFloat(document.getElementById('ia').value) || 9.8; 
            tf_limit = parseFloat(document.getElementById('itf').value) || 0; 
            
            t = 0; 
            t_inicio = 0; 
            trayect = []; 
            lanzado = true; 
            pausado = false;
    
            // Limpiar los máximos para que no queden datos del tiro anterior
            window.maxH = 0;
            window.maxD = 0;
    
            document.getElementById('btn-pause').innerHTML = "PAUSAR";
            document.getElementById('data-body').innerHTML = ""; 
    
            // Limpiar gráficos y asegurar que no tengan límites de puntos
            Object.values(charts).forEach(chart => {
                chart.data.labels = [];
                chart.data.datasets[0].data = [];
                chart.update();
            });
    
            // Llamar al cálculo teórico (asegúrate de haber pegado la función calcularTeorico)
            if(window.calcularTeorico) window.calcularTeorico(v0, ang, g_val);
        };

    window.exportarCSV = () => {
        if (trayect.length === 0) return;
        let csv = "Tiempo(s),Pos_X(m),Pos_Y(m),Vel_Total(m/s)\n";
        trayect.forEach(row => csv += `${row.t.toFixed(2)},${row.mx.toFixed(2)},${row.my.toFixed(2)},${row.vt.toFixed(2)}\n`);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'datos_cinematica.csv'; a.click();
    };

    window.resetSim = () => { t=0; trayect=[]; lanzado=false; historial=[]; offX=0; offY=0; window.centrarVista(); };

    const sketch = (p) => {
        p.setup = () => {
            const main = document.getElementById('main-content');
            main.innerHTML = `
                <div style="display: grid; grid-template-columns: 280px 1fr 340px; gap: 15px; padding: 15px; height: 95vh; font-family: sans-serif; background: #f8fafc;">
                    <div id="side-ctrl" style="background:white; padding:15px; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #e2e8f0; overflow-y:auto;"></div>
                    <div id="viz-area">
                            <div id="energy-container" style="display:flex; gap:10px; margin-bottom:10px; background:#1e293b; padding:10px; border-radius:8px;">
                                <div style="flex:1;">
                                    <div style="color:white; font-size:10px; margin-bottom:4px;">ENERGÍA CINÉTICA (Ec)</div>
                                    <div style="background:#334155; height:12px; border-radius:6px; overflow:hidden;">
                                        <div id="bar-ec" style="width:0%; height:100%; background:#10b981; transition:width 0.1s;"></div>
                                    </div>
                                </div>
                                <div style="flex:1;">
                                    <div style="color:white; font-size:10px; margin-bottom:4px;">ENERGÍA POTENCIAL (Ep)</div>
                                    <div style="background:#334155; height:12px; border-radius:6px; overflow:hidden;">
                                        <div id="bar-ep" style="width:0%; height:100%; background:#3b82f6; transition:width 0.1s;"></div>
                                    </div>
                                </div>
                            </div>
                            <div id="canvas-cont" style="width:100%; height:500px; background:white; border-radius:12px; position:relative; overflow:hidden; border:1px solid #e2e8f0;">
                            <div style="position:absolute; top:15px; right:15px; z-index:10; display:flex; gap:8px;">
                                <label style="background:white; padding:8px 12px; border-radius:6px; border:1px solid #ddd; font-size:12px; cursor:pointer; font-weight:bold; display:flex; align-items:center; gap:5px;">
                                    <input type="checkbox" id="checkSeguir" onchange="window.seguirParticula=this.checked"> 🎥 Seguir
                                </label>
                                <button onclick="window.centrarVista()" style="padding:8px 12px; cursor:pointer; background:white; border:1px solid #ddd; border-radius:6px; font-weight:bold;">🎯 Origen</button>
                            </div>
                        </div>
                        <div id="dashboard-control" style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-top:15px;"></div>
                        <div style="margin-top:15px; background:white; padding:15px; border-radius:12px; border:1px solid #e2e8f0;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                <h5 style="margin:0;">Registro de Datos (Live)</h5>
                                <button onclick="window.exportarCSV()" style="background:#10b981; color:white; border:none; padding:5px 12px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:bold;">Descargar CSV ↓</button>
                            </div>
                            <table style="width:100%; font-size:11px; text-align:left;"><tbody id="data-body"></tbody></table>
                        </div>
                    </div>
                    <div id="charts-col" style="display:flex; flex-direction:column; gap:10px; overflow-y:auto;">
                        <div class="c-box"><canvas id="chartPos"></canvas></div>
                        <div class="c-box"><canvas id="chartHeight"></canvas></div>
                        <div class="c-box"><canvas id="chartVel"></canvas></div>
                        <div class="c-box"><canvas id="chartAcc"></canvas></div>
                    </div>
                </div>
            `;
            let c = document.getElementById('canvas-cont');
            p.createCanvas(c.offsetWidth, 500).parent('canvas-cont');
            setupUI();
            setTimeout(() => { initCharts(); window.setM('TO'); window.setG(9.8); }, 300);
        };

        p.draw = () => {
            p.background(255);
            let camX = p.width/4 + offX;
            let camY = p.height*0.75 + offY;

            if(window.seguirParticula && trayect.length > 0){
                let l = trayect[trayect.length-1];
                camX = p.width/2 - l.mx*UNIT; camY = p.height/2 + l.my*UNIT;
            }

            p.push();
            p.translate(camX, camY);
            dibujarEjesMejorados(p, camX, camY);
            
            // Dibujar historial
            historial.forEach((h, index) => {
                p.noFill();
                p.stroke(200, 200, 200, 100); // Gris semitransparente
                p.strokeWeight(1);
                p.beginShape();
                h.forEach(pt => p.vertex(pt.mx * UNIT, -pt.my * UNIT));
                p.endShape();
            });

            if(lanzado && !pausado) {
                let vox = v0 * p.cos(p.radians(ang));
                let voy = v0 * p.sin(p.radians(ang));
                let ax = (modoActual === 'MRUV') ? g_val : 0;
                let ay = (modoActual === 'TO' || modoActual === 'CL') ? -g_val : 0;

                // Primer frame
                if (trayect.length === 0) {
                    let inicio = {t: 0, mx: x0, my: y0, vx: vox, vy: voy, vt: v0};
                    trayect.push(inicio);
                    actualizarDash(0, x0, y0, vox, voy, v0);
                    return; 
                }

                let dt_sig = (t + dt_valor) - t_inicio;
                let y_sig = y0 + voy * dt_sig + 0.5 * ay * p.pow(dt_sig, 2);

                // Detección de suelo
                if ((y_sig <= 0 && (modoActual==='TO'||modoActual==='CL')) || (tf_limit > 0 && t >= tf_limit)) {
                    let a_c = 0.5 * ay; let b_c = voy; let c_c = y0;
                    let dt_f = (p.abs(a_c) > 0.0001) ? (-b_c - p.sqrt(p.sq(b_c) - 4*a_c*c_c)) / (2*a_c) : -c_c/b_c;
                    if(isNaN(dt_f) || dt_f < 0) dt_f = (t-t_inicio);

                    let x_f = x0 + vox * dt_f + 0.5 * ax * p.pow(dt_f, 2);
                    let vx_f = vox + ax * dt_f;
                    let vy_f = voy + ay * dt_f;
                    let vt_f = p.sqrt(vx_f*vx_f + vy_f*vy_f);

                    let final = {t: t_inicio + dt_f, mx: x_f, my: 0, vx: vx_f, vy: vy_f, vt: vt_f};
                    trayect.push(final);
                    historial.push([...trayect]);
                    lanzado = false;
                    actualizarDash(final.t, x_f, 0, vx_f, vy_f, vt_f);
                } else {
                    t += dt_valor;
                    let dt_now = t - t_inicio;
                    let x_now = x0 + vox * dt_now + 0.5 * ax * p.pow(dt_now, 2);
                    let y_now = y0 + voy * dt_now + 0.5 * ay * p.pow(dt_now, 2);
                    let vx = vox + ax * dt_now;
                    let vy = voy + ay * dt_now;
                    let vt = p.sqrt(vx*vx + vy*vy);

                    let newData = {t: t, mx: x_now, my: y_now, vx: vx, vy: vy, vt: vt};
                    trayect.push(newData);
                    actualizarDash(t, x_now, y_now, vx, vy, vt);
                    updateCharts(t, x_now, y_now, vt, (modoActual==='MRUV'?ax:ay));
                    actualizarTabla(newData);
                }
            }

            // Dibujo de línea actual
            p.noFill(); p.stroke(79, 70, 229); p.strokeWeight(3);
            p.beginShape(); trayect.forEach(pt => p.vertex(pt.mx*UNIT, -pt.my*UNIT)); p.endShape();

            if(trayect.length > 0) {
                let last = trayect[trayect.length-1];
                dibujarParticulaConVectores(p, last);
            }
            p.pop();
        };

       function dibujarEjesMejorados(p, cx, cy) {
            let minX = -cx / UNIT;
            let maxX = (p.width - cx) / UNIT;
            let minY = -(p.height - cy) / UNIT;
            let maxY = cy / UNIT;

            // --- 1. CUADRÍCULA (Divisiones intermedias) ---
            p.stroke(240); // Gris muy clarito
            p.strokeWeight(1);
            
            let pasoGrilla = 2; // Líneas cada 2 metros
            
            for (let x = p.floor(minX / pasoGrilla) * pasoGrilla; x <= p.ceil(maxX); x += pasoGrilla) {
                p.line(x * UNIT, -minY * UNIT, x * UNIT, -maxY * UNIT);
            }
            for (let y = p.floor(minY / pasoGrilla) * pasoGrilla; y <= p.ceil(maxY); y += pasoGrilla) {
                p.line(minX * UNIT, -y * UNIT, maxX * UNIT, -y * UNIT);
            }

            // --- 2. EJES PRINCIPALES (X=0, Y=0) ---
            p.stroke(150); 
            p.strokeWeight(2);
            if (minY <= 0 && maxY >= 0) p.line(minX * UNIT, 0, maxX * UNIT, 0);
            if (minX <= 0 && maxX >= 0) p.line(0, -minY * UNIT, 0, -maxY * UNIT);

            // --- 3. ETIQUETAS NUMÉRICAS (Cada 10 metros) ---
            p.fill(120);
            p.noStroke();
            p.textSize(10);
            p.textStyle(p.NORMAL);
            
            let pasoEtiqueta = 10; // Números cada 10 metros

            // Números en el Eje X
            p.textAlign(p.CENTER, p.TOP);
            for (let x = p.floor(minX / pasoEtiqueta) * pasoEtiqueta; x <= p.ceil(maxX); x += pasoEtiqueta) {
                if (x !== 0) { // No dibujamos el 0 para no encimar
                    p.text(x, x * UNIT, 5);
                }
            }

            // Números en el Eje Y
            p.textAlign(p.RIGHT, p.CENTER);
            for (let y = p.floor(minY / pasoEtiqueta) * pasoEtiqueta; y <= p.ceil(maxY); y += pasoEtiqueta) {
                if (y !== 0) {
                    p.text(y, -5, -y * UNIT);
                }
            }

            // --- 4. TÍTULOS DE EJES (Fijos en pantalla) ---
            p.resetMatrix();
            p.textAlign(p.LEFT);
            p.fill(80); 
            p.textSize(11); 
            p.textStyle(p.BOLD);
            p.text("EJE X (m)", p.width - 70, p.height - 15);
            p.text("EJE Y (m)", 15, 20);
            
            p.translate(cx, cy); 
        }

        function dibujarFlecha(p, x1, y1, vx, vy, color, valor) {
            if (p.abs(vx) < 0.1 && p.abs(vy) < 0.1) return;
            let finalX = x1 + vx * UNIT;
            let finalY = y1 - vy * UNIT;
            p.stroke(color); p.strokeWeight(2);
            p.line(x1, y1, finalX, finalY);
            p.push();
            p.translate(finalX, finalY);
            p.rotate(p.atan2(-vy * UNIT, vx * UNIT));
            let arrowSize = 8;
            p.fill(color); p.noStroke();
            p.triangle(0, 0, -arrowSize, arrowSize/2, -arrowSize, -arrowSize/2);
            p.pop();
            p.noStroke(); p.fill(0); p.textSize(12); p.textStyle(p.BOLD);
            p.text(p.abs(valor).toFixed(1), finalX + 5, finalY - 5);
        }

        function dibujarParticulaConVectores(p, pt) {
            let x = pt.mx * UNIT;
            let y = -pt.my * UNIT;
            dibujarFlecha(p, x, y, pt.vx, 0, p.color(59, 130, 246), pt.vx); 
            dibujarFlecha(p, x, y, 0, pt.vy, p.color(239, 68, 68), pt.vy);  
            dibujarFlecha(p, x, y, pt.vx, pt.vy, p.color(34, 197, 94), pt.vt); 
            p.fill(239, 68, 68); p.stroke(255); p.strokeWeight(2);
            p.ellipse(x, y, 16, 16);
        }

        function actualizarTabla(row) {
            const body = document.getElementById('data-body');
            // Aseguramos que el contenedor de la tabla tenga scroll
            const tableCont = body.parentElement.parentElement; 
            tableCont.style.maxHeight = "200px";
            tableCont.style.overflowY = "auto";
            tableCont.style.display = "block";
        
            const tr = document.createElement('tr');
            tr.style.borderBottom = "1px solid #eee";
            tr.innerHTML = `
                <td style="padding:4px"><b>t:</b> ${row.t.toFixed(2)}s</td>
                <td style="padding:4px"><b>X:</b> ${row.mx.toFixed(1)}m</td>
                <td style="padding:4px"><b>Y:</b> ${row.my.toFixed(1)}m</td>
                <td style="padding:4px; color:#3b82f6"><b>Vx:</b> ${row.vx.toFixed(1)}</td>
                <td style="padding:4px; color:#ef4444"><b>Vy:</b> ${row.vy.toFixed(1)}</td>
                <td style="padding:4px; font-weight:bold"><b>VT:</b> ${row.vt.toFixed(1)}</td>
            `;
            body.insertBefore(tr, body.firstChild);
        }

        function setupUI() {
            document.getElementById('side-ctrl').innerHTML = `
                <button onclick="window.resetSim()" style="width:100%; padding:10px; margin-bottom:15px; cursor:pointer; font-weight:800; border-radius:8px; border:1px solid #ddd;">NUEVA SIMULACIÓN</button>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px">
                    <button id="b-MRU" class="btn-mod" onclick="window.setM('MRU')">MRU</button>
                    <button id="b-MRUV" class="btn-mod" onclick="window.setM('MRUV')">MRUV</button>
                    <button id="b-CL" class="btn-mod" onclick="window.setM('CL')">Caída</button>
                    <button id="b-TO" class="btn-mod" onclick="window.setM('TO')">Tiro</button>
                </div>
                <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:5px; margin-top:10px">
                    <button id="g-9.8" class="btn-g" onclick="window.setG(9.8)">Tierra</button>
                    <button id="g-1.6" class="btn-g" onclick="window.setG(1.6)">Luna</button>
                    <button id="g-24.8" class="btn-g" onclick="window.setG(24.8)">Júpiter</button>
                </div>
                
                <div style="margin-top:10px;">
                    <small style="font-weight:bold; color:#64748b;">VELOCIDAD DE SIMULACIÓN</small>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-top:5px;">
                        <button id="v-normal" class="btn-v" onclick="window.setVel(0.05, 'normal')" style="background:#4f46e5; color:white; padding:5px; border-radius:4px; border:none; cursor:pointer; font-size:10px;">NORMAL</button>
                        <button id="v-lento" class="btn-v" onclick="window.setVel(0.01, 'lento')" style="background:white; color:#4f46e5; padding:5px; border-radius:4px; border:1px solid #4f46e5; cursor:pointer; font-size:10px;">CÁMARA LENTA</button>
                    </div>
                </div>
                
                <div style="margin-top:15px; display:grid; grid-template-columns:1fr 1fr; gap:10px">
                    <label>x₀ (m)<input type="number" id="ix0" value="0"></label>
                    <label>y₀ (m)<input type="number" id="iy0" value="0"></label>
                    <label>v₀ (m/s)<input type="number" id="iv0" value="30"></label>
                    <label>θ (°) <input type="number" id="iang" value="45"></label>
                    <label>a (m/s²)<input type="number" id="ia" value="9.8"></label>
                    <label>t-lim (s)<input type="number" id="itf" value="0"></label>
                </div>
                <button onclick="window.lanzar()" style="width:100%; margin-top:15px; background:#4f46e5; color:white; padding:12px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">INICIAR</button>
                <button id="btn-pause" onclick="window.togglePausa()" style="width:100%; margin-top:8px; background:#ef4444; color:white; padding:10px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">PAUSAR</button>
                <div id="eq-box" style="margin-top:15px; text-align:center; font-weight:bold; color:#4f46e5; font-size:0.9rem"></div>
            `;
            const s = document.createElement('style');
            s.innerHTML = `.btn-mod, .btn-g { padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; background: white; font-weight: 600; font-size: 11px; } .btn-mod.active { background: #4f46e5 !important; color: white; } .btn-g.active { background: #f59e0b !important; color: white; } .c-box { height: 160px; background: white; border-radius: 8px; border: 1px solid #e2e8f0; padding: 10px; } input { width: 100%; padding: 4px; border: 1px solid #e2e8f0; border-radius: 4px; margin-top: 2px; font-size: 11px; }`;
            document.head.appendChild(s);
        }

        window.centrarVista = () => { offX = 0; offY = 0; window.seguirParticula = false; document.getElementById('checkSeguir').checked = false; };

        function initCharts() {
            const cfg = (title, color, yLabel) => ({
                type: 'line', data: { labels: [], datasets: [{ label: title, data: [], borderColor: color, borderWidth: 1.5, pointRadius: 0, fill: false }] },
                options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { x: { display: true, title: { display: true, text: 't (s)', font: { size: 10 } } }, y: { display: true, title: { display: true, text: yLabel, font: { size: 10 } } } }, plugins: { legend: { labels: { boxWidth: 8, font: { size: 10 } } } } }
            });
            charts.p = new Chart(document.getElementById('chartPos'), cfg('Posición X', '#4f46e5', 'x (m)'));
            charts.h = new Chart(document.getElementById('chartHeight'), cfg('Altura Y', '#ec4899', 'y (m)'));
            charts.v = new Chart(document.getElementById('chartVel'), cfg('Velocidad', '#10b981', 'v (m/s)'));
            charts.a = new Chart(document.getElementById('chartAcc'), cfg('Acel.', '#f59e0b', 'a (m/s²)'));
        }

        function updateCharts(t, x, y, v, a) {
            const dataArr = [
                {c: charts.p, v: x}, 
                {c: charts.h, v: y}, 
                {c: charts.v, v: v}, 
                {c: charts.a, v: a}
            ];
            
            dataArr.forEach(d => {
                if(d.c){
                    // Agregamos el tiempo al eje X y el valor al eje Y
                    d.c.data.labels.push(t.toFixed(1)); 
                    d.c.data.datasets[0].data.push(d.v);
                    
                    // IMPORTANTE: NO USAR .shift(). Si esta línea existe en tu código, bórrala.
                    
                    // Forzar a que el gráfico siempre empiece en el segundo 0
                    d.c.options.scales.x.min = 0;
                    
                    // Actualizar sin animaciones para que no consuma memoria
                    d.c.update('none');
                }
            });
        }

        function actualizarDash(t, x, y, vx, vy, vt) {
            const d = document.getElementById('dashboard-control');
            
            // Guardamos los máximos alcanzados en la sesión actual
            if (!window.maxH || lanzado === true && t === 0.05) window.maxH = 0;
            if (!window.maxD || lanzado === true && t === 0.05) window.maxD = 0;
            if (y > window.maxH) window.maxH = y;
            if (x > window.maxD) window.maxD = x;
        
            const st = "background:white; padding:8px; border-radius:8px; border-top:3px solid #4f46e5; box-shadow:0 2px 4px rgba(0,0,0,0.05); font-size:11px;";
            
            d.innerHTML = `
                <div style="${st}"><small>TIEMPO</small><br><b>${t.toFixed(2)} s</b></div>
                <div style="${st}"><small>POSICIÓN (X,Y)</small><br><b>${x.toFixed(1)}, ${y.toFixed(1)} m</b></div>
                <div style="${st}"><small>ALTURA MÁX (h)</small><br><b style="color:#ec4899">${window.maxH.toFixed(2)} m</b></div>
                <div style="${st}"><small>ALCANCE MÁX (d)</small><br><b style="color:#4f46e5">${window.maxD.toFixed(2)} m</b></div>
            `;
            // Supongamos masa = 1 para ver proporciones
            let masa = 1;
            let Ec = 0.5 * masa * Math.pow(vt, 2);
            let Ep = masa * g_val * y;
            let Etotal = 0.5 * masa * Math.pow(v0, 2) + masa * g_val * y0; // Energía mecánica inicial
            
            // Calculamos porcentajes respecto al total
            let pctEc = (Ec / Etotal) * 100;
            let pctEp = (Ep / Etotal) * 100;
            
            // Actualizamos las barras visuales
            document.getElementById('bar-ec').style.width = Math.min(pctEc, 100) + "%";
            document.getElementById('bar-ep').style.width = Math.min(pctEp, 100) + "%";
        }

        p.mouseWheel = (e) => { UNIT = p.constrain(UNIT * (e.delta > 0 ? 0.95 : 1.05), 2, 200); return false; };
        p.mouseDragged = () => { if(p.mouseX > 0 && p.mouseX < p.width){ offX += p.mouseX - p.pmouseX; offY += p.mouseY - p.pmouseY; window.seguirParticula = false; document.getElementById('checkSeguir').checked = false; } };
    };
    new p5(sketch);
})();