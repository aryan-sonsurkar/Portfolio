// Boot Screen Management
document.addEventListener('DOMContentLoaded', function() {
    const bootScreen = document.getElementById('boot-screen');
    
    // Hide boot screen after boot sequence completes
    setTimeout(() => {
        bootScreen.style.opacity = '0';
        setTimeout(() => {
            bootScreen.style.display = 'none';
        }, 1000);
    }, 4000);
    
    // Initialize all systems
    initTypingEffect();
    initSmoothScrolling();
    initInteractiveElements();
    initCursorGlow();
    initInteractiveTerminal();
    initBackgroundEffects();
    initModalSystem();
    initEasterEggs();
});

// Typing Effect
function initTypingEffect() {
    const typedTextElement = document.querySelector('.typed-text');
    const text = 'I build systems that solve real problems.';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            typedTextElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        } else {
            // Restart typing effect after a pause
            setTimeout(() => {
                typedTextElement.textContent = '';
                index = 0;
                type();
            }, 3000);
        }
    }
    
    type();
}

// Smooth Scrolling
function initSmoothScrolling() {
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll to Section Function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Interactive Elements
function initInteractiveElements() {
    // Add hover sound effect (optional)
    const buttons = document.querySelectorAll('.terminal-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // Add subtle visual feedback
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('click', function() {
            // Add click effect
            this.style.transform = 'translateY(0) scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(0) scale(1)';
            }, 150);
        });
    });
    
    // Terminal hover effects
    const terminals = document.querySelectorAll('.terminal');
    terminals.forEach(terminal => {
        terminal.addEventListener('mouseenter', function() {
            // Add subtle glow effect
            this.style.boxShadow = '0 15px 40px rgba(0, 240, 255, 0.3)';
        });
        
        terminal.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 10px 30px rgba(0, 240, 255, 0.1)';
        });
    });
    
    // Project card interactions
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add hover animation
            this.style.transform = 'translateY(-8px) rotateX(2deg)';
            this.style.boxShadow = '0 20px 40px rgba(0, 240, 255, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
            this.style.boxShadow = '0 10px 25px rgba(0, 240, 255, 0.2)';
        });
    });
    
    // Skill card interactions
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 35px rgba(0, 240, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Mindset item interactions
    const mindsetItems = document.querySelectorAll('.mindset-item');
    mindsetItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(15px)';
            this.style.borderLeftColor = '#00ff41';
            this.style.color = '#00ff41';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.borderLeftColor = '#00f0ff';
            this.style.color = '#a0a0a0';
        });
    });
}

// Cursor Glow Effect
function initCursorGlow() {
    let cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(0, 240, 255, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.display = 'block';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });
}

// Scroll-based animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Terminal command simulation
function simulateCommand(command, output, element) {
    const commandElement = document.createElement('div');
    commandElement.className = 'command-simulation';
    commandElement.innerHTML = `
        <div class="command-line">
            <span class="prompt">$</span>
            <span class="command-text">${command}</span>
        </div>
        <div class="command-output">${output}</div>
    `;
    
    element.appendChild(commandElement);
    
    // Scroll to the new command
    commandElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'h' to go home
    if (e.key === 'h' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        scrollToSection('hero');
    }
    
    // Press 'p' to go to projects
    if (e.key === 'p' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        scrollToSection('projects');
    }
    
    // Press 'c' to go to contact
    if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        scrollToSection('contact');
    }
    
    // Press 'Escape' to simulate terminal exit
    if (e.key === 'Escape') {
        simulateCommand('exit', 'Connection closed.', document.querySelector('.terminal-body'));
    }
});

// Add parallax effect to hero section
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = heroSection.offsetTop;
        const speed = 0.5;
        
        if (scrolled < parallax + heroSection.offsetHeight) {
            heroSection.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });
}

// Initialize scroll animations when page loads
window.addEventListener('load', () => {
    initScrollAnimations();
    initParallaxEffect();
});

// Add glitch effect on hover for main title
const glitchText = document.querySelector('.glitch-text');
if (glitchText) {
    glitchText.addEventListener('mouseenter', function() {
        this.style.animation = 'glitch 0.3s infinite';
    });
    
    glitchText.addEventListener('mouseleave', function() {
        this.style.animation = 'glitch 2s infinite';
    });
}

// Add typing effect to contact commands
const contactCommands = document.querySelectorAll('.command');
contactCommands.forEach((command, index) => {
    command.style.opacity = '0';
    command.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        command.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        command.style.opacity = '1';
        command.style.transform = 'translateX(0)';
    }, 1000 + (index * 200));
});

// Add dynamic year to footer if needed
function updateYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

updateYear();

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
const optimizedScrollHandler = debounce(() => {
    // Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Add loading state for images
function initImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
}

// Console Easter Egg
console.log('%c🔥 ARS System Initialized 🔥', 'color: #00f0ff; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to my terminal portfolio!', 'color: #00ff41; font-size: 14px;');
console.log('%cType "help" in the console for available commands...', 'color: #ffaa00; font-size: 12px;');

// Add fake console commands
window.help = function() {
    console.log('%cAvailable Commands:', 'color: #00f0ff; font-weight: bold;');
    console.log('%c- about(): Learn about Aryan Sonsurkar', 'color: #00ff41;');
    console.log('%c- projects(): View project list', 'color: #00ff41;');
    console.log('%c- skills(): Display technical skills', 'color: #00ff41;');
    console.log('%c- contact(): Get contact information', 'color: #00ff41;');
};

window.about = function() {
    console.log('%cAryan Sonsurkar (ARS)', 'color: #00f0ff; font-weight: bold;');
    console.log('%cFull Stack Developer | Python Developer | Future ML Engineer', 'color: #00ff41;');
    console.log('%c"I adapt fast, solve real problems, and find a way to win in any situation."', 'color: #ffaa00; font-style: italic;');
};

window.projects = function() {
    console.log('%cFeatured Project: Draco CLI', 'color: #00f0ff; font-weight: bold;');
    console.log('%cAI-powered developer assistant with screen OCR and auto-debugging', 'color: #00ff41;');
    console.log('%cStatus: Startup in Progress', 'color: #ffaa00;');
};

window.skills = function() {
    console.log('%cLanguages: Python, C, Embedded C', 'color: #00f0ff;');
    console.log('%cWeb: HTML, CSS, Flask', 'color: #00ff0ff;');
    console.log('%cConcepts: System Design, Automation, Networking, AI Integration', 'color: #00f0ff;');
};

window.contact = function() {
    console.log('%cEmail: aryansonsurkar87@gmail.com', 'color: #00f0ff;');
    console.log('%cGitHub: https://github.com/aryan-sonsurkar', 'color: #00f0ff;');
    console.log('%cLinkedIn: https://www.linkedin.com/in/aryan-sonsurkar/', 'color: #00f0ff;');
};

// Initialize help command
help();

// Interactive Terminal System
function initInteractiveTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    if (!terminalInput || !terminalOutput) return;
    
    const commands = {
        help: () => {
            return `Available commands:
  help     - Show this help message
  about    - Scroll to about section
  projects - Scroll to projects section
  skills   - Scroll to skills section
  contact  - Scroll to contact section
  status   - Show system status
  clear    - Clear terminal
  sudo     - Access privileged commands`;
        },
        about: () => {
            scrollToSection('about');
            return 'Navigating to About section...';
        },
        projects: () => {
            scrollToSection('projects');
            return 'Navigating to Projects section...';
        },
        skills: () => {
            scrollToSection('skills');
            return 'Navigating to Skills section...';
        },
        contact: () => {
            scrollToSection('contact');
            return 'Navigating to Contact section...';
        },
        status: () => {
            return `System Status:
  AI Systems: ACTIVE
  Automation Modules: LOADED
  Projects: DEPLOYED
  Security: ENHANCED
  Ready for opportunities: YES`;
        },
        clear: () => {
            terminalOutput.innerHTML = '';
            return null;
        },
        sudo: () => {
            return 'Access level insufficient... yet.';
        }
    };
    
    terminalInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const input = this.value.trim().toLowerCase();
            if (input) {
                // Add command to output
                addTerminalOutput(`ars@system:~$ ${input}`);
                
                // Execute command
                if (commands[input]) {
                    const output = commands[input]();
                    if (output) {
                        addTerminalOutput(output);
                    }
                } else {
                    addTerminalOutput(`Command not found: ${input}. Type 'help' for available commands.`);
                }
                
                // Clear input
                this.value = '';
            }
        }
    });
    
    function addTerminalOutput(text) {
        const line = document.createElement('div');
        line.textContent = text;
        line.style.marginBottom = '5px';
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    // Initial welcome message
    setTimeout(() => {
        addTerminalOutput('ARS Terminal v2.0 - Type "help" for commands');
    }, 4500);
}

// Background Effects
function initBackgroundEffects() {
    // Create floating particles
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 20; i++) {
        createParticle();
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        
        particlesContainer.appendChild(particle);
        
        // Remove and recreate after animation
        setTimeout(() => {
            particle.remove();
            createParticle();
        }, 20000);
    }
}

// Modal System
function initModalSystem() {
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('draco-modal');
        if (e.target === modal) {
            closeDracoModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDracoModal();
        }
    });
}

function showDracoConcept() {
    const modal = document.getElementById('draco-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeDracoModal() {
    const modal = document.getElementById('draco-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function requestDracoAccess() {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-blue);
        color: var(--primary-bg);
        padding: 15px 25px;
        border-radius: 8px;
        font-family: 'Fira Code', monospace;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = 'Access request received. We will contact you soon!';
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Easter Eggs
function initEasterEggs() {
    let konamiCode = [];
    const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', function(e) {
        // Konami Code
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === secretCode.join(',')) {
            activateEasterEgg();
        }
        
        // Special terminal commands
        if (e.ctrlKey && e.shiftKey && e.key === 'H') {
            e.preventDefault();
            showHiddenMessage();
        }
    });
}

function activateEasterEgg() {
    document.body.style.animation = 'glitch 0.5s infinite';
    setTimeout(() => {
        document.body.style.animation = '';
        showEasterEggMessage();
    }, 2000);
}

function showEasterEggMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--terminal-bg);
        border: 2px solid var(--accent-green);
        padding: 30px;
        border-radius: 12px;
        font-family: 'Fira Code', monospace;
        color: var(--accent-green);
        z-index: 3000;
        text-align: center;
        box-shadow: 0 0 50px var(--accent-green);
    `;
    message.innerHTML = `
        <h2 style="margin-bottom: 15px;">🎉 SECRET UNLOCKED!</h2>
        <p>You found the Konami Code!</p>
        <p style="margin-top: 10px; font-size: 14px;">You're a true hacker!</p>
        <button onclick="this.parentElement.remove()" style="
            margin-top: 20px;
            background: var(--accent-green);
            color: var(--primary-bg);
            border: none;
            padding: 10px 20px;
            font-family: 'Fira Code', monospace;
            cursor: pointer;
            border-radius: 4px;
        ">Close</button>
    `;
    
    document.body.appendChild(message);
}

function showHiddenMessage() {
    console.log('%c🔥 SECRET SYSTEMS ACTIVATED 🔥', 'color: #ff0040; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #ff0040;');
    console.log('%cYou found the hidden developer commands!', 'color: #00f0ff; font-size: 14px;');
    console.log('%cTry typing: window.secretCommands()', 'color: #00ff41; font-size: 12px;');
}

// Add secret commands
window.secretCommands = function() {
    console.log('%cSECRET COMMANDS:', 'color: #ff0040; font-weight: bold;');
    console.log('%c- matrix(): Enable matrix rain effect', 'color: #00f0ff;');
    console.log('%c- hack(): Simulate hacking sequence', 'color: #00f0ff;');
    console.log('%c- godmode(): Enable god mode', 'color: #00f0ff;');
};

window.matrix = function() {
    console.log('%cMatrix rain effect activated! (Visual only)', 'color: #00ff41;');
    document.body.style.filter = 'hue-rotate(120deg)';
    setTimeout(() => {
        document.body.style.filter = '';
    }, 3000);
};

window.hack = function() {
    const hackSequence = [
        'Initializing hack protocol...',
        'Bypassing firewall...',
        'Accessing mainframe...',
        'Extracting data...',
        'Covering tracks...',
        'Hack complete! 😉'
    ];
    
    hackSequence.forEach((line, index) => {
        setTimeout(() => {
            console.log(`%c${line}`, 'color: #00ff41;');
        }, index * 500);
    });
};

window.godmode = function() {
    console.log('%c🚀 GOD MODE ACTIVATED 🚀', 'color: #ff0040; font-size: 20px; font-weight: bold; text-shadow: 0 0 20px #ff0040;');
    console.log('%cYou now have unlimited access to all systems!', 'color: #00f0ff;');
};

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
