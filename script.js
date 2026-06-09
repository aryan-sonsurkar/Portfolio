const bootScreen = document.getElementById('boot-screen');

window.addEventListener('DOMContentLoaded', () => {
    if (bootScreen) {
        setTimeout(() => {
            if (bootScreen.parentNode && !isVoiceEnabled) {
                bootScreen.classList.add('hide');
                setTimeout(() => bootScreen.remove(), 1000);
            }
        }, 6000);
    }

    initProgressBar();
    initInteractiveTerminal();
    initHUDScrollSync();
    initNeuralCanvas();
    initHUDTilt();
    initHeroStats();
    initSystemLogs(); 
    initBackgroundEffects();
    initScrollReveal();
    initModalSystem();
    initEasterEggs();
    initCursorGlow();
    initGlitchHover();
    initVoiceAssistant();
    initNeuralFeed();
});

let isVoiceEnabled = false;
let lastSpokenSection = '';

function initVoiceAssistant() {
    // Unlock speech on first click
    window.addEventListener('click', () => {
        if (!isVoiceEnabled && lastSpokenSection === '') {
            // Optional: Auto-enable on first click if you want, 
            // but better to let user toggle.
        }
    }, { once: true });
}

const sectionScripts = {
    hero: "Welcome to ARS System. I am Aryan Sonsurkar, a full stack developer and founder of Fixly.",
    experience: "Here are my professional experience and achievements, including my internship at Kaevron Technologies and client projects.",
    building: "This is what I am currently building. Fixly, CodeShortsBot v2, and my ongoing learning journey.",
    projects: "Here are my featured projects. Fixly, Vishwanath Insurance website, and CodeShortsBot.",
    skills: "These are my technical skills spanning frontend, backend, AI and automation, and tools.",
    journey: "This is my developer journey from starting to code to shipping real products.",
    contact: "Connection protocols established. Feel free to reach out via email or LinkedIn."
};

function toggleVoice() {
    isVoiceEnabled = !isVoiceEnabled;
    const toggle = document.getElementById('voice-toggle');
    if (toggle) {
        toggle.querySelector('.hud-icon').innerHTML = isVoiceEnabled ? '&#128266;' : '&#128263;';
        toggle.querySelector('.hud-label').textContent = isVoiceEnabled ? 'VOICE: ON' : 'VOICE: OFF';
        
        if (isVoiceEnabled) {
            speak("Voice assistant activated.");
            // Speak current section
            if (lastSpokenSection) speak(sectionScripts[lastSpokenSection]);
        } else {
            window.speechSynthesis.cancel();
        }
    }
}

function speak(text) {
    if (!isVoiceEnabled) return;
    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.9; // Slightly lower for a "system" feel
    window.speechSynthesis.speak(utterance);
}

function initNeuralFeed() {
    const feed = document.getElementById('neural-activity-stream');
    if (!feed) return;

    const events = [
        "Analyzing project node: Fixly",
        "Optimizing neural network weights",
        "SIH 2025 reward protocol active",
        "OCR engine confidence: 98.4%",
        "New commit: Draco CLI core",
        "Scanning for system vulnerabilities",
        "ML model training in progress",
        "Syncing local Ollama instance",
        "Marketing strategy node: EDP Committee",
        "Building student-first assistants"
    ];

    function createFeedItem() {
        const time = new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const text = events[Math.floor(Math.random() * events.length)];
        
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <span class="activity-time">[${time}]</span>
            <span class="activity-text">${text}</span>
        `;
        
        feed.prepend(item);
        if (feed.children.length > 20) {
            feed.lastElementChild.remove();
        }
    }

    // Initial fill
    for (let i = 0; i < 15; i++) {
        createFeedItem();
    }

    setInterval(createFeedItem, 3000);
}

function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 60;
    const connectionDistance = isMobile ? 100 : 150;
    const mouse = { x: null, y: null, radius: isMobile ? 100 : 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Mouse push
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
            }
        }

        draw() {
            ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();
}

function initHUDTilt() {
    const terminals = document.querySelectorAll('.terminal');
    
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;
        
        terminals.forEach(terminal => {
            const rect = terminal.getBoundingClientRect();
            const termCenterX = rect.left + rect.width / 2;
            const termCenterY = rect.top + rect.height / 2;
            
            // Only tilt if somewhat in view
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const rotateY = moveX * 5; // Max 5 degrees
                const rotateX = -moveY * 5;
                terminal.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            }
        });
    });
}

function initSystemLogs() {
    const logFeed = document.getElementById('log-feed');
    if (!logFeed) return;

    const sectionLogs = {
        hero: ["Initializing ARS Environment...", "System Core: Active", "Ready for commands"],
        experience: ["Loading experience data...", "Internship records: Synced", "Project deliveries: Logged"],
        building: ["Scanning active builds...", "Fixly core: In progress", "Learning modules: Active"],
        projects: ["Accessing project repository...", "Fixly core: Active", "Client sites: Deployed"],
        skills: ["Analyzing technical stack...", "Frontend modules: Loaded", "AI pipelines: Optimized"],
        journey: ["Retrieving development timeline...", "Milestones: Documented"],
        contact: ["Establishing secure comms...", "Connection protocols: Ready", "Waiting for input..."]
    };

    let currentSection = 'hero';
    
    window.addEventListener('scroll', () => {
        const sections = ['hero', 'experience', 'building', 'projects', 'skills', 'journey', 'contact'];
        sections.forEach(s => {
            const el = document.getElementById(s);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                    if (currentSection !== s) {
                        currentSection = s;
                        updateLogFeed();
                        if (isVoiceEnabled && lastSpokenSection !== s) {
                            speak(sectionScripts[s]);
                        }
                        lastSpokenSection = s;
                    }
                }
            }
        });
    });

    function updateLogFeed() {
        const logs = sectionLogs[currentSection] || sectionLogs['hero'];
        let i = 0;
        logFeed.innerHTML = `<span class="log-item">${logs[i]}</span>`;
    }

    updateLogFeed();

    // Randomize System Badges
    const badges = document.querySelectorAll('.sys-badge');
    setInterval(() => {
        badges.forEach(badge => {
            if (badge.textContent.includes('CPU')) {
                badge.textContent = `CPU: ${Math.floor(Math.random() * 15 + 5)}%`;
            }
            if (badge.textContent.includes('MEM')) {
                badge.textContent = `MEM: ${(Math.random() * 0.5 + 1.0).toFixed(1)}GB`;
            }
        });
    }, 3000);
}

function initProgressBar() {
    const progress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progress.style.width = scrolled + "%";
    });
}

function initHeroStats() {
    // Session ID randomizer
    const sessionElement = document.getElementById('session-id');
    if (sessionElement) {
        const randomHex = '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
        sessionElement.textContent = randomHex;
    }

    // Uptime counter
    const uptimeElement = document.getElementById('uptime');
    if (uptimeElement) {
        let seconds = 0;
        setInterval(() => {
            seconds++;
            const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            uptimeElement.textContent = `${h}:${m}:${s}`;
        }, 1000);
    }
}

function initInteractiveTerminal() {
    const input = document.getElementById('hero-terminal-input');
    const output = document.getElementById('hero-terminal-output');
    if (!input || !output) return;

    // Greeting
    const hour = new Date().getHours();
    let greeting = "Good Evening";
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";

    output.innerHTML = `<div class="output-line success">> [SYSTEM] ${greeting}, User.</div>
                        <div class="output-line">> Initializing personalized session...</div>
                        <div class="output-line">Type 'help' to see available commands.</div>`;

    const commands = {
        help: "Available: experience, building, projects, skills, journey, contact, clear, whoami, ls",
        whoami: "Aryan Sonsurkar | Full Stack Developer | Founder of Fixly",
        ls: "experience.log, building.exe, projects.txt, skills.log, journey.md, contact.url",
        experience: () => scrollToSection('experience'),
        building: () => scrollToSection('building'),
        projects: () => scrollToSection('projects'),
        skills: () => scrollToSection('skills'),
        journey: () => scrollToSection('journey'),
        contact: () => scrollToSection('contact'),
        clear: () => { output.innerHTML = ''; return ""; }
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            input.value = '';
            
            // Echo command
            const echo = document.createElement('div');
            echo.className = 'output-line command-echo';
            echo.textContent = `ars@system:~$ ${cmd}`;
            output.appendChild(echo);

            if (cmd in commands) {
                const result = commands[cmd];
                if (typeof result === 'function') {
                    result();
                    const line = document.createElement('div');
                    line.className = 'output-line success';
                    line.textContent = `Executing ${cmd}...`;
                    output.appendChild(line);
                } else if (result !== "") {
                    const line = document.createElement('div');
                    line.className = 'output-line';
                    line.textContent = result;
                    output.appendChild(line);
                }
            } else if (cmd !== "") {
                const line = document.createElement('div');
                line.className = 'output-line error';
                line.textContent = `Command not found: ${cmd}. Type 'help' for assistance.`;
                output.appendChild(line);
            }

            output.scrollTop = output.scrollHeight;
        }
    });

    // Focus input on terminal click
    document.querySelector('.hero-terminal').addEventListener('click', () => {
        input.focus();
    });
}

function initHUDScrollSync() {
    const sections = document.querySelectorAll('section');
    const hudItems = document.querySelectorAll('.hud-item');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        hudItems.forEach(item => {
            item.classList.remove('active');
            const target = item.getAttribute('onclick').match(/'([^']+)'/)[1];
            if (target === current) {
                item.classList.add('active');
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function initBackgroundEffects() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const count = window.innerWidth < 768 ? 10 : 22;
    for (let i = 0; i < count; i += 1) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 5 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = `${Math.random() * 0.18 + 0.08}`;
        particle.style.animationDuration = `${Math.random() * 16 + 14}s`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particlesContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
            createParticle();
        }, 30000);
    }
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('section, .project-card, .project-card-body, .skill-card, .timeline-item, .experience-card, .building-card, .command-item, .achievement-premium');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

    revealElements.forEach((element) => {
        element.classList.add('reveal');
        observer.observe(element);
    });
}

function initModalSystem() {
    window.addEventListener('click', (event) => {
        const dracoModal = document.getElementById('draco-modal');
        const accessModal = document.getElementById('access-modal');
        if (dracoModal && event.target === dracoModal) closeDracoModal();
        if (accessModal && event.target === accessModal) closeAccessModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeDracoModal();
            closeAccessModal();
        }
    });
}

function showDracoConcept() {
    const modal = document.getElementById('draco-modal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeDracoModal() {
    const modal = document.getElementById('draco-modal');
    if (!modal) return;
    modal.classList.remove('open');
    if (!document.getElementById('access-modal').classList.contains('open')) {
        document.body.style.overflow = 'auto';
    }
}

function requestDracoAccess() {
    const modal = document.getElementById('access-modal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeAccessModal() {
    const modal = document.getElementById('access-modal');
    if (!modal) return;
    modal.classList.remove('open');
    if (!document.getElementById('draco-modal').classList.contains('open')) {
        document.body.style.overflow = 'auto';
    }
}

function updateContactPlaceholder() {
    const method = document.querySelector('input[name="contact-method"]:checked').value;
    const input = document.getElementById('user-contact');
    if (method === 'email') {
        input.placeholder = "Enter your email address";
        input.type = "email";
    } else {
        input.placeholder = "Enter your phone number";
        input.type = "tel";
    }
}

function submitAccessRequest(event) {
    event.preventDefault();
    
    // Capture data (This would normally be sent to a backend)
    const formData = {
        name: document.getElementById('user-name').value,
        purpose: document.getElementById('user-purpose').value,
        interest: document.getElementById('user-interest').value,
        method: document.querySelector('input[name="contact-method"]:checked').value,
        contact: document.getElementById('user-contact').value
    };

    console.log("Access Request Captured:", formData);

    // Terminal-style success feedback
    const submitBtn = document.querySelector('.submit-form-btn span');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = "UPLOADING_DATA...";
    
    setTimeout(() => {
        submitBtn.textContent = "ACCESS_GRANTED_PENDING_REVIEW";
        submitBtn.parentElement.style.borderColor = "var(--accent-green)";
        submitBtn.parentElement.style.color = "var(--accent-green)";
        
        setTimeout(() => {
            closeAccessModal();
            // Reset form
            document.getElementById('access-form').reset();
            submitBtn.textContent = originalText;
            submitBtn.parentElement.style.borderColor = "";
            submitBtn.parentElement.style.color = "";
            
            // Show toast
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.textContent = 'Application transmitted successfully. Review in progress.';
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'toastOut 0.25s ease forwards';
                setTimeout(() => toast.remove(), 250);
            }, 3000);
        }, 2000);
    }, 1500);
}

function initEasterEggs() {
    const secretSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let buffer = [];

    document.addEventListener('keydown', (event) => {
        buffer.push(event.key);
        buffer = buffer.slice(-secretSequence.length);
        if (buffer.join(',') === secretSequence.join(',')) activateEasterEgg();

        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'h') {
            event.preventDefault();
            showHiddenMessage();
        }
    });
}

function activateEasterEgg() {
    document.body.classList.add('glitch-mode');
    setTimeout(() => {
        document.body.classList.remove('glitch-mode');
        showEasterEggMessage();
    }, 2200);
}

function showEasterEggMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(3, 10, 18, 0.98);
        border: 1px solid rgba(72, 255, 183, 0.28);
        padding: 28px;
        border-radius: 18px;
        color: var(--accent-green);
        z-index: 12000;
        min-width: 320px;
        text-align: center;
        box-shadow: 0 0 60px rgba(72, 255, 183, 0.2);
    `;

    message.innerHTML = `
        <h2 style="margin-bottom: 14px;">?? SECRET UNLOCKED!</h2>
        <p>You found the Konami Code!</p>
        <button style="margin-top: 20px; background: var(--accent-green); color: #020408; border: none; padding: 12px 20px; border-radius: 999px; cursor: pointer;">Close</button>
    `;

    message.querySelector('button').addEventListener('click', () => message.remove());
    document.body.appendChild(message);
}

function showHiddenMessage() {
    console.log('%c?? SECRET SYSTEMS ACTIVATED ??', 'color: #ff0040; font-size: 18px; font-weight: bold;');
    console.log('%cYou found the hidden developer commands!', 'color: #00f0ff; font-size: 14px;');
    console.log('%cTry typing: window.secretCommands()', 'color: #00ff41; font-size: 12px;');
}

window.secretCommands = function() {
    console.log('%cSECRET COMMANDS:', 'color: #ff0040; font-weight: bold;');
    console.log('%c- matrix(): Enable matrix rain effect', 'color: #00f0ff;');
    console.log('%c- hack(): Simulate hacking sequence', 'color: #00f0ff;');
    console.log('%c- godmode(): Enable god mode', 'color: #00f0ff;');
};

window.matrix = function() {
    console.log('%cMatrix rain effect activated! (Visual only)', 'color: #00ff41;');
    document.body.style.filter = 'hue-rotate(120deg)';
    setTimeout(() => { document.body.style.filter = ''; }, 2600);
};

window.hack = function() {
    const sequence = [
        'Initializing hack protocol...',
        'Bypassing firewall...',
        'Accessing mainframe...',
        'Extracting data...',
        'Covering tracks...',
        'Hack complete! ??'
    ];

    sequence.forEach((line, index) => {
        setTimeout(() => {
            console.log(`%c${line}`, 'color: #00ff41;');
        }, index * 450);
    });
};

window.godmode = function() {
    console.log('%c?? GOD MODE ACTIVATED ??', 'color: #ff0040; font-size: 20px; font-weight: bold;');
    console.log('%cYou now have unlimited access to all systems!', 'color: #00f0ff;');
};

function initCursorGlow() {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 24px;
        height: 24px;
        background: radial-gradient(circle, rgba(0, 240, 255, 0.28) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (event) => {
        cursor.style.left = `${event.clientX - 12}px`;
        cursor.style.top = `${event.clientY - 12}px`;
        cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
}

function initGlitchHover() {
    const glitchText = document.querySelector('.glitch-text');
    if (!glitchText) return;

    glitchText.addEventListener('mouseenter', () => {
        glitchText.style.animation = 'glitch 0.3s infinite';
    });

    glitchText.addEventListener('mouseleave', () => {
        glitchText.style.animation = 'glitch 3s infinite';
    });
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'h' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        scrollToSection('hero');
    }
    if (event.key === 'p' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        scrollToSection('projects');
    }
    if (event.key === 'c' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        scrollToSection('contact');
    }
    if (event.key === 's' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        scrollToSection('skills');
    }
    if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        const input = document.getElementById('hero-terminal-input');
        if (input) {
            scrollToSection('hero');
            input.focus();
        }
    }
});

window.experience = function() {
    console.log('%cAryan Sonsurkar (ARS)', 'color: #00f0ff; font-weight: bold;');
    console.log('%cFull Stack Developer | Founder of Fixly | Best Performing Intern @ Kaevron', 'color: #00ff41;');
    console.log('%cSecond-year CS student already shipping real products and delivering client work.', 'color: #ffaa00;');
};

window.projects = function() {
    console.log('%cFeatured Projects:', 'color: #00f0ff; font-weight: bold;');
    console.log('%cFixly - AI Student Productivity Platform (Beta)', 'color: #00ff41;');
    console.log('%cVishwanath Insurance - Client Website (Live)', 'color: #00ff41;');
    console.log('%cCodeShortsBot v2 - AI Content Pipeline', 'color: #00ff41;');
};

window.skills = function() {
    console.log('%cFrontend: HTML, CSS, JavaScript, Next.js', 'color: #00f0ff;');
    console.log('%cBackend: Python, FastAPI, APIs', 'color: #00ff41;');
    console.log('%cAI & Automation: Ollama, Playwright, Automation Pipelines', 'color: #00ff41;');
    console.log('%cTools: Git, GitHub, Vercel, SQLite, FFmpeg', 'color: #00ff41;');
};

window.contact = function() {
    console.log('%cEmail: aryansonsurkar87@gmail.com', 'color: #00f0ff;');
    console.log('%cGitHub: https://github.com/aryan-sonsurkar', 'color: #00f0ff;');
    console.log('%cLinkedIn: https://www.linkedin.com/in/aryan-sonsurkar/', 'color: #00f0ff;');
};

function copyEmail() {
    const email = "aryansonsurkar87@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        showToast("Email copied to clipboard!");
    });
}

function showResumeComingSoon() {
    showToast("Resume coming soon. Check back shortly.");
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.25s ease forwards';
        setTimeout(() => toast.remove(), 250);
    }, 3000);
}

console.log('%cARS System Initialized', 'color: #00f0ff; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to the terminal portfolio!', 'color: #00ff41; font-size: 14px;');
console.log('%cEnter a command or use the buttons above.', 'color: #ffaa00; font-size: 12px;');
