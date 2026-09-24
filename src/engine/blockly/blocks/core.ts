import * as Blockly from 'blockly/core';
import { arduinoGenerator } from '../arduinoGenerator';

// LED color → pin mapping (hidden from user)
const LED_PIN: Record<string, string> = {
  Bahaya: '10', Aman: '11', Info: '12', Bawaan: 'LED_BUILTIN',
};

export function defineCoreBlocks() {

  // ── 1. Sistem Utama ────────────────────────────────────────────
  Blockly.Blocks['resq_program'] = {
    init: function () {
      this.appendDummyInput().appendField('Sistem Mitigasi');
      this.appendStatementInput('SETUP').setCheck(null).appendField('Mulai Saat Dihidupkan');
      this.appendStatementInput('LOOP').setCheck(null).appendField('Jalankan Terus-Menerus');
      this.setColour('#fd761a');
      this.setPreviousStatement(false);
      this.setNextStatement(false);
      this.setTooltip('"Mulai Saat Dihidupkan" dijalankan satu kali. "Jalankan Terus-Menerus" diulang selamanya.');
    },
  };
  arduinoGenerator.forBlock['resq_program'] = function (block: Blockly.Block) {
    const setup = arduinoGenerator.statementToCode(block, 'SETUP') || '';
    const loop = arduinoGenerator.statementToCode(block, 'LOOP') || '';
    return `#include <Arduino.h>\n\nvoid setup() {\n  Serial.begin(9600);\n${setup}}\n\nvoid loop() {\n${loop}}\n`;
  };

  // ── 2. Lampu Peringatan ──────────────────────────────────────
  Blockly.Blocks['resq_led'] = {
    init() {
      this.appendDummyInput()
        .appendField('Lampu')
        .appendField(new Blockly.FieldDropdown([
          ['Bahaya', 'Bahaya'], ['Aman', 'Aman'], ['Info', 'Info'], ['Bawaan', 'Bawaan'],
        ]), 'COLOR')
        .appendField(new Blockly.FieldDropdown([
          ['Nyala', 'HIGH'], ['Mati', 'LOW'],
        ]), 'STATE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Nyalakan atau matikan lampu peringatan sesuai status bahaya.');
    },
  };
  arduinoGenerator.forBlock['resq_led'] = function (block: Blockly.Block) {
    const color = block.getFieldValue('COLOR');
    const pin = LED_PIN[color] || '13';
    const state = block.getFieldValue('STATE');
    return `pinMode(${pin}, OUTPUT);\ndigitalWrite(${pin}, ${state}); // Lampu ${color}\n`;
  };

  // ── 3. Sirine Peringatan ─────────────────────────────────────
  Blockly.Blocks['resq_buzzer'] = {
    init() {
      this.appendDummyInput()
        .appendField('Sirine Peringatan')
        .appendField(new Blockly.FieldNumber(1000, 100), 'MS')
        .appendField('ms');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Bunyikan sirine peringatan dini selama beberapa waktu.');
    },
  };
  arduinoGenerator.forBlock['resq_buzzer'] = function (block: Blockly.Block) {
    const ms = block.getFieldValue('MS');
    return `tone(5, 1000, ${ms});\ndelay(${ms});\n`;
  };

  // ── 4. Sirine Berhenti ───────────────────────────────────────
  Blockly.Blocks['resq_buzzer_stop'] = {
    init() {
      this.appendDummyInput().appendField('Sirine Berhenti');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Hentikan bunyi sirine peringatan.');
    },
  };
  arduinoGenerator.forBlock['resq_buzzer_stop'] = function () {
    return `noTone(5);\n`;
  };

  // ── 5. Kipas Ventilasi ───────────────────────────────────────
  Blockly.Blocks['resq_motor'] = {
    init() {
      this.appendDummyInput()
        .appendField('Kipas Ventilasi')
        .appendField(new Blockly.FieldDropdown([
          ['Mati', '0'], ['Pelan', '85'], ['Sedang', '170'], ['Kencang', '255'],
        ]), 'SPEED');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7C3AED');
      this.setTooltip('Atur kecepatan kipas ventilasi untuk sirkulasi udara saat evakuasi.');
    },
  };
  arduinoGenerator.forBlock['resq_motor'] = function (block: Blockly.Block) {
    return `analogWrite(6, ${block.getFieldValue('SPEED')});\n`;
  };

  // ── 6. Pintu Evakuasi ────────────────────────────────────────
  Blockly.Blocks['resq_servo'] = {
    init() {
      this.appendDummyInput()
        .appendField('Pintu Evakuasi')
        .appendField(new Blockly.FieldDropdown([
          ['Tertutup', '0'], ['Setengah', '90'], ['Terbuka', '180'],
        ]), 'POS');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7C3AED');
      this.setTooltip('Buka atau tutup pintu evakuasi darurat.');
    },
  };
  arduinoGenerator.forBlock['resq_servo'] = function (block: Blockly.Block) {
    return `// Pintu Evakuasi (pin 9)\nservo_9.write(${block.getFieldValue('POS')});\n`;
  };

  // ── 7. Jeda Sebentar ─────────────────────────────────────────
  Blockly.Blocks['resq_tunggu'] = {
    init() {
      this.appendDummyInput()
        .appendField('Jeda Sebentar')
        .appendField(new Blockly.FieldNumber(1000, 0), 'MS')
        .appendField('ms');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#fd761a');
      this.setTooltip('Jeda sejenak sebelum melanjutkan aksi berikutnya.');
    },
  };
  arduinoGenerator.forBlock['resq_tunggu'] = function (block: Blockly.Block) {
    return `delay(${block.getFieldValue('MS')});\n`;
  };

  // ── 8. Laporkan ke Monitor ───────────────────────────────────
  Blockly.Blocks['resq_tampil'] = {
    init() {
      this.appendValueInput('VALUE').setCheck(null).appendField('Laporkan ke Monitor');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#fd761a');
      this.setTooltip('Tampilkan informasi di monitor aktivitas.');
    },
  };
  arduinoGenerator.forBlock['resq_tampil'] = function (block: Blockly.Block) {
    const val = arduinoGenerator.valueToCode(block, 'VALUE', 0) || '""';
    return `Serial.println(${val});\n`;
  };



  // ── 10. Pantau Intensitas Gempa ──────────────────────────────
  Blockly.Blocks['resq_sensor_getar'] = {
    init() {
      this.appendDummyInput().appendField('Pantau Intensitas Gempa');
      this.setOutput(true, 'Number');
      this.setColour('#2563EB');
      this.setTooltip('Membaca intensitas getaran gempa. Semakin tinggi nilainya, gempa semakin kuat.');
    },
  };
  arduinoGenerator.forBlock['resq_sensor_getar'] = function () {
    return [`analogRead(A1)`, 0];
  };

  // ── 11. Pantau Suhu Lingkungan ───────────────────────────────
  Blockly.Blocks['resq_sensor_suhu'] = {
    init() {
      this.appendDummyInput().appendField('Pantau Suhu Lingkungan');
      this.setOutput(true, 'Number');
      this.setColour('#2563EB');
      this.setTooltip('Membaca suhu lingkungan dalam derajat Celsius.');
    },
  };
  arduinoGenerator.forBlock['resq_sensor_suhu'] = function () {
    return [`(analogRead(A2) * 0.4887)`, 0];
  };

  // ── 12. Tombol Darurat 1 ─────────────────────────────────────
  Blockly.Blocks['resq_tombol_1'] = {
    init() {
      this.appendDummyInput().appendField('Tombol Darurat 1 ditekan?');
      this.setOutput(true, 'Boolean');
      this.setColour('#2563EB');
      this.setTooltip('Mendeteksi apakah tombol darurat pertama sedang ditekan.');
    },
  };
  arduinoGenerator.forBlock['resq_tombol_1'] = function () {
    return [`digitalRead(2) == HIGH`, 0];
  };

  // ── 13. Tombol Darurat 2 ─────────────────────────────────────
  Blockly.Blocks['resq_tombol_2'] = {
    init() {
      this.appendDummyInput().appendField('Tombol Darurat 2 ditekan?');
      this.setOutput(true, 'Boolean');
      this.setColour('#2563EB');
      this.setTooltip('Mendeteksi apakah tombol darurat kedua sedang ditekan.');
    },
  };
  arduinoGenerator.forBlock['resq_tombol_2'] = function () {
    return [`digitalRead(3) == HIGH`, 0];
  };

  // ── 14. Jika Kondisi...Lakukan ───────────────────────────────
  Blockly.Blocks['resq_jika'] = {
    init() {
      this.appendValueInput('KONDISI').setCheck(null).appendField('Kalau');
      this.appendStatementInput('MAKA').setCheck(null).appendField('Maka Lakukan');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#DB2777');
      this.setTooltip('Lakukan sesuatu HANYA JIKA kondisi terpenuhi.');
    },
  };
  arduinoGenerator.forBlock['resq_jika'] = function (block: Blockly.Block) {
    const cond = arduinoGenerator.valueToCode(block, 'KONDISI', 0) || 'false';
    const maka = arduinoGenerator.statementToCode(block, 'MAKA') || '';
    return `if (${cond}) {\n${maka}}\n`;
  };

  // ── 15. Jika Kondisi...Lakukan...Situasi Lain ────────────────
  Blockly.Blocks['resq_jika_tidak'] = {
    init() {
      this.appendValueInput('KONDISI').setCheck(null).appendField('Kalau');
      this.appendStatementInput('MAKA').setCheck(null).appendField('Maka Lakukan');
      this.appendStatementInput('TIDAK').setCheck(null).appendField('Selain Itu');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#DB2777');
      this.setTooltip('Pilih satu dari dua kemungkinan tindakan berdasarkan situasi.');
    },
  };
  arduinoGenerator.forBlock['resq_jika_tidak'] = function (block: Blockly.Block) {
    const cond = arduinoGenerator.valueToCode(block, 'KONDISI', 0) || 'false';
    const maka = arduinoGenerator.statementToCode(block, 'MAKA') || '';
    const tidak = arduinoGenerator.statementToCode(block, 'TIDAK') || '';
    return `if (${cond}) {\n${maka}} else {\n${tidak}}\n`;
  };

  // ── 16. Perbandingan ─────────────────────────────────────────
  Blockly.Blocks['resq_bandingkan'] = {
    init() {
      this.appendValueInput('A').setCheck('Number');
      this.appendDummyInput().appendField(new Blockly.FieldDropdown([
        ['lebih dari', '>'], ['kurang dari', '<'],
        ['sama dengan', '=='], ['tidak sama dengan', '!='],
        ['lebih dari atau sama', '>='], ['kurang dari atau sama', '<='],
      ]), 'OP');
      this.appendValueInput('B').setCheck('Number');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour('#DB2777');
      this.setTooltip('Bandingkan dua nilai untuk mengambil keputusan.');
    },
  };
  arduinoGenerator.forBlock['resq_bandingkan'] = function (block: Blockly.Block) {
    const op = block.getFieldValue('OP');
    const a = arduinoGenerator.valueToCode(block, 'A', 0) || '0';
    const b = arduinoGenerator.valueToCode(block, 'B', 0) || '0';
    return [`${a} ${op} ${b}`, 0];
  };

  // ── 17. DAN / ATAU ───────────────────────────────────────────
  Blockly.Blocks['resq_dan_atau'] = {
    init() {
      this.appendValueInput('A').setCheck('Boolean');
      this.appendDummyInput().appendField(new Blockly.FieldDropdown([
        ['DAN', 'AND'], ['ATAU', 'OR'],
      ]), 'OP');
      this.appendValueInput('B').setCheck('Boolean');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour('#DB2777');
      this.setTooltip('Gabungkan dua kondisi: keduanya harus terjadi (DAN) atau salah satu (ATAU).');
    },
  };
  arduinoGenerator.forBlock['resq_dan_atau'] = function (block: Blockly.Block) {
    const op = block.getFieldValue('OP') === 'AND' ? '&&' : '||';
    const a = arduinoGenerator.valueToCode(block, 'A', 0) || 'false';
    const b = arduinoGenerator.valueToCode(block, 'B', 0) || 'false';
    return [`${a} ${op} ${b}`, 0];
  };

  // ── 18. Angka ────────────────────────────────────────────────
  arduinoGenerator.forBlock['math_number'] = function (block: Blockly.Block) {
    return [String(block.getFieldValue('NUM') || '0'), 0];
  };

  // ── 19. Teks ─────────────────────────────────────────────────
  Blockly.Blocks['resq_teks'] = {
    init() {
      this.appendDummyInput()
        .appendField('"')
        .appendField(new Blockly.FieldTextInput('halo'), 'TEXT')
        .appendField('"');
      this.setOutput(true, 'String');
      this.setColour('#64748B');
    },
  };
  arduinoGenerator.forBlock['resq_teks'] = function (block: Blockly.Block) {
    return [`"${block.getFieldValue('TEXT')}"`, 0];
  };

  // ── 20. Ulangi Aksi ──────────────────────────────────────────
  Blockly.Blocks['resq_ulangi'] = {
    init() {
      this.appendDummyInput()
        .appendField('Ulangi Aksi')
        .appendField(new Blockly.FieldNumber(3, 1, 100), 'KALI')
        .appendField('kali');
      this.appendStatementInput('DO').setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#fd761a');
      this.setTooltip('Lakukan serangkaian aksi beberapa kali berulang.');
    },
  };
  arduinoGenerator.forBlock['resq_ulangi'] = function (block: Blockly.Block) {
    const n = block.getFieldValue('KALI');
    const body = arduinoGenerator.statementToCode(block, 'DO') || '';
    return `for (int _i = 0; _i < ${n}; _i++) {\n${body}}\n`;
  };

  // ── 21. Tidak Terjadi (NOT) ──────────────────────────────────
  Blockly.Blocks['resq_bukan'] = {
    init() {
      this.appendValueInput('KONDISI').setCheck('Boolean').appendField('Tidak Terjadi');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour('#DB2777');
      this.setTooltip('Membalikkan kondisi: jika terjadi menjadi tidak, dan sebaliknya.');
    },
  };
  arduinoGenerator.forBlock['resq_bukan'] = function (block: Blockly.Block) {
    const val = arduinoGenerator.valueToCode(block, 'KONDISI', 0) || 'false';
    return [`!(${val})`, 0];
  };

  // ── 22. Hitung (Math) ────────────────────────────────────────
  Blockly.Blocks['resq_hitung'] = {
    init() {
      this.appendValueInput('A').setCheck('Number');
      this.appendDummyInput().appendField(new Blockly.FieldDropdown([
        ['tambah (+)', '+'], ['kurang (-)', '-'],
        ['kali (×)', '*'], ['bagi (÷)', '/'],
      ]), 'OP');
      this.appendValueInput('B').setCheck('Number');
      this.setInputsInline(true);
      this.setOutput(true, 'Number');
      this.setColour('#64748B');
      this.setTooltip('Operasi matematika sederhana antara dua angka.');
    },
  };
  arduinoGenerator.forBlock['resq_hitung'] = function (block: Blockly.Block) {
    const op = block.getFieldValue('OP');
    const a = arduinoGenerator.valueToCode(block, 'A', 0) || '0';
    const b = arduinoGenerator.valueToCode(block, 'B', 0) || '0';
    return [`(${a} ${op} ${b})`, 0];
  };

  // ── 23. Alarm Evakuasi ───────────────────────────────────────
  Blockly.Blocks['resq_alarm_darurat'] = {
    init() {
      this.appendDummyInput()
        .appendField('Alarm Evakuasi')
        .appendField(new Blockly.FieldNumber(3, 1, 10), 'KALI')
        .appendField('kali');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#EF4444');
      this.setTooltip('Lampu bahaya berkedip + sirine berbunyi beberapa kali sebagai tanda evakuasi segera!');
    },
  };
  arduinoGenerator.forBlock['resq_alarm_darurat'] = function (block: Blockly.Block) {
    const n = block.getFieldValue('KALI');
    return `// Alarm Evakuasi ${n}x\nfor (int _a = 0; _a < ${n}; _a++) {\n  digitalWrite(10, HIGH);\n  tone(5, 2000, 300);\n  delay(300);\n  digitalWrite(10, LOW);\n  noTone(5);\n  delay(200);\n}\n`;
  };

  // ── 24. Lampu Berkedip ───────────────────────────────────────
  Blockly.Blocks['resq_led_kedip'] = {
    init() {
      this.appendDummyInput()
        .appendField('Lampu')
        .appendField(new Blockly.FieldDropdown([
          ['Bahaya', 'Bahaya'], ['Aman', 'Aman'], ['Info', 'Info'], ['Bawaan', 'Bawaan'],
        ]), 'COLOR')
        .appendField('berkedip')
        .appendField(new Blockly.FieldNumber(3, 1, 20), 'KALI')
        .appendField('kali');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Membuat lampu peringatan berkedip beberapa kali.');
    },
  };
  arduinoGenerator.forBlock['resq_led_kedip'] = function (block: Blockly.Block) {
    const color = block.getFieldValue('COLOR');
    const pin = LED_PIN[color] || '13';
    const n = block.getFieldValue('KALI');
    return `// Lampu ${color} kedip ${n}x\npinMode(${pin}, OUTPUT);\nfor (int _k = 0; _k < ${n}; _k++) {\n  digitalWrite(${pin}, HIGH);\n  delay(400);\n  digitalWrite(${pin}, LOW);\n  delay(400);\n}\n`;
  };

  // ── 25. Matikan Semua Lampu ──────────────────────────────────
  Blockly.Blocks['resq_semua_led_mati'] = {
    init() {
      this.appendDummyInput().appendField('Matikan Semua Lampu');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Matikan semua lampu peringatan sekaligus.');
    },
  };
  arduinoGenerator.forBlock['resq_semua_led_mati'] = function () {
    return `digitalWrite(10, LOW); // Bahaya\ndigitalWrite(11, LOW); // Aman\ndigitalWrite(12, LOW); // Info\ndigitalWrite(LED_BUILTIN, LOW);\n`;
  };

  // ── 26. Sirine Nada ──────────────────────────────────────────
  Blockly.Blocks['resq_buzzer_nada'] = {
    init() {
      this.appendDummyInput()
        .appendField('Sirine Nada')
        .appendField(new Blockly.FieldDropdown([
          ['Darurat', '3000'], ['Peringatan', '1500'], ['Info', '500'],
        ]), 'FREQ')
        .appendField('selama')
        .appendField(new Blockly.FieldNumber(500, 100), 'MS')
        .appendField('ms');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Mainkan sirine dengan nada tertentu sesuai tingkat bahaya.');
    },
  };
  arduinoGenerator.forBlock['resq_buzzer_nada'] = function (block: Blockly.Block) {
    const freq = block.getFieldValue('FREQ');
    const ms = block.getFieldValue('MS');
    return `tone(5, ${freq}, ${ms});\ndelay(${ms});\n`;
  };



  // ── 29. Gempa Terdeteksi Kuat? ───────────────────────────────
  Blockly.Blocks['resq_getar_kuat'] = {
    init() {
      this.appendDummyInput().appendField('Gempa Terdeteksi Kuat?');
      this.setOutput(true, 'Boolean');
      this.setColour('#2563EB');
      this.setTooltip('Benar jika intensitas gempa terdeteksi KUAT.');
    },
  };
  arduinoGenerator.forBlock['resq_getar_kuat'] = function () {
    return [`analogRead(A1) > 700`, 0];
  };

  // ── 30. Suhu Berbahaya? ──────────────────────────────────────
  Blockly.Blocks['resq_suhu_panas'] = {
    init() {
      this.appendDummyInput().appendField('Suhu Berbahaya? (>35°C)');
      this.setOutput(true, 'Boolean');
      this.setColour('#2563EB');
      this.setTooltip('Benar jika suhu lingkungan di atas 35 derajat Celsius — berbahaya!');
    },
  };
  arduinoGenerator.forBlock['resq_suhu_panas'] = function () {
    return [`(analogRead(A2) * 0.4887) > 35.0`, 0];
  };
}
