import { useEffect, useRef } from 'react';

export default function Cursor() {
  const cursorRef    = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my, rafId;
    
    // The smoothing formula
    const lerp = (a, b, t) => a + (b - a) * t;

    const onMove = e => {
      mx = e.clientX; 
      my = e.clientY;
      // Note: We do NOT update CSS here anymore. That causes lag.
    };
    
    const loop = () => {
      // 0.25 gives it that premium "float" without feeling heavy/sluggish like 0.15 did
      cx = lerp(cx, mx, .25); 
      cy = lerp(cy, my, .25);
      
      // Update the trailing dot using hardware-accelerated 3D transforms
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`;
      }
      
      // Update the spotlight instantly, but ONLY when the monitor is ready to draw a frame
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty("--mx", `${mx}px`);
        spotlightRef.current.style.setProperty("--my", `${my}px`);
      }
        
      rafId = requestAnimationFrame(loop);
    };

    const addBig    = () => cursorRef.current?.classList.add("big");
    const removeBig = () => cursorRef.current?.classList.remove("big");

    // passive: true prevents the listener from blocking scrolling/animations
    document.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    const attachHovers = () => {
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