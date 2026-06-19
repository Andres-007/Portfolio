document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const themeIcon = themeToggle.querySelector('i');

    // 1. Cargar preferencia de tema (por defecto oscuro)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light-mode') {
        body.classList.add('light-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        body.classList.remove('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    // 2. Toggle de tema
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light-mode');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark-mode');
        }
    });

    // 3. Navbar que se adapta al scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Si el usuario ha hecho scroll más de 50px
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Smooth scrolling para los enlaces de la navbar
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            // Obtiene el ID de la sección a la que apunta el enlace
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calcula la posición de desplazamiento ajustando para la altura de la navbar
                const navbarHeight = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - navbarHeight - 20; // -20px para un pequeño margen extra

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Carrusel de Habilidades "En Cadena" Infinito y Dinámico (Resuelve saltos en pantallas grandes)
    const tracks = document.querySelectorAll('.skills-track-tailwind');
    
    tracks.forEach(track => {
        // Guardamos el HTML base original (solo una copia de cada skill)
        if (!track.originalHTML) {
            track.originalHTML = track.innerHTML;
        }

        const rebuildMarquee = () => {
            // Restaurar el HTML limpio original para medir
            track.innerHTML = track.originalHTML;
            
            const originalItems = Array.from(track.querySelectorAll('.skill-logo-item'));
            if (originalItems.length === 0) return;

            // Medir el ancho de la lista base sin clones
            const initialWidth = track.scrollWidth;
            
            // Para evitar cortes, el bloque base debe superar el ancho de la pantalla
            // con un margen adicional para que no se vea vacío durante la traslación.
            const minWidthNeeded = window.innerWidth * 1.5;
            let multiplier = 1;
            if (initialWidth < minWidthNeeded) {
                multiplier = Math.ceil(minWidthNeeded / initialWidth);
            }

            // Guardamos copias en memoria
            const baseItems = originalItems.map(item => item.cloneNode(true));
            
            // Limpiamos el track
            track.innerHTML = '';

            // Rellenamos el track 'multiplier' veces para formar la parte "original"
            for (let i = 0; i < multiplier; i++) {
                baseItems.forEach(item => {
                    const node = item.cloneNode(true);
                    track.appendChild(node);
                });
            }

            // Duplicamos el bloque completo exactamente una vez para el efecto infinito
            const currentItems = Array.from(track.children);
            currentItems.forEach(item => {
                const clone = item.cloneNode(true);
                clone.classList.add('cloned');
                track.appendChild(clone);
            });

            // Ajustar la velocidad para mantenerla constante (50px por segundo)
            const totalWidth = track.scrollWidth;
            const singleWidth = totalWidth / 2;
            const speed = 50; 
            const duration = singleWidth / speed;
            
            track.style.animationDuration = `${duration}s`;
        };

        // Guardar la función en el elemento para llamarla en resize
        track.rebuildMarquee = rebuildMarquee;

        // Ejecutar por primera vez
        rebuildMarquee();
    });

    // Recalcular y reajustar los clones al redimensionar la ventana (para pantallas ultra-anchas)
    window.addEventListener('resize', () => {
        tracks.forEach(track => {
            if (track.rebuildMarquee) {
                track.rebuildMarquee();
            }
        });
    });
});