async function cargarModulo(archivo) {
    const main = document.getElementById('main-content');
    main.innerHTML = "Cargando...";

    // 1. Detectamos la carpeta basándonos en el nombre del JSON
    // Si archivo es 'cinematica.json', folder es 'cinematica'
    const folder = archivo.replace('.json', ''); 

    try {
        const res = await fetch(`data/${archivo}`);
        const data = await res.json();
        main.innerHTML = "";

        data.temas.forEach(tema => {
            const section = document.createElement('section');
            let html = tema.html || tema.contenido;

            // 2. REEMPLAZO DINÁMICO: Aquí usamos la variable 'folder'
            // Esto hace que busque en figuras/cinematica/ o figuras/vectores/ según corresponda
            html = html.replace(/src=["']([^"']+)["']/g, (m, p1) => {
                const nombreImagen = p1.split('/').pop();
                return `src="figuras/${folder}/${nombreImagen}"`;
            });

            section.innerHTML = html;

            // 3. Ajuste de tamaño de imágenes manual
            section.querySelectorAll('img').forEach(img => {
                img.style.width = "350px";
            });

            // 4. Limpieza de botones viejos del HTML original
            section.querySelectorAll('button, .solucion-label, .btn-solucion').forEach(el => el.remove());

            // 5. Encapsulamiento de ejercicios (Tu lógica de pasos)
            section.querySelectorAll('[id^="sol-"]').forEach(sol => {
                const marco = document.createElement('div');
                marco.className = 'ejercicio-resuelto';
                
                let enunciado = sol.previousElementSibling;
                while (enunciado && (enunciado.innerText.trim() === "" || enunciado.tagName === "BR")) {
                    enunciado = enunciado.previousElementSibling;
                }

                if (enunciado) {
                    enunciado.parentNode.insertBefore(marco, enunciado);
                    let hermano = enunciado.nextElementSibling;
                    marco.appendChild(enunciado); 
                    
                    while (hermano && hermano !== sol) {
                        let sig = hermano.nextElementSibling;
                        marco.appendChild(hermano);
                        hermano = sig;
                    }
                }

                // Procesar pasos de la solución
                let textoLimpio = sol.innerHTML.replace(/Soluci[óo]n:?/gi, "").trim();
                const lineas = textoLimpio.split(/<p>|<br>|<div>/).filter(t => t.replace(/<\/?[^>]+>/g,'').trim().length > 5);
                
                sol.innerHTML = lineas.map(l => `<div class="linea-solucion" style="display:none; padding: 10px 0; border-top: 1px solid #f1f5f9;">${l}</div>`).join('');
                sol.style.display = "block";

                const btnAccion = document.createElement('button');
                btnAccion.className = "nav-btn"; 
                btnAccion.innerText = "Analizar Resolución";
                btnAccion.style.marginTop = "15px";
                
                btnAccion.onclick = () => {
                    const lineasOcultas = sol.querySelectorAll('.linea-solucion[style*="display:none"]');
                    if (lineasOcultas.length > 0) {
                        lineasOcultas[0].style.display = "block";
                        lineasOcultas[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                        btnAccion.innerText = "Siguiente Paso ➔";
                        if (window.MathJax) MathJax.Hub.Queue(["Typeset", MathJax.Hub, lineasOcultas[0]]);
                    } 
                    if (lineasOcultas.length <= 1) {
                        btnAccion.innerText = "Ejercicio Completado";
                        btnAccion.style.background = "#64748b";
                    }
                };

                marco.appendChild(sol);
                marco.appendChild(btnAccion);
            });
            main.appendChild(section);
        });

        if (window.MathJax) MathJax.Hub.Queue(["Typeset", MathJax.Hub, main]);
    } catch (e) { 
        console.error("Error en cargarModulo:", e);
        main.innerHTML = "Error al cargar el módulo.";
    }
}