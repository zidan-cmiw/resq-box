# 🔧 Rencana Pemecahan Berkas Raksasa

Catatan teknis untuk memecah berkas sumber terbesar RESQ-BOX. Ditulis agar
pekerjaan ini dapat dikerjakan tuntas dan aman, bukan setengah jalan.

---

## 1. Kondisi saat ini

| Berkas | Baris | Ukuran |
|---|---|---|
`src/app/Level2/engine/renderer.ts` | **10.975** | 384 KB |
`src/app/Level2/DiscoveryModal.tsx` | 7.028 | 372 KB |
`src/app/EvacuationGame/Merapi3DScene.tsx` | 6.124 | 246 KB |
`src/app/Level1/EarthDive/engine/sprites.ts` | 5.624 | 240 KB |
`src/app/Level1/EarthDive/engine/npcSprites.ts` | 4.385 | 170 KB |

`renderer.ts` adalah yang terbesar dan **paling aman dipecah lebih dulu**,
karena analisis ketergantungannya sudah selesai (lihat bagian 3).

---

## 2. Mengapa `renderer.ts` aman dipecah

Berkas ini adalah **kotak hitam dengan satu pintu masuk**:

- 33 fungsi diekspor, 64 fungsi tingkat atas.
- Konsumennya hanya **satu**: `src/app/Level2/engine/TectonicGame.tsx`,
  dan hanya memakai `renderTectonicGameL2`.
- Seluruh 32 ekspor lain hanya dipanggil dari dalam berkas itu sendiri.

Konsekuensinya: selama `renderer.ts` tetap mengekspor `renderTectonicGameL2`
dengan tanda tangan yang sama, **konsumen tidak perlu diubah sama sekali**.
Ini membuat pemecahan dapat dilakukan bertahap tanpa risiko terhadap UI.

---

## 3. Peta ketergantungan (sudah diverifikasi)

Terbagi menjadi **3 lapisan**. Tidak ada impor melingkar.

```
┌─ LAPISAN 3: ORKESTRATOR ────────────────────────────────┐
│  renderTectonicGameL2  memanggil SEMUA tema             │
└──────────────────────┬──────────────────────────────────┘
                       │
┌─ LAPISAN 2: MODUL TEMA ─────────────────────────────────┐
│  classroom   2.050 baris   area ruang kelas + kerusakan │
│  volcano     1.800 baris   gunung, magma, lahar, abu    │
│  assembly      800 baris   lapangan evakuasi            │
│  merapi        700 baris   kawasan prabencana           │
│  fasilitas     300 baris   pos pengamatan, gapura PGA   │
│  overlay       300 baris   banner, prompt, timer        │
└──────────────────────┬──────────────────────────────────┘
                       │
┌─ LAPISAN 1: DASAR (dipakai lintas tema) ────────────────┐
│  drawRoundedBadgeL2          dipanggil 9x               │
│  drawRealisticVolcanicSmoke  dipanggil 7x               │
└─────────────────────────────────────────────────────────┘
```

### Panggilan lintas-tema yang WAJIB dihormati

Ini daftar lengkapnya, agar pemecahan tidak menimbulkan impor melingkar:

| Dari | Ke | Fungsi |
|---|---|---|
`drawPosPengamatanInterior` (FASILITAS) | DASAR | `drawRealisticVolcanicSmoke` |
`drawVolcanoMitigationAtmosphere` (VOLCANO) | DASAR | `drawRealisticVolcanicSmoke` |
`drawMerapiPrabencanaAtmosphere` (MERAPI) | DASAR | `drawRealisticVolcanicSmoke` |
`drawVolcanoSimulationAtmosphere` (VOLCANO) | DASAR | `drawRealisticVolcanicSmoke` |
`drawClassroomEntranceDoor` (CLASSROOM) | DASAR | `drawRoundedBadgeL2` |
`drawClassroomExitDoor` (CLASSROOM) | DASAR | `drawRoundedBadgeL2` |
`drawVolcanoEvacuationExitGate` (VOLCANO) | DASAR | `drawRoundedBadgeL2` |
`drawPosPgaExitGapura` (FASILITAS) | DASAR | `drawRoundedBadgeL2` |
`drawAssemblyFieldAtmosphere` (ASSEMBLY) | DASAR | `drawRoundedBadgeL2` |
`drawAssemblyFieldBackDoor` (ASSEMBLY) | DASAR | `drawRoundedBadgeL2` |
`drawVolcanoSimulationGround` (VOLCANO) | MERAPI | `drawRambuJalurEvakuasiMerapi` |

Jadi: **DASAR tidak boleh mengimpor apa pun dari tema.** Tema boleh mengimpor
DASAR. Orkestrator mengimpor semua.

---

## 4. Urutan pengerjaan yang disarankan

Lakukan satu langkah per commit, dan **verifikasi setelah setiap langkah**.
Jangan menggabungkan dua langkah dalam satu commit.

### Langkah 1 — `engine/draw/base.ts`
Pindahkan `drawRoundedBadgeL2` dan `drawRealisticVolcanicSmoke` beserta
konstanta yang hanya dipakai keduanya.
`renderer.ts` mengimpor dan **mengekspor ulang** keduanya agar API tetap sama.

Verifikasi: `npm run typecheck && npm run test && npm run build`.

### Langkah 2 — `engine/draw/volcano.ts`
Pindahkan kelompok gunung/magma/lahar (baris 6582–8381 pada keadaan saat ini,
kurang lebih 1.800 baris): `drawDenseDarkAshPlume`,
`drawMagmaExplosiveFountain`, `drawMagmaEffusiveFountain`,
`drawEffusiveDownstreamRiver`, `getActiveLavaStream`, `drawLavaDeltaPool`,
`drawEruptingLavaFlows`, `drawFleeingBirdFlock`, `drawAshFallOverlay`,
`drawVolcanoSimulationHills`, `drawVolcanoSimulationGround`,
`drawVolcanoSimulationAtmosphere`.
Catatan: modul ini mengimpor dari DASAR dan MERAPI.

### Langkah 3 — `engine/draw/classroom.ts`
Kelompok ruang kelas (sekitar 2.050 baris).

### Langkah 4–6 — `assembly.ts`, `merapi.ts`, `facilities.ts`, `overlay.ts`

### Langkah 7 — `renderer.ts` menjadi orkestrator tipis
Setelah semua dipindahkan, `renderer.ts` hanya berisi `renderTectonicGameL2`
dan mengekspor ulang fungsi publik yang diperlukan. Target: **< 600 baris**.

---

## 5. Jebakan yang harus dihindari

1. **Jangan memindahkan fungsi secara otomatis dengan regex.** Helper bersama
   seperti `drawRoundedBadgeL2` tersebar, dan batas fungsi tidak selalu jelas.
   Pindahkan blok per blok secara manual lalu periksa hasilnya.

2. **Waspadai variabel modul tingkat atas.** Bila ada `const`/`let` di luar
   fungsi yang dipakai lintas tema, variabel itu harus ikut pindah ke DASAR.
   Periksa dengan: `grep -n "^const\|^let" renderer.ts`.

3. **Sesuaikan jalur impor.** Kedalaman berubah:
   - dari `engine/renderer.ts` → `./gameEngine`
   - dari `engine/draw/volcano.ts` → `../gameEngine`

4. **Ukur ukuran berkas sebelum dan sesudah.** Bila ukuran chunk total
   berubah banyak, ada kode yang terduplikasi atau hilang.

5. **Jangan mengubah perilaku.** Pemecahan berkas tidak boleh mengubah satu
   piksel pun tampilan. Bila ada perubahan visual, ada yang salah.

---

## 6. Manfaat yang diharapkan

- Berkas 10.975 baris menjadi 8 modul berukuran 300–2.000 baris.
- Perubahan pada satu tema tidak lagi menyentuh berkas raksasa.
- Lebih mudah dipahami kontributor baru.
- **Tidak mengubah ukuran unduhan** — pemecahan berkas tidak mengurangi byte
  yang dikirim ke siswa; manfaatnya untuk pemeliharaan kode.

---

## 7. Catatan tentang berkas raksasa lainnya

`DiscoveryModal.tsx` (7.028 baris) dan `Merapi3DScene.tsx` (6.124 baris)
sebaiknya dipecah dengan pola yang sama, tetapi **setelah** `renderer.ts`
selesai dan polanya terbukti. Keduanya adalah komponen React (bukan kumpulan
fungsi gambar), sehingga pemecahannya lebih rumit: state antar-bagian saling
terkait dan harus dipisah dengan hati-hati.
