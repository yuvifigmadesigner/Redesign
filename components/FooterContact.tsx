import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check, Globe } from 'lucide-react';
import Matter from 'matter-js';
import { WEBSITE_CONTENT } from '../constants';

const DESKTOP_QUERY = '(min-width: 768px)';

const FooterContact = () => {
    const [copied, setCopied] = useState(false);
    const [isDesktop, setIsDesktop] = useState(
        () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLElement>(null);
    const socialRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const engineRef = useRef<Matter.Engine | null>(null);
    const email = WEBSITE_CONTENT.footer.email;

    const copyEmail = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Physics playground is desktop only — on touch it fights the page scroll
    useEffect(() => {
        const mq = window.matchMedia(DESKTOP_QUERY);
        const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    // Draggable items (desktop only)
    const items = [
        { id: 'guitar', content: <div className="text-5xl sticker-icon">🎸</div> },
        { id: 'mushroom', content: <div className="text-4xl sticker-icon">🍄</div> },
        { id: 'shoe', content: <div className="text-4xl sticker-icon">👟</div> },
        {
            id: 'drag-play',
            content: <div className="font-mono text-[10px] font-bold tracking-widest uppercase text-muted-400 bg-white/50 px-2 py-1 rounded border border-cream-300 backdrop-blur-sm">DRAG & PLAY</div>
        },
        { id: 'memoji', content: <div className="text-6xl sticker-icon">👨‍💻</div> },
        { id: 'star', content: <div className="text-4xl sticker-icon">✨</div> },
        { id: 'fire', content: <div className="text-4xl sticker-icon">🔥</div> },
        { id: 'bulb', content: <div className="text-4xl sticker-icon">💡</div> },
    ];

    // Static stand-ins for the physics stickers on mobile (decorative, non-interactive)
    const mobileStickers = [
        { id: 'guitar', emoji: '🎸', size: 'text-3xl', rotate: -14 },
        { id: 'mushroom', emoji: '🍄', size: 'text-2xl', rotate: 9 },
        { id: 'star', emoji: '✨', size: 'text-2xl', rotate: -6 },
        { id: 'memoji', emoji: '👨‍💻', size: 'text-4xl', rotate: 0 },
        { id: 'fire', emoji: '🔥', size: 'text-2xl', rotate: 11 },
        { id: 'shoe', emoji: '👟', size: 'text-3xl', rotate: -9 },
        { id: 'bulb', emoji: '💡', size: 'text-2xl', rotate: 7 },
    ];

    useEffect(() => {
        if (!isDesktop || !containerRef.current) return;

        // 1. Setup Matter.js
        const Engine = Matter.Engine;
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

        items.forEach((item) => {
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

        // 5. Drop Matter.js' own touch listeners — pointer drag is mouse only here
        mouse.element.removeEventListener("touchstart", mouse.mousedown as any);
        mouse.element.removeEventListener("touchmove", mouse.mousemove as any);
        mouse.element.removeEventListener("touchend", mouse.mouseup as any);
        mouse.element.removeEventListener("touchcancel", mouse.mouseup as any);

        // 6. Animation Loop
        let animationId = 0;
        let running = false;

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

        const start = () => {
            if (running) return;
            running = true;
            animationId = requestAnimationFrame(runner);
        };

        const stop = () => {
            running = false;
            if (animationId) cancelAnimationFrame(animationId);
            animationId = 0;
        };

        // The solver is the most expensive thing on the page. Run it only while the
        // footer is actually on screen — otherwise it burns a frame budget forever.
        const visibility = new IntersectionObserver(
            ([entry]) => (entry.isIntersecting ? start() : stop()),
            { threshold: 0 }
        );
        visibility.observe(container);

        // 7. Cleanup
        return () => {
            visibility.disconnect();
            stop();
            Composite.clear(engine.world, false);
            Engine.clear(engine);
            engineRef.current = null;
        };
    }, [isDesktop]);

    // Social icons ride a wave as the page scrolls past — motion stays tied to the
    // scroll position, so it keeps moving for as long as the visitor keeps scrolling.
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let frame = 0;

        const apply = () => {
            frame = 0;
            const footer = footerRef.current;
            if (!footer) return;

            const rect = footer.getBoundingClientRect();
            // 0 as the footer first appears from the bottom, 1 once it has fully passed the top
            const raw = 1 - rect.bottom / (window.innerHeight + rect.height);
            const progress = Math.max(0, Math.min(1, raw));

            socialRefs.current.forEach((el, i) => {
                if (!el) return;
                const phase = progress * Math.PI * 4 + i * 0.8;
                el.style.transform = `translateY(${(Math.sin(phase) * 7).toFixed(2)}px) rotate(${(Math.sin(phase) * 9).toFixed(2)}deg)`;
            });
        };

        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(apply);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        apply();

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    // Scroll reveal for the mobile footer content
    useEffect(() => {
        const root = contentRef.current;
        if (!root) return;

        const targets = root.querySelectorAll('.animate-on-scroll');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
        );

        targets.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [isDesktop]);

    // Reveal is mobile only; on desktop the physics drop is the entrance
    const revealClass = isDesktop ? '' : 'animate-on-scroll';
    const revealStyle = (delay: number) =>
        isDesktop ? undefined : { animation: `animationIn 0.8s ease-out ${delay}s both` };

    return (
        <footer ref={footerRef} className="w-full mt-16 md:mt-20 px-4 sm:px-6 md:px-12 max-w-[1600px] mx-auto mb-10 md:mb-12">
            <div className="relative w-full h-auto md:h-[400px] bg-cream-100 rounded-xl overflow-hidden border border-cream-300/50 shadow-sm isolate">

                {/* --- Physics Container (Desktop only) --- */}
                {isDesktop && (
                    <div
                        ref={containerRef}
                        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing overflow-hidden"
                    >
                        {items.map((item) => (
                            <div
                                key={item.id}
                                ref={(el) => {
                                    if (el) itemRefs.current.set(item.id, el);
                                    else itemRefs.current.delete(item.id);
                                }}
                                className="absolute top-0 left-0 will-change-transform opacity-0 select-none pointer-events-none"
                                style={{
                                    // Initial hidden position, physics will take over
                                    transform: 'translate3d(-100px, -100px, 0)'
                                }}
                            >
                                {item.content}
                            </div>
                        ))}
                    </div>
                )}

                {/* --- Content Layer (Foreground) --- */}
                {/* pointer-events-none allows clicks to pass through empty spaces to the physics layer */}
                <div
                    ref={contentRef}
                    className="relative z-10 w-full h-auto md:h-full flex flex-col items-start justify-center px-6 py-10 md:p-16 pointer-events-none"
                >

                    {/* Status */}
                    <div
                        style={revealStyle(0)}
                        className={`flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/60 mb-6 md:mb-8 pointer-events-auto ${revealClass}`}
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-muted font-semibold text-sm tracking-wide">{WEBSITE_CONTENT.footer.status}</span>
                    </div>

                    {/* Headline */}
                    <h2
                        style={revealStyle(0.1)}
                        className={`font-serif text-[2.15rem] leading-[1.1] md:text-5xl lg:text-6xl text-ink tracking-tight mb-7 md:mb-8 mix-blend-multiply ${revealClass}`}
                    >
                        {WEBSITE_CONTENT.footer.headline}
                    </h2>

                    {/* Actions Row */}
                    <div
                        style={revealStyle(0.2)}
                        className={`w-full flex flex-wrap items-center gap-3 md:gap-4 mt-1 md:mt-2 pointer-events-auto ${revealClass}`}
                    >

                        {/* Email Copy Button */}
                        <button
                            onClick={copyEmail}
                            className="flex items-center gap-2.5 md:gap-3 bg-brand-100 text-ink border border-brand-200 px-4 md:pl-6 md:pr-8 py-3.5 md:py-4 rounded-[10px] hover:bg-brand-200 md:hover:scale-[1.02] transition-all shadow-sm hover:shadow-md active:scale-[0.98] group/btn w-full sm:w-auto max-w-full min-w-0"
                        >
                            <div className="w-8 h-8 shrink-0 bg-white/70 rounded-full flex items-center justify-center">
                                {copied ? <Check size={16} className="text-brand-700" /> : <Copy size={16} className="text-brand group-hover/btn:text-brand-700 transition-colors" />}
                            </div>
                            <span className="font-medium text-sm md:text-base tracking-wide truncate">{email}</span>
                        </button>

                        {/* Divider (Mobile hidden) */}
                        <div className="hidden md:block w-px h-12 bg-cream-400 mx-2"></div>

                        {/* Social Buttons */}
                        <div className="flex items-center gap-3">

                            {/* Pinterest */}
                            <a
                                href={WEBSITE_CONTENT.footer.socialLinks.pinterest}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Pinterest"
                                className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center md:hover:scale-110 active:scale-95 transition-transform duration-300 group"
                            >
                                <span ref={(el) => { socialRefs.current[0] = el; }} className="block will-change-transform">
                                    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-9 md:h-9 text-brand group-hover:text-brand-700 sticker-icon group-hover:rotate-[10deg] transition-all duration-300">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" />
                                    </svg>
                                </span>
                            </a>

                            {/* LinkedIn */}
                            <a
                                href={WEBSITE_CONTENT.footer.socialLinks.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                                className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center md:hover:scale-110 active:scale-95 transition-transform duration-300 group"
                            >
                                <span ref={(el) => { socialRefs.current[1] = el; }} className="block will-change-transform">
                                    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-9 md:h-9 text-brand group-hover:text-brand-700 sticker-icon group-hover:rotate-[10deg] transition-all duration-300">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </span>
                            </a>

                            {/* Portfolio */}
                            <a
                                href={WEBSITE_CONTENT.footer.socialLinks.portfolio}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Portfolio"
                                className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center md:hover:scale-110 active:scale-95 transition-transform duration-300 group"
                            >
                                <span ref={(el) => { socialRefs.current[2] = el; }} className="block will-change-transform">
                                    <Globe
                                        strokeWidth={2.25}
                                        className="w-8 h-8 md:w-9 md:h-9 text-brand group-hover:text-brand-700 sticker-icon-sm group-hover:rotate-[10deg] transition-all duration-300"
                                    />
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Sticker strip (mobile stand-in for the physics playground) */}
                    {!isDesktop && (
                        <div
                            aria-hidden="true"
                            className="w-full mt-10 flex items-end justify-center gap-2 select-none pointer-events-none"
                        >
                            {mobileStickers.map((sticker, index) => (
                                <div
                                    key={sticker.id}
                                    className="animate-on-scroll"
                                    style={{ animation: `animationIn 0.7s ease-out ${0.3 + index * 0.07}s both` }}
                                >
                                    <div
                                        className={`${sticker.size} sticker-icon`}
                                        style={{ transform: `rotate(${sticker.rotate}deg)` }}
                                    >
                                        {sticker.emoji}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default FooterContact;
