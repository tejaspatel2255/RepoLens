import { useState, useEffect, useRef } from 'react';

function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // Check if IntersectionObserver is supported in browser
    if (!window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, stop observing to keep animation completed state
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of element is in viewport
        rootMargin: '0px 0px -50px 0px' // offset bottom triggers slightly
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, []);

  return { elementRef, isVisible };
}

export default useScrollAnimation;
