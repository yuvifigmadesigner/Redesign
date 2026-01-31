import React, { useEffect, useRef, useState } from 'react';
import { Instagram, Linkedin, Copy, Check } from 'lucide-react';
import Matter from 'matter-js';
import { WEBSITE_CONTENT } from '../constants';

const FooterContact = () => {
    const [copied, setCopied] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const engineRef = useRef<Matter.Engine | null>(null);
    const email = WEBSITE_CONTENT.footer.email;

    const copyEmail = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Define the items to drop
    const items = [
        { id: 'guitar', content: <div className="text-5xl drop-shadow-lg">🎸</div> },
        { id: 'mushroom', content: <div className="text-4xl drop-shadow-md">🍄</div> },
        { id: 'shoe', content: <div className="text-4xl drop-shadow-md">👟</div> },
        {
            id: 'drag-play',
            content: <div className="font-mono text-[10px] font-bold tracking-widest uppercase text-neutral-400 bg-white/50 px-2 py-1 rounded border border-neutral-200 backdrop-blur-sm">DRAG & PLAY</div>
        },
        { id: 'memoji', content: <div className="text-6xl filter drop-shadow-2xl">👨‍💻</div> },
        { id: 'star', content: <div className="text-4xl opacity-80">✨</div> },
        { id: 'fire', content: <div className="text-4xl">🔥</div> },
        { id: 'bulb', content: <div className="text-4xl">💡</div> },
    ];

    useEffect(() => {
        if (!containerRef.current) return;

        // 1. Setup Matter.js
        const Engine = Matter.Engine;
        const Render = Matter.Render;
        const World = Matter.World;
        const Bodies = Matter.Bodies;
        const Mouse = Matter.Mouse;
        const MouseConstraint = Matter.MouseConstraint;
        const Composite = Matter.Composite;

        const engine = Engine.create();
        engineRef.current = engine;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 2. Create Walls (Static)
        // Make walls thicker and positioned just outside visible area to prevent tunneling
        const wallOptions = { isStatic: true, render: { visible: false } };
        const ground = Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions);
        const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 2, wallOptions);
        const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 2, wallOptions);

        // 3. Create Bodies for Items
        const bodies: Matter.Body[] = [];

        items.forEach((item, index) => {
            const el = itemRefs.current.get(item.id);
            if (el) {
                // Get accurate dimensions
                const { width: w, height: h } = el.getBoundingClientRect();

                // Random start position at top
                const x = Math.random() * (width - 100) + 50;
                const y = -Math.random() * 500 - 50; // Staggered drop height

                const body = Bodies.rectangle(x, y, w, h, {
                    restitution: 0.5, // Bounciness
                    friction: 0.1,
                    density: 0.04,
                    angle: Math.random() * Math.PI, // Random initial rotation
                    label: item.id // Bind body to ID
                });

                bodies.push(body);
            }
        });

        World.add(engine.world, [ground, leftWall, rightWall, ...bodies]);

        // 4. Mouse Control
        const mouse = Mouse.create(container);

        // Fix: Remove wheel listeners to prevent blocking page scroll
        mouse.element.removeEventListener("mousewheel", mouse.mousewheel as any);
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel as any);
        mouse.element.removeEventListener("wheel", mouse.mousewheel as any);

        // Fix: Allow page scrolling on touch devices (sticker elements have touch-none to allow drag)
        container.style.touchAction = 'pan-y';

        // Fix: CSS Layout matches Physics World 1:1, do not apply devicePixelRatio
        mouse.pixelRatio = 1;

        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });

        World.add(engine.world, mouseConstraint);

        // 5. Smart Touch Handling (Prevent scroll when dragging, allow scroll on background)
        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            const rect = container.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            const collisions = Matter.Query.point(bodies, { x, y });

            if (collisions.length > 0) {
                // Touched a body -> Block scroll to allow drag
                e.preventDefault();
            }
        };

        container.addEventListener('touchstart', handleTouchStart, { passive: false });

        // 6. Animation Loop
        let animationId: number;
        const runner = () => {
            Engine.update(engine, 1000 / 60);

            // Sync DOM with Physics
            bodies.forEach(body => {
                const el = itemRefs.current.get(body.label);
                if (el) {
                    const { x, y } = body.position;
                    const angle = body.angle;
                    // Use translate3d for GPU accel
                    el.style.transform = `translate3d(${x - el.offsetWidth / 2}px, ${y - el.offsetHeight / 2}px, 0) rotate(${angle}rad)`;
                    el.style.opacity = '1'; // Make visible once physics starts
                }
            });

            animationId = requestAnimationFrame(runner);
        };

        runner();

        // 7. Cleanup
        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            cancelAnimationFrame(animationId);
            Composite.clear(engine.world, false);
            Engine.clear(engine);
        };
    }, []);

    return (
        <footer className="w-full mt-20 px-6 md:px-12 max-w-[1600px] mx-auto mb-12">
            <div className="relative w-full h-[500px] md:h-[400px] bg-[#EBF2F8] rounded-[2.5rem] overflow-hidden border border-neutral-100/50 shadow-sm isolate">

                {/* --- Physics Container (Background Layer) --- */}
                <div
                    ref={containerRef}
                    className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing overflow-hidden"
                >
                    {items.map((item) => (
                        <div
                            key={item.id}
                            ref={(el) => {
                                if (el) itemRefs.current.set(item.id, el);
                            }}
                            className="absolute top-0 left-0 will-change-transform opacity-0 select-none touch-none pointer-events-none"
                            style={{
                                // Initial hidden position, physics will will take over
                                transform: 'translate3d(-100px, -100px, 0)'
                            }}
                        >
                            {item.content}
                        </div>
                    ))}
                </div>

                {/* --- Content Layer (Foreground) --- */}
                {/* pointer-events-none allows clicks to pass through empty spaces to the physics layer */}
                <div className="relative z-10 w-full h-full flex flex-col items-start justify-center p-8 md:p-16 pointer-events-none">

                    {/* Status */}
                    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/60 mb-8 pointer-events-auto">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-neutral-600 font-semibold text-sm tracking-wide">{WEBSITE_CONTENT.footer.status}</span>
                    </div>

                    {/* Headline */}
                    <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-[#171717] tracking-tight drop-shadow-sm mb-8 mix-blend-multiply">
                        {WEBSITE_CONTENT.footer.headline}
                    </h2>

                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center gap-4 mt-2 pointer-events-auto">

                        {/* Email Copy Button */}
                        <button
                            onClick={copyEmail}
                            className="flex items-center gap-3 bg-[#0F1115] text-white pl-6 pr-8 py-4 rounded-2xl hover:bg-black hover:scale-[1.02] transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] group/btn"
                        >
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-neutral-300 group-hover/btn:text-white transition-colors" />}
                            </div>
                            <span className="font-medium text-base tracking-wide">{email}</span>
                        </button>

                        {/* Divider (Mobile hidden) */}
                        <div className="hidden md:block w-px h-12 bg-neutral-300 mx-2"></div>

                        {/* Social Buttons */}
                        <div className="flex items-center gap-3">

                            {/* Pinterest */}
                            <a
                                href={WEBSITE_CONTENT.footer.socialLinks.pinterest}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Pinterest"
                                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-neutral-900 shadow-sm hover:shadow-md hover:scale-110 transition-all border border-neutral-100 group"
                            >
                                <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#E60023] group-hover:rotate-12 transition-transform">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" />
                                </svg>
                            </a>

                            {/* Instagram */}
                            <a
                                href={WEBSITE_CONTENT.footer.socialLinks.instagram}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-neutral-900 shadow-sm hover:shadow-md hover:scale-110 transition-all border border-neutral-100 group"
                            >
                                <Instagram size={22} className="group-hover:text-[#E1306C] transition-colors" />
                            </a>

                            {/* LinkedIn */}
                            <a
                                href={WEBSITE_CONTENT.footer.socialLinks.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-neutral-900 shadow-sm hover:shadow-md hover:scale-110 transition-all border border-neutral-100 group"
                            >
                                <Linkedin size={22} className="group-hover:text-[#0077B5] transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterContact;