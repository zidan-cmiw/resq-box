// ── src/components/ResqyMascot.tsx ─────────────────────────────────────
// Maskot Resmi RESQ-BOX: Resqy, burung hantu pemandu ekspedisi geologi.
// Topi proyek dengan lampu, kacamata, rompi keselamatan, dan ransel antena.
//
// Bentuk disimpan sebagai kisi karakter (pixel art). Satu karakter = satu
// kotak SVG, sehingga maskot tetap tajam pada ukuran 22 px maupun 120 px.
// Untuk mengubah bentuk, sunting KISI di bawah — tidak perlu menyentuh SVG.

import React from 'react';

interface ResqyMascotProps {
  size?: number;
  className?: string;
  talking?: boolean;
  mood?: 'happy' | 'thinking' | 'excited' | 'wise';
}

const PALET: Record<string, string> = {
  H: '#ff8a3d',
  V: '#ffffff',
  b: '#b06b2c',
  d: '#7a4518',
  e: '#ffffff',
  f: '#f7a53b',
  g: '#2b2b2b',
  h: '#f26522',
  k: '#1a1a1a',
  n: '#ffb02e',
  o: '#3d1f0c',
  p: '#3a2a12',
  v: '#ff8c1a',
  w: '#f0e2cd',
  y: '#ffd23f'
};

const KISI: string[] = [
  '..........................',
  '...........hhhhh..........',
  '.........hhhhhhhhh........',
  '.......hhhhkyyykhhhh......',
  '......hhhhhkyyykhhhhh.....',
  '......hhhhhkkkkkhhhhh.....',
  '.....hHHHHHHHHHHHHHHHh....',
  '....hhhhhhhhhhhhhhhhhhh...',
  '.......obbbbbbbbbbbo......',
  '.....eeeeeegggeeeeeeg.....',
  '.....eeppeegggeeppeeg.....',
  '.....eepeeegggeepeeeg.....',
  '........obbbbbbbbbo.......',
  '.........obbnnbbbo........',
  '..........oonnooo.........',
  '.........ovvvnvvvo........',
  '......ooovvvvvvvvbooo.....',
  '......ddoVVVVVVVVVodd.....',
  '.....oddovvvvvvvvvoddo....',
  '.....oddovvvvvvvvvoddo....',
  '.....oddoVVVVVVVVVoddo....',
  '.....oddovvvvvvvvvoddo....',
  '.....oddoooooooooooddo....',
  '.....oddobwwwwwwwboddo....',
  '......ddooowwwwwooodd.....',
  '......ooobbwwwwwbbooo.....',
  '.........fffbbfffo........',
  '.........fffbbfff.........',
  '........ffff.ffff.........',
  '..........................'
];

const LEBAR = 26;
const TINGGI = 30;

/** Ubah kisi sesuai pose. Hanya mata yang berbeda. */
function kisiPose(mood: NonNullable<ResqyMascotProps['mood']>): string[] {
  const salin = [...KISI];
  const ganti = (baris: number, dari: string, ke: string) => {
    const i = salin[baris].indexOf(dari);
    if (i >= 0) {
      salin[baris] = salin[baris].slice(0, i) + ke + salin[baris].slice(i + dari.length);
    }
  };

  if (mood === 'happy') {
    ganti(11, 'p', 'e');
  } else if (mood === 'thinking') {
    ganti(10, 'e', 'w');
  } else if (mood === 'excited') {
    ganti(10, 'p', 'e');
    ganti(11, 'p', 'e');
  }
  return salin;
}

export const ResqyMascot: React.FC<ResqyMascotProps> = ({
  size = 56,
  className = '',
  talking = false,
  mood = 'wise',
}) => {
  const kisi = kisiPose(mood);

  return (
    <div
      className={`inline-flex items-center justify-center select-none relative ${className}`}
      style={{ width: size, height: size }}
      title="Resqy — burung hantu pemandu RESQ-BOX"
    >
      <svg
        viewBox={`0 0 ${LEBAR} ${TINGGI}`}
        width={size}
        height={size}
        className={`w-full h-full drop-shadow-[0_3px_0_rgba(35,18,6,0.55)] ${
          talking ? 'animate-bounce-subtle' : ''
        }`}
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {kisi.map((baris, y) =>
          baris.split('').map((k, x) => {
            const warna = PALET[k];
            if (!warna) return null;
            return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={warna} />;
          }),
        )}
      </svg>
    </div>
  );
};

export default ResqyMascot;
