// ── engine/draw/base.ts ───────────────────────────────────────────────────
// Fungsi gambar DASAR yang dipakai lintas tema di Level 2.
//
// MENGAPA DIPISAH
//   Keduanya dipanggil dari banyak modul tema:
//     • drawRoundedBadgeL2         — 9 pemanggil
//     • drawRealisticVolcanicSmoke — 7 pemanggil
//
//   Menempatkannya di sini membuat aturan ketergantungan menjadi jelas:
//   modul ini adalah LAPISAN PALING DASAR dan **tidak boleh mengimpor apa pun
//   dari modul tema** (classroom, volcano, assembly, merapi, facilities,
//   overlay). Tema boleh mengimpor dari sini, bukan sebaliknya. Tanpa aturan
//   ini, pemecahan berkas besar akan menghasilkan impor melingkar.
//
//   Kedua fungsi bersifat MURNI terhadap canvas: hanya memakai
//   CanvasRenderingContext2D dan argumennya, tanpa state modul. Karena itu
//   pemindahannya tidak mengubah perilaku sama sekali.

/**
 * Gambar kotak bersudut tumpul dengan isian dan garis tepi opsional.
 *
 * Memakai `ctx.roundRect` bila peramban mendukungnya (Chrome 99+, Safari 16+),
 * dan jatuh ke kotak bersiku tajam bila tidak — sehingga tampilan tetap benar
 * di peramban sekolah yang lebih tua.
 */
export function drawRoundedBadgeL2(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string | CanvasGradient,
  stroke?: string | CanvasGradient,
  strokeWidth: number = 1
): void {
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Gambar kepulan asap/uap vulkanik organik dari puncak gunung.
 *
 * Tiga mode tampilan:
 *   - `white_steam`           uap solfatara putih (kondisi tenang)
 *   - `dark_ash`              gumpalan abu silika gelap + pendaran bara magma
 *   - `post_eruption_distant` abu andesit pasca-erupsi di kejauhan (pudar)
 *
 * Gumpalan dibentuk dari poligon harmonik 10 titik yang bergelombang
 * (harmonic perturbed polygon) dengan gradien radial bertingkat, BUKAN
 * lingkaran kaku bergaris tepi. Ini yang membuat bentuknya terlihat seperti
 * awan cumuliform alami.
 *
 * @param isDarkAsh mode; juga menerima boolean untuk kompatibilitas
 *                  (`true` = abu gelap, `false` = uap putih)
 * @param scale     pengali ukuran keseluruhan (mis. 0.5 untuk gunung kecil)
 */
export function drawRealisticVolcanicSmoke(
  ctx: CanvasRenderingContext2D,
  summitX: number,
  summitY: number,
  animTick: number,
  isDarkAsh: boolean | 'dark_ash' | 'white_steam' | 'post_eruption_distant' = false,
  scale: number = 1.0
): void {
  const mode = typeof isDarkAsh === 'string'
    ? isDarkAsh
    : isDarkAsh ? 'dark_ash' : 'white_steam';

  ctx.save();
  const isPost = mode === 'post_eruption_distant';
  const isDark = mode === 'dark_ash' || isPost;
  const puffCount = isPost ? 20 : isDark ? 26 : 16;
  const maxRise = (isPost ? 115 : isDark ? 165 : 95) * scale;
  const windDrift = (isPost ? 46 : isDark ? 62 : 36) * scale;

  for (let i = 0; i < puffCount; i++) {
    // Progres naik dari 0 (kawah) sampai 1 (udara tinggi)
    const speed = isPost ? 0.0038 : isDark ? 0.0055 : 0.0048;
    const progress = ((animTick * speed + i / puffCount) % 1);

    // Meliuk alami tertiup angin lereng gunung (turbulensi fluida non-linear)
    const sway = Math.sin(animTick * 0.022 + i * 1.35) * (7 + progress * 22) * scale;
    const px = summitX + progress * windDrift + sway;
    const py = summitY - progress * maxRise;

    // Radius mengembang bertahap saat naik karena penurunan tekanan udara
    const baseR = (isPost ? 6 : isDark ? 10 : 8) * scale;
    const expandR = (isPost ? 28 : isDark ? 44 : 26) * scale;
    const r = baseR + progress * expandR;

    // Transparansi memudar di puncak plume (Gaussian falloff envelope)
    let alpha: number;
    if (progress < 0.12) {
      alpha = (progress / 0.12) * (isPost ? 0.75 : isDark ? 0.9 : 0.65);
    } else {
      alpha = Math.max(0, Math.pow(1 - progress, 1.25) * (isPost ? 0.75 : isDark ? 0.9 : 0.65));
    }
    if (alpha <= 0.01) continue;

    // Gambar gumpalan awan organik berlobus amorf (Cauliflower / Cumuliform Billow)
    // Menggunakan kontur poligon harmonik 10-titik bergelombang + multi-stop radial gradient
    // BUKAN lingkaran kaku dengan garis tepi!
    const lobeCount = isPost ? 5 : 6;
    const puffSeed = i * 3.14159;
    const rotSpeed = animTick * 0.012 * (i % 2 === 0 ? 1 : -1);

    for (let l = 0; l < lobeCount; l++) {
      const angle = (l / lobeCount) * Math.PI * 2 + rotSpeed + puffSeed;
      const dist = r * (0.34 + Math.sin(puffSeed + l * 2.1) * 0.12);
      const lx = px + Math.cos(angle) * dist;
      const ly = py + Math.sin(angle) * dist * 0.78; // Sedikit pipih secara vertikal
      const lr = r * (0.55 + Math.sin(puffSeed * 1.4 + l) * 0.18);

      const radGrad = ctx.createRadialGradient(
        lx - lr * 0.28, ly - lr * 0.28, lr * 0.05,
        lx, ly, lr
      );

      if (isDark) {
        if (progress < 0.18 && l % 2 === 0 && !isPost) {
          // Pendaran bara magma / uap belerang membara dekat mulut kawah
          radGrad.addColorStop(0, `rgba(251, 146, 60, ${alpha * 0.85})`);
          radGrad.addColorStop(0.35, `rgba(194, 65, 12, ${alpha * 0.6})`);
          radGrad.addColorStop(0.7, `rgba(67, 20, 7, ${alpha * 0.3})`);
          radGrad.addColorStop(1, 'rgba(30, 20, 15, 0)');
        } else if (isPost) {
          // Asap abu pasca erupsi di kejauhan (warna andesit & slate lembut pudar)
          radGrad.addColorStop(0, `rgba(100, 116, 139, ${alpha * 0.88})`);
          radGrad.addColorStop(0.35, `rgba(71, 85, 105, ${alpha * 0.72})`);
          radGrad.addColorStop(0.7, `rgba(51, 65, 85, ${alpha * 0.42})`);
          radGrad.addColorStop(0.9, `rgba(30, 41, 59, ${alpha * 0.15})`);
          radGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        } else {
          // Gumpalan abu silika gelap & jelaga andesit pekat
          radGrad.addColorStop(0, `rgba(120, 113, 108, ${alpha * 0.95})`);
          radGrad.addColorStop(0.3, `rgba(68, 64, 60, ${alpha * 0.85})`);
          radGrad.addColorStop(0.65, `rgba(41, 37, 36, ${alpha * 0.6})`);
          radGrad.addColorStop(0.88, `rgba(28, 25, 23, ${alpha * 0.25})`);
          radGrad.addColorStop(1, 'rgba(12, 10, 9, 0)');
        }
      } else {
        // Kepulan Uap Solfatara Putih Halus Alami (Tenang)
        radGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.92})`);
        radGrad.addColorStop(0.35, `rgba(241, 245, 249, ${alpha * 0.75})`);
        radGrad.addColorStop(0.7, `rgba(203, 213, 225, ${alpha * 0.4})`);
        radGrad.addColorStop(0.9, `rgba(203, 213, 225, ${alpha * 0.15})`);
        radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }

      ctx.fillStyle = radGrad;
      // Kontur organik amorf bergelombang (Harmonic Perturbed Polygon)
      ctx.beginPath();
      const numPts = 10;
      for (let p = 0; p <= numPts; p++) {
        const theta = (p / numPts) * Math.PI * 2;
        const pert = 1 + 0.22 * Math.sin(theta * 3 + puffSeed + l)
          + 0.12 * Math.cos(theta * 4 - puffSeed);
        const ptX = lx + Math.cos(theta) * lr * pert;
        const ptY = ly + Math.sin(theta) * lr * pert * 0.85;
        if (p === 0) ctx.moveTo(ptX, ptY);
        else ctx.lineTo(ptX, ptY);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}
