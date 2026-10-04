import re

with open('src/app/Workspace/BlockEditor/BlocklyComponent.tsx', 'r', encoding='utf-8') as f:
    tb = f.read()
tb_types = re.findall(r"type:\s*'([^']+)'", tb)

with open('src/engine/blockly/blocks/core.ts', 'r', encoding='utf-8') as f:
    core = f.read()
core_blocks = set(re.findall(r"Blockly\.Blocks\['([^']+)'\]", core))

with open('src/engine/blockly/jsGenerator.ts', 'r', encoding='utf-8') as f:
    jsg = f.read()
js_blocks = set(re.findall(r"javascriptGenerator\.forBlock\['([^']+)'\]", jsg))

print(f"Toolbox total blocks: {len(tb_types)}")
missing_in_core = [t for t in tb_types if t not in core_blocks and t != 'math_number']
print(f"Toolbox blocks MISSING in core.ts: {missing_in_core}")

missing_in_js = [t for t in tb_types if t not in js_blocks]
print(f"Toolbox blocks MISSING in jsGenerator.ts: {missing_in_js}")



