import { useState, useEffect } from 'react';

interface PixelTypewriterProps {
  text: string;
  speed?: number; // ms per char, default 12
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
}

export default function PixelTypewriter({
  text,
  speed = 12,
  className = '',
  onComplete,
  showCursor = true,
}: PixelTypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    const totalLength = text.length;

    if (totalLength === 0) {
      setIsTyping(false);
      return;
    }

    const interval = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));
      if (index >= totalLength) {
        clearInterval(interval);
        setIsTyping(false);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTyping) {
      setDisplayedText(text);
      setIsTyping(false);
      onComplete?.();
    }
  };

  return (
    <span
      onClick={handleSkip}
      className={`inline ${className}`}
      title={isTyping ? 'Klik untuk memunculkan teks langsung' : undefined}
    >
      {displayedText}
      {isTyping && showCursor && (
        <span className="inline-block w-1.5 h-3.5 bg-amber-800 ml-0.5 align-middle animate-pulse" />
      )}
    </span>
  );
}
