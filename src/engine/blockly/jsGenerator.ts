import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

const LED_PINS: Record<string, string> = { Bahaya: '10', Aman: '11', Info: '12', Bawaan: '13' };
const MOTOR_LABELS: Record<string, string> = { '0': 'Mati', '85': 'Pelan', '170': 'Sedang', '255': 'Kencang' };
const SERVO_LABELS: Record<string, string> = { '0': 'Tertutup', '90': 'Setengah', '180': 'Terbuka' };

// ── resq_program ────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_program'] = function(block: Blockly.Block) {
  const setup = javascriptGenerator.statementToCode(block, 'SETUP');
  const loop = javascriptGenerator.statementToCode(block, 'LOOP');
  return `
async function setup() {
  await api.print('Simulasi dimulai', 'system');
${setup}
}

async function loop() {
${loop}
}
`;
};

// ── resq_led ────────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_led'] = function(block: Blockly.Block) {
  const color = block.getFieldValue('COLOR');
  const pin = LED_PINS[color] || '13';
  const state = block.getFieldValue('STATE');
  const stateLabel = state === 'HIGH' ? 'menyala' : 'mati';
  return `await api.setPin('${pin}', '${state}');\nawait api.print('Lampu ${color} ${stateLabel}', 'success');\n`;
};

// ── resq_buzzer ─────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_buzzer'] = function(block: Blockly.Block) {
  const ms = block.getFieldValue('MS');
  return `await api.print('Sirine berbunyi selama ${ms}ms', 'info');\nawait api.delay(${ms});\nawait api.print('Sirine berhenti', 'info');\n`;
};

// ── resq_buzzer_stop ────────────────────────────────────────────
javascriptGenerator.forBlock['resq_buzzer_stop'] = function() {
  return `await api.print('Sirine berhenti', 'warn');\n`;
};

// ── resq_motor ──────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_motor'] = function(block: Blockly.Block) {
  const speed = block.getFieldValue('SPEED');
  const label = MOTOR_LABELS[speed] || speed;
  return `await api.print('Kipas Ventilasi ${label}', 'info');\n`;
};

// ── resq_servo ──────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_servo'] = function(block: Blockly.Block) {
  const pos = block.getFieldValue('POS');
  const label = SERVO_LABELS[pos] || pos;
  return `await api.print('Pintu Evakuasi ${label}', 'info');\n`;
};

// ── resq_tunggu ─────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_tunggu'] = function(block: Blockly.Block) {
  return `await api.delay(${block.getFieldValue('MS')});\n`;
};

// ── resq_tampil ─────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_tampil'] = function(block: Blockly.Block) {
  const val = javascriptGenerator.valueToCode(block, 'VALUE', 0) || '""';
  return `await api.print(String(${val}), 'info');\n`;
};


// ── resq_sensor_getar ───────────────────────────────────────────
javascriptGenerator.forBlock['resq_sensor_getar'] = function() {
  return [`api.getSensor('A1')`, 0];
};

// ── resq_sensor_suhu ────────────────────────────────────────────
javascriptGenerator.forBlock['resq_sensor_suhu'] = function() {
  return [`(api.getSensor('A2') * 0.4887)`, 0];
};

// ── resq_tombol_1 ───────────────────────────────────────────────
javascriptGenerator.forBlock['resq_tombol_1'] = function() {
  return [`api.getPin('D2')`, 0];
};

// ── resq_tombol_2 ───────────────────────────────────────────────
javascriptGenerator.forBlock['resq_tombol_2'] = function() {
  return [`api.getPin('D3')`, 0];
};

// ── resq_jika ───────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_jika'] = function(block: Blockly.Block) {
  const cond = javascriptGenerator.valueToCode(block, 'KONDISI', 0) || 'false';
  const maka = javascriptGenerator.statementToCode(block, 'MAKA') || '';
  return `if (${cond}) {\n${maka}}\n`;
};

// ── resq_jika_tidak ─────────────────────────────────────────────
javascriptGenerator.forBlock['resq_jika_tidak'] = function(block: Blockly.Block) {
  const cond = javascriptGenerator.valueToCode(block, 'KONDISI', 0) || 'false';
  const maka = javascriptGenerator.statementToCode(block, 'MAKA') || '';
  const tidak = javascriptGenerator.statementToCode(block, 'TIDAK') || '';
  return `if (${cond}) {\n${maka}} else {\n${tidak}}\n`;
};

// ── resq_bandingkan ─────────────────────────────────────────────
javascriptGenerator.forBlock['resq_bandingkan'] = function(block: Blockly.Block) {
  const opMap: Record<string, string> = {
    '>': '>', '<': '<', '==': '===', '!=': '!==', '>=': '>=', '<=': '<=',
  };
  const op = opMap[block.getFieldValue('OP')] || '===';
  const a = javascriptGenerator.valueToCode(block, 'A', 0) || '0';
  const b = javascriptGenerator.valueToCode(block, 'B', 0) || '0';
  return [`${a} ${op} ${b}`, 0];
};

// ── resq_dan_atau ───────────────────────────────────────────────
javascriptGenerator.forBlock['resq_dan_atau'] = function(block: Blockly.Block) {
  const op = block.getFieldValue('OP') === 'AND' ? '&&' : '||';
  const a = javascriptGenerator.valueToCode(block, 'A', 0) || 'false';
  const b = javascriptGenerator.valueToCode(block, 'B', 0) || 'false';
  return [`(${a}) ${op} (${b})`, 0];
};

// ── math_number ─────────────────────────────────────────────────
javascriptGenerator.forBlock['math_number'] = function(block: Blockly.Block) {
  return [String(block.getFieldValue('NUM') || '0'), 0];
};

// ── resq_teks ───────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_teks'] = function(block: Blockly.Block) {
  return [`"${block.getFieldValue('TEXT')}"`, 0];
};

// ── resq_ulangi ─────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_ulangi'] = function(block: Blockly.Block) {
  const n = parseInt(block.getFieldValue('KALI') || '3');
  const body = javascriptGenerator.statementToCode(block, 'DO') || '';
  return `for (let _i = 0; _i < ${n}; _i++) {\n${body}}\n`;
};

// ── resq_bukan ──────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_bukan'] = function(block: Blockly.Block) {
  const val = javascriptGenerator.valueToCode(block, 'KONDISI', 0) || 'false';
  return [`!(${val})`, 0];
};

// ── resq_hitung ─────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_hitung'] = function(block: Blockly.Block) {
  const op = block.getFieldValue('OP');
  const a = javascriptGenerator.valueToCode(block, 'A', 0) || '0';
  const b = javascriptGenerator.valueToCode(block, 'B', 0) || '0';
  return [`(${a} ${op} ${b})`, 0];
};

// ── resq_alarm_darurat ──────────────────────────────────────────
javascriptGenerator.forBlock['resq_alarm_darurat'] = function(block: Blockly.Block) {
  const n = parseInt(block.getFieldValue('KALI') || '3');
  let code = '';
  for (let i = 0; i < Math.min(n, 5); i++) {
    code += `await api.print('[ALARM] ALARM EVAKUASI! (${i + 1}/${n})', 'error');\nawait api.setPin('10', 'HIGH');\nawait api.print('Sirine berbunyi', 'error');\nawait api.delay(300);\nawait api.setPin('10', 'LOW');\nawait api.print('Sirine berhenti', 'error');\nawait api.delay(200);\n`;
  }
  if (n > 5) code += `await api.print('[ALARM] ... +${n - 5} alarm lagi', 'error');\n`;
  return code;
};

// ── resq_led_kedip ──────────────────────────────────────────────
javascriptGenerator.forBlock['resq_led_kedip'] = function(block: Blockly.Block) {
  const color = block.getFieldValue('COLOR');
  const n = parseInt(block.getFieldValue('KALI') || '3');
  const LED_PINS: Record<string, string> = { Bahaya: '10', Aman: '11', Info: '12', Bawaan: '13' };
  const pin = LED_PINS[color] || '13';
  return `for (let _k = 0; _k < ${n}; _k++) {\n  await api.setPin('${pin}', 'HIGH');\n  await api.print('Lampu ${color} menyala (' + (_k+1) + '/${n})', 'success');\n  await api.delay(400);\n  await api.setPin('${pin}', 'LOW');\n  await api.delay(400);\n}\n`;
};

// ── resq_semua_led_mati ─────────────────────────────────────────
javascriptGenerator.forBlock['resq_semua_led_mati'] = function() {
  return `await api.setPin('10', 'LOW');\nawait api.setPin('11', 'LOW');\nawait api.setPin('12', 'LOW');\nawait api.setPin('13', 'LOW');\nawait api.print('Semua lampu dimatikan', 'warn');\n`;
};

// ── resq_buzzer_nada ────────────────────────────────────────────
javascriptGenerator.forBlock['resq_buzzer_nada'] = function(block: Blockly.Block) {
  const freqMap: Record<string, string> = { '3000': 'Darurat', '1500': 'Peringatan', '500': 'Info' };
  const freq = block.getFieldValue('FREQ');
  const ms = block.getFieldValue('MS');
  const label = freqMap[freq] || freq;
  return `await api.print('Sirine nada ${label} selama ${ms}ms', 'info');\nawait api.delay(${ms});\n`;
};


// ── resq_getar_kuat ─────────────────────────────────────────────
javascriptGenerator.forBlock['resq_getar_kuat'] = function() {
  return [`api.getSensor('A1') > 700`, 0];
};

// ── resq_suhu_panas ─────────────────────────────────────────────
javascriptGenerator.forBlock['resq_suhu_panas'] = function() {
  return [`(api.getSensor('A2') * 0.4887) > 35.0`, 0];
};

export { javascriptGenerator };
