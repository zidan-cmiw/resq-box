import React, { useState } from 'react';
import { DEFAULT_CUSTOM_AVATAR, type CustomAvatarConfig } from '../../store/teacherStore';
import { PixelAvatarRenderer } from './PixelAvatarRenderer';
import { retroAudio } from '../../utils/retroAudio';
import PixelIcon from '../PixelIcon';

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  initialConfig?: CustomAvatarConfig;
  onClose: () => void;
  onSave: (config: CustomAvatarConfig) => void;
}

// Preset options for quick 1-click loading (Pure pixel avatar previews, NO emojis)
const PRESETS: { name: string; subtitle: string; config: CustomAvatarConfig }[] = [
  {
    name: 'Taruna Boy',
    subtitle: 'Relawan Putra',
    config: {
      skin: 'warm',
      hairStyle: 'spiky',
      hairColor: '#3e2723',
      eyes: 'determined',
      outfit: 'vest-orange',
      accessory: 'walkie',
      bgTheme: 'amber',
    },
  },
  {
    name: 'Taruna Girl',
    subtitle: 'Relawan Putri',
    config: {
      skin: 'light',
      hairStyle: 'ponytail',
      hairColor: '#1e1b18',
      eyes: 'happy',
      outfit: 'vest-orange',
      accessory: 'badge',
      bgTheme: 'rose',
    },
  },
  {
    name: 'Ahli Geologi',
    subtitle: 'Peneliti Lempeng',
    config: {
      skin: 'tan',
      hairStyle: 'parted',
      hairColor: '#3e2723',
      eyes: 'glasses',
      outfit: 'jacket-blue',
      accessory: 'badge',
      bgTheme: 'blue',
    },
  },
  {
    name: 'Peneliti Hijab',
    subtitle: 'Mitigasi Bencana',
    config: {
      skin: 'warm',
      hairStyle: 'hijab',
      hairColor: '#166534',
      eyes: 'focus',
      outfit: 'gear-red',
      accessory: 'mask',
      bgTheme: 'emerald',
    },
  },
  {
    name: 'Rescue Bot AI',
    subtitle: 'Robot Penolong',
    config: {
      skin: 'robot',
      hairStyle: 'cap',
      hairColor: '#0f172a',
      eyes: 'focus',
      outfit: 'cyber',
      accessory: 'headlamp',
      bgTheme: 'cyan',
    },
  },
  {
    name: 'Ranger Hutan',
    subtitle: 'Penjaga Konservasi',
    config: {
      skin: 'brown',
      hairStyle: 'curly',
      hairColor: '#1e1b18',
      eyes: 'determined',
      outfit: 'khaki',
      accessory: 'headlamp',
      bgTheme: 'emerald',
    },
  },
];

const SKIN_OPTIONS: { id: CustomAvatarConfig['skin']; label: string; desc: string; color: string }[] = [
  { id: 'light', label: 'Kuning Langsat', desc: 'Nuansa cerah alami nusantara', color: '#fed7aa' },
  { id: 'warm', label: 'Sawo Matang Cerah', desc: 'Nuansa hangat populer siswa', color: '#f5af7e' },
  { id: 'tan', label: 'Sawo Matang Alami', desc: 'Nuansa tropis kepulauan', color: '#d97706' },
  { id: 'brown', label: 'Cokelat Manis', desc: 'Nuansa eksotis nusantara timur', color: '#92400e' },
  { id: 'dark', label: 'Cokelat Gelap', desc: 'Nuansa tanah vulkanik dalam', color: '#5c2c16' },
  { id: 'robot', label: 'Android Cyber Metal', desc: 'Edisi robot penyelamat AI', color: '#38bdf8' },
];

const HAIR_STYLES: { id: CustomAvatarConfig['hairStyle']; label: string; desc: string }[] = [
  { id: 'spiky', label: 'Jabrik Taruna', desc: 'Gaya rambut sporty & tangkas' },
  { id: 'parted', label: 'Sisir Rapi', desc: 'Gaya belah samping akademis' },
  { id: 'curly', label: 'Ikal Keriting', desc: 'Gaya rambut bervolume retro' },
  { id: 'ponytail', label: 'Kuncir Kuda', desc: 'Kuncir ekor kuda siap aksi' },
  { id: 'bob', label: 'Bob Pendek', desc: 'Potongan rambut modern ringkas' },
  { id: 'hijab', label: 'Hijab Rescuer', desc: 'Hijab tim tanggap bencana' },
  { id: 'headband', label: 'Ikat Kepala', desc: 'Ikat kepala penjelajah lapangan' },
  { id: 'cap', label: 'Topi Lapangan', desc: 'Topi pelindung terik matahari' },
];

const HAIR_COLORS: { color: string; label: string }[] = [
  { color: '#1e1b18', label: 'Hitam Pekat' },
  { color: '#3e2723', label: 'Cokelat Kayu' },
  { color: '#854d0e', label: 'Cokelat Emas' },
  { color: '#991b1b', label: 'Merah Bata' },
  { color: '#166534', label: 'Hijau Hutan' },
  { color: '#1d4ed8', label: 'Biru Samudera' },
  { color: '#7e22ce', label: 'Ungu Cyber' },
  { color: '#94a3b8', label: 'Perak Titanium' },
  { color: '#eab308', label: 'Pirang Pasir' },
];

const EYE_OPTIONS: { id: CustomAvatarConfig['eyes']; label: string; desc: string }[] = [
  { id: 'determined', label: 'Mata Fokus & Berani', desc: 'Tatapan percaya diri siap menghadapi misi' },
  { id: 'happy', label: 'Senyum Ceria & Ramah', desc: 'Wajah ramah menenangkan korban bencana' },
  { id: 'focus', label: 'Sorot Analitis Peneliti', desc: 'Fokus tinggi menganalisis data kegempaan' },
  { id: 'goggles', label: 'Kacamata Safety Visor', desc: 'Pelindung mata dari debu & gas vulkanik' },
  { id: 'glasses', label: 'Kacamata Riset Geologi', desc: 'Kacamata ilmuwan ahli kebumian' },
];

const OUTFIT_OPTIONS: { id: CustomAvatarConfig['outfit']; label: string; desc: string; color: string }[] = [
  { id: 'vest-orange', label: 'Rompi Evakuasi SAR Oranye', desc: 'Standar tim penyelamat darurat & BPBD', color: '#ea580c' },
  { id: 'jacket-blue', label: 'Jaket Geologi Lapangan Biru', desc: 'Seragam observasi survei lempeng bumi', color: '#0284c7' },
  { id: 'gear-red', label: 'Baju Hazmat Vulkanik Merah', desc: 'Pakaian proteksi zona merah bahaya letusan', color: '#dc2626' },
  { id: 'khaki', label: 'Kemeja Ranger Konservasi', desc: 'Seragam penjelajah medan terjal & lereng', color: '#a16207' },
  { id: 'cyber', label: 'Armor Cyber Mech Suit', desc: 'Zirah berteknologi sensor gempa masa depan', color: '#0f172a' },
];

const ACCESSORY_OPTIONS: { id: CustomAvatarConfig['accessory']; label: string; desc: string }[] = [
  { id: 'none', label: 'Tanpa Aksesoris', desc: 'Tampilan rapi tanpa perlengkapan tambahan' },
  { id: 'walkie', label: 'Walkie-Talkie HT SAR', desc: 'Perangkat radio komunikasi darurat di pundak' },
  { id: 'headlamp', label: 'Headlamp Senter Kepala', desc: 'Lampu sorot penerangan gua & lorong gelap' },
  { id: 'mask', label: 'Masker Respirator Filter Gas', desc: 'Penyaring udara beracun dan partikel abu sulfur' },
  { id: 'badge', label: 'Lencana Bintang Emas Taruna', desc: 'Medali kehormatan kesiapsiagaan berprestasi' },
];

const BG_THEME_OPTIONS: { id: CustomAvatarConfig['bgTheme']; label: string; desc: string; color: string }[] = [
  { id: 'amber', label: 'Lava Magma Gold', desc: 'Nuansa energi panas bumi & inti lempeng', color: '#f59e0b' },
  { id: 'blue', label: 'Samudera Nusantara', desc: 'Nuansa zona subduksi lempeng laut dalam', color: '#38bdf8' },
  { id: 'emerald', label: 'Hutan Hujan Tropis', desc: 'Nuansa vegetasi subur pegunungan', color: '#34d399' },
  { id: 'rose', label: 'Magma Crimson Glow', desc: 'Nuansa api kawah dan lava pijar aktif', color: '#fb7185' },
  { id: 'purple', label: 'Senja Vulkanik Ungu', desc: 'Nuansa langit malam observasi kegempaan', color: '#c084fc' },
  { id: 'cyan', label: 'Neon Cyber Rescue', desc: 'Nuansa hologram radar sensor seismik', color: '#22d3ee' },
];

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  isOpen,
  initialConfig = DEFAULT_CUSTOM_AVATAR,
  onClose,
  onSave,
}) => {
  const [avatar, setAvatar] = useState<CustomAvatarConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<'hair' | 'skin' | 'eyes' | 'outfit' | 'accessory' | 'bg'>('hair');

  if (!isOpen) return null;

  const handleRandomize = () => {
    retroAudio.playSelect();
    const randomSkin = SKIN_OPTIONS[Math.floor(Math.random() * SKIN_OPTIONS.length)].id;
    const randomHair = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].id;
    const randomColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].color;
    const randomEyes = EYE_OPTIONS[Math.floor(Math.random() * EYE_OPTIONS.length)].id;
    const randomOutfit = OUTFIT_OPTIONS[Math.floor(Math.random() * OUTFIT_OPTIONS.length)].id;
    const randomAccessory = ACCESSORY_OPTIONS[Math.floor(Math.random() * ACCESSORY_OPTIONS.length)].id;
    const randomBg = BG_THEME_OPTIONS[Math.floor(Math.random() * BG_THEME_OPTIONS.length)].id;

    setAvatar({
      skin: randomSkin,
      hairStyle: randomHair,
      hairColor: randomColor,
      eyes: randomEyes,
      outfit: randomOutfit,
      accessory: randomAccessory,
      bgTheme: randomBg,
    });
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    retroAudio.playSelect();
    setAvatar({ ...preset.config });
  };

  const handleSave = () => {
    retroAudio.playSelect();
    onSave(avatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 animate-fade-in font-pixel select-none">
      <div
        className="relative w-full max-h-[94vh] flex flex-col pixel-wood-board p-4 sm:p-6 md:p-7 overflow-hidden shadow-[0_12px_0_#231206] rounded-2xl"
        style={{ width: '980px', maxWidth: '95vw', background: '#fef3c7' }}
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between pb-3.5 border-b-3 border-amber-950/30">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-amber-950 flex items-center justify-center shadow-[0_3px_0_#78350f]">
              <PixelAvatarRenderer config={avatar} size={32} bordered={false} />
            </div>
            <div>
              <h2 className="font-pixel-title text-base sm:text-xl text-amber-950 tracking-wider">
                BENGKEL AVATAR RESQ-TEAM
              </h2>
              <p className="text-xs sm:text-sm text-amber-900">
                Kustomisasi karakter penyelamatmu secara bebas dan simpan langsung ke profil akun!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-amber-200 border-2 border-amber-950 flex items-center justify-center font-pixel-title text-sm text-amber-950 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer shadow-[0_2px_0_#78350f]"
            title="Tutup Modal"
          >
            ✕
          </button>
        </div>

        {/* ── BODY (2 COLUMNS: PREVIEW + EDIT TABS) ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-4 overflow-y-auto flex-1 pr-1">
          
          {/* Left Column: Avatar Live Preview & Quick Actions */}
          <div className="md:col-span-4 flex flex-col items-center justify-start bg-amber-900/10 p-4 sm:p-5 rounded-2xl border-3 border-amber-950/40 space-y-4">
            
            {/* Live Preview Screen */}
            <div className="w-full flex flex-col items-center bg-amber-950/10 py-4 px-3 rounded-xl border-2 border-amber-950/30">
              <div className="relative group">
                <PixelAvatarRenderer config={avatar} size={140} animate={false} />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full border-2 border-slate-950 shadow">
                  ● LIVE
                </div>
              </div>

              <div className="text-center mt-3">
                <span className="text-[10px] text-amber-800 uppercase tracking-widest font-bold block">
                  PRATINJAU KARAKTER
                </span>
                <p className="text-xs sm:text-sm text-amber-950 font-bold">
                  {avatar.outfit.replace('-', ' ').toUpperCase()}
                </p>
              </div>
            </div>

            {/* Randomize button */}
            <button
              onClick={handleRandomize}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-3 border-amber-950 shadow-[0_4px_0_#78350f] flex items-center justify-center gap-2 text-xs sm:text-sm transition-transform active:translate-y-1 cursor-pointer"
            >
              <PixelIcon name="dice" size={18} />
              <span>ACAK AVATAR (RANDOM)</span>
            </button>

            {/* Quick Presets (NO EMOJIS, ACTUAL MINI PIXEL AVATARS) */}
            <div className="w-full pt-3 border-t-2 border-amber-950/20">
              <span className="text-[11px] text-amber-900 font-bold flex items-center justify-center gap-1.5 mb-2 uppercase tracking-wider">
                <PixelIcon name="lightning" size={13} />
                <span>PRESET KARAKTER CEPAT:</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleApplyPreset(preset)}
                    className="p-1.5 bg-amber-100 hover:bg-amber-200 border-2 border-amber-950 rounded-xl flex items-center gap-2 text-left transition-all active:scale-95 cursor-pointer shadow-[0_2px_0_#78350f]"
                  >
                    <PixelAvatarRenderer config={preset.config} size={36} bordered={true} />
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] text-amber-950 font-bold block leading-tight">
                        {preset.name}
                      </span>
                      <span className="text-[9px] text-amber-800 block leading-tight">
                        {preset.subtitle}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Customization Tabs & Options */}
          <div className="md:col-span-8 flex flex-col space-y-3.5">
            
            {/* Category Navigation Pills (Clean Pixel Labels, NO EMOJIS) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pb-1">
              {[
                { id: 'hair', label: 'RAMBUT' },
                { id: 'skin', label: 'KULIT' },
                { id: 'eyes', label: 'MATA' },
                { id: 'outfit', label: 'SERAGAM' },
                { id: 'accessory', label: 'AKSESORIS' },
                { id: 'bg', label: 'LATAR' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      retroAudio.playHover();
                      setActiveTab(tab.id as any);
                    }}
                    className={`py-2 px-2 rounded-xl border-2 border-amber-950 text-xs sm:text-sm font-bold text-center cursor-pointer transition-all ${
                      isActive
                        ? 'bg-amber-950 text-amber-300 shadow-[0_3px_0_#451a03] scale-102'
                        : 'bg-amber-200/90 text-amber-950 hover:bg-amber-300 shadow-[0_2px_0_#78350f]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT BOX */}
            <div className="bg-amber-50/90 p-4 sm:p-5 rounded-2xl border-3 border-amber-950/30 flex-1 overflow-y-auto max-h-[52vh] shadow-inner">
              
              {/* 1. HAIR & HEADWEAR TAB */}
              {activeTab === 'hair' && (
                <div className="space-y-5">
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-amber-950 block mb-2.5">
                      PILIH MODEL RAMBUT / PENUTUP KEPALA:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {HAIR_STYLES.map((h) => {
                        const isSelected = avatar.hairStyle === h.id;
                        const previewConfig: CustomAvatarConfig = { ...avatar, hairStyle: h.id };
                        return (
                          <button
                            key={h.id}
                            onClick={() => {
                              retroAudio.playSelect();
                              setAvatar({ ...avatar, hairStyle: h.id });
                            }}
                            className={`p-2.5 rounded-xl border-2 border-amber-950 flex items-center gap-3 text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-400 text-amber-950 font-bold shadow-[0_3px_0_#78350f] ring-2 ring-amber-950'
                                : 'bg-white hover:bg-amber-100 text-amber-950 shadow-[0_2px_0_#78350f]'
                            }`}
                          >
                            <PixelAvatarRenderer config={previewConfig} size={48} bordered={true} />
                            <div className="min-w-0 flex-1">
                              <span className="text-xs sm:text-sm block font-bold leading-tight">{h.label}</span>
                              <span className="text-[10px] text-amber-800 block leading-tight">{h.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t-2 border-amber-950/20">
                    <label className="text-xs sm:text-sm font-bold text-amber-950 block mb-2.5">
                      PILIH WARNA RAMBUT / HIJAB:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                      {HAIR_COLORS.map((c) => {
                        const isSelected = avatar.hairColor === c.color;
                        return (
                          <button
                            key={c.color}
                            onClick={() => {
                              retroAudio.playSelect();
                              setAvatar({ ...avatar, hairColor: c.color });
                            }}
                            className={`p-2.5 rounded-xl border-2 border-amber-950 flex items-center gap-2.5 cursor-pointer transition-all ${
                              isSelected
                                ? 'ring-2 ring-amber-950 bg-amber-300 font-bold shadow-[0_2px_0_#78350f]'
                                : 'bg-white hover:bg-amber-100 shadow-[0_2px_0_#78350f]'
                            }`}
                          >
                            <span
                              className="w-6 h-6 rounded-lg border-2 border-amber-950 shrink-0 shadow-inner"
                              style={{ backgroundColor: c.color }}
                            />
                            <span className="text-[11px] text-amber-950 font-bold truncate">
                              {c.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. SKIN TONE TAB */}
              {activeTab === 'skin' && (
                <div>
                  <label className="text-xs sm:text-sm font-bold text-amber-950 block mb-3">
                    PILIH WARNA KULIT KARAKTER:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SKIN_OPTIONS.map((s) => {
                      const isSelected = avatar.skin === s.id;
                      const previewConfig: CustomAvatarConfig = { ...avatar, skin: s.id };
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            retroAudio.playSelect();
                            setAvatar({ ...avatar, skin: s.id });
                          }}
                          className={`p-3 rounded-xl border-2 border-amber-950 flex items-center gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-amber-950 font-bold shadow-[0_3px_0_#78350f] ring-2 ring-amber-950'
                              : 'bg-white hover:bg-amber-100 text-amber-950 shadow-[0_2px_0_#78350f]'
                          }`}
                        >
                          <PixelAvatarRenderer config={previewConfig} size={48} bordered={true} />
                          <div className="text-left min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-bold block leading-tight">{s.label}</span>
                            <span className="text-[10px] text-amber-800 block leading-tight">
                              {s.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. EYES & EXPRESSION TAB */}
              {activeTab === 'eyes' && (
                <div>
                  <label className="text-xs sm:text-sm font-bold text-amber-950 block mb-3">
                    PILIH EKSPRESI MATA & VISOR KACAMATA:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EYE_OPTIONS.map((e) => {
                      const isSelected = avatar.eyes === e.id;
                      const previewConfig: CustomAvatarConfig = { ...avatar, eyes: e.id };
                      return (
                        <button
                          key={e.id}
                          onClick={() => {
                            retroAudio.playSelect();
                            setAvatar({ ...avatar, eyes: e.id });
                          }}
                          className={`p-3 rounded-xl border-2 border-amber-950 flex items-center gap-3 text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-amber-950 font-bold shadow-[0_3px_0_#78350f] ring-2 ring-amber-950'
                              : 'bg-white hover:bg-amber-100 text-amber-950 shadow-[0_2px_0_#78350f]'
                          }`}
                        >
                          <PixelAvatarRenderer config={previewConfig} size={48} bordered={true} />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-bold block leading-tight mb-0.5">{e.label}</span>
                            <span className="text-[10px] text-amber-800 block leading-tight">{e.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. OUTFIT TAB */}
              {activeTab === 'outfit' && (
                <div>
                  <label className="text-xs sm:text-sm font-bold text-amber-950 block mb-3">
                    PILIH SERAGAM LAPANGAN / KOSTUM TIM SAR:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {OUTFIT_OPTIONS.map((o) => {
                      const isSelected = avatar.outfit === o.id;
                      const previewConfig: CustomAvatarConfig = { ...avatar, outfit: o.id };
                      return (
                        <button
                          key={o.id}
                          onClick={() => {
                            retroAudio.playSelect();
                            setAvatar({ ...avatar, outfit: o.id });
                          }}
                          className={`p-3 rounded-xl border-2 border-amber-950 flex items-center gap-3 text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-amber-950 font-bold shadow-[0_3px_0_#78350f] ring-2 ring-amber-950'
                              : 'bg-white hover:bg-amber-100 text-amber-950 shadow-[0_2px_0_#78350f]'
                          }`}
                        >
                          <PixelAvatarRenderer config={previewConfig} size={48} bordered={true} />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-bold block leading-tight">{o.label}</span>
                            <span className="text-[10px] text-amber-800 block leading-tight">{o.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. ACCESSORIES TAB */}
              {activeTab === 'accessory' && (
                <div>
                  <label className="text-xs sm:text-sm font-bold text-amber-950 block mb-3">
                    PILIH PERLENGKAPAN / AKSESORIS SIAGA BENCANA:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ACCESSORY_OPTIONS.map((a) => {
                      const isSelected = avatar.accessory === a.id;
                      const previewConfig: CustomAvatarConfig = { ...avatar, accessory: a.id };
                      return (
                        <button
                          key={a.id}
                          onClick={() => {
                            retroAudio.playSelect();
                            setAvatar({ ...avatar, accessory: a.id });
                          }}
                          className={`p-3 rounded-xl border-2 border-amber-950 flex items-center gap-3 text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-amber-950 font-bold shadow-[0_3px_0_#78350f] ring-2 ring-amber-950'
                              : 'bg-white hover:bg-amber-100 text-amber-950 shadow-[0_2px_0_#78350f]'
                          }`}
                        >
                          <PixelAvatarRenderer config={previewConfig} size={48} bordered={true} />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-bold block leading-tight mb-0.5">{a.label}</span>
                            <span className="text-[10px] text-amber-800 block leading-tight">{a.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. BACKGROUND THEME TAB */}
              {activeTab === 'bg' && (
                <div>
                  <label className="text-xs sm:text-sm font-bold text-amber-950 block mb-3">
                    PILIH TEMA WARNA LATAR LENCANA PROFIL:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BG_THEME_OPTIONS.map((b) => {
                      const isSelected = avatar.bgTheme === b.id;
                      const previewConfig: CustomAvatarConfig = { ...avatar, bgTheme: b.id };
                      return (
                        <button
                          key={b.id}
                          onClick={() => {
                            retroAudio.playSelect();
                            setAvatar({ ...avatar, bgTheme: b.id });
                          }}
                          className={`p-3 rounded-xl border-2 border-amber-950 flex items-center gap-3 text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-amber-950 font-bold shadow-[0_3px_0_#78350f] ring-2 ring-amber-950'
                              : 'bg-white hover:bg-amber-100 text-amber-950 shadow-[0_2px_0_#78350f]'
                          }`}
                        >
                          <PixelAvatarRenderer config={previewConfig} size={48} bordered={true} />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-bold block leading-tight">{b.label}</span>
                            <span className="text-[10px] text-amber-800 block leading-tight">{b.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="flex items-center justify-between pt-3.5 border-t-3 border-amber-950/20">
          <button
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border-2 border-slate-950 font-bold text-xs sm:text-sm cursor-pointer shadow-[0_3px_0_#0f172a]"
          >
            BATAL
          </button>

          <button
            onClick={handleSave}
            className="px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel-title text-xs sm:text-sm border-3 border-amber-950 shadow-[0_4px_0_#064e3b] transition-transform active:translate-y-1 cursor-pointer flex items-center gap-2"
          >
            <span>SIMPAN AVATAR SAYA</span>
            <PixelIcon name="check" size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
