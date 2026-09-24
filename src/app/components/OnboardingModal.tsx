import { useState, useEffect } from 'react';

const ONBOARDING_STEPS = [
  {
    title: 'Selamat Datang di RESQ-BOX!',
    description: 'Mari belajar mitigasi bencana dengan merancang alarm otomatis menggunakan sensor.',
    icon: 'school',
    color: 'text-primary'
  },
  {
    title: 'Panel Kiri: Susun Logika',
    description: 'Tarik komponen dari kategori di sebelah kiri dan susun di dalam area kerja untuk membuat aturan peringatan.',
    icon: 'extension',
    color: 'text-secondary-container'
  },
  {
    title: 'Panel Sensor & Output',
    description: 'Di bawah kanan, ada simulasi Output (Console) dan panel untuk mengatur nilai Sensor secara manual.',
    icon: 'sensors',
    color: 'text-tertiary-container'
  },
  {
    title: 'Uji & Validasi!',
    description: 'Klik tombol "Mulai" di atas untuk mencoba sistem peringatanmu. Jika misimu selesai, klik tombol Validasi!',
    icon: 'task_alt',
    color: 'text-[#16A34A]'
  }
];

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeen = localStorage.getItem('resq_onboarding_seen');
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    localStorage.setItem('resq_onboarding_seen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const currentInfo = ONBOARDING_STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl shadow-xl border border-outline-variant w-full max-w-[384px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Progress bar */}
        <div className="flex h-1 bg-surface-container">
          {ONBOARDING_STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 transition-all duration-300 ${i <= step ? 'bg-primary' : 'bg-transparent'}`} 
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-xl flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-12 ${currentInfo.color}`}>
            <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {currentInfo.icon}
            </span>
          </div>
          
          <h2 className="font-headline-sm font-bold text-on-surface mb-sm">
            {currentInfo.title}
          </h2>
          
          <p className="font-body-md text-on-surface-variant min-h-[60px]">
            {currentInfo.description}
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 bg-surface-container-lowest flex justify-between gap-3 border-t border-outline-variant">
          <button
            onClick={handleClose}
            className="px-6 py-3 rounded-xl font-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Lewati
          </button>
          
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-12 bg-primary text-on-primary font-label-md font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
          >
            {step === ONBOARDING_STEPS.length - 1 ? 'Mulai Belajar!' : 'Lanjut'}
          </button>
        </div>
      </div>
    </div>
  );
}
