import React, { ReactNode, useLayoutEffect, useRef, useState } from 'react';

interface FitGameProps {
  children: ReactNode;
}

export const FitGame: React.FC<FitGameProps> = ({ children }) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, height: 0 });

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const measure = () => {
      const contentWidth = content.scrollWidth;
      const contentHeight = content.scrollHeight;
      if (!contentWidth || !contentHeight) return;
      const scale = Math.min(1, viewport.clientWidth / contentWidth, viewport.clientHeight / contentHeight);
      setFit({ scale, height: contentHeight * scale });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(content);
    measure();
    return () => observer.disconnect();
  }, [children]);

  return (
    <div ref={viewportRef} className="flex h-full min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
      <div className="flex w-full justify-center" style={{ height: fit.height || undefined }}>
        <div
          ref={contentRef}
          className="w-full shrink-0"
          style={{
            maxWidth: 768,
            transform: `scale(${fit.scale})`,
            transformOrigin: 'top center',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
