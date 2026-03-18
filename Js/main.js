document.addEventListener('DOMContentLoaded', () => {

    // Inicialización de la librería AOS para animaciones al hacer scroll
    AOS.init();

    // Obtención de elementos del DOM
    const nav = document.getElementById('mainNav');
    const btnArriba = document.getElementById('btnArriba');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const typedTextElement = document.getElementById("typed-text");
    const readMoreBtn = document.getElementById('read-more-btn');
    const moreText = document.getElementById('more-text');
    const contactForm = document.getElementById('contactForm');
    const formResponse = document.getElementById('formResponse');
    const readMoreCardBtns = document.querySelectorAll('.read-more-card-btn');
    const detailsElements = document.querySelectorAll('details'); // <-- Variable unificada arriba

    // --- Lógica del Menú de Navegación Móvil ---
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }

    // --- Lógica de Scroll para Navbar y Botón "Volver Arriba" ---
    window.addEventListener('scroll', () => {
        // Añadir/quitar clase 'navbar-scrolled'
        if (window.scrollY > 50) {
            nav.classList.add('navbar-scrolled');
        } else {
            nav.classList.remove('navbar-scrolled');
        }

        // Mostrar/ocultar el botón "Volver Arriba"
        if (window.scrollY > 300) {
            btnArriba.style.display = 'flex';
        } else {
            btnArriba.style.display = 'none';
        }
    });

    // Lógica del botón "Volver Arriba"
    if (btnArriba) {
        btnArriba.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // --- Lógica de Scroll Suave ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = nav ? nav.offsetHeight : 0;
                window.scrollTo({
                    top: targetElement.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Efecto de Máquina de Escribir ---
    if (typedTextElement) {
        const phrases = [
            "Diseño web moderno.",
            "Gestión de redes sociales.",
            "Sitios optimizados para SEO."
        ];
        const typingDelay = 70;
        const eraseDelay = 30;
        const newPhraseDelay = 1000;
        let phraseIndex = 0;
        let charIndex = 0;

        const cursor = document.createElement('span');
        cursor.classList.add('typed-cursor');
        typedTextElement.appendChild(cursor);

        function type() {
            if (charIndex < phrases[phraseIndex].length) {
                typedTextElement.textContent = phrases[phraseIndex].substring(0, charIndex + 1);
                typedTextElement.appendChild(cursor);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                setTimeout(erase, newPhraseDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                typedTextElement.textContent = phrases[phraseIndex].substring(0, charIndex - 1);
                typedTextElement.appendChild(cursor);
                charIndex--;
                setTimeout(erase, eraseDelay);
            } else {
                phraseIndex++;
                if (phraseIndex >= phrases.length) {
                    phraseIndex = 0;
                }
                setTimeout(type, typingDelay + 500);
            }
        }
        
        setTimeout(type, newPhraseDelay);
    }
    
    // --- Lógica de "Ver Más" en la sección "Quiénes Somos" ---
    if (readMoreBtn && moreText) {
        readMoreBtn.addEventListener('click', () => {
            if (moreText.classList.contains('visible')) {
                moreText.classList.remove('visible');
                readMoreBtn.textContent = 'Ver más';
            } else {
                moreText.classList.add('visible');
                readMoreBtn.textContent = 'Ver menos';
            }
        });
    }

    // --- Lógica de "Ver Más" para las tarjetas de servicios ---
    readMoreCardBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.card');
            const hiddenText = card.querySelector('.hidden-text-card');

            if (hiddenText.classList.contains('visible')) {
                hiddenText.classList.remove('visible');
                event.target.textContent = 'Ver más';
            } else {
                hiddenText.classList.add('visible');
                event.target.textContent = 'Ver menos';
            }
        });
    });

    // --- Lógica de Preguntas Frecuentes (Cierra las otras al abrir una) ---
    detailsElements.forEach(details => {
        details.addEventListener('toggle', () => {
            if (details.open) {
                detailsElements.forEach(otherDetails => {
                    if (otherDetails !== details && otherDetails.open) {
                        otherDetails.removeAttribute('open');
                    }
                });
            }
        });
    });
    
    // --- Lógica y Validación del Formulario de Contacto ---
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formInputs = contactForm.querySelectorAll('input, textarea');
            let formIsValid = true;

            formInputs.forEach(input => {
                input.classList.remove('invalid');
                const formGroup = input.closest('.form-group');
                if (formGroup) formGroup.classList.remove('invalid');
            });

            formInputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    formIsValid = false;
                    const formGroup = input.closest('.form-group');
                    if (formGroup) formGroup.classList.add('invalid');
                }
            });

            // Si el formulario es válido, enviamos los datos con EmailJS
            if (formIsValid) {
                // 1. Cambiamos el texto del botón para que diga "Enviando..."
                const submitBtn = contactForm.querySelector('.submit-button');
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;

                // 2. Tomamos los datos que escribió el usuario en el formulario
                const templateParams = {
                    nombre: document.getElementById('nombre').value,
                    telefono: document.getElementById('telefono').value,
                    email: document.getElementById('email').value,
                    mensaje: document.getElementById('mensaje').value
                };

                // 3. Enviamos el correo usando tus credenciales de EmailJS
                emailjs.send('service_iluflaf', 'template_p36wghj', templateParams)
                    .then(() => {
                        // Si se envió bien, mostramos el mensaje de éxito
                        formResponse.innerHTML = `
                            <div class="success-message">
                                ¡Gracias por contactarnos! Te responderemos pronto.
                            </div>
                        `;

                        
                        contactForm.reset();
                    })
                    .catch((error) => {
                        // Si falló, mostramos un error en la consola y al usuario
                        console.error('Error al enviar:', error);
                        formResponse.innerHTML = `
                            <div class="invalid-feedback" style="display: block;">
                                Hubo un problema al enviar el mensaje. Por favor, intentá de nuevo.
                            </div>
                        `;
                    })
                    .finally(() => {
                        // 4. Volvemos el botón a la normalidad
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                    });
            } else {
                formResponse.innerHTML = ``;
            }
        });
    }
});


// --- Animación Hero tipo DonWeb ---
const heroAnimation = document.querySelector('.hero-animation');

if (heroAnimation) {
    function runAnimation() {
        // 1. Limpiamos cualquier rastro anterior
        heroAnimation.classList.remove('active');
        
        // 2. Pequeño delay de 500ms antes de arrancar (página vacía)
        setTimeout(() => {
            heroAnimation.classList.add('active');
        }, 500);

        // 3. Duración total del ciclo (por ejemplo 6 segundos)
        // El 'active' se quita antes de que empiece el siguiente ciclo
        setTimeout(() => {
            heroAnimation.classList.remove('active');
        }, 5500); 
    }

    // Arrancamos a los 2 segundos de que cargó la web (como pediste)
    setTimeout(runAnimation, 2000);

    // Repetimos el ciclo cada 7 segundos para dejar 1.5s de "página vacía"
    setInterval(runAnimation, 7000);
}
