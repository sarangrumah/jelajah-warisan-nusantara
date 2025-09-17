import React, { useRef, useEffect } from 'react';

interface SectionWrapperProps {
  id: string;
  nextId?: string;
  prevId?: string;
  children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, nextId, prevId, children }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasSnappedRef = useRef(false);

  useEffect(() => {
    const handleSnapScroll = (e: WheelEvent | TouchEvent) => {
      if (hasSnappedRef.current) { return; }
      const section = sectionRef.current;
      if (!section) { return; }

      // For wheel event
      if ('deltaY' in e) {
        if ((e as WheelEvent).deltaY > 0 && nextId) {
          e.preventDefault();
          hasSnappedRef.current = true;
          const el = document.getElementById(nextId);
          if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
        } else if ((e as WheelEvent).deltaY < 0 && prevId) {
          e.preventDefault();
          hasSnappedRef.current = true;
          const el = document.getElementById(prevId);
          if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
        }
      }
      // For touch event (swipe up/down)
      if ('touches' in e && e.type === 'touchend') {
        const touchEndY = (e as TouchEvent).changedTouches[0].clientY;
        if (section.dataset.touchStartY) {
          const delta = Number(section.dataset.touchStartY) - touchEndY;
          if (delta > 30 && nextId) {
            e.preventDefault();
            hasSnappedRef.current = true;
            const el = document.getElementById(nextId);
            if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
          } else if (delta < -30 && prevId) {
            e.preventDefault();
            hasSnappedRef.current = true;
            const el = document.getElementById(prevId);
            if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (sectionRef.current) {
        sectionRef.current.dataset.touchStartY = String(e.touches[0].clientY);
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('wheel', handleSnapScroll, { passive: false });
      section.addEventListener('touchstart', handleTouchStart, { passive: true });
      section.addEventListener('touchend', handleSnapScroll, { passive: false });
    }
    return () => {
      if (section) {
        section.removeEventListener('wheel', handleSnapScroll);
        section.removeEventListener('touchstart', handleTouchStart);
        section.removeEventListener('touchend', handleSnapScroll);
      }
    };
  }, [nextId, prevId]);

  // Reset snap state when section comes into view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) { return; }
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            hasSnappedRef.current = false;
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div id={id} ref={sectionRef}>
      {children}
    </div>
  );
};

export default SectionWrapper;