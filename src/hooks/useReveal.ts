import { useEffect } from 'react';

/**
 * Fades each step in the first time it scrolls into view. Sections are static, so
 * observing them (not their changing children) can never leave content hidden.
 */
export function useReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver !== 'function') return;
    const root = document.documentElement;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('shown');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    document.querySelectorAll('.section').forEach((s) => io.observe(s));
    root.classList.add('reveal-ready');
    return () => {
      io.disconnect();
      root.classList.remove('reveal-ready');
    };
  }, []);
}
