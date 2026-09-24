import { useState } from 'react';

interface InteractiveCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  frontClassName?: string;
  backClassName?: string;
  className?: string;
}

export default function InteractiveCard({ front, back, frontClassName = '', backClassName = '', className = '' }: InteractiveCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`group cursor-pointer ${className}`}
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        className="relative w-full h-full transition-transform duration-600 ease-in-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transitionDuration: '600ms',
        }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-2xl p-5 flex flex-col items-center justify-center text-center ${frontClassName}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-sm">touch_app</span>
          </div>
          {front}
        </div>
        {/* Back */}
        <div
          className={`absolute inset-0 rounded-2xl p-5 flex flex-col items-center justify-center text-center ${backClassName}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-sm">undo</span>
          </div>
          {back}
        </div>
      </div>
    </div>
  );
}
