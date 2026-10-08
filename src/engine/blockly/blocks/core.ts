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
    return `#include <Arduino.h>\n\nvoid setup() {\n  Serial.begin(115200);\n${setup}}\n\nvoid loop() {\n${loop}}\n`;
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
    const state = block.getFieldValue('STATE');
    const isHigh = state === 'HIGH';
    if (color === 'Bahaya') {
      return isHigh ? `setRGBColor("red");\nredLED_ON(); // Lampu Bahaya Nyala\n` : `rgbOFF();\nredLED_OFF(); // Lampu Bahaya Mati\n`;
    } else if (color === 'Aman') {
      return isHigh ? `setRGBColor("green"); // Lampu Aman Nyala\n` : `rgbOFF(); // Lampu Aman Mati\n`;
    } else if (color === 'Info') {
      return isHigh ? `setRGBColor("blue"); // Lampu Info Nyala\n` : `rgbOFF(); // Lampu Info Mati\n`;
    } else {
      return isHigh ? `setRGBColor("yellow"); // Lampu Bawaan Nyala\n` : `rgbOFF(); // Lampu Bawaan Mati\n`;
    }
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
    return `buzzerON();\ndelay(${ms});\nbuzzerOFF();\n`;
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
    return `buzzerOFF();\n`;
  };

  Blockly.Blocks['resq_sirine_stop'] = {
    init() {
      this.appendDummyInput().appendField('Hentikan Sirine Peringatan');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Hentikan bunyi sirine peringatan dini evakuasi.');
    },
  };
  arduinoGenerator.forBlock['resq_sirine_stop'] = function () {
    return `buzzerOFF();\n`;
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
    const spd = block.getFieldValue('SPEED');
    if (spd === '0') return `motorStop();\n`;
    return `analogWrite(MOTOR_AIN1, ${spd});\ndigitalWrite(MOTOR_AIN2, LOW);\n`;
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
        .appendField(new Blockly.FieldNumber(1, 0), 'DETIK')
        .appendField('detik');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#fd761a');
      this.setTooltip('Jeda sejenak beberapa detik sebelum melanjutkan aksi berikutnya.');
    },
  };
  arduinoGenerator.forBlock['resq_tunggu'] = function (block: Blockly.Block) {
    const sec = Number(block.getFieldValue('DETIK') ?? block.getFieldValue('MS')) || 1;
    const ms = sec > 50 ? sec : sec * 1000;
    return `delay(${ms});\n`;
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
    return `rgbOFF();\nredLED_OFF();\n`;
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
    const ms = block.getFieldValue('MS');
    return `buzzerON();\ndelay(${ms});\nbuzzerOFF();\n`;
  };



  // ── 29. Tipe Gempa (Kondisi Predikat) ────────────────────────
  Blockly.Blocks['resq_tipe_gempa'] = {
    init() {
      this.appendDummyInput()
        .appendField('Tipe Gempa:')
        .appendField(new Blockly.FieldDropdown([
          ['Ringan (3-4 SR)', '1'],
          ['Sedang (5-6 SR)', '2'],
          ['Besar (>7 SR)', '3'],
        ]), 'LEVEL');
      this.setOutput(true, 'Boolean');
      this.setColour('#DC2626');
      this.setTooltip('Kondisi tingkat guncangan gempa: bernilai Benar jika intensitas gempa aktif sesuai pilihan.');
    },
  };
  arduinoGenerator.forBlock['resq_tipe_gempa'] = function (block: Blockly.Block) {
    const lvl = block.getFieldValue('LEVEL') || '1';
    return [`(seismicLevel == ${lvl})`, 0];
  };

  // ── 31. Lampu Status Bencana (RGB) ───────────────────────────
  Blockly.Blocks['resq_lampu_status'] = {
    init() {
      this.appendDummyInput()
        .appendField('Atur Lampu Status ke')
        .appendField(new Blockly.FieldDropdown([
          ['Aman (Hijau)', 'green'],
          ['Waspada (Kuning)', 'yellow'],
          ['Siaga (Oranye)', 'orange'],
          ['Awas (Merah)', 'red'],
          ['Mati', 'off'],
        ]), 'STATUS');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Nyalakan lampu status bencana (Hijau/Kuning/Oranye/Merah) di posko/diorama.');
    },
  };
  arduinoGenerator.forBlock['resq_lampu_status'] = function (block: Blockly.Block) {
    const status = block.getFieldValue('STATUS');
    return `setRGBColor("${status}");\n`;
  };

  // ── 32. Sirine Peringatan Dini (EWS) ─────────────────────────
  Blockly.Blocks['resq_sirine_ews'] = {
    init() {
      this.appendDummyInput()
        .appendField('Bunyikan Sirine EWS selama')
        .appendField(new Blockly.FieldNumber(3, 1, 60), 'DETIK')
        .appendField('detik');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Bunyikan sirine peringatan dini evakuasi.');
    },
  };
  arduinoGenerator.forBlock['resq_sirine_ews'] = function (block: Blockly.Block) {
    const s = block.getFieldValue('DETIK');
    return `buzzerON();\ndelay(${s} * 1000);\nbuzzerOFF();\n`;
  };

  // ── 33. Simulasi Getaran Gempa (Motor + Audio Speaker) ───────
  Blockly.Blocks['resq_gempa_sim'] = {
    init() {
      this.appendDummyInput()
        .appendField('Simulasi Getaran Gempa')
        .appendField(new Blockly.FieldDropdown([
          ['Ringan (3-4 SR)', '1'],
          ['Sedang (5-6 SR)', '2'],
          ['Besar (>7 SR)', '3'],
        ]), 'LEVEL');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#DC2626');
      this.setTooltip('Simulasi guncangan gempa bumi. Motor getar dan suara speaker aktif bersamaan!');
    },
  };
  arduinoGenerator.forBlock['resq_gempa_sim'] = function (block: Blockly.Block) {
    const lvl = block.getFieldValue('LEVEL');
    return `startSimulation(MODE_GEMPA, ${lvl});\n`;
  };

  // ── 34. Simulasi Aktivitas Gunung Merapi ─────────────────────
  Blockly.Blocks['resq_gunung_sim'] = {
    init() {
      this.appendDummyInput()
        .appendField('Simulasi Erupsi Merapi')
        .appendField(new Blockly.FieldDropdown([
          ['Waspada (Fase 1)', '1'],
          ['Siaga (Fase 2)', '2'],
          ['Awas / Erupsi (Fase 3)', '3'],
        ]), 'STATUS')
        .appendField('Tipe')
        .appendField(new Blockly.FieldDropdown([
          ['Eksplosif (Ledakan & Abu)', 'EKSPLOSIF'],
          ['Efusif (Lelehan Lava Pijar)', 'EFUSIF'],
        ]), 'TIPE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#DC2626');
      this.setTooltip('Simulasi aktivitas letusan Gunung Merapi. Mist maker menyemburkan kabut asap uap!');
    },
  };
  arduinoGenerator.forBlock['resq_gunung_sim'] = function (block: Blockly.Block) {
    const status = block.getFieldValue('STATUS');
    return `startSimulation(MODE_GUNUNG, ${status});\n`;
  };

  // ── 35. Tipe Letusan ─────────────────────────────────────────
  Blockly.Blocks['resq_tipe_letusan'] = {
    init() {
      this.appendDummyInput()
        .appendField('Tipe Letusan:')
        .appendField(new Blockly.FieldDropdown([
          ['Eksplosif (Ledakan & Kolom Abu)', 'EKSPLOSIF'],
          ['Efusif (Lelehan Kubah Lava)', 'EFUSIF'],
        ]), 'TIPE');
      this.setOutput(true, 'Boolean');
      this.setColour('#DC2626');
      this.setTooltip('Kondisi tipe letusan gunung api: bernilai Benar jika tipe letusan aktif sesuai pilihan.');
    },
  };
  arduinoGenerator.forBlock['resq_tipe_letusan'] = function (block: Blockly.Block) {
    const tipe = block.getFieldValue('TIPE') || 'EFUSIF';
    return [`(eruptionType == "${tipe}")`, 0];
  };


  // ── 37. Blok Evakuasi: Keluar Bangunan ───────────────────────
  Blockly.Blocks['resq_evak_keluar_bangunan'] = {
    init() {
      this.appendDummyInput()
        .appendField('Evakuasi Keluar Bangunan');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7C3AED');
      this.setTooltip('Arahkan warga di dalam bangunan untuk segera keluar menuju area terbuka di luar gedung (digunakan saat gempa sedang).');
    },
  };
  arduinoGenerator.forBlock['resq_evak_keluar_bangunan'] = function () {
    return `// Evakuasi: Keluar dari Bangunan\n`;
  };

  // ── 38. Blok Evakuasi: Tanah Lapang Terdekat ──────────────────
  Blockly.Blocks['resq_evak_tanah_lapang'] = {
    init() {
      this.appendDummyInput()
        .appendField('Evakuasi ke Tanah Lapang Terdekat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7C3AED');
      this.setTooltip('Arahkan warga mencari dan berkumpul di tanah lapang terdekat yang jauh dari bangunan (digunakan saat gempa besar).');
    },
  };
  arduinoGenerator.forBlock['resq_evak_tanah_lapang'] = function () {
    return `// Evakuasi: Menuju Tanah Lapang Terdekat\n`;
  };

  // ── 39. Blok Evakuasi: Menuju Zona KRB ────────────────────────
  Blockly.Blocks['resq_evak_krb'] = {
    init() {
      this.appendDummyInput()
        .appendField('Evakuasi Warga ke')
        .appendField(new Blockly.FieldDropdown([
          ['Zona KRB II (Status Waspada)', 'KRB2'],
          ['Zona KRB I (Status Siaga)', 'KRB1'],
        ]), 'ZONA');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7C3AED');
      this.setTooltip('Arahkan warga mengungsi bertahap menuju zona KRB II atau KRB I sesuai peningkatan aktivitas gunung api.');
    },
  };
  arduinoGenerator.forBlock['resq_evak_krb'] = function (block: Blockly.Block) {
    const zona = block.getFieldValue('ZONA');
    return `// Evakuasi: Menuju ${zona}\n`;
  };

  // ── 40. Blok Evakuasi: Menjauh dari KRB I (Luar Area Peta) ────
  Blockly.Blocks['resq_evak_luar_map'] = {
    init() {
      this.appendDummyInput()
        .appendField('Evakuasi Menjauh dari KRB I (Luar Area Peta)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7C3AED');
      this.setTooltip('Arahkan seluruh warga evakuasi total ke selatan hingga keluar area peta menjauhi letusan eksplosif.');
    },
  };
  arduinoGenerator.forBlock['resq_evak_luar_map'] = function () {
    return `// Evakuasi: Keluar dari Area Peta\n`;
  };

  // ── 41. Blok Evakuasi: Menjauh dari Wilayah Sungai ────────────
  Blockly.Blocks['resq_evak_jauhi_sungai'] = {
    init() {
      this.appendDummyInput()
        .appendField('Evakuasi Menjauh dari Wilayah Sungai');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7C3AED');
      this.setTooltip('Arahkan warga segera menjauhi bantaran aliran sungai untuk menghindari bahaya lahar dingin.');
    },
  };
  arduinoGenerator.forBlock['resq_evak_jauhi_sungai'] = function () {
    return `// Evakuasi: Menjauhi Wilayah Aliran Sungai\n`;
  };


  // ── 39. Layar Informasi Publik ───────────────────────────────
  Blockly.Blocks['resq_layar_oled'] = {
    init() {
      this.appendDummyInput()
        .appendField('Tampilkan di Layar Informasi')
        .appendField(new Blockly.FieldTextInput('SIAP SIAGA'), 'TEXT');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#fd761a');
      this.setTooltip('Tampilkan pengumuman evakuasi pada layar monitor informasi publik.');
    },
  };
  arduinoGenerator.forBlock['resq_layar_oled'] = function (block: Blockly.Block) {
    const text = block.getFieldValue('TEXT');
    return `oledMessage("INFO MITIGASI", "${text}");\n`;
  };


  // ── 41. Hentikan Semua (STOP ALL) ─────────────────────────────
  Blockly.Blocks['resq_stopall'] = {
    init() {
      this.appendDummyInput().appendField('Hentikan Semua Perangkat (STOP ALL)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#EF4444');
      this.setTooltip('Hentikan semua simulasi, getaran motor, kabut asap, sirine, audio, dan matikan lampu.');
    },
  };
  arduinoGenerator.forBlock['resq_stopall'] = function () {
    return `stopAll();\n`;
  };

  // ── 42. Asap Erupsi (Mist Maker) ──────────────────────────────
  Blockly.Blocks['resq_mist'] = {
    init() {
      this.appendDummyInput()
        .appendField('Asap Erupsi (Mist Maker)')
        .appendField(new Blockly.FieldDropdown([
          ['Nyalakan (Sembur Asap)', 'ON'],
          ['Matikan', 'OFF'],
        ]), 'STATE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#DC2626');
      this.setTooltip('Nyalakan atau matikan pembuat asap kabut uap erupsi gunung api.');
    },
  };
  arduinoGenerator.forBlock['resq_mist'] = function (block: Blockly.Block) {
    const state = block.getFieldValue('STATE');
    return state === 'ON' ? `mistON();\n` : `mistOFF();\n`;
  };

  // ── 43. Putar Suara Speaker (DFPlayer) ────────────────────────
  Blockly.Blocks['resq_audio'] = {
    init() {
      this.appendDummyInput()
        .appendField('Putar Suara Speaker')
        .appendField(new Blockly.FieldDropdown([
          ['Gempa Bumi (Track 1)', '1'],
          ['Gemuruh Erupsi (Track 2)', '2'],
          ['Sirine Evakuasi (Track 3)', '3'],
          ['Hentikan Suara', '0'],
        ]), 'TRACK');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#DC2626');
      this.setTooltip('Putar efek suara simulasi bencana atau pengumuman melalui modul DFPlayer Mini.');
    },
  };
  arduinoGenerator.forBlock['resq_audio'] = function (block: Blockly.Block) {
    const track = block.getFieldValue('TRACK');
    if (track === '0') return `stopAudio();\n`;
    return `playTrack(${track});\n`;
  };

  // ── 44. Motor Getar Diorama ──────────────────────────────────
  Blockly.Blocks['resq_motor_getar'] = {
    init() {
      this.appendDummyInput()
        .appendField('Motor Getar Diorama')
        .appendField(new Blockly.FieldDropdown([
          ['Ringan (PWM 20)', '20'],
          ['Sedang (PWM 35)', '35'],
          ['Kuat (PWM 50)', '50'],
          ['Berhenti', '0'],
        ]), 'SPEED');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#DC2626');
      this.setTooltip('Atur kekuatan motor penggetar fisik meja simulasi gempa.');
    },
  };
  arduinoGenerator.forBlock['resq_motor_getar'] = function (block: Blockly.Block) {
    const speed = block.getFieldValue('SPEED');
    if (speed === '0') return `motorStop();\n`;
    return `analogWrite(MOTOR_AIN1, ${speed});\ndigitalWrite(MOTOR_AIN2, LOW);\n`;
  };
}

