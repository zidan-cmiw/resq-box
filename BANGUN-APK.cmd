@echo off
REM ══════════════════════════════════════════════════════════════════════════
REM  RESQ-BOX — Bangun aplikasi Android
REM ══════════════════════════════════════════════════════════════════════════
REM
REM  Klik dua kali berkas ini untuk menyiapkan aplikasi Android.
REM
REM  Berkas ini ada karena menjalankan perintah di jendela PowerShell yang
REM  belum berada di folder yang benar adalah sumber kebingungan yang paling
REM  sering terjadi. Dengan berkas ini, kamu tidak perlu mengetik apa pun:
REM  ia mengurus pindah folder dan memeriksa kelengkapan alat.
REM
REM  Yang dilakukan:
REM    1. Memastikan berkas ini dijalankan dari folder yang benar
REM    2. Memeriksa apakah Android Studio sudah terpasang
REM    3. Membangun web lalu menyalinnya ke proyek Android
REM    4. Membuka proyek Android di Android Studio (bila sudah terpasang)
REM ══════════════════════════════════════════════════════════════════════════

setlocal
cd /d "%~dp0"

echo.
echo ==========================================================
echo   RESQ-BOX - Menyiapkan aplikasi Android
echo ==========================================================
echo.
echo   Folder proyek: %CD%
echo.

REM ── 1. Pastikan ini folder proyek yang benar ─────────────────────────────
if not exist "package.json" (
  echo   [X] package.json tidak ditemukan di folder ini.
  echo.
  echo       Berkas .cmd ini harus berada di dalam folder proyek RESQ-BOX,
  echo       bersebelahan dengan package.json dan capacitor.config.ts.
  echo.
  pause
  exit /b 1
)
if not exist "capacitor.config.ts" (
  echo   [X] capacitor.config.ts tidak ditemukan.
  echo       Folder ini sepertinya bukan proyek RESQ-BOX yang benar.
  echo.
  pause
  exit /b 1
)
echo   [v] Folder proyek benar
echo.

REM ── 2. Periksa Android Studio ────────────────────────────────────────────
set "STUDIO="
if exist "%ProgramFiles%\Android\Android Studio\bin\studio64.exe" set "STUDIO=%ProgramFiles%\Android\Android Studio\bin\studio64.exe"
if exist "%LOCALAPPDATA%\Programs\Android Studio\bin\studio64.exe" set "STUDIO=%LOCALAPPDATA%\Programs\Android Studio\bin\studio64.exe"
if exist "%ProgramFiles%\Android\Android Studio\bin\studio.exe" set "STUDIO=%ProgramFiles%\Android\Android Studio\bin\studio.exe"

if defined STUDIO (
  echo   [v] Android Studio ditemukan
) else (
  echo   [!] Android Studio BELUM terpasang
)
echo.

REM ── 3. Bangun web dan salin ke proyek Android ────────────────────────────
echo ----------------------------------------------------------
echo   Langkah 1 dari 2: membangun web dan menyalinnya
echo ----------------------------------------------------------
echo.
call npm run android:sync
if errorlevel 1 (
  echo.
  echo   [X] Gagal membangun web.
  echo       Coba jalankan: npm install
  echo       lalu ulangi berkas ini.
  echo.
  pause
  exit /b 1
)

echo.
echo   [v] Web berhasil disalin ke proyek Android
echo.

REM ── 4. Buka Android Studio ───────────────────────────────────────────────
echo ----------------------------------------------------------
echo   Langkah 2 dari 2: membuka Android Studio
echo ----------------------------------------------------------
echo.

if not defined STUDIO (
  echo   Android Studio belum terpasang, jadi langkah ini dilewati.
  echo.
  echo   PASANG DULU:
  echo     1. Buka https://developer.android.com/studio
  echo     2. Unduh dan pasang dengan pilihan bawaan
  echo     3. Jalankan SEKALI supaya Android SDK terunduh, lalu tutup
  echo     4. Klik dua kali berkas ini lagi
  echo.
  echo   Setelah Android Studio terbuka:
  echo     Build  -^>  Build Bundle^(s^) / APK^(s^)  -^>  Build APK^(s^)
  echo.
  echo   Hasil APK ada di:
  echo     android\app\build\outputs\apk\debug\app-debug.apk
  echo.
  pause
  exit /b 0
)

call npm run android:open

echo.
echo ----------------------------------------------------------
echo   SELESAI - Android Studio sedang dibuka
echo ----------------------------------------------------------
echo.
echo   Di Android Studio, tunggu "Gradle sync" selesai
echo   (pertama kali bisa 1-3 menit), lalu:
echo.
echo     Build  -^>  Build Bundle^(s^) / APK^(s^)  -^>  Build APK^(s^)
echo.
echo   Hasil APK ada di:
echo     android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo   Salin berkas itu ke tablet, lalu pasang.
echo.
pause
endlocal
