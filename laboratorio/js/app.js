window.p5Instancia = null;

const limpiarFisica = (texto) => {
    if (!texto) return "";
    return texto.replace(/Â/g, '').replace(/â/g, '').replace(/°/g, '°').replace(/\?/g, '');
};

// --- CARGA DE TEORÍA ---
window.cargarTeoria = async function(archivo) {
    const main = document.getElementById('main-content');
    if (window.p5Instancia) { window.p5Instancia.remove(); window.p5Instancia = null; }

    main.innerHTML = `<div style="text-align:center; padding:50px;">Cargando lección...</div>`;

    try {
        const res = await fetch(`data/${archivo}`);
        const data = await res.json();
        main.innerHTML = "";
        const folder = archivo.replace('.json', '');

        data.temas.forEach(tema => {
            const section = document.createElement('section');
            section.className = "teoria-card fade-in";
            
            let contenidoOriginal = tema.html || tema.contenido;
            
            // Corregir rutas de imágenes
            contenidoOriginal = contenidoOriginal.replace(/src=["']([^"']+)["']/g, (m, p1) => {
                const nombreImg = p1.split('/').pop();
                return `src="figuras/${folder}/${nombreImg}" class="img-fluid-modern"`;
            });
            
            section.innerHTML = limpiarFisica(contenidoOriginal);

            // PROCESAMIENTO DE EJERCICIOS (Pasos)
            section.querySelectorAll('[id^="sol-"]').forEach(solBox => {
                const marco = document.createElement('div');
                marco.className = 'premium-step-box';
                
                // Limpiar botones viejos
                solBox.querySelectorAll('button').forEach(b => b.remove());

                // Encuadrar enunciado
                let elPrevio = solBox.previousElementSibling;
                let elementosEnunciado = [];
                while (elPrevio && !elPrevio.classList.contains('premium-step-box') && 
                       elPrevio.tagName !== 'H2' && elPrevio.tagName !== 'H1') {
                    elementosEnunciado.unshift(elPrevio);
                    elPrevio = elPrevio.previousElementSibling;
                }

                if (elementosEnunciado.length > 0) {
                    solBox.parentNode.insertBefore(marco, elementosEnunciado[0]);
                    elementosEnunciado.forEach(el => marco.appendChild(el));
                } else {
                    solBox.parentNode.insertBefore(marco, solBox);
                }

                // Procesar pasos
                let textoLimpio = solBox.innerHTML
                    .replace(/Soluci[óo]n:?/gi, '')
                    .replace(/<button.*?>.*?<\/button>/gi, '')
                    .replace(/onclick=".*?"/gi, '');       
                
                const lineas = textoLimpio.split(/<p>|<br>|<div>/)
                    .map(l => l.replace(/<\/?[^>]+>/g, '').trim())
                    .filter(l => l.length > 5);
                
                solBox.innerHTML = ""; 
                let i = 0;
                
                const btnAccion = document.createElement('button');
                btnAccion.className = "btn-step-action";
                btnAccion.innerHTML = `Analizar Resolución (Paso 1 de ${lineas.length}) →`;
                
                btnAccion.onclick = () => {
                    if (i < lineas.length) {
                        const divPaso = document.createElement('div');
                        divPaso.className = 'step-item fade-in';
                        divPaso.innerHTML = `
                            <div class="step-badge">${i + 1}</div>
                            <div class="step-text">${limpiarFisica(lineas[i])}</div>
                        `;
                        solBox.appendChild(divPaso);
                        i++;
                        btnAccion.innerHTML = i < lineas.length ? `Siguiente Paso (${i+1}/${lineas.length}) →` : "✓ Ejercicio Completado";
                        if (window.MathJax) MathJax.Hub.Queue(["Typeset", MathJax.Hub, divPaso]);
                    }
                };

                marco.appendChild(solBox);
                marco.appendChild(btnAccion);
            });
            main.appendChild(section);
        });
        if (window.MathJax) MathJax.Hub.Queue(["Typeset", MathJax.Hub, main]);
    } catch (e) { console.error("Error en carga:", e); }
};

// --- LABORATORIO ---

window.abrirLaboratorio = function() {
    const main = document.getElementById('main-content');
    if (window.p5Instancia) { window.p5Instancia.remove(); window.p5Instancia = null; }
    
    // Pantalla de selección de simulador
    main.innerHTML = `
        <section class="hero fade-in">
            <div class="hero-content">
                <h2>Laboratorio Virtual</h2>
                <p>Selecciona un módulo de experimentación para comenzar.</p>
                <div class="hero-actions">
                    <button onclick="lanzarSim('cinematica')" class="btn-main">Cinemática Proyectiles</button>
                    <button onclick="lanzarSim('vectores')" class="btn-outline">Suma de Vectores</button>
                </div>
            </div>
        </section>
    `;
};

window.lanzarSim = function(tipo) {
    const main = document.getElementById('main-content');
    
    // Inyectamos la estructura de 3 COLUMNAS necesaria para el sim de cinemática
    // y compatible con vectores.
    main.innerHTML = `
        <div class="main-lab-layout">
            <div id="controles-dinamicos"></div>
            <div id="canvas-container"></div>
            <div class="graphs-sidebar">
                <div class="graph-box"><canvas id="chartPos"></canvas></div>
                <div class="graph-box"><canvas id="chartVel"></canvas></div>
                <div class="graph-box"><canvas id="chartAcc"></canvas></div>
                <div id="resultados-sim"></div>
                <button onclick="abrirLaboratorio()" class="btn-reset" style="background:#e2e8f0; color:#475569; margin-top:10px;">⬅ Volver al Menú</button>
            </div>
        </div>
    `;

    // Si es vectores, podemos ocultar los cuadros de gráficos que no usemos
    if(tipo === 'vectores') {
        document.querySelectorAll('.graph-box').forEach(el => el.style.display = 'none');
    }

    // Cargar el script del simulador
    const scriptExistente = document.getElementById('script-sim');
    if (scriptExistente) scriptExistente.remove();

    const script = document.createElement('script');
    script.id = 'script-sim';
    script.src = `js/sim_${tipo}.js?v=${Date.now()}`;
    document.body.appendChild(script);
};