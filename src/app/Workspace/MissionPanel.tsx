import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MISSIONS, CATEGORIES } from '../../missions/data/missions';
import { useMissionStore } from '../../store/missionStore';
import { validateMission } from '../../missions/engine/validationEngine';
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from '../../engine/blockly/jsGenerator';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { retroAudio } from '../../utils/retroAudio';

export default function MissionPanel({ missionId, onClose }: { missionId: string; onClose?: () => void }) {
  const navigate = useNavigate();
  const mission = MISSIONS.find((m) => m.id === missionId);

  const [currentStep, setCurrentStep] = useState(0);

  const { completeMission, setValidationResult, validationStatus, validationMessage } =
    useMissionStore();

  if (!mission) {
    return (
      <aside aria-label="Panduan Misi" className="w-80 max-w-[85vw] bg-[#16120e] border-r-2 border-amber-950 flex items-center justify-center text-amber-200/60 p-4 font-pixel text-[13px] font-semibold">
        <p>Misi tidak ditemukan.</p>
      </aside>
    );
  }

  const steps = mission.steps;
  const totalSteps = steps.length;
  const step = steps[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  const handleValidate = () => {
    retroAudio.playSelect();
    setValidationResult('checking', '');
    setTimeout(() => {
      const workspace = Blockly.getMainWorkspace();
      const generatedCode = javascriptGenerator.workspaceToCode(workspace);

      const result = validateMission(mission, workspace, generatedCode);
      if (result.passed) {
        completeMission(mission.id);
        retroAudio.playWin();
        setValidationResult('pass', 'Luar biasa! Seluruh instruksi mitigasimu sudah benar dan diverifikasi!');
      } else {
        retroAudio.playHurt();
        setValidationResult('fail', result.failureReason ?? 'Rangkaian blok belum sesuai dengan kriteria misi.');
      }
    }, 600);
  };

  const handleFinish = () => {
    retroAudio.playSelect();
    useWorkspaceStore.getState().clearDraft(mission.id);
    navigate('/level3');
  };

  const isChecking = validationStatus === 'checking';
  const isPassed = validationStatus === 'pass';
  const isFailed = validationStatus === 'fail';

  const categoryObj = CATEGORIES.find((c) => c.id === mission.category);

  return (
    <aside aria-label="Panduan Misi" className="w-80 max-w-[85vw] bg-[#fffbeb] border-r-4 border-[#78350f] flex flex-col overflow-hidden shrink-0 font-pixel text-[#1c1917] shadow-xl">
      {/* ── 1. HEADER MISSION CARD (SS 3 Warm Parchment) ── */}
      <div className="p-3.5 border-b-2 border-[#b45309] bg-[#fef3c7]">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded text-[13.5px] font-bold uppercase tracking-wider bg-[#b45309] text-white shadow-sm font-pixel">
              {categoryObj?.title.toUpperCase()} • {mission.category === 'proyek' ? 'KASUS' : 'LEVEL'} {mission.level}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[13.5px] text-[#78350f] font-bold">
              {currentStep + 1} / {totalSteps}
            </span>
            {onClose && (
              <button aria-label="Tutup"
                onClick={onClose}
                className="w-5 h-5 rounded bg-[#b45309] hover:bg-[#92400e] text-white flex items-center justify-center font-bold text-[13.5px] cursor-pointer lg:hidden"
                title="Tutup Panduan Misi"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <h2 className="text-[15px] sm:text-base font-extrabold text-[#451a03] leading-snug font-sans">
          {mission.title}
        </h2>

        {/* Step Progression Pips */}
        <div className="flex items-center gap-1.5 mt-2.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                retroAudio.playSelect();
                setCurrentStep(i);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i < currentStep
                ? 'bg-[#15803d] flex-1'
                : i === currentStep
                  ? 'bg-[#b45309] flex-[2] ring-2 ring-[#78350f]'
                  : 'bg-[#d6d3d1] border border-[#a8a29e] flex-1'
                }`}
              title={`Langkah ${i + 1}: ${steps[i].title}`}
            />
          ))}
        </div>
      </div>

      {/* ── 2. SCROLLABLE MISSION BRIEF & STEP CONTENT ── */}
      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3 font-sans bg-[#fffbeb]">
        {/* Step Card: Warm High-Contrast Parchment (SS 3 Style) */}
        <div className="rounded-xl border-2 border-[#b45309] bg-[#fefce8] p-3.5 flex flex-col gap-2.5 shadow-sm text-[#1c1917]">
          {/* Step Icon & Title */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#b45309]/20">
            <div className="w-8 h-8 rounded-lg bg-[#b45309] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {step.icon}
              </span>
            </div>
            <h3 className="font-bold text-[#451a03] text-[15px] sm:text-base leading-tight">
              {step.title}
            </h3>
          </div>

          {/* Description — crisp dark text with high contrast */}
          <div className="text-[13px] sm:text-[15px] text-[#292524] leading-relaxed whitespace-pre-line font-medium">
            {step.description}
          </div>
        </div>

        {/* Tip Box (SS 3 Style Fact Box) */}
        {step.tip && (
          <div className="flex items-start gap-2 bg-[#fef3c7] border-2 border-[#d97706] rounded-xl p-3 text-[#78350f] shadow-sm">
            <p className="text-[13px] sm:text-[15px] text-[#78350f] font-semibold leading-relaxed">
              {step.tip}
            </p>
          </div>
        )}

        {/* Quick Toolbox Category Guide */}
        {mission.hint && (
          <div className="flex items-start gap-2 bg-[#ecfdf5] border-2 border-[#059669] rounded-xl p-3 text-[#065f46] shadow-sm">
            <div>
              <span className="text-[14.5px] font-black uppercase tracking-wider block text-[#047857] mb-0.5">
                PANDUAN LOKASI BLOK:
              </span>
              <p className="text-[13px] sm:text-[15px] font-semibold leading-relaxed text-[#064e3b]">
                {mission.hint}
              </p>
            </div>
          </div>
        )}

        {/* Validation Result Box */}
        {isLastStep && (isPassed || isFailed) && (
          <div
            className={`rounded-xl p-3.5 border-2 flex items-start gap-2.5 shadow-md ${isPassed
              ? 'bg-[#f0fdf4] border-[#16a34a] text-[#15803d]'
              : 'bg-[#fff1f2] border-[#e11d48] text-[#be123c]'
              }`}
          >
            <span className="text-lg shrink-0 mt-0.5 font-medium">
 {isPassed ? '' : '⚠'}
            </span>
            <div className="flex-1">
              <p className="text-[15px] font-bold leading-tight mb-1">
                {isPassed ? 'MISI BERHASIL TUNTAS!' : 'PERLU PENYESUAIAN BLOK'}
              </p>
              <p className="text-[13px] sm:text-[15px] leading-relaxed font-medium">
                {validationMessage}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. BOTTOM FOOTER NAVIGATION ── */}
      <div className="p-3.5 border-t-2 border-[#b45309] bg-[#fef3c7] flex flex-col gap-2 font-pixel">
        {/* Navigation / Validation Buttons */}
        {!isPassed && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                retroAudio.playSelect();
                setCurrentStep((s) => Math.max(0, s - 1));
              }}
              disabled={isFirstStep}
              className={`flex-1 py-2.5 px-3 rounded-lg text-[13px] sm:text-[15px] font-bold flex items-center justify-center gap-1 border-2 transition-colors ${isFirstStep
                ? 'bg-[#e7e5e4] border-[#d6d3d1] text-[#a8a29e] cursor-not-allowed'
                : 'bg-[#e7e5e4] hover:bg-[#d6d3d1] border-[#a8a29e] text-[#44403c]'
                }`}
            >
              <span>◀</span>
              <span>SEBELUM</span>
            </button>

            {isLastStep ? (
              /* Validate button on last step (SS 3 Style Orange-Amber) */
              <button
                onClick={handleValidate}
                disabled={isChecking}
                className={`flex-[2] py-2.5 px-3.5 rounded-lg text-[13px] sm:text-[15px] font-bold flex items-center justify-center gap-1.5 shadow-md transition-all border-2 border-[#7c2d12] ${isChecking
                  ? 'bg-[#b45309] text-white cursor-not-allowed animate-pulse'
                  : 'bg-gradient-to-r from-[#c2410c] to-[#b45309] hover:from-[#ea580c] hover:to-[#c2410c] text-white'
                  }`}
              >
                <span>{isChecking ? 'MENGECEK...' : 'VALIDASI MISI!'}</span>
              </button>
            ) : (

              <button
                onClick={() => {
                  retroAudio.playSelect();
                  setCurrentStep((s) => Math.min(totalSteps - 1, s + 1));
                }}
                className="flex-[2] py-2.5 px-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-[13px] sm:text-[15px] rounded-lg shadow-md flex items-center justify-center gap-1 border-2 border-emerald-700"
              >
                <span>LANJUT</span>
                <span>➔</span>
              </button>
            )}
          </div>
        )}

        {/* When passed: Large celebratory return to map button */}
        {isPassed && (
          <button
            onClick={handleFinish}
            className="w-full py-3 px-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-[13px] sm:text-[15px] rounded-xl shadow-lg flex items-center justify-center gap-2 border-2 border-emerald-700 animate-bounce"
          >
            <span>KEMBALI KE PETA LEVEL 3 ➔</span>
          </button>
        )}

        {/* Return to Level 3 Map link */}
        <button
          onClick={() => {
            retroAudio.playSelect();
            navigate('/level3');
          }}
          className="w-full py-1 text-[13px] text-[#78350f] hover:text-[#451a03] font-bold flex items-center justify-center gap-1 transition-colors"
        >
          <span>Kembali ke Peta Level 3</span>
        </button>
      </div>
    </aside>
  );
}
