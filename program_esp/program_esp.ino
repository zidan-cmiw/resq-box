#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DFRobotDFPlayerMini.h>
#include <WiFi.h>
#include <WebSocketsServer.h>

// =====================================================
// KONFIGURASI WEBSOCKET SERVER (PORT 81)
// Web App RESQ-BOX terhubung melalui ws://192.168.4.1:81
// =====================================================
WebSocketsServer webSocket(81);

void processCommand(String command, uint8_t clientNum = 255);
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length);

// =====================================================
// KONFIGURASI OLED SSD1306 (128x64 I2C)
// =====================================================
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define OLED_ADDR 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// =====================================================
// KONFIGURASI DFPLAYER MINI (SERIAL2)
// =====================================================
HardwareSerial dfSerial(2);
DFRobotDFPlayerMini dfPlayer;

#define DF_RX 16
#define DF_TX 17

bool dfPlayerReady = false;
int volumeLevel = 25;

// =====================================================
// KONFIGURASI PIN HARDWARE DIORAMA RESQ-BOX
// =====================================================
#define BUZZER_PIN   25
#define MIST_PIN     26

#define RGB_R        27
#define RGB_G        32
#define RGB_B        33
// Common Cathode (active HIGH) agar warna Lampu Aman (Hijau), Waspada (Kuning), Siaga (Oranye), Awas (Merah) menyala presisi
bool RGB_COMMON_ANODE = false;

#define RED_LED_PIN  14

#define MOTOR_AIN1   19
#define MOTOR_AIN2   18

// =====================================================
// VARIABEL & FUNGSI KOMPATIBILITAS ARDUINO C BLOCKLY
// 100% Selaras dengan kode C++ yang di-generate Blockly Level 3
// =====================================================
int seismicLevel = 0;           // Digunakan oleh blok: resq_tipe_gempa
String eruptionType = "EFUSIF"; // Digunakan oleh blok: resq_tipe_letusan

#ifndef ESP32_TONE_COMPAT
#define ESP32_TONE_COMPAT
// Kompatibilitas fungsi tone() untuk blok resq_alarm_darurat
inline void tone(uint8_t pin, unsigned int freq, unsigned long duration = 0) {
  digitalWrite(BUZZER_PIN, HIGH);
}
inline void noTone(uint8_t pin) {
  digitalWrite(BUZZER_PIN, LOW);
}
#endif

// =====================================================
// PARAMETER MOTOR GETAR (PWM & INTERVAL)
// Selaras dengan pilihan blok resq_motor_getar & resq_gempa_sim
// =====================================================
int motorKickPWM = 200;
int motorSustainPWM = 35;
unsigned long motorKickDuration = 250;
unsigned long motorKickStartTime = 0;
bool motorKicking = false;

int vibrationBasePWM = 35;
int vibrationPeakPWM = 50;
unsigned long vibrationInterval = 320;
unsigned long lastVibrationChange = 0;
bool vibrationHigh = false;
bool vibrationPatternActive = false;

bool motorState = false;

// =====================================================
// LEVEL GEMPA (SELARAS BLOCK CODING: PWM 20, 35, 50)
// =====================================================
struct GempaLevel {
  int sustainPWM;
  int peakPWM;
  int kickPWM;
  unsigned long interval;
};

const GempaLevel GEMPA_LEVELS[3] = {
  {  20,     35,   200,   400  },  // LEVEL 1 - RINGAN (PWM 20, 3-4 SR)
  {  35,     50,   210,   320  },  // LEVEL 2 - SEDANG (PWM 35, 5-6 SR)
  {  50,     70,   220,   250  }   // LEVEL 3 - KUAT   (PWM 50, >7 SR)
};

// =====================================================
// STATE SIMULASI BENCANA (GEMPA & GUNUNG INDEPENDEN)
// =====================================================
bool gempaActive = false;
int gempaLevel = 2;

bool gunungActive = false;
int gunungLevel = 2;
unsigned long gunungStartTime = 0;
bool mistDelayed = false;

enum DisasterMode {
  MODE_NORMAL,
  MODE_GEMPA,
  MODE_GUNUNG
};

enum SimStage {
  STAGE_IDLE,
  STAGE_WARNING,
  STAGE_ACTIVE
};

DisasterMode currentMode = MODE_NORMAL;
SimStage currentStage = STAGE_IDLE;

int currentLevel = 2;
unsigned long stageStartTime = 0;
const unsigned long WARNING_DURATION = 2000;

// =====================================================
// ANIMASI OLED
// =====================================================
unsigned long lastAnimFrame = 0;
const unsigned long ANIM_INTERVAL = 120;
uint8_t animFrame = 0;

unsigned long lastQuakeAnim = 0;
const unsigned long QUAKE_ANIM_INTERVAL = 80;
int8_t quakeOffset = 0;
int8_t quakeDir = 1;

unsigned long lastSmokeAnim = 0;
const unsigned long SMOKE_ANIM_INTERVAL = 150;
uint8_t smokeFrame = 0;

// =====================================================
// SERIAL
// =====================================================
String inputCommand = "";

// =====================================================
// KONFIGURASI WIFI ACCESS POINT
// ESP32 MEMANCARKAN HOTSPOT MANDIRI UNTUK WEB APP
// =====================================================
const char* AP_SSID     = "DIORAMA_ESP32";
const char* AP_PASSWORD = "12345678";

IPAddress AP_IP(192, 168, 4, 1);
IPAddress AP_GATEWAY(192, 168, 4, 1);
IPAddress AP_SUBNET(255, 255, 255, 0);

void startWiFiAP() {
  Serial.println();
  Serial.println("==============================================");
  Serial.println("       ESP32 WIFI ACCESS POINT");
  Serial.println("==============================================");

  WiFi.mode(WIFI_AP);

  if (!WiFi.softAPConfig(AP_IP, AP_GATEWAY, AP_SUBNET)) {
    Serial.println("Gagal mengatur konfigurasi IP AP!");
  }

  bool success = WiFi.softAP(AP_SSID, AP_PASSWORD);

  if (success) {
    Serial.println("WiFi AP berhasil dibuat!");
    Serial.print("SSID     : ");
    Serial.println(AP_SSID);
    Serial.print("Password : ");
    Serial.println(AP_PASSWORD);
    Serial.print("IP ESP32 : ");
    Serial.println(WiFi.softAPIP());
    Serial.print("MAC AP   : ");
    Serial.println(WiFi.softAPmacAddress());
    Serial.print("Client   : ");
    Serial.println(WiFi.softAPgetStationNum());
  } else {
    Serial.println("GAGAL membuat WiFi Access Point!");
  }

  Serial.println("==============================================");
}

void printWiFiStatus() {
  Serial.println();
  Serial.println("========== WIFI ACCESS POINT ==========");

  if (WiFi.getMode() == WIFI_AP) {
    Serial.println("Mode     : ACCESS POINT");
    Serial.print("SSID     : ");
    Serial.println(AP_SSID);
    Serial.print("Password : ");
    Serial.println(AP_PASSWORD);
    Serial.print("IP       : ");
    Serial.println(WiFi.softAPIP());
    Serial.print("MAC      : ");
    Serial.println(WiFi.softAPmacAddress());
    Serial.print("Client   : ");
    Serial.println(WiFi.softAPgetStationNum());
  } else {
    Serial.println("Mode     : BUKAN ACCESS POINT");
  }

  Serial.println("=======================================");
}

// =====================================================
// OLED HELPER DENGAN FORMAT TERTATA & AUTO WRAP
// =====================================================
void oledMessage(String line1, String line2 = "", String line3 = "") {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextWrap(true);

  // Baris Header
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println(line1);
  display.drawFastHLine(0, 10, 128, SSD1306_WHITE);

  // Baris Isi
  if (line3.length() > 0) {
    display.setCursor(0, 15);
    display.println(line2);
    display.drawFastHLine(0, 48, 128, SSD1306_WHITE);
    display.setCursor(0, 52);
    display.println(line3);
  } else if (line2.length() > 0) {
    display.setCursor(0, 15);
    display.println(line2);
  }

  display.display();
}

// =====================================================
// ANIMASI: SPLASH SCREEN
// =====================================================
void animSplash() {
  for (int i = 0; i <= 100; i += 5) {
    display.clearDisplay();

    display.setTextColor(SSD1306_WHITE);
    display.setTextSize(1);
    display.setCursor(16, 8);
    display.println("RESQ-BOX DIORAMA");

    display.drawTriangle(30, 40, 50, 20, 70, 40, SSD1306_WHITE);
    display.drawTriangle(55, 40, 75, 25, 95, 40, SSD1306_WHITE);

    display.drawRect(14, 50, 100, 8, SSD1306_WHITE);
    int fill = map(i, 0, 100, 0, 96);
    display.fillRect(16, 52, fill, 4, SSD1306_WHITE);

    display.setCursor(50, 44);
    display.print(i);
    display.print("%");

    display.display();
    delay(20);
  }

  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(20, 10);
  display.println("SIAP!");
  display.setTextSize(1);
  display.setCursor(20, 40);
  display.println("Diorama Bencana");
  display.setCursor(44, 52);
  display.println("ESP32 OK");
  display.display();
  delay(600);
}

// =====================================================
// ANIMASI: PERINGATAN
// =====================================================
void animWarning(DisasterMode mode, int level) {
  display.clearDisplay();

  bool blink = (animFrame % 2) == 0;

  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(28, 0);
  if (mode == MODE_GEMPA) {
    display.println("! ! ! GEMPA ! ! !");
  } else {
    display.println("! ! GUNUNG ! !");
  }

  if (blink) {
    display.fillTriangle(64, 14, 44, 44, 84, 44, SSD1306_WHITE);
    display.fillTriangle(62, 22, 66, 22, 64, 36, SSD1306_BLACK);
    display.fillRect(62, 39, 5, 3, SSD1306_BLACK);
  } else {
    display.drawTriangle(64, 14, 44, 44, 84, 44, SSD1306_WHITE);
    display.drawTriangle(62, 20, 60, 34, 68, 34, SSD1306_WHITE);
    display.drawRect(62, 39, 5, 3, SSD1306_WHITE);
  }

  display.setTextSize(1);
  display.setCursor(0, 50);
  if (mode == MODE_GEMPA) {
    display.print("BERSIAP! Level ");
  } else {
    display.print("AWAS! Level ");
  }
  display.print(level);

  display.display();
}

// =====================================================
// ANIMASI: AKTIF GEMPA
// =====================================================
void animActiveGempa(int level) {
  display.clearDisplay();

  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(16, 0);
  display.println("== GEMPA AKTIF ==");

  display.drawFastHLine(0, 32, 128, SSD1306_WHITE);

  int amp = 4 + level * 3;
  for (int x = 0; x < 128; x += 4) {
    int y = 32 + (int)(sin((x + quakeOffset * 4) * 0.35) * amp);
    if (y < 2) y = 2;
    if (y > 42) y = 42;
    display.drawPixel(x, y, SSD1306_WHITE);
    display.drawPixel(x + 1, y + 1, SSD1306_WHITE);
    display.drawPixel(x + 2, y, SSD1306_WHITE);
  }

  display.setCursor(0, 48);
  display.print("LVL ");
  display.print(level);
  display.print("  PWM ");
  display.print(vibrationBasePWM);

  if ((animFrame % 2) == 0) {
    display.fillCircle(118, 52, 4, SSD1306_WHITE);
  } else {
    display.drawCircle(118, 52, 4, SSD1306_WHITE);
  }

  display.display();
}

// =====================================================
// ANIMASI: AKTIF GUNUNG MELETUS
// =====================================================
void animActiveGunung(int level) {
  display.clearDisplay();

  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(8, 0);
  display.println("== GUNUNG MELETUS ==");

  display.drawTriangle(64, 20, 20, 52, 108, 52, SSD1306_WHITE);
  display.drawLine(64, 20, 50, 52, SSD1306_WHITE);

  display.fillRect(58, 20, 12, 2, SSD1306_WHITE);

  for (int i = 0; i < 4; i++) {
    int smokeY = 20 - ((smokeFrame + i * 3) % 14);
    int smokeX = 64 + ((i % 2 == 0) ? -3 : 3);
    int smokeR = 2 + i;
    if (smokeY > 2) {
      display.drawCircle(smokeX, smokeY, smokeR, SSD1306_WHITE);
    }
  }

  if ((animFrame % 2) == 0) {
    display.drawPixel(60, 22, SSD1306_WHITE);
    display.drawPixel(68, 22, SSD1306_WHITE);
  }

  display.setCursor(0, 56);
  display.print("LVL ");
  display.print(level);
  display.print(" Mist ON");

  display.display();
}

// =====================================================
// ANIMASI: GEMPA & GUNUNG AKTIF BERSAMAAN
// =====================================================
void animActiveDual(int gLevel, int mLevel) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(6, 0);
  display.println("! GEMPA & ERUPSI !");
  display.drawFastHLine(0, 10, 128, SSD1306_WHITE);

  // Bagian Kiri: Gelombang Seismik Gempa
  int amp = 2 + gLevel * 2;
  for (int x = 2; x < 58; x += 3) {
    int y = 30 + (int)(sin((x + quakeOffset * 4) * 0.4) * amp);
    if (y < 12) y = 12;
    if (y > 48) y = 48;
    display.drawPixel(x, y, SSD1306_WHITE);
    display.drawPixel(x + 1, y, SSD1306_WHITE);
  }

  // Garis Pemisah
  display.drawFastVLine(60, 11, 39, SSD1306_WHITE);

  // Bagian Kanan: Gunung Meletus & Asap Erupsi
  display.drawTriangle(94, 26, 68, 48, 120, 48, SSD1306_WHITE);
  display.fillRect(90, 26, 8, 2, SSD1306_WHITE);
  for (int i = 0; i < 3; i++) {
    int smokeY = 24 - ((smokeFrame + i * 2) % 12);
    int smokeX = 94 + ((i % 2 == 0) ? -2 : 2);
    if (smokeY > 12) {
      display.drawCircle(smokeX, smokeY, 2 + i, SSD1306_WHITE);
    }
  }

  // Status Bawah
  display.drawFastHLine(0, 50, 128, SSD1306_WHITE);
  display.setCursor(2, 54);
  display.print("GMP:L"); display.print(gLevel);
  display.setCursor(66, 54);
  display.print("GNG:L"); display.print(mLevel);

  display.display();
}

// =====================================================
// ANIMASI: STOP
// =====================================================
void animStop() {
  for (int i = 0; i < 2; i++) {
    display.clearDisplay();
    display.setTextSize(2);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(28, 20);
    display.println("STOP");
    display.display();
    delay(120);

    display.clearDisplay();
    display.display();
    delay(80);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(24, 20);
  display.println("SISTEM SIAP");
  display.setCursor(18, 38);
  display.println("Menunggu Misi...");
  display.display();
}

// =====================================================
// UPDATE ANIMASI
// =====================================================
void updateAnimation() {
  unsigned long now = millis();

  if (now - lastAnimFrame >= ANIM_INTERVAL) {
    lastAnimFrame = now;
    animFrame++;
  }

  if (currentStage == STAGE_WARNING) {
    static unsigned long lastWarningDraw = 0;
    if (now - lastWarningDraw >= ANIM_INTERVAL) {
      lastWarningDraw = now;
      animWarning(currentMode, currentLevel);
    }
    return;
  }

  // Jika kedua bencana aktif bersamaan
  if (gempaActive && gunungActive) {
    if (now - lastQuakeAnim >= QUAKE_ANIM_INTERVAL) {
      lastQuakeAnim = now;
      quakeOffset += quakeDir;
      if (quakeOffset > 8 || quakeOffset < -8) quakeDir = -quakeDir;
      smokeFrame++;
      animActiveDual(gempaLevel, gunungLevel);
    }
    return;
  }

  // Jika hanya gempa aktif
  if (gempaActive) {
    if (now - lastQuakeAnim >= QUAKE_ANIM_INTERVAL) {
      lastQuakeAnim = now;
      quakeOffset += quakeDir;
      if (quakeOffset > 8 || quakeOffset < -8) quakeDir = -quakeDir;
      animActiveGempa(gempaLevel);
    }
    return;
  }

  // Jika hanya gunung aktif
  if (gunungActive) {
    if (now - lastSmokeAnim >= SMOKE_ANIM_INTERVAL) {
      lastSmokeAnim = now;
      smokeFrame++;
      animActiveGunung(gunungLevel);
    }
    return;
  }
}

// =====================================================
// BUZZER (SFM-27 / SIRINE EWS)
// =====================================================
void buzzerON() {
  digitalWrite(BUZZER_PIN, HIGH);
  Serial.println("Buzzer: ON");
}

void buzzerOFF() {
  digitalWrite(BUZZER_PIN, LOW);
  Serial.println("Buzzer: OFF");
}

// =====================================================
// MIST MAKER (ASAP ERUPSI)
// =====================================================
void mistON() {
  digitalWrite(MIST_PIN, HIGH);
  Serial.println("Mist: ON");
}

void mistOFF() {
  digitalWrite(MIST_PIN, LOW);
  Serial.println("Mist: OFF");
}

// =====================================================
// LED MERAH FISIK STANDALONE (PIN 14)
// =====================================================
void redLED_ON()  { digitalWrite(RED_LED_PIN, HIGH); Serial.println("LED Merah: ON"); }
void redLED_OFF() { digitalWrite(RED_LED_PIN, LOW);  Serial.println("LED Merah: OFF"); }

// =====================================================
// RGB LED KONTROL (PIN 27, 32, 33)
// =====================================================
void writeRGB(int r, int g, int b) {
  r = constrain(r, 0, 255);
  g = constrain(g, 0, 255);
  b = constrain(b, 0, 255);

  if (RGB_COMMON_ANODE) {
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
  }

  analogWrite(RGB_R, r);
  analogWrite(RGB_G, g);
  analogWrite(RGB_B, b);
}

void rgbOFF() {
  if (RGB_COMMON_ANODE) {
    analogWrite(RGB_R, 255);
    analogWrite(RGB_G, 255);
    analogWrite(RGB_B, 255);
  } else {
    analogWrite(RGB_R, 0);
    analogWrite(RGB_G, 0);
    analogWrite(RGB_B, 0);
  }
  Serial.println("RGB: OFF");
}

// Selaras dengan pilihan blok resq_lampu_status:
// Aman (Hijau), Waspada (Kuning), Siaga (Oranye), Awas (Merah), Mati
void setRGBColor(String color) {
  color.toLowerCase();

  if (color == "red") {
    writeRGB(255, 0, 0);
    redLED_ON(); // Lampu Bahaya / Awas menyalakan juga LED merah diorama
  } else if (color == "green") {
    writeRGB(0, 255, 0);
    redLED_OFF();
  } else if (color == "blue") {
    writeRGB(0, 0, 255);
    redLED_OFF();
  } else if (color == "yellow") {
    writeRGB(255, 255, 0);
    redLED_OFF();
  } else if (color == "cyan") {
    writeRGB(0, 255, 255);
    redLED_OFF();
  } else if (color == "purple") {
    writeRGB(255, 0, 255);
    redLED_OFF();
  } else if (color == "orange") {
    writeRGB(255, 80, 0);
    redLED_OFF();
  } else if (color == "pink") {
    writeRGB(255, 20, 100);
    redLED_OFF();
  } else if (color == "white") {
    writeRGB(255, 255, 255);
    redLED_OFF();
  } else if (color == "off") {
    rgbOFF();
    redLED_OFF();
    return;
  } else {
    Serial.println("Warna RGB tidak dikenal: " + color);
    return;
  }

  Serial.print("RGB: ");
  Serial.println(color);
}

void testRGB() {
  Serial.println("Testing RGB...");
  setRGBColor("red");    delay(700);
  setRGBColor("green");  delay(700);
  setRGBColor("blue");   delay(700);
  setRGBColor("yellow"); delay(700);
  setRGBColor("cyan");   delay(700);
  setRGBColor("purple"); delay(700);
  setRGBColor("orange"); delay(700);
  setRGBColor("pink");   delay(700);
  setRGBColor("white");  delay(700);
  rgbOFF();
  redLED_OFF();
  Serial.println("RGB test selesai.");
}

// =====================================================
// MOTOR GETAR - STOP
// =====================================================
void motorStop() {
  motorKicking = false;
  vibrationPatternActive = false;
  vibrationHigh = false;

  analogWrite(MOTOR_AIN1, 0);
  digitalWrite(MOTOR_AIN1, LOW);
  digitalWrite(MOTOR_AIN2, LOW);

  motorState = false;

  Serial.println("Motor: STOP");
}

// =====================================================
// MOTOR GETAR - KICK START
// =====================================================
void motorStartKick(int sustainPWM, int kickPWM = 200) {
  sustainPWM = constrain(sustainPWM, 0, 255);
  kickPWM    = constrain(kickPWM, 0, 255);

  if (sustainPWM <= 0) {
    motorStop();
    return;
  }

  motorSustainPWM = sustainPWM;
  motorKickPWM    = kickPWM;

  motorKickStartTime = millis();
  motorKicking = true;
  motorState = true;

  vibrationPatternActive = true;
  vibrationHigh = false;
  lastVibrationChange = millis();

  digitalWrite(MOTOR_AIN2, LOW);
  analogWrite(MOTOR_AIN1, motorKickPWM);

  Serial.print("Motor KICK START (kick=");
  Serial.print(motorKickPWM);
  Serial.print(", sustain=");
  Serial.print(motorSustainPWM);
  Serial.print(", peak=");
  Serial.print(vibrationPeakPWM);
  Serial.print(", interval=");
  Serial.print(vibrationInterval);
  Serial.println(" ms)");
}

// =====================================================
// MOTOR GETAR - UPDATE
// =====================================================
void updateMotor() {
  if (motorKicking) {
    unsigned long elapsed = millis() - motorKickStartTime;

    if (elapsed >= motorKickDuration) {
      motorKicking = false;

      analogWrite(MOTOR_AIN1, vibrationBasePWM);
      motorState = true;

      vibrationHigh = false;
      lastVibrationChange = millis();

      Serial.print("Motor masuk pola GETARAN (base=");
      Serial.print(vibrationBasePWM);
      Serial.println(")");
    }
    return;
  }

  if (!motorState || !vibrationPatternActive) return;

  unsigned long now = millis();

  if (now - lastVibrationChange >= vibrationInterval) {
    lastVibrationChange = now;
    vibrationHigh = !vibrationHigh;

    if (vibrationHigh) {
      analogWrite(MOTOR_AIN1, vibrationPeakPWM);
    } else {
      analogWrite(MOTOR_AIN1, vibrationBasePWM);
    }
  }
}

// =====================================================
// SETTING PARAMETER GETARAN
// =====================================================
void setVibrationParams(int sustainPWM, int peakPWM, int kickPWM, unsigned long interval) {
  vibrationBasePWM   = constrain(sustainPWM, 0, 255);
  vibrationPeakPWM   = constrain(peakPWM, 0, 255);
  motorKickPWM       = constrain(kickPWM, 0, 255);
  vibrationInterval  = interval;
}

// =====================================================
// KONTROL SIMULASI GEMPA (INDEPENDEN)
// Buzzer TIDAK otomatis aktif (dikontrol terpisah via blok Sirine)
// =====================================================
void startGempa(int level) {
  level = constrain(level, 1, 3);
  int idx = level - 1;

  setVibrationParams(
    GEMPA_LEVELS[idx].sustainPWM,
    GEMPA_LEVELS[idx].peakPWM,
    GEMPA_LEVELS[idx].kickPWM,
    GEMPA_LEVELS[idx].interval
  );

  gempaActive  = true;
  gempaLevel   = level;
  seismicLevel = level; // Sinkron ke Blockly resq_tipe_gempa

  Serial.println();
  Serial.println("================================");
  Serial.print("  SIMULASI GEMPA AKTIF - LEVEL ");
  Serial.println(level);
  Serial.println("================================");
  Serial.print("Sustain PWM : "); Serial.println(vibrationBasePWM);
  Serial.print("Peak PWM    : "); Serial.println(vibrationPeakPWM);
  Serial.print("Kick PWM    : "); Serial.println(motorKickPWM);
  Serial.print("Interval    : "); Serial.print(vibrationInterval); Serial.println(" ms");

  // Motor getar diorama langsung menyala sesuai pola getaran gempa
  motorStartKick(vibrationBasePWM, motorKickPWM);

  // SFX Gempa jika DFPlayer siap: Track 1 = Gempa Bumi (sesuai resq_audio)
  if (dfPlayerReady) {
    dfPlayer.play(1);
    Serial.println("SFX Gempa: 0001.mp3");
  }

  // Tampilkan animasi OLED
  lastQuakeAnim = 0;
  quakeOffset   = 0;
  if (gunungActive) {
    animActiveDual(gempaLevel, gunungLevel);
  } else {
    animActiveGempa(gempaLevel);
  }
}

void stopGempa() {
  gempaActive  = false;
  seismicLevel = 0; // Reset variabel seismik
  motorStop();
  Serial.println("Simulasi Gempa: STOP");
  if (gunungActive) {
    animActiveGunung(gunungLevel);
  } else {
    oledMessage("SISTEM SIAP", "Gempa Selesai", "Menunggu...");
  }
}

// =====================================================
// KONTROL SIMULASI GUNUNG MERAPI (INDEPENDEN)
// Selaras dengan parameter blok resq_gunung_sim (Fase 1-3 & Efusif/Eksplosif)
// =====================================================
void startGunung(int level, bool isEfusif = false) {
  level = constrain(level, 1, 3);
  gunungActive    = true;
  gunungLevel     = level;
  gunungStartTime = millis();
  eruptionType    = isEfusif ? "EFUSIF" : "EKSPLOSIF"; // Sinkron ke Blockly resq_tipe_letusan

  Serial.println();
  Serial.println("================================");
  Serial.print("  SIMULASI GUNUNG MELETUS - LEVEL ");
  Serial.print(level);
  if (isEfusif) Serial.println(" (EFUSIF)");
  else Serial.println(" (EKSPLOSIF)");
  Serial.println("================================");

  if (level >= 3) {
    // Level 3 = AWAS: Erupsi Penuh
    mistDelayed = true;
    if (isEfusif) {
      startGempa(1); // EFUSIF: Gempa vulkanik tremor ringan (Level 1)
      oledMessage("STATUS: AWAS", "Erupsi Efusif", "Lava Pijar...");
    } else {
      startGempa(3); // EKSPLOSIF: Tremor vulkanik menyala kuat (Level 3)
      oledMessage("STATUS: AWAS!", "Tremor Vulkanik", "Pre-Erupsi...");
    }
  } else if (level == 2) {
    // Level 2 = SIAGA: Fase eskalasi magma. TIDAK ADA GEMPA & TIDAK ADA MIST!
    mistDelayed = false;
    mistOFF();
    stopGempa();
    oledMessage("STATUS: SIAGA", "Aktivitas Naik", "Waspada...");
  } else {
    // Level 1 = WASPADA: Pemantauan normal-tinggi. TIDAK ADA GEMPA & TIDAK ADA MIST!
    mistDelayed = false;
    mistOFF();
    stopGempa();
    oledMessage("STATUS: WASPADA", "Aktivitas Normal+", "Pemantauan...");
  }
}

void stopGunung() {
  gunungActive = false;
  mistDelayed  = false;
  mistOFF();
  stopGempa();
  Serial.println("Simulasi Gunung: STOP");
  oledMessage("SISTEM SIAP", "Erupsi Selesai", "Menunggu...");
}

// =====================================================
// MULAI SIMULASI (WRAPPER KOMPATIBILITAS BLOCKLY C)
// =====================================================
void startSimulation(DisasterMode mode, int level) {
  if (mode == MODE_GEMPA) {
    startGempa(level);
  } else if (mode == MODE_GUNUNG) {
    startGunung(level, false);
  }
}

// =====================================================
// UPDATE SIMULASI (TRANSISI PRE-ERUPSI & WARNING)
// =====================================================
void updateSimulation() {
  // Transisi jeda pre-erupsi: gempa bergetar ~2 detik, lalu mist & SFX erupsi (Track 2) aktif!
  if (gunungActive && mistDelayed && (millis() - gunungStartTime >= 2000)) {
    mistDelayed = false;
    mistON();
    if (dfPlayerReady) {
      dfPlayer.play(2); // Track 2: Gemuruh Erupsi (sesuai resq_audio)
      Serial.println("SFX Erupsi: 0002.mp3");
    }
    lastSmokeAnim = 0;
    smokeFrame    = 0;
    animActiveDual(gempaLevel, gunungLevel);
  }

  if (currentStage != STAGE_WARNING) return;
  if (millis() - stageStartTime < WARNING_DURATION) return;

  currentStage = STAGE_ACTIVE;
  if (currentMode == MODE_GEMPA) {
    startGempa(currentLevel);
  } else if (currentMode == MODE_GUNUNG) {
    startGunung(currentLevel, false);
  }
}

// =====================================================
// DFPLAYER MINI AUDIO
// Track 1: Gempa Bumi | Track 2: Gemuruh Erupsi | Track 3: Sirine Evakuasi
// =====================================================
void playTrack(int track) {
  if (!dfPlayerReady) {
    Serial.println("DFPlayer belum siap.");
    return;
  }
  if (track < 1) {
    Serial.println("Nomor track tidak valid.");
    return;
  }

  Serial.print("Memutar track: ");
  Serial.println(track);
  dfPlayer.play(track);

  oledMessage("DFPLAYER", "Track: " + String(track), "Audio Aktif");
}

void stopAudio() {
  if (!dfPlayerReady) return;
  dfPlayer.stop();
  Serial.println("Audio: STOP");
}

void setVolume(int volume) {
  volume = constrain(volume, 0, 30);
  volumeLevel = volume;

  if (dfPlayerReady) dfPlayer.volume(volume);

  Serial.print("Volume: ");
  Serial.println(volume);
}

void testSpeaker() {
  if (!dfPlayerReady) {
    Serial.println("DFPlayer tidak siap.");
    return;
  }

  dfPlayer.volume(volumeLevel);

  for (int i = 1; i <= 3; i++) {
    Serial.print("Memutar track ");
    Serial.println(i);
    dfPlayer.play(i);
    oledMessage("TEST SPEAKER", "Track: " + String(i), "Audio Test");
    delay(3000);
    dfPlayer.stop();
    delay(500);
  }

  Serial.println("Speaker test selesai.");
}

// =====================================================
// TEST DIAGNOSTIK
// =====================================================
void testBuzzer() {
  Serial.println("Testing buzzer...");
  buzzerON();
  delay(1000);
  buzzerOFF();
}

void testMist() {
  Serial.println("Testing mist...");
  mistON();
  delay(3000);
  mistOFF();
}

void testOLED() {
  oledMessage("OLED TEST", "Baris 1", "Baris 2");
  delay(2000);
  oledMessage("SISTEM DIORAMA", "OLED OK", "ESP32 RESQ-BOX");
}

// =====================================================
// STOP SEMUA (STOP ALL - RESET TOTAL)
// Selaras dengan blok resq_stopall & tombol Berhenti web
// =====================================================
void stopAll() {
  Serial.println();
  Serial.println("========== STOP SEMUA ==========");

  gempaActive  = false;
  gunungActive = false;
  mistDelayed  = false;

  seismicLevel = 0;
  currentMode  = MODE_NORMAL;
  currentStage = STAGE_IDLE;

  if (dfPlayerReady) dfPlayer.stop();

  motorStop();
  mistOFF();
  buzzerOFF();
  rgbOFF();
  redLED_OFF();

  animStop();
}

// =====================================================
// STATUS HARDWARE
// =====================================================
void printStatus() {
  Serial.println();
  Serial.println("========== STATUS HARDWARE ==========");

  Serial.print("DFPlayer : "); Serial.println(dfPlayerReady ? "READY" : "NOT READY");
  Serial.print("Volume   : "); Serial.println(volumeLevel);
  Serial.print("WiFi AP  : "); Serial.println(AP_SSID);
  Serial.print("IP WiFi  : "); Serial.println(WiFi.softAPIP());
  Serial.print("Client   : "); Serial.println(WiFi.softAPgetStationNum());
  Serial.print("Gempa    : "); Serial.println(gempaActive ? ("AKTIF (Lvl " + String(gempaLevel) + ")") : "OFF");
  Serial.print("Gunung   : "); Serial.println(gunungActive ? ("AKTIF (Lvl " + String(gunungLevel) + ")") : "OFF");
  Serial.print("Buzzer   : "); Serial.println(digitalRead(BUZZER_PIN) ? "ON" : "OFF");
  Serial.print("Mist     : "); Serial.println(digitalRead(MIST_PIN) ? "ON" : "OFF");
  Serial.print("LED Merah: "); Serial.println(digitalRead(RED_LED_PIN) ? "ON" : "OFF");
  Serial.print("Motor    : "); Serial.println(motorState ? "ON" : "OFF");
  Serial.print("RGB Anode: "); Serial.println(RGB_COMMON_ANODE ? "YES (Active LOW)" : "NO (Common Cathode - Active HIGH)");

  Serial.print("Base PWM : "); Serial.println(vibrationBasePWM);
  Serial.print("Peak PWM : "); Serial.println(vibrationPeakPWM);
  Serial.print("Kick PWM : "); Serial.println(motorKickPWM);
  Serial.print("Interval : "); Serial.print(vibrationInterval); Serial.println(" ms");

  Serial.println("=====================================");
}

// =====================================================
// MENU BANTUAN SERIAL
// =====================================================
void printMenu() {
  Serial.println();
  Serial.println("==============================================");
  Serial.println("   SISTEM DIORAMA MITIGASI BENCANA RESQ-BOX");
  Serial.println("==============================================");
  Serial.println();
  Serial.println("SIMULASI GEMPA:");
  Serial.println("  gempa 1 / ringan   -> Level 1 (sustain PWM 20)");
  Serial.println("  gempa 2 / sedang   -> Level 2 (sustain PWM 35)");
  Serial.println("  gempa 3 / kuat     -> Level 3 (sustain PWM 50)");
  Serial.println("  gempa 0 / stop     -> Hentikan simulasi gempa");
  Serial.println();
  Serial.println("SIMULASI GUNUNG MERAPI:");
  Serial.println("  gunung 1 / waspada -> Level 1 (Waspada, mist off)");
  Serial.println("  gunung 2 / siaga   -> Level 2 (Siaga, mist off)");
  Serial.println("  gunung 3 / awas    -> Level 3 (Awas Eksplosif, mist on)");
  Serial.println("  gunung 3 efusif    -> Level 3 (Awas Efusif, lava pijar)");
  Serial.println("  gunung 0 / stop    -> Hentikan simulasi erupsi");
  Serial.println();
  Serial.println("KONTROL UTAMA:");
  Serial.println("  stopall            -> Hentikan semua simulasi & perangkat");
  Serial.println();
  Serial.println("AUDIO DFPLAYER:");
  Serial.println("  play 1             -> Track 1: Gempa Bumi");
  Serial.println("  play 2             -> Track 2: Gemuruh Erupsi");
  Serial.println("  play 3             -> Track 3: Sirine Evakuasi");
  Serial.println("  stop               -> Stop audio");
  Serial.println("  vol N              -> Set volume (0-30)");
  Serial.println("  speaker            -> Test speaker");
  Serial.println();
  Serial.println("OUTPUT & AKTUATOR:");
  Serial.println("  buzzer on / off    -> Kontrol Sirine EWS (pin 25)");
  Serial.println("  mist on / off      -> Kontrol Mist Maker asap (pin 26)");
  Serial.println("  led on / off       -> Kontrol LED Merah (pin 14)");
  Serial.println("  rgb <warna>        -> green/yellow/orange/red/blue/off");
  Serial.println("  rgb R G B          -> Custom warna RGB (0-255)");
  Serial.println("  motor <pwm>        -> Kecepatan motor getar (20, 35, 50, off)");
  Serial.println("  oled <pesan>       -> Tampilkan pesan ke layar OLED");
  Serial.println();
  Serial.println("PROTOKOL RESQ-BOX BLOCK CODING:");
  Serial.println("  PIN:<target>:<val> -> PIN:10:HIGH, PIN:11:HIGH, PIN:BUZZER:ON");
  Serial.println();
  Serial.println("WIFI & SYSTEM:");
  Serial.println("  wifi               -> Status WiFi AP (ws://192.168.4.1:81)");
  Serial.println("  status             -> Tampilkan status semua aktuator");
  Serial.println("  help               -> Tampilkan menu bantuan ini");
  Serial.println();
  Serial.println("==============================================");
}

// =====================================================
// WEBSOCKET EVENT CALLBACK
// Menghubungkan browser Web App RESQ-BOX secara live
// =====================================================
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[WS] Klien #%u Terputus.\n", num);
      break;

    case WStype_CONNECTED: {
      IPAddress ip = webSocket.remoteIP(num);
      Serial.printf("[WS] Klien #%u Terhubung dari %d.%d.%d.%d\n", num, ip[0], ip[1], ip[2], ip[3]);
      webSocket.sendTXT(num, "CONNECTED_TO_ESP32\n");
      oledMessage("WEB TERHUBUNG!", "Klien: " + ip.toString(), "Port 81 Siap!");
      break;
    }

    case WStype_TEXT: {
      String msg = String((char*)payload);
      msg.trim();
      processCommand(msg, num);
      break;
    }

    default:
      break;
  }
}

// =====================================================
// UNIFIED COMMAND PROCESSOR
// Memproses perintah dari Serial Monitor (USB) dan WebSocket (WiFi)
// =====================================================
void processCommand(String command, uint8_t clientNum) {
  command.trim();
  if (command.length() == 0) return;

  Serial.print(">> ");
  Serial.println(command);

  String lowerCmd = command;
  lowerCmd.toLowerCase();

  // ---------------------------------------------------
  // 1. PROTOKOL PIN BLOCK CODING RESQ-BOX (PIN:TARGET:VALUE)
  // ---------------------------------------------------
  if (lowerCmd.startsWith("pin:")) {
    int c1 = command.indexOf(':');
    int c2 = command.indexOf(':', c1 + 1);
    if (c2 != -1) {
      String target = command.substring(c1 + 1, c2);
      String val = command.substring(c2 + 1);
      target.toUpperCase();
      val.toUpperCase();
      bool on = (val == "HIGH" || val == "1" || val == "ON");

      if (target == "10") { // Bahaya / Awas -> Merah
        if (on) { setRGBColor("red"); redLED_ON(); }
        else { rgbOFF(); redLED_OFF(); }
      } else if (target == "11") { // Aman -> Hijau
        if (on) setRGBColor("green");
        else rgbOFF();
      } else if (target == "12") { // Info -> Biru
        if (on) setRGBColor("blue");
        else rgbOFF();
      } else if (target == "13") { // Bawaan / Kuning Waspada
        if (on) setRGBColor("yellow");
        else rgbOFF();
      } else if (target == "14" || target == "RED") { // LED Merah Fisik
        if (on) redLED_ON();
        else redLED_OFF();
      } else if (target == "BUZZER" || target == "5") {
        if (on) buzzerON();
        else buzzerOFF();
      } else if (target == "MIST" || target == "6") {
        if (on) mistON();
        else mistOFF();
      } else if (target == "MOTOR") {
        if (on) motorStartKick(vibrationBasePWM, motorKickPWM);
        else motorStop();
      } else if (target == "ALL" && !on) {
        stopAll();
      }
    }
    if (clientNum != 255) {
      webSocket.sendTXT(clientNum, "ACK:" + command + "\n");
    }
    return;
  }

  // ---------------------------------------------------
  // 2. SIMULASI GEMPA (INDEPENDEN & RESQ-BOX COMPATIBLE)
  // ---------------------------------------------------
  if (lowerCmd.startsWith("gempa")) {
    if (lowerCmd == "gempa off" || lowerCmd == "gempa stop" || lowerCmd == "gempa 0" || lowerCmd.startsWith("gempa 0")) {
      stopGempa();
    } else {
      int lvl = 2;
      if (lowerCmd.indexOf("1") != -1 || lowerCmd.indexOf("ringan") != -1) lvl = 1;
      else if (lowerCmd.indexOf("3") != -1 || lowerCmd.indexOf("kuat") != -1) lvl = 3;
      startGempa(lvl);
    }
  }

  // ---------------------------------------------------
  // 3. SIMULASI GUNUNG MERAPI (INDEPENDEN & RESQ-BOX COMPATIBLE)
  // ---------------------------------------------------
  else if (lowerCmd.startsWith("gunung")) {
    if (lowerCmd == "gunung off" || lowerCmd == "gunung stop" || lowerCmd == "gunung 0" || lowerCmd.startsWith("gunung 0")) {
      stopGunung();
    } else {
      bool isEfusif = (lowerCmd.indexOf("efusif") != -1);
      int lvl = 2;
      if (lowerCmd.indexOf("1") != -1 || lowerCmd.indexOf("ringan") != -1 || lowerCmd.indexOf("waspada") != -1) lvl = 1;
      else if (lowerCmd.indexOf("3") != -1 || lowerCmd.indexOf("kuat") != -1 || lowerCmd.indexOf("awas") != -1) lvl = 3;
      else if (lowerCmd.indexOf("siaga") != -1) lvl = 2;
      startGunung(lvl, isEfusif);
    }
  }

  // ---------------------------------------------------
  // 4. STOP SEMUA
  // ---------------------------------------------------
  else if (lowerCmd == "stopall" || lowerCmd == "stop all" || lowerCmd == "stop") {
    stopAll();
  }

  // ---------------------------------------------------
  // 5. MOTOR GETAR DIORAMA
  // ---------------------------------------------------
  else if (lowerCmd.startsWith("motor ")) {
    String spdStr = lowerCmd.substring(6);
    spdStr.trim();
    int pwm = spdStr.toInt();
    if (pwm == 0 || spdStr == "off" || spdStr == "stop") {
      motorStop();
    } else {
      motorStartKick(pwm, motorKickPWM);
    }
  }
  else if (lowerCmd == "motor on") {
    motorStartKick(vibrationBasePWM, motorKickPWM);
  }
  else if (lowerCmd == "motor off" || lowerCmd == "motor stop") {
    motorStop();
  }

  // ---------------------------------------------------
  // 6. LED MERAH (PIN 14)
  // ---------------------------------------------------
  else if (lowerCmd == "led on" || lowerCmd == "redled on") {
    redLED_ON();
  }
  else if (lowerCmd == "led off" || lowerCmd == "redled off") {
    redLED_OFF();
  }

  // ---------------------------------------------------
  // 7. BUZZER
  // ---------------------------------------------------
  else if (lowerCmd == "buzzer") {
    testBuzzer();
  }
  else if (lowerCmd == "buzzer on") {
    buzzerON();
  }
  else if (lowerCmd == "buzzer off") {
    buzzerOFF();
  }

  // ---------------------------------------------------
  // 8. MIST MAKER
  // ---------------------------------------------------
  else if (lowerCmd == "mist") {
    testMist();
  }
  else if (lowerCmd == "mist on") {
    mistON();
  }
  else if (lowerCmd == "mist off") {
    mistOFF();
  }

  // ---------------------------------------------------
  // 9. RGB LED
  // ---------------------------------------------------
  else if (lowerCmd == "anode" || lowerCmd == "rgb anode") {
    RGB_COMMON_ANODE = true;
    rgbOFF();
    Serial.println("RGB Mode: Common ANODE (Active LOW)");
  }
  else if (lowerCmd == "cathode" || lowerCmd == "rgb cathode") {
    RGB_COMMON_ANODE = false;
    rgbOFF();
    Serial.println("RGB Mode: Common CATHODE (Active HIGH)");
  }
  else if (lowerCmd == "rgbtest") {
    testRGB();
  }
  else if (lowerCmd.startsWith("rgb ")) {
    String rgbCmd = lowerCmd.substring(4);
    rgbCmd.trim();

    int sp1 = rgbCmd.indexOf(' ');
    if (sp1 > 0) {
      String rStr = rgbCmd.substring(0, sp1);
      String rest = rgbCmd.substring(sp1 + 1);
      int sp2 = rest.indexOf(' ');

      if (sp2 > 0) {
        int r = rStr.toInt();
        int g = rest.substring(0, sp2).toInt();
        int b = rest.substring(sp2 + 1).toInt();
        writeRGB(r, g, b);
        Serial.print("RGB custom: ");
        Serial.print(r); Serial.print(", ");
        Serial.print(g); Serial.print(", ");
        Serial.println(b);
      } else {
        Serial.println("Format: rgb R G B");
      }
    } else {
      setRGBColor(rgbCmd);
    }
  }

  // ---------------------------------------------------
  // 10. OLED
  // ---------------------------------------------------
  else if (lowerCmd.startsWith("oled ")) {
    String msg = command.substring(5);
    msg.trim();
    oledMessage("INFO MITIGASI", msg, "RESQ-BOX");
  }
  else if (lowerCmd == "oled") {
    testOLED();
  }

  // ---------------------------------------------------
  // 11. AUDIO DFPLAYER
  // ---------------------------------------------------
  else if (lowerCmd.startsWith("play ")) {
    int track = lowerCmd.substring(5).toInt();
    playTrack(track);
  }
  else if (lowerCmd == "stop") {
    stopAudio();
  }
  else if (lowerCmd.startsWith("vol ")) {
    int vol = lowerCmd.substring(4).toInt();
    setVolume(vol);
  }
  else if (lowerCmd == "speaker") {
    testSpeaker();
  }

  // ---------------------------------------------------
  // 12. WIFI & SYSTEM
  // ---------------------------------------------------
  else if (lowerCmd == "wifi") {
    printWiFiStatus();
  }
  else if (lowerCmd == "status") {
    printStatus();
  }
  else if (lowerCmd == "help") {
    printMenu();
  }

  // ---------------------------------------------------
  // 13. UNKNOWN
  // ---------------------------------------------------
  else {
    Serial.println();
    Serial.println("Command tidak dikenal: " + command);
    Serial.println("Ketik 'help' untuk melihat menu.");
  }

  if (clientNum != 255) {
    webSocket.sendTXT(clientNum, "ACK:" + command + "\n");
  }
  Serial.println();
}

// =====================================================
// SETUP
// =====================================================
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println("==============================================");
  Serial.println("  ESP32 DIORAMA MITIGASI BENCANA RESQ-BOX");
  Serial.println("==============================================");

  startWiFiAP();

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  Serial.println("WebSocket Server aktif di ws://192.168.4.1:81");

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(MIST_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(RGB_R, OUTPUT);
  pinMode(RGB_G, OUTPUT);
  pinMode(RGB_B, OUTPUT);
  pinMode(MOTOR_AIN1, OUTPUT);
  pinMode(MOTOR_AIN2, OUTPUT);

  digitalWrite(MOTOR_AIN1, LOW);
  digitalWrite(MOTOR_AIN2, LOW);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(MIST_PIN, LOW);
  digitalWrite(RED_LED_PIN, LOW);

  rgbOFF();
  motorStop();

  Wire.begin(21, 22);
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    Serial.println("OLED gagal ditemukan!");
  } else {
    Serial.println("OLED OK");
    animSplash();
  }

  dfSerial.begin(9600, SERIAL_8N1, DF_RX, DF_TX);
  Serial.println("Initializing DFPlayer...");
  delay(1000);

  if (dfPlayer.begin(dfSerial)) {
    dfPlayerReady = true;
    Serial.println("DFPlayer OK");
    dfPlayer.volume(volumeLevel);
    dfPlayer.EQ(DFPLAYER_EQ_NORMAL);
    dfPlayer.stop();
  } else {
    dfPlayerReady = false;
    Serial.println("DFPlayer tidak ditemukan!");
    Serial.println("Periksa: TX/RX, GND, 5V, SD card");
  }

  currentMode  = MODE_NORMAL;
  currentStage = STAGE_IDLE;
  currentLevel = 2;

  motorStop();
  buzzerOFF();
  mistOFF();
  redLED_OFF();
  rgbOFF();

  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(24, 20);
  display.println("SISTEM SIAP");
  display.setCursor(16, 36);
  display.println("AP: " + String(AP_SSID));
  display.setCursor(20, 50);
  display.println("IP: 192.168.4.1");
  display.display();

  printMenu();
}

// =====================================================
// LOOP UTAMA
// =====================================================
void loop() {
  webSocket.loop();
  updateMotor();
  updateSimulation();
  updateAnimation();

  if (Serial.available()) {
    inputCommand = Serial.readStringUntil('\n');
    processCommand(inputCommand, 255);
  }
}