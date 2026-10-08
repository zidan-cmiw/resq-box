import * as Blockly from 'blockly/core';

export const ResqTheme = Blockly.Theme.defineTheme('resqbox', {
  name: 'resqbox',
  base: Blockly.Themes.Zelos, // Zelos is the modern, Scratch-like renderer
  blockStyles: {
    logic_blocks: {
      colourPrimary: '#2563EB',
      colourSecondary: '#1D4ED8',
      colourTertiary: '#1E3A8A',
    },
    loop_blocks: {
      colourPrimary: '#16A34A',
      colourSecondary: '#15803D',
      colourTertiary: '#14532D',
    },
    math_blocks: {
      colourPrimary: '#9333EA',
      colourSecondary: '#7E22CE',
      colourTertiary: '#581C87',
    },
    variable_blocks: {
      colourPrimary: '#E11D48',
      colourSecondary: '#BE123C',
      colourTertiary: '#881337',
    },
    arduino_core_blocks: {
      colourPrimary: '#fd761a', // Using the secondary-container color from our Stitch theme
      colourSecondary: '#9d4300',
      colourTertiary: '#5c2400',
    },
    arduino_io_blocks: {
      colourPrimary: '#0D9488',
      colourSecondary: '#0F766E',
      colourTertiary: '#115E59',
    },
  },
  categoryStyles: {
    logic_category: {
      colour: '#2563EB',
    },
    loop_category: {
      colour: '#16A34A',
    },
    math_category: {
      colour: '#9333EA',
    },
    variable_category: {
      colour: '#E11D48',
    },
    arduino_core_category: {
      colour: '#fd761a',
    },
    arduino_io_category: {
      colour: '#0D9488',
    },
  },
  componentStyles: {
    workspaceBackgroundColour: '#F8FAFC',
    toolboxBackgroundColour: '#ffffff',
    toolboxForegroundColour: '#1b1b1d',
    flyoutBackgroundColour: '#f5f3f4',
    flyoutForegroundColour: '#1b1b1d',
    scrollbarColour: '#c5c6cd',
    insertionMarkerColour: '#1b1b1d',
    insertionMarkerOpacity: 0.3,
    markerColour: '#1b1b1d',
    cursorColour: '#1b1b1d',
  },
  fontStyle: {
    family: "'Plus Jakarta Sans', system-ui, sans-serif",
    weight: '600',
    size: 14,
  },
});
