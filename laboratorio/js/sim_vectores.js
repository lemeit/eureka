(function() {
    let vectores = [], UNIT = 40, offX = 0, offY = 0;
    let resultante = null, animSuma = false;
    const colores = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

    const sketch = (p) => {
        p.setup = () => {
            let container = document.getElementById('canvas-container');
            if (container) {
                p.createCanvas(container.offsetWidth, 500).parent('canvas-container');
            }
            setupUI();
        };

        p.draw = () => {
            p.background(255);
            
            p.push();
            p.translate(p.width/2 + offX, p.height/2 + offY);
            dibujarCuadriculaYEjes(p);

            if (animSuma && vectores.length >= 2) {
                // MODO PUNTA-COLA (Enfoque en A y B)
                let vA = vectores[0];
                let vB = vectores[1];
                let esResta = resultante && resultante.id.includes("Resta");
                let factor = esResta ? -1 : 1;

                // Dibujamos la cadena pedagógica
                dibujarVector(p, vA.x, vA.y, vA.col, vA.id, true);
                dibujarVector(p, vB.x * factor, vB.y * factor, vB.col, (esResta ? "-" : "") + vB.id, false, vA.x * UNIT, -vA.y * UNIT);
                
                // IMPORTANTE: Dibujamos el resto de los vectores (del 3ro en adelante) en el origen
                if (vectores.length > 2) {
                    for (let i = 2; i < vectores.length; i++) {
                        let v = vectores[i];
                        dibujarVector(p, v.x, v.y, v.col, v.id, true);
                    }
                }
            } else {
                // MODO NORMAL: Dibuja ABSOLUTAMENTE TODOS los vectores desde el origen
                // Si están encimados, se verán uno sobre otro (el último queda arriba)
                vectores.forEach(v => dibujarVector(p, v.x, v.y, v.col, v.id, true));
            }

            if(resultante) {
                dibujarVector(p, resultante.x, resultante.y, resultante.col, resultante.id, true);
            }
            p.pop();
            dibujarNombresEjes(p);
        };

        function dibujarNombresEjes(p) {
            p.fill(120); p.noStroke(); p.textSize(14); p.textStyle(p.BOLD);
            // Solo X e Y, sin "m"
            p.text("EJE X", p.width - 50, p.height/2 + offY - 10);
            p.text("EJE Y", p.width/2 + offX + 10, 20);
        }
        
        function dibujarCuadriculaYEjes(p) {
            let limiteX = p.ceil((p.width/2 + p.abs(offX))/UNIT) + 5;
            let limiteY = p.ceil((p.height/2 + p.abs(offY))/UNIT) + 5;
        
            // Cuadrícula secundaria (fina)
            p.stroke(245); p.strokeWeight(1);
            for(let i = -limiteX; i <= limiteX; i++) {
                p.line(i * UNIT, -limiteY * UNIT, i * UNIT, limiteY * UNIT);
                p.line(-limiteX * UNIT, i * UNIT, limiteX * UNIT, i * UNIT);
            }
        
            // Ejes Principales
            p.stroke(200); p.strokeWeight(2);
            p.line(-limiteX * UNIT, 0, limiteX * UNIT, 0);
            p.line(0, -limiteY * UNIT, 0, limiteY * UNIT);
        
            // Numeración de escala (Cada 5 unidades para no saturar)
            p.fill(150); p.noStroke(); p.textSize(10); p.textAlign(p.CENTER, p.TOP);
            for(let i = -limiteX; i <= limiteX; i++) {
                if(i !== 0 && i % 5 === 0) {
                    p.text(i, i * UNIT, 5); // Números en X
                    p.text(i, -15, -i * UNIT - 5); // Números en Y
                }
            }
            p.textAlign(p.LEFT); // Reset del align
        }

        function dibujarVector(p, x, y, col, txt, conTrazas, origenX = 0, origenY = 0) {
            let destX = origenX + x * UNIT;
            let destY = origenY - y * UNIT;
            if(conTrazas) {
                p.stroke(col + "66"); p.strokeWeight(1.2);
                p.drawingContext.setLineDash([5, 5]);
                p.line(destX, destY, destX, origenY); 
                p.line(destX, destY, origenX, destY);
                p.drawingContext.setLineDash([]);
                p.noStroke(); p.fill(col); p.textSize(10);
                p.text(x.toFixed(1), destX, origenY + 12);
                p.text(y.toFixed(1), origenX - 25, destY);
            }
            p.stroke(col); p.strokeWeight(3);
            p.line(origenX, origenY, destX, destY);
            p.push();
            p.translate(destX, destY);
            p.rotate(p.atan2(destY - origenY, destX - origenX));
            p.fill(col); p.triangle(0, 0, -12, 5, -12, -5);
            p.pop();
            p.fill(col); p.noStroke(); p.textSize(13); p.text(txt, destX + 5, destY - 5);
        }

        function setupUI() {
                    const ctrl = document.getElementById('controles-dinamicos');
                    ctrl.innerHTML = `
                        <div class="sidebar-panel">
                            <button onclick="window.resetV()" class="btn-reset" style="width:100%; margin-bottom:15px; font-weight:bold;">NUEVA SIMULACIÓN</button>
                            
                            <div style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:10px;">
                                <h4 style="margin-top:0;">Nuevo Vector</h4>
                                <select id="selModoV" onchange="window.cambiarLabels()" class="btn-mini" style="width:100%; margin-bottom:10px;">
                                    <option value="cart">Rectangulares (x, y)</option>
                                    <option value="pol">Polares (r, θ°)</option>
                                </select>
                                <input type="text" id="vid" placeholder="Nombre del vector" style="width:100%; margin-bottom:8px;">
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                                    <div><small id="lbl-v1" style="font-weight:bold; color:#64748b;">COMPONENTE X</small>
                                    <input type="number" id="vx" value="0" style="width:100%;"></div>
                                    <div><small id="lbl-v2" style="font-weight:bold; color:#64748b;">COMPONENTE Y</small>
                                    <input type="number" id="vy" value="0" style="width:100%;"></div>
                                </div>
                                <button onclick="window.addVector()" class="btn-step-action" style="width:100%; margin-top:12px; background:#4f46e5; color:white;">AÑADIR VECTOR</button>
                            </div>
        
                            <div style="background:#f1f5f9; padding:12px; border-radius:8px; border:1px solid #e2e8f0;">
                                <h4 style="margin-top:0;">Operaciones</h4>
                                <label style="display:flex; align-items:center; gap:8px; font-size:11px; margin-bottom:10px; cursor:pointer;">
                                    <input type="checkbox" id="checkPuntaCola" onchange="window.animSuma=this.checked"> <b>Activar Método Punta-Cola</b>
                                </label>
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;">
                                    <button onclick="window.operarV('suma')" style="padding:8px; cursor:pointer;">SUMAR</button>
                                    <button onclick="window.operarV('resta')" style="padding:8px; cursor:pointer;">RESTAR</button>
                                    <button onclick="window.calcProds()" style="grid-column: span 2; padding:8px; cursor:pointer; margin-top:5px; background:#64748b; color:white; border:none; border-radius:4px;">CALCULAR PRODUCTOS (· / x)</button>
                                    <button onclick="window.capturarPantalla()" style="grid-column: span 2; padding:8px; cursor:pointer; margin-top:5px; background:#1e293b; color:white; border:none; border-radius:4px;">📷 CAPTURAR GRÁFICO (PNG)</button>
                                </div>
                            </div>
                        </div>`;

            const resSim = document.getElementById('resultados-sim');
            resSim.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <h4 style="margin:0;">Vectores Cargados</h4>
                    <button onclick="window.exportarVectoresCSV()" style="background:#10b981; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:bold;">Descargar CSV ↓</button>
                </div>
                <div id="tabla-vectores-cont" style="height:200px; overflow-y:auto; background:white; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:15px;">
                    <table style="width:100%; font-size:12px; border-collapse:collapse;">
                        <thead style="position:sticky; top:0; background:#f8fafc; border-bottom:2px solid #e2e8f0;">
                            <tr><th style="padding:8px; text-align:left;">ID</th><th style="padding:8px;">Comp. (x,y)</th><th style="padding:8px;">Mod | Ang</th></tr>
                        </thead>
                        <tbody id="vectores-body"></tbody>
                    </table>
                </div>
                <div id="resultado-operacion-box"></div>
            `;
        }

        window.cambiarLabels = () => {
            const modo = document.getElementById('selModoV').value;
            document.getElementById('lbl-v1').innerText = modo === 'pol' ? "MÓDULO (r)" : "COMPONENTE X";
            document.getElementById('lbl-v2').innerText = modo === 'pol' ? "ÁNGULO (θ°)" : "COMPONENTE Y";
        };

        window.addVector = () => {
            let modo = document.getElementById('selModoV').value;
            let id = document.getElementById('vid').value || 'V'+(vectores.length+1);
            let v1 = parseFloat(document.getElementById('vx').value) || 0;
            let v2 = parseFloat(document.getElementById('vy').value) || 0;
            
            let x, y;
            if(modo === 'pol') {
                x = v1 * Math.cos(v2 * Math.PI / 180);
                y = v1 * Math.sin(v2 * Math.PI / 180);
            } else { x = v1; y = v2; }

            let col = colores[vectores.length % colores.length];
            vectores.push({x, y, id, col});
            
            const body = document.getElementById('vectores-body');
            const mag = Math.sqrt(x*x + y*y).toFixed(1);
            const ang = ((Math.atan2(y, x) * 180 / Math.PI + 360) % 360).toFixed(0);
            
            const tr = document.createElement('tr');
            tr.style.borderBottom = "1px solid #f1f5f9";
            tr.innerHTML = `<td style="padding:8px; color:${col}; font-weight:bold;">${id}</td>
                            <td style="padding:8px; text-align:center;">(${x.toFixed(1)}, ${y.toFixed(1)})</td>
                            <td style="padding:8px; text-align:center;">${mag} | ${ang}°</td>`;
            body.appendChild(tr);
            resultante = null;
        };

        window.operarV = (tipo) => {
            if(vectores.length < 2) return alert("Carga al menos 2 vectores.");
            let A = vectores[0], B = vectores[1];
            animSuma = document.getElementById('checkPuntaCola').checked;
        
            if(tipo === 'suma') {
                resultante = { x: A.x + B.x, y: A.y + B.y, id: "Suma (Σ)", col: "#ef4444" };
            } else {
                // Lógica de resta: A + (-B)
                resultante = { x: A.x - B.x, y: A.y - B.y, id: "Resta (Δ)", col: "#f59e0b" };
                
                // Si punta-cola está activo, creamos un vector B invertido para la visualización
                if(animSuma) {
                    // Esto le dice al draw que use los valores de la resta
                    // pero manteniendo el flujo visual
                }
            }
            
            const resBox = document.getElementById('resultado-operacion-box');
            resBox.innerHTML = `
                <div style="background:#f8fafc; color:#1e293b; padding:15px; border-radius:8px; border:1px solid #e2e8f0; border-left:5px solid ${resultante.col};">
                    <small style="color:#64748b; font-weight:bold; text-transform:uppercase; font-size:10px;">Resultado Teórico</small>
                    <div style="margin-top:8px;">
                        <b style="font-size:15px; color:${resultante.col}">${resultante.id}: ${resultante.x.toFixed(1)}î + ${resultante.y.toFixed(1)}ĵ</b>
                        <p style="margin:5px 0; font-size:12px; color:#475569;">Módulo: <b>${Math.sqrt(resultante.x**2 + resultante.y**2).toFixed(2)}</b> | Ángulo: <b>${((Math.atan2(resultante.y, resultante.x)*180/Math.PI+360)%360).toFixed(1)}°</b></p>
                    </div>
                </div>`;
        };

        window.calcProds = () => {
            if(vectores.length < 2) return alert("Carga al menos 2 vectores.");
            let A = vectores[0], B = vectores[1];
            let dot = A.x * B.x + A.y * B.y;
            let cross = A.x * B.y - A.y * B.x;
            
            const resBox = document.getElementById('resultado-operacion-box');
            resBox.innerHTML = `
                <div style="background:#f8fafc; color:#1e293b; padding:15px; border-radius:8px; border:1px solid #e2e8f0; border-left:5px solid #64748b;">
                    <small style="color:#64748b; font-weight:bold; text-transform:uppercase; font-size:10px;">Análisis de Productos</small>
                    <div style="margin-top:10px;">
                        <p style="margin:5px 0;">Escalar (A·B): <span style="font-family:monospace; font-weight:bold; color:#4f46e5;">${dot.toFixed(2)}</span></p>
                        <p style="margin:5px 0;">Vectorial (AxB): <span style="font-family:monospace; font-weight:bold; color:#4f46e5;">${cross.toFixed(2)} k̂</span></p>
                    </div>
                </div>`;
            resultante = null;
        };

        window.exportarVectoresCSV = () => {
            if (vectores.length === 0) return;
            let csv = "ID,X,Y,Modulo,Angulo\n";
            vectores.forEach(v => {
                let mag = Math.sqrt(v.x**2 + v.y**2).toFixed(2);
                let ang = ((Math.atan2(v.y, v.x)*180/Math.PI+360)%360).toFixed(1);
                csv += `${v.id},${v.x.toFixed(2)},${v.y.toFixed(2)},${mag},${ang}\n`;
            });
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'laboratorio_vectores.csv'; a.click();
        };

        window.capturarPantalla = () => {
            p.saveCanvas('laboratorio_vectores', 'png');
        };
                
        window.resetV = () => { 
            vectores = []; resultante = null; offX=0; offY=0; 
            setupUI(); // Esto limpia la tabla y el box de resultados automáticamente
        };

        p.mouseDragged = () => { if(p.mouseX > 0 && p.mouseX < p.width) { offX += p.mouseX - p.pmouseX; offY += p.mouseY - p.pmouseY; } };
        p.mouseWheel = (e) => { if(p.mouseX > 0 && p.mouseX < p.width) { UNIT = p.constrain(UNIT - e.delta*0.05, 10, 200); return false; } };
    };
    new p5(sketch);
})();