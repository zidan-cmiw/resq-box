import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MISSIONS, CATEGORIES } from '../../missions/data/missions';
import { useMissionStore } from '../../store/missionStore';
import { validateMission } from '../../missions/engine/validationEngine';
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from '../../engine/blockly/jsGenerator';
import { useWorkspaceStore } from '../../store/workspaceStore';

export default function MissionPanel({ missionId }: { missionId: string }) {
  const navigate = useNavigate();
  const mission = MISSIONS.find((m) => m.id === missionId);

  const [currentStep, setCurrentStep] = useState(0);

  const { completeMission, setValidationResult, validationStatus, validationMessage } =
    useMissionStore();

  if (!mission) {
    return (
      <div className="w-72 bg-surface-container border-r border-outline-variant flex items-center justify-center text-on-surface-variant p-md">
        <p className="font-body-sm text-body-sm">Misi tidak ditemukan.</p>
      </div>
    );
  }

  const steps = mission.steps;
  const totalSteps = steps.length;
  const step = steps[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  const handleValidate = () => {
    setValidationResult('checking', '');
    setTimeout(() => {
      const workspace = Blockly.getMainWorkspace();
      const generatedCode = javascriptGenerator.workspaceToCode(workspace);

      const result = validateMission(mission, workspace, generatedCode);
      if (result.passed) {
        completeMission(mission.id);
        setValidationResult('pass', 'Misi selesai! Instruksi penyelamatan kamu sudah benar!');
      } else {
        setValidationResult('fail', result.failureReason ?? 'Terjadi kesalahan yang tidak diketahui.');
      }
    }, 600);
  };

  const handleFinish = () => {
    useWorkspaceStore.getState().clearDraft(mission.id);
    navigate('/');
  };

  const isChecking = validationStatus === 'checking';
  const isPassed = validationStatus === 'pass';
  const isFailed = validationStatus === 'fail';

  // Step colors based on step type
  const stepAccent =
    step.icon === 'auto_stories'
      ? { bg: 'bg-[#EFF6FF]', iconBg: 'bg-[#3B82F6]', border: 'border-[#93C5FD]' }
      : step.icon === 'inventory_2'
      ? { bg: 'bg-[#FFF7ED]', iconBg: 'bg-[#F97316]', border: 'border-[#FED7AA]' }
      : step.icon === 'cable'
      ? { bg: 'bg-[#F0FDF4]', iconBg: 'bg-[#16A34A]', border: 'border-[#86EFAC]' }
      : step.icon === 'extension'
      ? { bg: 'bg-[#FDF4FF]', iconBg: 'bg-[#A855F7]', border: 'border-[#D8B4FE]' }
      : { bg: 'bg-[#FFF7ED]', iconBg: 'bg-secondary-container', border: 'border-[#FED7AA]' };

  return (
    <div className="w-72 bg-surface-container border-r border-outline-variant flex flex-col overflow-hidden shrink-0">
      {/* ── Header ── */}
      <div className="p-sm border-b border-outline-variant" style={{ background: 'rgba(253,118,26,0.08)' }}>
        <div className="flex items-center gap-xs mb-1">
          <span
            className="material-symbols-outlined text-secondary-container"
            style={{ fontSize: '18px' }}
          >
            {mission.icon}
          </span>
          <span className="font-label-caps text-label-caps text-secondary-container">
            {CATEGORIES.find((c) => c.id === mission.category)?.title.toUpperCase()} • {mission.category === 'proyek' ? 'KASUS' : 'LEVEL'} {mission.level}
          </span>
        </div>
        <h2 className="font-title-md text-title-md text-primary leading-tight">{mission.title}</h2>

        {/* Progress bar steps */}
        <div className="flex items-center gap-[3px] mt-sm">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-[5px] rounded-full transition-all duration-300 ${
                i < currentStep
                  ? 'bg-[#16A34A] flex-1'
                  : i === currentStep
                  ? 'bg-secondary-container flex-[2]'
                  : 'bg-outline-variant flex-1'
              }`}
            />
          ))}
        </div>
        <p className="font-label-caps text-label-caps text-on-surface-variant mt-xs">
          LANGKAH {currentStep + 1} DARI {totalSteps}
        </p>
      </div>

      {/* ── Step Content ── */}
      <div className="flex-1 overflow-y-auto p-sm flex flex-col gap-sm">
        {/* Step Card */}
        <div
          className={`rounded-xl border ${stepAccent.border} ${stepAccent.bg} p-sm flex flex-col gap-sm`}
        >
          {/* Step Icon + Title */}
          <div className="flex items-center gap-sm">
            <div
              className={`h-10 w-10 rounded-xl ${stepAccent.iconBg} flex items-center justify-center shrink-0`}
            >
              <span
                className="material-symbols-outlined text-white"
                style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
              >
                {step.icon}
              </span>
            </div>
            <h3 className="font-title-md text-title-md text-on-surface leading-tight">
              {step.title}
            </h3>
          </div>

          {/* Description — support newlines */}
          <div className="font-body-sm text-body-sm text-on-surface leading-relaxed whitespace-pre-line">
            {step.description}
          </div>
        </div>

        {/* Tip box (optional) */}
        {step.tip && (
          <div className="flex items-start gap-xs bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-sm">
            <span
              className="material-symbols-outlined text-[#D97706] shrink-0"
              style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
            >
              lightbulb
            </span>
            <p className="font-body-sm text-body-sm text-[#92400E] leading-relaxed">{step.tip}</p>
          </div>
        )}

        {/* Step dots indicator */}
        <div className="flex items-center justify-center gap-xs mt-auto pt-xs">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`rounded-full transition-all duration-200 ${
                i === currentStep
                  ? 'w-5 h-2 bg-secondary-container'
                  : i < currentStep
                  ? 'w-2 h-2 bg-[#16A34A]'
                  : 'w-2 h-2 bg-outline-variant'
              }`}
            />
          ))}
        </div>

        {/* Validation Result (shown on last step) */}
        {isLastStep && (isPassed || isFailed) && (
          <div
            className={`rounded-lg p-sm border flex items-start gap-xs ${
              isPassed
                ? 'border-[#16A34A] text-[#16A34A]'
                : 'border-error text-error'
            }`}
            style={{ background: isPassed ? 'rgba(22,163,74,0.08)' : 'rgba(186,26,26,0.08)' }}
          >
            <span
              className="material-symbols-outlined shrink-0"
              style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
            >
              {isPassed ? 'check_circle' : 'error'}
            </span>
            <p className="font-body-sm text-body-sm leading-relaxed">{validationMessage}</p>
          </div>
        )}
      </div>

      {/* ── Footer Navigation ── */}
      <div className="p-sm border-t border-outline-variant flex flex-col gap-xs">
        {/* Prev / Next navigation */}
        {!isPassed && (
          <div className="flex gap-xs">
            <button
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={isFirstStep}
              className={`flex-1 py-sm px-sm font-label-caps text-label-caps rounded tactile-btn flex items-center justify-center gap-xs transition-colors ${
                isFirstStep
                  ? 'bg-surface-variant text-on-surface-variant opacity-40 cursor-not-allowed'
                  : 'bg-surface-container-high border border-outline-variant text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                arrow_back
              </span>
              KEMBALI
            </button>

            {isLastStep ? (
              /* Validate button on last step */
              <button
                onClick={handleValidate}
                disabled={isChecking}
                className={`flex-[2] py-sm px-sm font-label-caps text-label-caps rounded tactile-btn flex items-center justify-center gap-xs transition-colors ${
                  isChecking
                    ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
                    : 'bg-primary text-on-primary hover:opacity-90'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  {isChecking ? 'hourglass_empty' : 'verified'}
                </span>
                {isChecking ? 'MENGECEK...' : 'VALIDASI!'}
              </button>
            ) : (
              /* Next step button */
              <button
                onClick={() => setCurrentStep((s) => Math.min(totalSteps - 1, s + 1))}
                className="flex-[2] py-sm px-sm bg-secondary-container text-on-secondary-container font-label-caps text-label-caps rounded tactile-btn flex items-center justify-center gap-xs hover:opacity-90"
              >
                LANGKAH BERIKUTNYA
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  arrow_forward
                </span>
              </button>
            )}
          </div>
        )}

        {/* Selesai button setelah passed */}
        {isPassed && (
          <button
            onClick={handleFinish}
            className="w-full py-sm px-md bg-[#16A34A] text-white font-label-caps text-label-caps rounded tactile-btn flex items-center justify-center gap-xs"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              emoji_events
            </span>
            SELESAI! KEMBALI KE DASHBOARD
          </button>
        )}

        {/* Back to dashboard link */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-xs px-md text-on-surface-variant font-label-caps text-label-caps hover:text-on-surface flex items-center justify-center gap-xs"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            home
          </span>
          Keluar ke Dashboard
        </button>
      </div>
    </div>
  );
}
