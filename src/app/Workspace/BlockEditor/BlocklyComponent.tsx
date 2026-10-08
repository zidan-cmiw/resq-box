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
        { kind: 'block', type: 'resq_layar_oled' },
      ],
    },
    {
      kind: 'category',
      name: 'Simulasi Bencana',
      colour: '#DC2626',
      contents: [
        { kind: 'block', type: 'resq_gempa_sim' },
        { kind: 'block', type: 'resq_gunung_sim' },
      ],
    },
    {
      kind: 'category',
      name: 'Peringatan & EWS',
      colour: '#0D9488',
      contents: [
        { kind: 'block', type: 'resq_lampu_status' },
        { kind: 'block', type: 'resq_sirine_ews' },
        { kind: 'block', type: 'resq_sirine_stop' },
        { kind: 'block', type: 'resq_alarm_darurat' },
      ],
    },
    {
      kind: 'category',
      name: 'Aksi & Evakuasi',
      colour: '#7C3AED',
      contents: [
        { kind: 'block', type: 'resq_evak_keluar_bangunan' },
        { kind: 'block', type: 'resq_evak_tanah_lapang' },
        { kind: 'block', type: 'resq_evak_krb' },
        { kind: 'block', type: 'resq_evak_luar_map' },
        { kind: 'block', type: 'resq_evak_jauhi_sungai' },
      ],
    },
    {
      kind: 'category',
      name: 'Kondisi Bencana',
      colour: '#2563EB',
      contents: [
        { kind: 'block', type: 'resq_tipe_gempa' },
        { kind: 'block', type: 'resq_tipe_letusan' },
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
        startScale: 1.05,
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
          flyout.getWorkspace().setScale(1.05);
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

  // Force resize blockly on window resize and container resize
  useEffect(() => {
    const handleResize = () => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    };
    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (blocklyDiv.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(blocklyDiv.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-[#fefce8]">
      <div className="flex justify-between items-center px-3 py-2 border-b-2 border-[#b45309] bg-[#fef3c7] shadow-sm">
        <h2 className="font-pixel text-xs sm:text-sm text-[#451a03] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#b45309]" style={{ fontSize: '18px' }}>widgets</span>
          Ruang Simulasi
        </h2>
      </div>
      
      <div className="flex-1 relative flex bg-[#fefce8]">
        <div 
          ref={blocklyDiv} 
          className="absolute inset-0 w-full"
        />
      </div>
    </div>
  );
}
