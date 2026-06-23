document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    // --- 1. Traducciones e Internacionalización (i18n) ---
    const translations = {
        es: {
            "nav.home": "Inicio",
            "nav.skills": "Habilidades",
            "nav.projects": "Proyectos",
            "nav.contact": "Contacto",
            "hero.tag": "[ ESTADO: ACTIVO // PORTFOLIO_V2.6 ]",
            "hero.title": "Hola, soy Andres Ansorge",
            "hero.subtitle": "Soy un ingeniero de software que busca aprender nuevas tecnologías y utilizo IA para construir proyectos.",
            "hero.scroll": "DESPLAZAR_PARA_EXPLORAR ⬇",
            "skills.title": "Habilidades",
            "skills.subtitle": "Tecnologías que domino o estoy aprendiendo",
            "skills.fe_title": "DESARROLLO FRONT-END",
            "skills.be_title": "DESARROLLO BACK-END",
            "skills.db_title": "BASES DE DATOS & SQL",
            "skills.ml": "Aprendizaje Automático",
            "projects.title": "Proyectos",
            "projects.p1.title": "Proyecto de WebDevAI con Flask",
            "projects.p1.desc": "Desarrollé una plataforma de chatbot para código usando Python y Flask, integrando una API de Gemini para que pudiera resolver dudas sobre código.",
            "projects.p1.btn_code": "Código",
            "projects.p1.btn_live": "Ver Proyecto",
            "projects.p2.title": "Hub of Commands",
            "projects.p2.desc": "Una aplicación de comandos de varias aplicaciones como git, docker, linux.",
            "projects.p2.btn_code": "Código",
            "projects.p2.btn_live": "Ver Proyecto",
            "contact.title": "Contacto",
            "contact.desc": "Estoy siempre abierto a nuevas oportunidades y colaboraciones. ¡No dudes en contactarme!",
            "contact.email_label": "Email: ",
            "footer.copy": "© 2026 Andres Ansorge."
        },
        en: {
            "nav.home": "Home",
            "nav.skills": "Skills",
            "nav.projects": "Projects",
            "nav.contact": "Contact",
            "hero.tag": "[ STATUS: ACTIVE // PORTFOLIO_V2.6 ]",
            "hero.title": "Hi, I'm Andres Ansorge",
            "hero.subtitle": "I'm a software engineer trying to learn new technologies and I use an AI to build projects.",
            "hero.scroll": "SCROLL_TO_EXPLORE ⬇",
            "skills.title": "Skills",
            "skills.subtitle": "Technologies I'm proficient in or learning",
            "skills.fe_title": "FRONT-END DEVELOPMENT",
            "skills.be_title": "BACK-END DEVELOPMENT",
            "skills.db_title": "DATABASES & SQL",
            "skills.ml": "Machine Learning",
            "projects.title": "Projects",
            "projects.p1.title": "WebDevAI Project with Flask",
            "projects.p1.desc": "I developed a chatbot platform for code using Python and Flask, integrating a Gemini API to answer coding questions.",
            "projects.p1.btn_code": "Code",
            "projects.p1.btn_live": "Live Demo",
            "projects.p2.title": "Hub of Commands",
            "projects.p2.desc": "A command reference application for various tools like Git, Docker, Linux.",
            "projects.p2.btn_code": "Code",
            "projects.p2.btn_live": "Live Demo",
            "contact.title": "Contact",
            "contact.desc": "I'm always open to new opportunities and collaborations. Feel free to contact me!",
            "contact.email_label": "Email: ",
            "footer.copy": "© 2026 Andres Ansorge."
        }
    };

    function applyTranslations(lang) {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                const icon = element.querySelector('i');
                if (icon) {
                    const iconHTML = icon.outerHTML;
                    element.innerHTML = `${iconHTML} ${translations[lang][key]}`;
                } else {
                    element.innerHTML = translations[lang][key];
                }
            }
        });
    }

    // Auto-detectar idioma del navegador
    const userLang = (navigator.language || navigator.userLanguage).substring(0, 2);
    const activeLang = translations[userLang] ? userLang : 'es'; // Por defecto español
    applyTranslations(activeLang);


    // --- 2. Cargar preferencia de tema (por defecto oscuro) ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light-mode') {
        body.classList.add('light-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        body.classList.remove('light-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // --- 3. Toggle de tema ---
    if (themeToggle && themeIcon) {
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
    }

    // --- 4. Navbar que se adapta al scroll ---
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- 5. Smooth scrolling para los enlaces de la navbar ---
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Validar que sea un ID de sección interna para evitar romper con links externos
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement && navbar) {
                    const navbarHeight = navbar.offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - navbarHeight - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    // --- 6. Carrusel de Habilidades "En Cadena" Infinito y Dinámico ---
    const tracks = document.querySelectorAll('.skills-track');
    
    tracks.forEach((track, index) => {
        if (!track.originalHTML) {
            track.originalHTML = track.innerHTML;
        }

        const rebuildMarquee = () => {
            track.innerHTML = track.originalHTML;
            
            const originalItems = Array.from(track.querySelectorAll('.skill-logo-item'));
            if (originalItems.length === 0) return;

            const initialWidth = track.scrollWidth;
            const minWidthNeeded = window.innerWidth * 1.5;
            let multiplier = 1;
            if (initialWidth < minWidthNeeded) {
                multiplier = Math.ceil(minWidthNeeded / initialWidth);
            }

            const baseItems = originalItems.map(item => item.cloneNode(true));
            track.innerHTML = '';

            for (let i = 0; i < multiplier; i++) {
                baseItems.forEach(item => {
                    const node = item.cloneNode(true);
                    track.appendChild(node);
                });
            }

            const currentItems = Array.from(track.children);
            currentItems.forEach(item => {
                const clone = item.cloneNode(true);
                clone.classList.add('cloned');
                track.appendChild(clone);
            });

            const totalWidth = track.scrollWidth;
            const singleWidth = totalWidth / 2;
            
            // Asignar velocidades diferentes (40, 50 y 60 px/s) para evitar que vayan en paralelo
            const speeds = [40, 50, 60];
            const speed = speeds[index % speeds.length];
            const duration = singleWidth / speed;
            
            track.style.animationDuration = `${duration}s`;
        };

        track.rebuildMarquee = rebuildMarquee;
        rebuildMarquee();
    });

    // --- 7. Optimización de Resize (Debounce para evitar Layout Thrashing) ---
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            tracks.forEach(track => {
                if (track.rebuildMarquee) {
                    track.rebuildMarquee();
                }
            });
        }, 250);
    });
});