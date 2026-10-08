import { useState, type KeyboardEvent, type ReactNode } from 'react';

interface InteractiveCardProps {
  front: ReactNode;
  back: ReactNode;
  frontClassName?: string;
  backClassName?: string;
  className?: string;
}

export default function InteractiveCard({ front, back, frontClassName = '', backClassName = '', className = '' }: InteractiveCardProps) {
  const [flipped, setFlipped] = useState(false);

  // Kartu ini berfungsi sebagai tombol, jadi harus bisa dijangkau dan
  // diaktifkan lewat keyboard (Tab + Enter/Spasi) — bukan hanya klik mouse.
  const toggle = () => setFlipped(f => !f);
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={flipped ? 'Balikkan kembali kartu ke sisi depan' : 'Balikkan kartu untuk melihat penjelasan'}
      className={`group cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 rounded-2xl ${className}`}
      style={{ perspective: '1000px' }}
      onClick={toggle}
      onKeyDown={handleKeyDown}
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
            <span className="material-symbols-outlined text-[15px] font-semibold">touch_app</span>
          </div>
          {front}
        </div>
        {/* Back */}
        <div
          className={`absolute inset-0 rounded-2xl p-5 flex flex-col items-center justify-center text-center ${backClassName}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-[15px] font-semibold">undo</span>
          </div>
          {back}
        </div>
      </div>
    </div>
  );
}
