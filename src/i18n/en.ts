// ── i18n/en.ts ────────────────────────────────────────────────────────────
// English dictionary — INTERFACE ONLY.
//
// Scope matches id.ts: buttons, labels, titles, system messages, errors, and
// navigation. Story dialogue and lesson material are NOT translated here;
// they live in dialogueData.ts and the level data files.
//
// LANGUAGE LEVEL
//   Readers are Indonesian junior-high students, so the English is kept simple:
//   short sentences, common words, no idioms. Technical terms that matter for
//   the lesson (lava, lahar, pyroclastic flow, KRB) are kept and explained the
//   first time they appear.
//
// STRUCTURE
//   Must mirror id.ts exactly. TypeScript fails the build if a key is missing,
//   which is what prevents half-translated screens.

export const en = {
  // ── Common ──────────────────────────────────────────────────────────────
  common: {
    readyHint: 'NOT YET — FINISH THE RESEARCHER CHALLENGE FIRST',
    appName: 'RESQ-BOX',
    tagline: 'Disaster Safety Learning Media',
    loading: 'Loading…',
    saving: 'Saving…',
    save: 'SAVE',
    cancel: 'CANCEL',
    close: 'CLOSE',
    back: 'BACK',
    next: 'NEXT',
    finish: 'FINISH',
    retry: 'TRY AGAIN',
    reload: 'RELOAD PAGE',
    home: 'BACK TO MAIN MENU',
    yes: 'Yes',
    no: 'No',
    search: 'Search',
    print: 'Print',
    download: 'Download',
    students: 'Students',
    student: 'Student',
    teacher: 'Teacher',
    admin: 'Admin',
    score: 'Score',
    level: 'Level',
    status: 'Status',
    class: 'Class',
    name: 'Name',
    username: 'Username',
    password: 'Password',
    school: 'School',
    absentNumber: 'Absent No.',
    completed: 'Done',
    locked: 'Locked',
    active: 'Active',
    optional: 'optional',
    required: 'required',
    unknownError: 'Something went wrong. Please try again.',
  },

  // ── Main navigation ─────────────────────────────────────────────────────
  nav: {
    teacherMonitor: 'TEACHER MONITORING POST',
    level1: 'LEVEL 1. EARTH EXPLORER',
    level2: 'LEVEL 2. DISASTER ANALYST',
    level3: 'LEVEL 3. SIMULATION GAME',
    guideAndMissions: 'GUIDE & MISSIONS',
    teacherPost: 'TEACHER POST',
    credits: 'CREDITS',
    learningGuide: 'LEARNING GUIDE',
  },

  // ── Sign-in page ────────────────────────────────────────────────────────
  login: {
    studentTab: 'STUDENT ACCOUNT',
    teacherTab: 'TEACHER ACCOUNT',
    noAccount: 'No account yet?',
    guestPlay: 'TRY WITHOUT SIGNING IN',
    guestNote: 'Play every level without an account. Your progress is not saved.',
    downloadHint: 'Download the app for the physical diorama',
    title: 'SIGN IN TO RESQ-BOX',
    roleStudent: 'Student',
    roleTeacher: 'Teacher',
    usernameLabel: 'Username',
    usernamePlaceholderStudent: 'Student username…',
    usernamePlaceholderTeacher: 'Example: guru',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password…',
    submitLogin: 'SIGN IN',
    loadingSession: 'Checking your session…',
    errorUsernameTaken: 'That username is already used. Try another one.',
    errorCredentials: 'Wrong username or password.',
    errorClassNotFound: 'Class code not found. Check it again or ask your teacher.',
    errorRequired: 'All fields marked * are required.',
    errorPasswordShort: 'Password must be at least 6 characters.',
    errorNetwork: 'Cannot reach the server. Check your internet connection.',
    errorTooManyAttempts: 'Too many tries. Please wait a moment and try again.',
    privacyLink: 'Privacy Policy & Student Data',
  },

  // ── Student profile ─────────────────────────────────────────────────────
  profile: {
    title: 'STUDENT PROFILE',
    editData: 'EDIT DATA',
    changePassword: 'CHANGE STUDENT PASSWORD',
    changePasswordHint: 'Change the password for your account (leave empty to keep the old one)',
    newPassword: 'New Password',
    confirmPassword: 'Repeat New Password',
    passwordMismatch: 'The two passwords are not the same.',
    passwordChanged: 'Password changed.',
    avatar: 'Avatar',
    customizeAvatar: 'CHANGE LOOK',
    dataSaver: 'DATA SAVER MODE',
    dataSaverOn: 'ON',
    dataSaverOff: 'OFF',
    dataSaverAuto: 'AUTOMATIC',
    dataSaverEnable: 'TURN ON',
    dataSaverDisable: 'TURN OFF',
    dataSaverNote:
      'Lesson materials stay complete. Only the display is lighter: the 3D volcano scene and heavy animations are not loaded, so the page opens faster and uses less data.',
    progress: 'LEARNING PROGRESS',
    language: 'LANGUAGE',
    languageHint: 'Choose the display language for menus, buttons, and messages.',
  },

  // ── Teacher post ────────────────────────────────────────────────────────
  teacher: {
    title: 'TEACHER POST',
    subtitle: 'Follow class progress and student scores',
    myClasses: 'MY CLASSES',
    noClasses: 'No classes yet. Create your first class.',
    createClass: 'CREATE CLASS',
    className: 'Class Name',
    classCode: 'Class Code',
    renameClass: 'RENAME CLASS',
    deleteClass: 'DELETE CLASS',
    deleteClassConfirm: 'Delete this class? All student data inside will be deleted and cannot be recovered.',
    studentList: 'STUDENT LIST',
    noStudents: 'No students have joined this class yet.',
    addStudent: 'ADD STUDENT',
    deleteStudent: 'DELETE STUDENT',
    deleteStudentConfirm: 'Delete this student account and all their results? This cannot be undone.',
    viewDetail: 'VIEW DETAIL',
    printReport: 'PRINT REPORT',
    exportCsv: 'DOWNLOAD CSV',
    lastActive: 'Last active',
    neverActive: 'Never signed in',
    averageScore: 'Average Score',
    completedLevels: 'Levels Done',
    liveUpdate: 'Auto refresh is on',
    refreshNow: 'REFRESH NOW',
    classNotSelected: 'Choose a class first.',
    newClass: 'NEW CLASS',
    addStudentShort: 'ADD STUDENT',
    createNow: 'CREATE A CLASS NOW',
    createClassCode: 'CREATE CLASS & NEW CODE',
    reportTitle: 'LEARNING PROGRESS REPORT',
    reportNote: 'This document was generated automatically by RESQ-BOX.',
  },

  // ── Privacy policy ──────────────────────────────────────────────────────
  privacy: {
    title: 'PRIVACY POLICY & STUDENT DATA',
    lastUpdated: 'Last updated',
    intro:
      'RESQ-BOX is a science learning media for junior high school. We only store the data we truly need to record learning results, and we never use it for ads or sell it.',
    footerNote:
      'This page exists so schools and parents can check for themselves how student data is handled. If any part needs more explanation, please contact us using the details in section 8.',
  },

  // ── Data saver & error recovery ─────────────────────────────────────────
  dataSaver: {
    reasonManualOn: 'Data saver was turned on manually. The 3D scene and heavy animations are off.',
    reasonManualOff: 'Data saver is off. The full display (3D and animations) is loaded.',
    reasonAutoMetered: 'Your browser reports a data-saving connection, so the display is lighter.',
    reasonAutoSlow: 'The connection looks slow (2G/3G), so the display is lighter.',
    reasonOff: 'The connection looks fast enough. The full display is loaded.',
    canvasTitle: 'DATA SAVER IS ON',
    canvasBody:
      'The 3D map is not loaded to save data and keep this device fast. The evacuation simulation still runs — the digital residents still respond to your safety actions.',
    canvasHint:
      'Want to see the 3D map? Turn off data saver on the Profile page, then open this page again.',
    canvasCta: 'OPEN PROFILE SETTINGS',
  },

  error: {
    recoverableTitle: 'CONNECTION LOST FOR A MOMENT',
    technicalTitle: 'TECHNICAL PROBLEM',
    recoverableBody:
      'The app could not load part of the material. This is usually caused by a dropped internet connection or a version update. Try reloading the page.',
    technicalBody:
      'The app ran into a problem. Your learning progress is still saved, so you will not lose your scores or place.',
    showTechnical: 'Show technical details',
    noMessage: 'No message',
    reportHint:
      'If this keeps happening, tell your teacher and mention the text in the “technical details” section above.',
  },

  notFound: {
    heading: 'PAGE NOT FOUND',
    body: 'Looks like you got lost inside a volcanic cave!',
    backHome: 'BACK TO HOME',
  },

  // ── Workspace & diorama ─────────────────────────────────────────────────
  workspace: {
    levelMap: 'LEVEL 3 MAP',
    mission: 'MISSION',
    start: 'START',
    mapLoading: 'LOADING THE 3D DISASTER MAP...',
    reloadMap: 'Reload Map',
    mapError: 'SOMETHING WENT WRONG WITH THE DIORAMA MAP.',
    title: 'WORKSPACE',
    connectDiorama: 'CONNECT DIORAMA',
    disconnect: 'DISCONNECT',
    ipAddress: 'IP Address',
    ipPlaceholder: '192.168.4.1',
    run: 'RUN',
    stop: 'STOP',
    reset: 'RESET',
    console: 'CONSOLE LOG',
    clearConsole: 'Clear the console log',
    invalidIp: 'Wrong IP format',
    connectionFailed: 'Could not connect to the diorama. Check that the device is on and on the same WiFi.',
    waitingDevice: 'Waiting for the device…',
    deviceReady: 'Diorama is ready.',
  },

  // ── Accessibility ───────────────────────────────────────────────────────
  a11y: {
    toggleSound: 'Turn sound on or off',
    toggleFullscreen: 'Enter or leave full screen',
    diveDeeper: 'Dive deeper',
    ascend: 'Go back up',
    toggleExplanation: 'Show or hide the explanation',
    runTectonicSim: 'Run the tectonic plate simulation',
    testMitigation: 'Test the safety plan',
    nextStep: 'Go to the next step',
    flipCard: 'Flip the card to see the explanation',
    unflipCard: 'Flip the card back',
    skipTyping: 'Show all the text now',
    openMaterial: 'Open material {name}',
  },

  // ── Dashboard & Level 3 ──
  dashboard: {
    teacherPost: 'TEACHER POST',
    switchAccount: 'SWITCH ACCOUNT',
    tagline: 'Tectonic Plates Learning Media',
    guide: 'GUIDE & MISSIONS',
    learningGuide: 'LEARNING GUIDE',
    about: 'ABOUT THE PLATFORM',
    credits: 'CREDITS',
  },

  // ── Dashboard & Level 3 ──
  level3: {
    mainMenu: 'MAIN MENU',
    myProject: 'MY PROJECT',
    competency: 'SKILLS YOU WILL GAIN',
    situation: 'DISASTER SITUATION',
    statusDone: 'STATUS: COMPLETED',
    statusReady: 'STATUS: READY',
    back: 'BACK',
    active: 'ACTIVE',
  },

  // ── Panel misi ──
  mission: {
    case: 'CASE',
    previous: 'PREVIOUS',
    checking: 'CHECKING...',
    validate: 'CHECK MISSION!',
    passed: 'MISSION COMPLETE!',
    failed: 'BLOCKS NEED FIXING',
    guideLabel: 'BLOCK LOCATION GUIDE:',
    feedbackTitle: 'Resqy feedback',
  },

  // ── Level 1 & 2 ──
  level1: {
    radar: 'EARTH RADAR',
    land: 'LAND (CONTINENT COLLISION)',
    ocean: 'OCEAN & COAST (TRENCH)',
    reset: 'RESET',
    replay: 'REPLAY ANIMATION',
    paused: 'SIMULATION PAUSED',
  },

  level2: {
    replaySim: 'REPLAY SIMULATION',
    jump: 'JUMP',
  },
} as const;
