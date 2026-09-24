import { useDraggable, useDroppable } from '@dnd-kit/core';
import type { MitigationAction } from '../../mitigation/data/scenarios';

// ─────────────────────────────────────────────────
// Draggable Action Block (from the available pool)
// ─────────────────────────────────────────────────
interface DraggableActionBlockProps {
  action: MitigationAction;
  isDragging?: boolean;
  isUsed?: boolean;
}

export function DraggableActionBlock({ action, isDragging = false, isUsed = false }: DraggableActionBlockProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${action.id}`,
    data: { action },
    disabled: isUsed,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 px-4 py-3 min-h-[64px] rounded-xl border-2 cursor-grab active:cursor-grabbing
        select-none transition-all duration-150 touch-none
        ${isUsed
          ? 'opacity-30 border-outline-variant bg-surface-container pointer-events-none'
          : isDragging
          ? 'opacity-70 shadow-2xl border-primary bg-primary-container scale-105'
          : 'border-outline-variant bg-surface-container hover:border-primary hover:bg-primary-container hover:shadow-md active:scale-95'
        }
      `}
    >
      <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '24px' }}>
        {action.icon}
      </span>
      <span className="font-body-sm text-body-sm text-on-surface leading-tight">{action.label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────
// Drop Slot in the answer sequence
// ─────────────────────────────────────────────────
interface DropSlotProps {
  slotIndex: number;
  placedAction: MitigationAction | null;
  isSubmitted: boolean;
  isCorrectSlot?: boolean; // only shown after submit
  onRemove?: (slotIndex: number) => void;
}

export function DropSlot({ slotIndex, placedAction, isSubmitted, isCorrectSlot, onRemove }: DropSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot-${slotIndex}`,
    data: { slotIndex },
  });

  const getSlotStyle = () => {
    if (isSubmitted && placedAction) {
      return isCorrectSlot
        ? 'border-[#16A34A] bg-[#DCFCE7]'
        : 'border-[#DC2626] bg-[#FEE2E2]';
    }
    if (isOver) return 'border-primary bg-primary-container scale-[1.02]';
    if (placedAction) return 'border-secondary bg-secondary-container';
    return 'border-dashed border-outline-variant bg-surface-container';
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 min-h-[64px] min-w-[200px]
        transition-all duration-150
        ${getSlotStyle()}
      `}
    >
      {/* Step number badge */}
      <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-caps text-label-caps shrink-0">
        {slotIndex + 1}
      </div>

      {placedAction ? (
        <>
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '18px' }}>
            {placedAction.icon}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface flex-1 leading-tight">
            {placedAction.label}
          </span>
          {/* Correct/Wrong icon after submit */}
          {isSubmitted && (
            <span
              className={`material-symbols-outlined text-xl ${isCorrectSlot ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}
            >
              {isCorrectSlot ? 'check_circle' : 'cancel'}
            </span>
          )}
          {/* Remove button (only before submit) */}
          {!isSubmitted && onRemove && (
            <button
              onClick={() => onRemove(slotIndex)}
              className="ml-auto p-xs hover:bg-error hover:text-on-error rounded-full transition-colors text-on-surface-variant"
              title="Hapus dari slot ini"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
            </button>
          )}
        </>
      ) : (
        <span className="font-label-sm text-label-sm text-on-surface-variant italic">
          {isOver ? 'Letakkan di sini...' : `Tindakan ${slotIndex + 1}`}
        </span>
      )}
    </div>
  );
}
