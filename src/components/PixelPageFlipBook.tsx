import { useEffect, useRef } from 'react';
import { PageFlip } from 'page-flip';

interface PixelPageFlipBookProps {
  children: React.ReactNode;
  onFlip?: (pageIndex: number) => void;
}

export default function PixelPageFlipBook({ children, onFlip }: PixelPageFlipBookProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const pageFlip = new PageFlip(containerRef.current, {
        width: 480,
        height: 580,
        size: 'stretch',
        minWidth: 320,
        maxWidth: 540,
        minHeight: 460,
        maxHeight: 640,
        drawShadow: true,
        flippingTime: 700,
        usePortrait: true,
        showCover: false,
        mobileScrollSupport: true,
        clickEventForward: true,
        disableFlipByClick: true,
        useMouseEvents: true,
      });

      const pages = containerRef.current.querySelectorAll<HTMLElement>('.pixel-page-item');
      if (pages.length > 0) {
        pageFlip.loadFromHTML(pages);
      }

      pageFlip.on('flip', (e: any) => {
        if (onFlip) {
          onFlip(e.data);
        }
      });

      pageFlipRef.current = pageFlip;
    } catch (err) {
      console.error('Failed to init PageFlip:', err);
    }

    return () => {
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy();
        } catch {
          // ignore
        }
        pageFlipRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="pixel-pageflip-container w-full h-full">
      {children}
    </div>
  );
}
