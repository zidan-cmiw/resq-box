import { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks'; // Import default blocks
import { ResqTheme } from '../../../engine/blockly/theme';
import { arduinoGenerator } from '../../../engine/blockly/arduinoGenerator';
import { javascriptGenerator } from '../../../engine/blockly/jsGenerator';
import { defineCoreBlocks } from '../../../engine/blockly/blocks/core';
import { useWorkspaceStore } from '../../../store/workspaceStore';

// Initialize our custom blocks
defineCoreBlocks();

const INITIAL_TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Sistem',
      colour: '#fd761a',
      contents: [
        { kind: 'block', type: 'resq_program' },
        { kind: 'block', type: 'resq_tunggu' },
        { kind: 'block', type: 'resq_ulangi' },
        { kind: 'block', type: 'resq_tampil' },
      ],
    },
    {
      kind: 'category',
      name: 'Peringatan & Lampu',
      colour: '#0D9488',
      contents: [
        { kind: 'block', type: 'resq_led' },
        { kind: 'block', type: 'resq_led_kedip' },
        { kind: 'block', type: 'resq_semua_led_mati' },
        { kind: 'block', type: 'resq_buzzer' },
        { kind: 'block', type: 'resq_buzzer_nada' },
        { kind: 'block', type: 'resq_buzzer_stop' },
        { kind: 'block', type: 'resq_alarm_darurat' },
      ],
    },
    {
      kind: 'category',
      name: 'Mekanik Evakuasi',
      colour: '#7C3AED',
      contents: [
        { kind: 'block', type: 'resq_motor' },
        { kind: 'block', type: 'resq_servo' },
      ],
    },
    {
      kind: 'category',
      name: 'Pemantauan Alam',
      colour: '#2563EB',
      contents: [
        { kind: 'block', type: 'resq_sensor_getar' },
        { kind: 'block', type: 'resq_sensor_suhu' },
        { kind: 'block', type: 'resq_tombol_1' },
        { kind: 'block', type: 'resq_tombol_2' },
        { kind: 'block', type: 'resq_getar_kuat' },
        { kind: 'block', type: 'resq_suhu_panas' },
      ],
    },
    {
      kind: 'category',
      name: 'Pengambilan Keputusan',
      colour: '#DB2777',
      contents: [
        { kind: 'block', type: 'resq_jika' },
        { kind: 'block', type: 'resq_jika_tidak' },
        { kind: 'block', type: 'resq_bandingkan' },
        { kind: 'block', type: 'resq_dan_atau' },
        { kind: 'block', type: 'resq_bukan' },
        { kind: 'block', type: 'resq_hitung' },
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'resq_teks' },
      ],
    },
  ],
};

export default function BlocklyComponent({ contextId }: { contextId: string }) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const { getActiveDraft, saveDraft } = useWorkspaceStore();

  useEffect(() => {
    if (!blocklyDiv.current) return;

    // Inject Blockly
    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: INITIAL_TOOLBOX,
      theme: ResqTheme,
      renderer: 'zelos', // Use the fun Scratch-like renderer
      grid: {
        spacing: 25,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.9,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      move: {
        scrollbars: {
          horizontal: true,
          vertical: true,
        },
        drag: true,
        wheel: true,
      },
      trashcan: true,
    });

    // Prevent flyout from zooming with the main workspace
    const toolbox = workspaceRef.current.getToolbox();
    if (toolbox) {
      const flyout = (toolbox as any).getFlyout();
      if (flyout) {
        // Disable auto-scaling in Blockly flyout
        flyout.autoScale_ = false;
        // Force reset scale to initial
        if (flyout.getWorkspace()) {
          flyout.getWorkspace().setScale(0.9);
        }
      }
    }

    // Load draft for this context, if any
    const draft = getActiveDraft();
    if (draft?.workspaceJson) {
      try {
        Blockly.serialization.workspaces.load(draft.workspaceJson, workspaceRef.current);
      } catch (e) {
        console.error('Failed to load workspace draft', e);
      }
    } else {
      // Default: spawn the main program block
      const block = workspaceRef.current.newBlock('resq_program');
      block.initSvg();
      block.render();
      block.moveBy(50, 50);
    }

    // Handle workspace changes to update Zustand and Code preview
    const onChange = (event: Blockly.Events.Abstract) => {
      // If the user zoomed the workspace, make sure flyout stays unzoomed
      if (event.type === Blockly.Events.VIEWPORT_CHANGE) {
        const flyout = (workspaceRef.current?.getToolbox() as any)?.getFlyout();
        if (flyout && flyout.getWorkspace()) {
          flyout.getWorkspace().setScale(0.9); // Lock scale to 0.9
        }
      }

      // Don't update on UI events (like scrolling/zooming) to save performance
      if (event.isUiEvent) return;

      if (workspaceRef.current) {
        // Generate code internally (needed for runtime & validation)
        const generatedCode = arduinoGenerator.workspaceToCode(workspaceRef.current);
        const generatedJsCode = javascriptGenerator.workspaceToCode(workspaceRef.current);

        // Save draft for active context
        const state = Blockly.serialization.workspaces.save(workspaceRef.current);
        saveDraft(contextId, state, generatedCode, generatedJsCode);
      }
    };

    workspaceRef.current.addChangeListener(onChange);

    // Initial code generation — run after workspace is loaded/initialized.
    // This ensures generatedJsCode in the store is always in sync with the current
    // workspace state, even before the user makes any changes (important after page refresh).
    const syncCode = () => {
      if (!workspaceRef.current) return;
      const state = Blockly.serialization.workspaces.save(workspaceRef.current);
      const initialArduinoCode = arduinoGenerator.workspaceToCode(workspaceRef.current);
      const initialJsCode = javascriptGenerator.workspaceToCode(workspaceRef.current);
      saveDraft(contextId, state, initialArduinoCode, initialJsCode);
    };
    syncCode();

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, []); // Empty dependency array to run only once on mount

  // Force resize blockly on window resize
  useEffect(() => {
    const handleResize = () => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-surface">
      <div className="flex justify-between items-center p-sm border-b border-outline-variant bg-surface-container-lowest">
        <h2 className="font-title-md text-title-md text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-container">widgets</span>
          Ruang Simulasi
        </h2>
      </div>
      
      <div className="flex-1 relative flex">
        <div 
          ref={blocklyDiv} 
          className="absolute inset-0 w-full"
        />
      </div>
    </div>
  );
}
