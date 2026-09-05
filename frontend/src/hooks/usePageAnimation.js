import { useLayoutEffect } from "react";
import gsap from "gsap";

function usePageAnimation(containerRef) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-title", {
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(".page-subtitle", {
        opacity: 0,
        y: 15,
        duration: 0.5,
        delay: 0.15,
        ease: "power3.out",
      });

      gsap.from(".animate-card", {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(".animate-section", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.35,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
}

export default usePageAnimation;