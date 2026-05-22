import { useEffect, useRef } from 'react';

export default function Cursor() {
  const cursorRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    // Failsafe: Don't run on mobile/touch screens
    if (!window.matchMedia("(pointer:fine)").matches) return;
    
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my, rafId;
    
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const onMove = e => {
      mx = e.clientX; 
      my = e.clientY;
    };
    
    const loop = () => {
      cx = lerp(cx, mx, 0.25); 
      cy = lerp(cy, my, 0.25);
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      }
      
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty("--mx", `${mx}px`);
        spotlightRef.current.style.setProperty("--my", `${my}px`);
      }
        
      rafId = requestAnimationFrame(loop);
    };

    const addBig = () => cursorRef.current?.classList.add("big");
    const removeBig = () => cursorRef.current?.classList.remove("big");

    document.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    // ── THIS IS WHERE THE ERROR WAS ──
    const attachHovers = () => {
      // The string inside querySelectorAll must be perfectly wrapped in quotes
      document.querySelectorAll(".hover-target, button, a").forEach(el => {
        el.removeEventListener("mouseenter", addBig);
        el.removeEventListener("mouseleave", removeBig);
        el.addEventListener("mouseenter", addBig);
        el.addEventListener("mouseleave", removeBig);
      });
    };
    
    attachHovers();
    const observer = new MutationObserver(attachHovers);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => { 
      document.removeEventListener("mousemove", onMove); 
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cur" ref={cursorRef} />
      <div id="spotlight" ref={spotlightRef} />
    </>
  );
}