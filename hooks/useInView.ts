import { useEffect, useRef, useState } from 'react';

/**
 * Flips to true the first time the element scrolls into view, then stops observing.
 * Reveals are one-shot on purpose — replaying them on every pass is distracting.
 */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(entry.target);
                }
            },
            // Threshold 0 + a bottom margin fires as soon as the top edge rises past the
            // trigger line. A percentage threshold would stall on very tall cards.
            { threshold: 0, rootMargin: '0px 0px -12% 0px', ...options }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { ref, inView };
}
