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
  return `await api.setBuzzer(true);\nawait api.print('Sirine berbunyi selama ${ms}ms', 'info');\nawait api.delay(${ms});\nawait api.setBuzzer(false);\nawait api.print('Sirine berhenti', 'info');\n`;
};

// ── resq_buzzer_stop ────────────────────────────────────────────
javascriptGenerator.forBlock['resq_buzzer_stop'] = function() {
  return `await api.setBuzzer(false);\nawait api.print('Sirine berhenti', 'warn');\n`;
};

// ── resq_sirine_stop ────────────────────────────────────────────
javascriptGenerator.forBlock['resq_sirine_stop'] = function() {
  return `await api.setBuzzer(false);\nawait api.print('Sirine Peringatan dimatikan', 'info');\n`;
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
  const sec = Number(block.getFieldValue('DETIK') ?? block.getFieldValue('MS')) || 1;
  const ms = sec > 50 ? sec : sec * 1000;
  return `await api.delay(${ms});\n`;
};

// ── resq_tampil ─────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_tampil'] = function(block: Blockly.Block) {
  const val = javascriptGenerator.valueToCode(block, 'VALUE', 0) || '""';
  return `await api.print(String(${val}), 'info');\n`;
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
  let code = `await api.setBuzzer(true);\n`;
  for (let i = 0; i < Math.min(n, 5); i++) {
    code += `await api.print('[ALARM] ALARM EVAKUASI! (${i + 1}/${n})', 'error');\nawait api.setPin('10', 'HIGH');\nawait api.delay(350);\nawait api.setPin('10', 'LOW');\nawait api.delay(200);\n`;
  }
  if (n > 5) code += `await api.print('[ALARM] ... +${n - 5} alarm lagi', 'error');\n`;
  code += `await api.setBuzzer(false);\n`;
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


// ── resq_tipe_gempa ─────────────────────────────────────────────
javascriptGenerator.forBlock['resq_tipe_gempa'] = function(block: Blockly.Block) {
  const lvl = parseInt(block.getFieldValue('LEVEL') || '1', 10);
  return [`(api.getSeismicLevel() === ${lvl})`, 0];
};

// ── resq_lampu_status ───────────────────────────────────────────
javascriptGenerator.forBlock['resq_lampu_status'] = function(block: Blockly.Block) {
  const status = block.getFieldValue('STATUS');
  const labelMap: Record<string, string> = {
    green: 'Aman (Hijau)',
    yellow: 'Waspada (Kuning)',
    orange: 'Siaga (Oranye)',
    red: 'Awas (Merah)',
    off: 'Mati',
  };
  const label = labelMap[status] || status;
  return `await api.setRgb('${status}');\nawait api.print('Lampu Status Mitigasi: ${label}', 'success');\n`;
};

// ── resq_sirine_ews ─────────────────────────────────────────────
javascriptGenerator.forBlock['resq_sirine_ews'] = function(block: Blockly.Block) {
  const s = parseInt(block.getFieldValue('DETIK') || '3');
  return `await api.setBuzzer(true);\nawait api.print('Sirine Peringatan Dini (EWS) berbunyi selama ${s} detik!', 'warn');\nawait api.delay(${s * 1000});\nawait api.setBuzzer(false);\nawait api.print('Sirine EWS selesai', 'info');\n`;
};

// ── resq_gempa_sim ──────────────────────────────────────────────
javascriptGenerator.forBlock['resq_gempa_sim'] = function(block: Blockly.Block) {
  const lvl = parseInt(block.getFieldValue('LEVEL') || '1');
  const lvlNames: Record<number, string> = {
    1: 'Ringan (3-4 SR)',
    2: 'Sedang (5-6 SR)',
    3: 'Besar (>7 SR)',
  };
  const label = lvlNames[lvl] || `Level ${lvl}`;
  return `await api.simGempa(${lvl});\nawait api.print('Simulasi Gempa Bumi: ${label} aktif! (Motor getar & audio berbunyi)', 'error');\n`;
};

// ── resq_gunung_sim ─────────────────────────────────────────────
javascriptGenerator.forBlock['resq_gunung_sim'] = function(block: Blockly.Block) {
  const stMap: Record<string, string> = { '1': 'WASPADA', '2': 'SIAGA', '3': 'AWAS' };
  const st = stMap[block.getFieldValue('STATUS')] || 'WASPADA';
  const tipe = block.getFieldValue('TIPE') || 'EKSPLOSIF';
  return `await api.simGunung('${st}', '${tipe}');\n`;
};

// ── resq_tipe_letusan ───────────────────────────────────────────
javascriptGenerator.forBlock['resq_tipe_letusan'] = function(block: Blockly.Block) {
  const tipe = block.getFieldValue('TIPE') || 'EFUSIF';
  return [`(api.getEruptionType() === '${tipe}')`, 0];
};


// ── resq_evak_keluar_bangunan ───────────────────────────────────
javascriptGenerator.forBlock['resq_evak_keluar_bangunan'] = function() {
  return `await api.setEvacCommand('KELUAR_BANGUNAN');\nawait api.print('Perintah Evakuasi: Warga diarahkan keluar dari bangunan ke area terbuka!', 'success');\n`;
};

// ── resq_evak_tanah_lapang ──────────────────────────────────────
javascriptGenerator.forBlock['resq_evak_tanah_lapang'] = function() {
  return `await api.setEvacCommand('TANAH_LAPANG');\nawait api.print('Perintah Evakuasi: Warga diarahkan ke tanah lapang terdekat yang jauh dari bangunan!', 'success');\n`;
};

// ── resq_evak_krb ───────────────────────────────────────────────
javascriptGenerator.forBlock['resq_evak_krb'] = function(block: Blockly.Block) {
  const zona = block.getFieldValue('ZONA') || 'KRB2';
  const label = zona === 'KRB1' ? 'Zona KRB I (Status Siaga)' : 'Zona KRB II (Status Waspada)';
  return `await api.setEvacCommand('${zona}');\nawait api.print('Perintah Evakuasi: Warga diarahkan mengungsi menuju ${label}!', 'success');\n`;
};

// ── resq_evak_luar_map ──────────────────────────────────────────
javascriptGenerator.forBlock['resq_evak_luar_map'] = function() {
  return `await api.setEvacCommand('LUAR_MAP');\nawait api.print('Perintah Evakuasi: Seluruh warga evakuasi total menjauh dari KRB I ke luar area peta!', 'success');\n`;
};

// ── resq_evak_jauhi_sungai ──────────────────────────────────────
javascriptGenerator.forBlock['resq_evak_jauhi_sungai'] = function() {
  return `await api.setEvacCommand('JAUHI_SUNGAI');\nawait api.print('Perintah Evakuasi: Warga diarahkan menjauhi sempadan wilayah sungai!', 'warn');\n`;
};



// ── resq_layar_oled ─────────────────────────────────────────────
javascriptGenerator.forBlock['resq_layar_oled'] = function(block: Blockly.Block) {
  const txt = block.getFieldValue('TEXT') || '';
  return `await api.setOledMessage('${txt}');\nawait api.print('Layar Informasi: "${txt}"', 'info');\n`;
};



// ── resq_stopall ────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_stopall'] = function() {
  return `await api.stopAll();\nawait api.print('Semua perangkat & simulasi dihentikan (STOP ALL)', 'warn');\n`;
};

// ── resq_mist ───────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_mist'] = function(block: Blockly.Block) {
  const state = block.getFieldValue('STATE');
  const isOn = state === 'ON';
  return `await api.setMist(${isOn});\nawait api.print('Asap Erupsi (Mist Maker) ${isOn ? 'AKTIF (Menyembur)' : 'MATI'}', '${isOn ? 'error' : 'info'}');\n`;
};

// ── resq_audio ──────────────────────────────────────────────────
javascriptGenerator.forBlock['resq_audio'] = function(block: Blockly.Block) {
  const track = parseInt(block.getFieldValue('TRACK') || '1');
  const trackNames: Record<number, string> = {
    1: 'Gempa Bumi (Track 1)',
    2: 'Gemuruh Erupsi (Track 2)',
    3: 'Sirine Evakuasi (Track 3)',
    0: 'Hentikan Suara',
  };
  const label = trackNames[track] || `Track ${track}`;
  if (track === 0) {
    return `await api.stopAudio();\nawait api.print('Audio speaker dihentikan', 'info');\n`;
  }
  return `await api.playAudio(${track});\nawait api.print('Memutar audio speaker: ${label}', 'warn');\n`;
};

// ── resq_motor_getar ────────────────────────────────────────────
javascriptGenerator.forBlock['resq_motor_getar'] = function(block: Blockly.Block) {
  const speed = block.getFieldValue('SPEED');
  const labelMap: Record<string, string> = {
    '20': 'Ringan (PWM 20)',
    '35': 'Sedang (PWM 35)',
    '50': 'Kuat (PWM 50)',
    '0': 'Berhenti',
  };
  const label = labelMap[speed] || speed;
  return `await api.setMotor('${speed}');\nawait api.print('Motor getar diorama: ${label}', 'info');\n`;
};

export { javascriptGenerator };

