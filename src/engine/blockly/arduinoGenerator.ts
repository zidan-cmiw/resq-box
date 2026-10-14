import * as Blockly from 'blockly/core';

class ArduinoGenerator extends Blockly.CodeGenerator {
  constructor() {
    super('Arduino');
    this.INDENT = '  ';
  }

  init(_workspace: Blockly.Workspace) {
    // Clear any existing state
    // We cast to any to bypass TS strict mode for these internal Blockly generator fields
    const _this = this as any;
    if (!_this.definitions_) {
      _this.definitions_ = Object.create(null);
    } else {
      for (const key in _this.definitions_) {
        delete _this.definitions_[key];
      }
    }

    if (!_this.functionNames_) {
      _this.functionNames_ = Object.create(null);
    } else {
      for (const key in _this.functionNames_) {
        delete _this.functionNames_[key];
      }
    }

    if (!_this.nameDB_) {
      _this.nameDB_ = new Blockly.Names(_this.RESERVED_WORDS_);
    } else {
      _this.nameDB_.reset();
    }
  }

  finish(code: string) {
    const _this = this as any;
    const definitions = [];
    if (_this.definitions_) {
      for (const name in _this.definitions_) {
        definitions.push(_this.definitions_[name]);
      }
    }
    
    // Clean up
    _this.definitions_ = Object.create(null);
    _this.functionNames_ = Object.create(null);
    if (_this.nameDB_) {
      _this.nameDB_.reset();
    }

    const allDefs = definitions.join('\n\n');
    return (allDefs ? allDefs + '\n\n' : '') + code;
  }

  scrub_(block: Blockly.Block, code: string, opt_thisOnly?: boolean) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = opt_thisOnly ? '' : this.blockToCode(nextBlock);
    return code + nextCode;
  }

  // Public helper to add definitions
  addDefinition(name: string, code: string) {
    const _this = this as any;
    if (!_this.definitions_) {
      _this.definitions_ = Object.create(null);
    }
    _this.definitions_[name] = code;
  }
}

export const arduinoGenerator = new ArduinoGenerator();
