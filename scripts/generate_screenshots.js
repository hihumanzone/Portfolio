import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/projects');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function svgWrapper(title, subtitle, badgeText, badgeColor, contentSvg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1d" />
      <stop offset="50%" stop-color="#0e172a" />
      <stop offset="100%" stop-color="#060913" />
    </linearGradient>
    <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
    <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#ef4444" />
    </linearGradient>
    <linearGradient id="greenGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <pattern id="gridPattern" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="1280" height="720" fill="url(#bgGrad)" />
  <rect width="1280" height="720" fill="url(#gridPattern)" />

  <!-- App Window Frame -->
  <rect x="24" y="24" width="1232" height="672" rx="12" fill="#0b111e" stroke="rgba(120, 188, 235, 0.22)" stroke-width="1.5" />

  <!-- Window Titlebar -->
  <rect x="24" y="24" width="1232" height="46" rx="12" fill="#080c16" />
  <rect x="24" y="58" width="1232" height="12" fill="#080c16" />
  <line x1="24" y1="70" x2="1256" y2="70" stroke="rgba(255,255,255,0.08)" stroke-width="1" />

  <!-- Window Dots -->
  <circle cx="48" cy="47" r="6" fill="#ef4444" />
  <circle cx="68" cy="47" r="6" fill="#f59e0b" />
  <circle cx="88" cy="47" r="6" fill="#10b981" />

  <!-- Titlebar text -->
  <text x="120" y="52" font-family="'Fira Code', monospace" font-size="13" font-weight="600" fill="#94a3b8" letter-spacing="1">${title}</text>
  <text x="640" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#64748b" text-anchor="middle">${subtitle}</text>

  <!-- Titlebar Badge -->
  <rect x="1100" y="37" width="136" height="22" rx="11" fill="${badgeColor}22" stroke="${badgeColor}88" stroke-width="1" />
  <text x="1168" y="52" font-family="'Fira Code', monospace" font-size="10" font-weight="600" fill="${badgeColor}" text-anchor="middle">${badgeText}</text>

  <!-- Main Viewport Content -->
  <g transform="translate(24, 70)">
    ${contentSvg}
  </g>

  <!-- Subtle CRT Scanline overlay effect -->
  <line x1="24" y1="24" x2="1256" y2="24" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
</svg>`;
}

const screenshots = {
  // 1. Gemini Discord Bot - Main Chat UI
  'gemini-discord-bot-1.svg': svgWrapper(
    'DISCORD.CLIENT // #ai-cognition-lab',
    'Gemini 2.0 Flash • Multimodal Audio, Video &amp; Realtime Reasoning',
    '★ 101 STARS',
    '#f59e0b',
    `
    <!-- Sidebar Channels -->
    <rect x="0" y="0" width="220" height="626" fill="#080d1a" />
    <text x="24" y="36" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="700" fill="#f8fafc">ALPINE AI GUILD</text>
    <rect x="16" y="56" width="188" height="30" rx="6" fill="rgba(56, 189, 248, 0.15)" stroke="rgba(56, 189, 248, 0.3)" />
    <text x="32" y="76" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8"># 🤖 ai-cognition-lab</text>
    <text x="32" y="112" font-family="'Fira Code', monospace" font-size="12" fill="#64748b"># 🔊 voice-lounge</text>
    <text x="32" y="148" font-family="'Fira Code', monospace" font-size="12" fill="#64748b"># 📊 latency-benchmarks</text>
    <text x="32" y="184" font-family="'Fira Code', monospace" font-size="12" fill="#64748b"># ⚙ bot-settings</text>

    <!-- Main Chat Feed -->
    <g transform="translate(240, 20)">
      <!-- User message -->
      <circle cx="20" cy="24" r="18" fill="#3b82f6" />
      <text x="20" y="29" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="12" fill="#fff" text-anchor="middle">RK</text>
      <text x="50" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#e2e8f0">Riddhiman Kundal</text>
      <text x="180" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#64748b">Today at 4:12 PM</text>
      <text x="50" y="44" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#cbd5e1">@Gemini Analyze this high-altitude sensor telemetry and compute mountain pass wind vectors:</text>
      
      <!-- Telemetry attachment card -->
      <rect x="50" y="60" width="460" height="96" rx="8" fill="#0f172a" stroke="rgba(120, 188, 235, 0.3)" />
      <path d="M 70 120 Q 150 70, 230 110 T 390 90 T 480 130" fill="none" stroke="#38bdf8" stroke-width="2.5" />
      <text x="70" y="86" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">RAW TELEMETRY: summit_sensor_array_142.bin (48.2 KB)</text>
      <text x="70" y="142" font-family="'Fira Code', monospace" font-size="10" fill="#10b981">✓ Verified SHA-256 Checksum • 8 Channels</text>

      <!-- Bot Message -->
      <g transform="translate(0, 176)">
        <circle cx="20" cy="24" r="18" fill="#f59e0b" />
        <text x="20" y="29" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="11" fill="#000" text-anchor="middle">AI</text>
        <text x="50" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#38bdf8">Gemini Cognition</text>
        <rect x="175" y="8" width="48" height="18" rx="4" fill="#6366f1" />
        <text x="199" y="21" font-family="'Fira Code', monospace" font-size="9" font-weight="700" fill="#fff" text-anchor="middle">BOT</text>
        <text x="235" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#64748b">Gemini 2.0 Flash • 242ms</text>

        <!-- Bot Response Box -->
        <rect x="50" y="36" width="700" height="340" rx="10" fill="#0c1424" stroke="rgba(56, 189, 248, 0.25)" />
        
        <!-- Thinking accordion -->
        <rect x="66" y="52" width="668" height="32" rx="6" fill="rgba(255, 255, 255, 0.04)" />
        <text x="82" y="73" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">✦ Thought for 0.84 seconds (Multimodal sensor tokenization &amp; gradient analysis)</text>
        
        <!-- Markdown content -->
        <text x="66" y="112" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="#f1f5f9">Analysis of Alpine Ridge Telemetry:</text>
        <text x="66" y="136" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94a3b8">Cross-referenced wind pressure differential against summit coordinates. High shear detected:</text>
        
        <!-- Data Table -->
        <rect x="66" y="152" width="668" height="110" rx="6" fill="#070c18" stroke="rgba(255, 255, 255, 0.08)" />
        <line x1="66" y1="184" x2="734" y2="184" stroke="rgba(255, 255, 255, 0.08)" />
        <text x="82" y="174" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="#38bdf8">VECTOR</text>
        <text x="240" y="174" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="#38bdf8">VELOCITY</text>
        <text x="390" y="174" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="#38bdf8">TURBULENCE</text>
        <text x="560" y="174" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="#38bdf8">STATUS</text>

        <text x="82" y="210" font-family="'Fira Code', monospace" font-size="12" fill="#e2e8f0">NNE 024°</text>
        <text x="240" y="210" font-family="'Fira Code', monospace" font-size="12" fill="#e2e8f0">44.8 kt</text>
        <text x="390" y="210" font-family="'Fira Code', monospace" font-size="12" fill="#f59e0b">Moderate (0.62)</text>
        <text x="560" y="210" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">SAFE TRAIL</text>

        <text x="82" y="244" font-family="'Fira Code', monospace" font-size="12" fill="#e2e8f0">WNW 290°</text>
        <text x="240" y="244" font-family="'Fira Code', monospace" font-size="12" fill="#e2e8f0">62.1 kt</text>
        <text x="390" y="244" font-family="'Fira Code', monospace" font-size="12" fill="#ef4444">Severe (0.89)</text>
        <text x="560" y="244" font-family="'Fira Code', monospace" font-size="12" fill="#ef4444">PASS CLOSED</text>

        <!-- Metric badges -->
        <rect x="66" y="280" width="130" height="26" rx="13" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.4)" />
        <text x="131" y="297" font-family="'Fira Code', monospace" font-size="10" fill="#38bdf8" text-anchor="middle">TOKENS: 1,420</text>

        <rect x="210" y="280" width="150" height="26" rx="13" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.4)" />
        <text x="285" y="297" font-family="'Fira Code', monospace" font-size="10" fill="#10b981" text-anchor="middle">STREAMING: 68 tk/s</text>

        <rect x="375" y="280" width="150" height="26" rx="13" fill="rgba(245, 158, 11, 0.12)" stroke="rgba(245, 158, 11, 0.4)" />
        <text x="450" y="297" font-family="'Fira Code', monospace" font-size="10" fill="#f59e0b" text-anchor="middle">SESSION: SHARED</text>
      </g>
    </g>
    `
  ),

  // 2. Gemini Discord Bot - Dashboard & Memory Settings
  'gemini-discord-bot-2.svg': svgWrapper(
    'GEMINI-DISCORD-BOT // ADMIN DASHBOARD &amp; MEMORY TELEMETRY',
    'Multi-Turn Contextual Buffer • Grounding Tools • Dynamic Persona',
    'v2.4 ACTIVE',
    '#38bdf8',
    `
    <g transform="translate(30, 20)">
      <!-- Top Metrics -->
      <rect x="0" y="0" width="280" height="110" rx="8" fill="#0f172a" stroke="rgba(56, 189, 248, 0.3)" />
      <text x="24" y="32" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">ACTIVE CONTEXT WINDOW</text>
      <text x="24" y="74" font-family="'Fira Code', monospace" font-size="32" font-weight="700" fill="#38bdf8">128,450</text>
      <text x="24" y="96" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#64748b">Tokens cached across 42 active guilds</text>

      <rect x="304" y="0" width="280" height="110" rx="8" fill="#0f172a" stroke="rgba(245, 158, 11, 0.3)" />
      <text x="328" y="32" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">MEDIAN LATENCY</text>
      <text x="328" y="74" font-family="'Fira Code', monospace" font-size="32" font-weight="700" fill="#f59e0b">218 ms</text>
      <text x="328" y="96" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#64748b">WebSocket streaming to Discord Gateway</text>

      <rect x="608" y="0" width="280" height="110" rx="8" fill="#0f172a" stroke="rgba(16, 185, 129, 0.3)" />
      <text x="632" y="32" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">TOOL EXECUTION RATE</text>
      <text x="632" y="74" font-family="'Fira Code', monospace" font-size="32" font-weight="700" fill="#10b981">99.4%</text>
      <text x="632" y="96" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#64748b">Search, Python sandbox, Code execution</text>

      <rect x="912" y="0" width="260" height="110" rx="8" fill="#0f172a" stroke="rgba(129, 140, 248, 0.3)" />
      <text x="936" y="32" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">STARRED REPO</text>
      <text x="936" y="74" font-family="'Fira Code', monospace" font-size="32" font-weight="700" fill="#818cf8">101 ★</text>
      <text x="936" y="96" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#64748b">72 open-source forks on GitHub</text>

      <!-- Memory Timeline Graph -->
      <rect x="0" y="130" width="780" height="280" rx="10" fill="#0b1322" stroke="rgba(255, 255, 255, 0.08)" />
      <text x="24" y="162" font-family="'Fira Code', monospace" font-size="13" font-weight="600" fill="#f8fafc">MULTI-TURN REASONING &amp; TOKEN ALLOCATION STREAM</text>
      
      <!-- Graph Lines -->
      <path d="M 40 360 L 120 320 L 200 340 L 280 270 L 360 300 L 440 230 L 520 250 L 600 200 L 680 210 L 750 180" fill="none" stroke="#38bdf8" stroke-width="3" />
      <path d="M 40 380 L 120 370 L 200 360 L 280 340 L 360 330 L 440 310 L 520 290 L 600 270 L 680 250 L 750 240" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 4" />

      <!-- Settings Panel on Right -->
      <rect x="800" y="130" width="372" height="430" rx="10" fill="#0b1322" stroke="rgba(255, 255, 255, 0.08)" />
      <text x="824" y="162" font-family="'Fira Code', monospace" font-size="13" font-weight="600" fill="#f8fafc">AGENT CONTROL MATRIX</text>
      
      <rect x="824" y="185" width="324" height="48" rx="6" fill="#131e33" />
      <text x="840" y="214" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">GOOGLE_SEARCH_GROUNDING: ON</text>

      <rect x="824" y="245" width="324" height="48" rx="6" fill="#131e33" />
      <text x="840" y="274" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">PYTHON_CODE_EXECUTION: ON</text>

      <rect x="824" y="305" width="324" height="48" rx="6" fill="#131e33" />
      <text x="840" y="334" font-family="'Fira Code', monospace" font-size="12" fill="#f59e0b">DYNAMIC_IMAGE_GENERATION: ACTIVE</text>

      <rect x="824" y="365" width="324" height="48" rx="6" fill="#131e33" />
      <text x="840" y="394" font-family="'Fira Code', monospace" font-size="12" fill="#e2e8f0">MAX_MESSAGE_HISTORY: 50 TURNS</text>
    </g>
    `
  ),

  // 3. opendroid_remote - 60 FPS Streaming View
  'opendroid-remote-1.svg': svgWrapper(
    'OPENDROID_REMOTE // BROWSER HARDWARE STREAM CLIENT',
    'WebUSB + WebADB Protocol • WebCodecs H.264 / HEVC Hardware Decode • 60 FPS',
    'ZERO DRIVERS',
    '#10b981',
    `
    <g transform="translate(20, 15)">
      <!-- Left: Streaming Phone Display Container -->
      <rect x="0" y="0" width="320" height="570" rx="36" fill="#000" stroke="#334155" stroke-width="4" />
      <rect x="10" y="10" width="300" height="550" rx="28" fill="#0f172a" />
      
      <!-- Phone Status Bar -->
      <text x="32" y="36" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="#fff">09:41</text>
      <text x="280" y="36" font-family="'Fira Code', monospace" font-size="10" fill="#fff" text-anchor="end">5G 100%</text>

      <!-- Simulated Android Home Screen -->
      <g transform="translate(20, 70)">
        <rect x="10" y="0" width="260" height="44" rx="22" fill="rgba(255,255,255,0.08)" />
        <text x="32" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94a3b8">Search apps &amp; web...</text>

        <!-- App Icons Grid -->
        <g transform="translate(10, 70)">
          <rect x="0" y="0" width="48" height="48" rx="14" fill="#3b82f6" />
          <rect x="68" y="0" width="48" height="48" rx="14" fill="#10b981" />
          <rect x="136" y="0" width="48" height="48" rx="14" fill="#f59e0b" />
          <rect x="204" y="0" width="48" height="48" rx="14" fill="#8b5cf6" />
          
          <rect x="0" y="70" width="48" height="48" rx="14" fill="#ef4444" />
          <rect x="68" y="70" width="48" height="48" rx="14" fill="#06b6d4" />
          <rect x="136" y="70" width="48" height="48" rx="14" fill="#ec4899" />
          <rect x="204" y="70" width="48" height="48" rx="14" fill="#14b8a6" />
        </g>
      </g>

      <!-- Touch point indicator -->
      <circle cx="160" cy="380" r="18" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" stroke-width="2" />
      <circle cx="160" cy="380" r="4" fill="#fff" />

      <!-- Right: Hardware Telemetry Dashboard -->
      <g transform="translate(350, 0)">
        <!-- Telemetry bar -->
        <rect x="0" y="0" width="840" height="60" rx="8" fill="#0c1424" stroke="rgba(16, 185, 129, 0.3)" />
        <text x="24" y="36" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">● WEBUSB CONNECTED</text>
        <text x="200" y="36" font-family="'Fira Code', monospace" font-size="12" fill="#e2e8f0">DEVICE: Pixel 8 Pro (Android 14)</text>
        <text x="520" y="36" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">CODEC: AVC1 / H.264 (GPU HW DECODE)</text>
        <text x="760" y="36" font-family="'Fira Code', monospace" font-size="12" font-weight="700" fill="#f59e0b">60.1 FPS</text>

        <!-- Video stream stats -->
        <rect x="0" y="80" width="405" height="240" rx="8" fill="#0f172a" stroke="rgba(255, 255, 255, 0.08)" />
        <text x="20" y="110" font-family="'Fira Code', monospace" font-size="12" font-weight="600" fill="#f8fafc">VIDEO PIPELINE METRICS</text>
        <text x="20" y="145" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">Native Resolution: 2400 × 1080 (Scaled 1:1)</text>
        <text x="20" y="175" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">Stream Bitrate: 16.4 Mbps (Dynamic VBR)</text>
        <text x="20" y="205" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">WebCodecs VideoDecoder: GPU Accelerated</text>
        <text x="20" y="235" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">Total Display Lag: 13.8 ms (Local USB 3.2)</text>
        <text x="20" y="265" font-family="'Fira Code', monospace" font-size="11" fill="#10b981">Dropped Frames: 0 / 14,280 (0.00%)</text>

        <!-- ADB Control Bar -->
        <rect x="425" y="80" width="415" height="240" rx="8" fill="#0f172a" stroke="rgba(255, 255, 255, 0.08)" />
        <text x="445" y="110" font-family="'Fira Code', monospace" font-size="12" font-weight="600" fill="#f8fafc">TOUCH &amp; INPUT ENGINE</text>
        <text x="445" y="145" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">Input Mode: Multi-touch pointer injection</text>
        <text x="445" y="175" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">Sample Rate: 120 Hz Touch Polling</text>
        <text x="445" y="205" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">Keyboard Emulation: UTF-8 ADB Keycodes</text>
        <text x="445" y="235" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">Clipboard Sync: Bidirectional auto-sync</text>
        <text x="445" y="265" font-family="'Fira Code', monospace" font-size="11" fill="#38bdf8">Audio Forwarding: Opus Web Audio low-latency</text>

        <!-- Terminal log bottom -->
        <rect x="0" y="340" width="840" height="220" rx="8" fill="#080c16" stroke="rgba(56, 189, 248, 0.2)" />
        <text x="20" y="370" font-family="'Fira Code', monospace" font-size="11" fill="#38bdf8">[WebUSB] Claimed interface #0 (ADB bulk endpoints in:0x81 out:0x01)</text>
        <text x="20" y="395" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">[scrcpy] Server launched on device /data/local/tmp/scrcpy-server.jar</text>
        <text x="20" y="420" font-family="'Fira Code', monospace" font-size="11" fill="#10b981">[WebCodecs] Configured VideoDecoder with codec: "avc1.64002a"</text>
        <text x="20" y="445" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">[Stream] H.264 IDR keyframe received, rendering on HTMLCanvasElement</text>
        <text x="20" y="470" font-family="'Fira Code', monospace" font-size="11" fill="#f59e0b">[Audio] AudioTrack forwarding activated via Web Audio API AudioBuffer</text>
      </g>
    </g>
    `
  ),

  // 4. opendroid_remote - Architecture & Codecs
  'opendroid-remote-2.svg': svgWrapper(
    'OPENDROID_REMOTE // WEBADB STREAM ARCHITECTURE',
    'Direct Browser-to-Silicon Protocol Bridge • Zero Native Executables Required',
    'PROTOCOL v3',
    '#38bdf8',
    `
    <g transform="translate(40, 20)">
      <!-- Architecture Pipeline Diagram -->
      <rect x="0" y="0" width="1150" height="260" rx="10" fill="#0f172a" stroke="rgba(56, 189, 248, 0.25)" />
      <text x="30" y="36" font-family="'Fira Code', monospace" font-size="13" font-weight="600" fill="#38bdf8">DIRECT HARDWARE PROTOCOL PIPELINE</text>
      
      <!-- Box 1: Android Device -->
      <rect x="30" y="60" width="220" height="160" rx="8" fill="#1e293b" stroke="#475569" />
      <text x="50" y="90" font-family="'Fira Code', monospace" font-size="12" font-weight="700" fill="#f8fafc">ANDROID HARDWARE</text>
      <text x="50" y="120" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">• MediaCodec Encoder</text>
      <text x="50" y="145" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">• scrcpy Server Jar</text>
      <text x="50" y="170" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">• USB ADB Daemon</text>

      <!-- Arrow 1 -->
      <path d="M 260 140 L 310 140" stroke="#38bdf8" stroke-width="3" />
      <text x="285" y="130" font-family="'Fira Code', monospace" font-size="10" fill="#38bdf8" text-anchor="middle">USB 3.2</text>

      <!-- Box 2: WebUSB API -->
      <rect x="320" y="60" width="220" height="160" rx="8" fill="#1e293b" stroke="#38bdf8" />
      <text x="340" y="90" font-family="'Fira Code', monospace" font-size="12" font-weight="700" fill="#38bdf8">WEBUSB LAYER</text>
      <text x="340" y="120" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">• Raw USB Bulk Transfer</text>
      <text x="340" y="145" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">• ADB Handshake &amp; Auth</text>
      <text x="340" y="170" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">• Zero OS Drivers Needed</text>

      <!-- Arrow 2 -->
      <path d="M 550 140 L 600 140" stroke="#10b981" stroke-width="3" />

      <!-- Box 3: WebCodecs VideoDecoder -->
      <rect x="610" y="60" width="230" height="160" rx="8" fill="#1e293b" stroke="#10b981" />
      <text x="630" y="90" font-family="'Fira Code', monospace" font-size="12" font-weight="700" fill="#10b981">WEBCODECS GPU</text>
      <text x="630" y="120" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">• VideoDecoder API</text>
      <text x="630" y="145" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">• Zero-Copy GPU Textures</text>
      <text x="630" y="170" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">• H.264 / HEVC Parsing</text>

      <!-- Arrow 3 -->
      <path d="M 850 140 L 900 140" stroke="#f59e0b" stroke-width="3" />

      <!-- Box 4: Canvas Display -->
      <rect x="910" y="60" width="210" height="160" rx="8" fill="#1e293b" stroke="#f59e0b" />
      <text x="930" y="90" font-family="'Fira Code', monospace" font-size="12" font-weight="700" fill="#f59e0b">CANVAS &amp; INPUT</text>
      <text x="930" y="120" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">• 60 FPS HTML5 Canvas</text>
      <text x="930" y="145" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">• Mouse / Touch Injection</text>
      <text x="930" y="170" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">• AudioContext Playback</text>

      <!-- Benchmarks Table -->
      <rect x="0" y="280" width="1150" height="260" rx="10" fill="#0f172a" stroke="rgba(255, 255, 255, 0.08)" />
      <text x="30" y="315" font-family="'Fira Code', monospace" font-size="13" font-weight="600" fill="#f8fafc">HARDWARE STREAMING BENCHMARKS (1080p @ 60 FPS)</text>
      
      <line x1="30" y1="340" x2="1120" y2="340" stroke="rgba(255,255,255,0.1)" />
      <text x="40" y="370" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">METRIC</text>
      <text x="300" y="370" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">NATIVE SCRCPY (C)</text>
      <text x="600" y="370" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">OPENDROID (WEBUSB)</text>
      <text x="900" y="370" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">DIFFERENCE</text>

      <text x="40" y="415" font-family="'Fira Code', monospace" font-size="12" fill="#e2e8f0">End-to-End Latency</text>
      <text x="300" y="415" font-family="'Fira Code', monospace" font-size="12" fill="#e2e8f0">11.4 ms</text>
      <text x="600" y="415" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">13.2 ms</text>
      <text x="900" y="415" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">+1.8 ms (Imperceptible)</text>

      <text x="40" y="455" font-family="'Fira Code', monospace" font-size="12" fill="#e2e8f0">Host CPU Utilization</text>
      <text x="300" y="455" font-family="'Fira Code', monospace" font-size="12" fill="#e2e8f0">4.2%</text>
      <text x="600" y="455" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">5.1% (WebCodecs)</text>
      <text x="900" y="455" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">Zero CPU Overhead</text>

      <text x="40" y="495" font-family="'Fira Code', monospace" font-size="12" fill="#e2e8f0">Installation Friction</text>
      <text x="300" y="495" font-family="'Fira Code', monospace" font-size="12" fill="#ef4444">Requires CLI, adb, drivers</text>
      <text x="600" y="495" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">Click link in Chrome</text>
      <text x="900" y="495" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">100% Zero-Install</text>
    </g>
    `
  ),

  // 5. Gemini Live Voice Discord - Voice Room
  'gemini-live-discord-1.svg': svgWrapper(
    'GEMINI_LIVE_DISCORD // REAL-TIME DUPLEX VOICE AGENT',
    'Bidirectional WebSocket Audio Streaming • Opus 48kHz Codec • Sub-200ms Latency',
    'LIVE DUPLEX',
    '#38bdf8',
    `
    <g transform="translate(30, 20)">
      <!-- Discord Voice Room Stage -->
      <rect x="0" y="0" width="1160" height="540" rx="12" fill="#0f172a" stroke="rgba(56, 189, 248, 0.3)" />
      
      <!-- Voice Channel Header -->
      <rect x="0" y="0" width="1160" height="60" rx="12" fill="#090d16" />
      <text x="30" y="38" font-family="'Fira Code', monospace" font-size="14" font-weight="700" fill="#38bdf8">🔊 ALPINE SUMMIT // LIVE VOICE LOUNGE</text>
      <rect x="1000" y="16" width="130" height="28" rx="14" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" />
      <text x="1065" y="35" font-family="'Fira Code', monospace" font-size="11" fill="#10b981" text-anchor="middle">● CONNECTED</text>

      <!-- Center Voice Stage -->
      <g transform="translate(180, 100)">
        <!-- User Avatar with speaking ring -->
        <circle cx="150" cy="120" r="70" fill="#1e293b" stroke="#10b981" stroke-width="4" />
        <circle cx="150" cy="120" r="82" fill="none" stroke="rgba(16, 185, 129, 0.3)" stroke-width="3" stroke-dasharray="6 6" />
        <text x="150" y="128" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="700" fill="#fff" text-anchor="middle">RK</text>
        <text x="150" y="220" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="600" fill="#f8fafc" text-anchor="middle">Riddhiman (Speaking)</text>
        <text x="150" y="242" font-family="'Fira Code', monospace" font-size="11" fill="#10b981" text-anchor="middle">Input: 48kHz PCM via Opus</text>

        <!-- Bidirectional Sound Wave Bridge -->
        <g transform="translate(300, 100)">
          <path d="M 0 20 Q 50 -30, 100 20 T 200 20" fill="none" stroke="#38bdf8" stroke-width="3" />
          <path d="M 0 20 Q 50 70, 100 20 T 200 20" fill="none" stroke="#f59e0b" stroke-width="2" />
          <text x="100" y="-10" font-family="'Fira Code', monospace" font-size="11" fill="#38bdf8" text-anchor="middle">DUPLEX WEBSOCKET</text>
          <text x="100" y="55" font-family="'Fira Code', monospace" font-size="10" fill="#64748b" text-anchor="middle">186 ms Roundtrip</text>
        </g>

        <!-- Gemini Live Bot Avatar with glowing aura -->
        <circle cx="650" cy="120" r="70" fill="#1e1b4b" stroke="#818cf8" stroke-width="4" filter="url(#glow)" />
        <circle cx="650" cy="120" r="82" fill="none" stroke="rgba(129, 140, 248, 0.4)" stroke-width="3" />
        <text x="650" y="128" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="700" fill="#818cf8" text-anchor="middle">AI</text>
        <text x="650" y="220" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="600" fill="#818cf8" text-anchor="middle">Gemini Live Voice (Bot)</text>
        <text x="650" y="242" font-family="'Fira Code', monospace" font-size="11" fill="#818cf8" text-anchor="middle">Streaming Audio Chunks</text>
      </g>

      <!-- Real-time Audio Spectrum Visualizer at Bottom -->
      <g transform="translate(60, 390)">
        <rect x="0" y="0" width="1040" height="110" rx="8" fill="#070c18" stroke="rgba(255, 255, 255, 0.08)" />
        <text x="20" y="28" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">LIVE AUDIO SPECTRUM (OPUS 48,000 HZ DUPLEX PIPELINE)</text>
        
        <!-- Bars of spectrum -->
        ${Array.from({ length: 36 }).map((_, i) => {
          const h = 15 + Math.sin(i * 0.45) * 35 + Math.cos(i * 0.9) * 20;
          return `<rect x="${30 + i * 27}" y="${95 - h}" width="16" height="${h}" rx="3" fill="url(#cyanGlow)" />`;
        }).join('')}
      </g>
    </g>
    `
  ),

  // 6. Gemini Live Voice Discord - Telemetry
  'gemini-live-discord-2.svg': svgWrapper(
    'GEMINI_LIVE_DISCORD // WEBSOCKET DUPLEX TELEMETRY',
    'Voice Activity Detection (VAD) • Audio Buffer Drift Correction • Opus Latency',
    '0.18s LATENCY',
    '#10b981',
    `
    <g transform="translate(30, 20)">
      <rect x="0" y="0" width="360" height="130" rx="8" fill="#0f172a" stroke="rgba(16, 185, 129, 0.3)" />
      <text x="20" y="34" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">VOICE ROUNDTRIP LATENCY</text>
      <text x="20" y="80" font-family="'Fira Code', monospace" font-size="34" font-weight="700" fill="#10b981">182 ms</text>
      <text x="20" y="106" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#64748b">Mic Speech → Gemini API → Voice Output</text>

      <rect x="390" y="0" width="360" height="130" rx="8" fill="#0f172a" stroke="rgba(56, 189, 248, 0.3)" />
      <text x="410" y="34" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">AUDIO FRAME DROP RATE</text>
      <text x="410" y="80" font-family="'Fira Code', monospace" font-size="34" font-weight="700" fill="#38bdf8">0.02%</text>
      <text x="410" y="106" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#64748b">Automatic jitter buffer drift compensation</text>

      <rect x="780" y="0" width="380" height="130" rx="8" fill="#0f172a" stroke="rgba(245, 158, 11, 0.3)" />
      <text x="800" y="34" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">WEBSOCKET PACKET STREAM</text>
      <text x="800" y="80" font-family="'Fira Code', monospace" font-size="34" font-weight="700" fill="#f59e0b">2.4 MB/min</text>
      <text x="800" y="106" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#64748b">Bidirectional 16-bit 24kHz PCM chunks</text>

      <!-- Terminal stream output -->
      <rect x="0" y="160" width="1160" height="380" rx="10" fill="#070c18" stroke="rgba(255, 255, 255, 0.1)" />
      <text x="24" y="195" font-family="'Fira Code', monospace" font-size="13" font-weight="600" fill="#f8fafc">DUPLEX PROTOCOL LOG // WEBSOCKET TRACE</text>

      <text x="24" y="240" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">[05:12:01.104] [VAD] User speech start triggered (Energy threshold &gt; 0.42)</text>
      <text x="24" y="270" font-family="'Fira Code', monospace" font-size="12" fill="#94a3b8">[05:12:01.120] [AudioPipe] Discord voice receiver decoded Opus packet into 960 PCM samples</text>
      <text x="24" y="300" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">[05:12:01.144] [GeminiLive] Sent realtimeInput (mediaChunks: 1920 bytes audio/pcm;rate=24000)</text>
      <text x="24" y="330" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">[05:12:01.290] [GeminiLive] Received serverContent.modelTurn audio delta (chunk: 2400 bytes)</text>
      <text x="24" y="360" font-family="'Fira Code', monospace" font-size="12" fill="#f59e0b">[05:12:01.312] [AudioPlayer] Discord voice connection playback stream active (Jitter: 3ms)</text>
      <text x="24" y="390" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">[05:12:01.328] [Latency] End-to-End turn delay: 184 ms — Natural interruption enabled</text>
      <text x="24" y="420" font-family="'Fira Code', monospace" font-size="12" fill="#64748b">[05:12:02.010] [VAD] User silent for 400ms — Finalizing turn context buffer</text>
    </g>
    `
  ),

  // 7. HTML-previewer - Live Sandbox Playground
  'html-previewer-1.svg': svgWrapper(
    'HTML_PREVIEWER // ZERO-TELEMETRY BROWSER SANDBOX',
    '100% Client-Side Isolated Execution • Instant Hot Reload • Zero Server Dependencies',
    'LOCAL FIRST',
    '#10b981',
    `
    <g transform="translate(20, 15)">
      <!-- Left: Code Editor Pane -->
      <rect x="0" y="0" width="560" height="570" rx="8" fill="#0d1117" stroke="rgba(255, 255, 255, 0.1)" />
      
      <!-- Editor Tabs -->
      <rect x="0" y="0" width="560" height="40" rx="8" fill="#161b22" />
      <rect x="0" y="0" width="140" height="40" fill="#0d1117" />
      <text x="20" y="25" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">index.html</text>
      <text x="160" y="25" font-family="'Fira Code', monospace" font-size="12" fill="#64748b">style.css</text>
      <text x="260" y="25" font-family="'Fira Code', monospace" font-size="12" fill="#64748b">app.js</text>

      <!-- Code lines -->
      <g transform="translate(20, 70)">
        <text x="0" y="0" font-family="'Fira Code', monospace" font-size="13" fill="#ff7b72">&lt;!DOCTYPE html&gt;</text>
        <text x="0" y="28" font-family="'Fira Code', monospace" font-size="13" fill="#79c0ff">&lt;html lang="en"&gt;</text>
        <text x="0" y="56" font-family="'Fira Code', monospace" font-size="13" fill="#79c0ff">&lt;head&gt;</text>
        <text x="20" y="84" font-family="'Fira Code', monospace" font-size="13" fill="#79c0ff">&lt;title&gt;Autonomous Simulation&lt;/title&gt;</text>
        <text x="0" y="112" font-family="'Fira Code', monospace" font-size="13" fill="#79c0ff">&lt;/head&gt;</text>
        <text x="0" y="140" font-family="'Fira Code', monospace" font-size="13" fill="#79c0ff">&lt;body&gt;</text>
        <text x="20" y="168" font-family="'Fira Code', monospace" font-size="13" fill="#79c0ff">&lt;canvas id="viewport"&gt;&lt;/canvas&gt;</text>
        <text x="20" y="196" font-family="'Fira Code', monospace" font-size="13" fill="#79c0ff">&lt;div class="hud-telemetry"&gt;</text>
        <text x="40" y="224" font-family="'Fira Code', monospace" font-size="13" fill="#f0f6fc">SYSTEM READY // ZERO DATA EXFILTRATION</text>
        <text x="20" y="252" font-family="'Fira Code', monospace" font-size="13" fill="#79c0ff">&lt;/div&gt;</text>
        <text x="20" y="280" font-family="'Fira Code', monospace" font-size="13" fill="#79c0ff">&lt;script src="./app.js"&gt;&lt;/script&gt;</text>
        <text x="0" y="308" font-family="'Fira Code', monospace" font-size="13" fill="#79c0ff">&lt;/body&gt;</text>
      </g>

      <!-- Right: Live Sandboxed Preview Frame -->
      <g transform="translate(580, 0)">
        <rect x="0" y="0" width="600" height="570" rx="8" fill="#030712" stroke="rgba(56, 189, 248, 0.3)" />
        <rect x="0" y="0" width="600" height="40" rx="8" fill="#0f172a" />
        <circle cx="20" cy="20" r="4" fill="#10b981" />
        <text x="35" y="24" font-family="'Fira Code', monospace" font-size="11" fill="#10b981">SANDBOX: sandbox://isolated-iframe (CSP: STRICT)</text>

        <!-- Preview rendering -->
        <g transform="translate(40, 70)">
          <rect x="0" y="0" width="520" height="440" rx="10" fill="#090d16" stroke="rgba(120, 188, 235, 0.2)" />
          <circle cx="260" cy="180" r="100" fill="none" stroke="#38bdf8" stroke-width="2" />
          <circle cx="260" cy="180" r="70" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 4" />
          <circle cx="260" cy="180" r="12" fill="#38bdf8" />
          
          <text x="260" y="330" font-family="'Fira Code', monospace" font-size="14" font-weight="700" fill="#f8fafc" text-anchor="middle">LIVE HOT-RELOAD PREVIEW</text>
          <text x="260" y="360" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">Rendered instantly with zero server calls or network tracking</text>
        </g>
      </g>
    </g>
    `
  ),

  // 8. HTML-previewer - Responsive Test Bench
  'html-previewer-2.svg': svgWrapper(
    'HTML_PREVIEWER // MULTI-DEVICE RESPONSIVE SIMULATOR',
    'Simultaneous Mobile, Tablet &amp; Desktop Viewport Isolation Testing',
    'HOT RELOAD',
    '#38bdf8',
    `
    <g transform="translate(30, 20)">
      <!-- Desktop Device -->
      <rect x="0" y="0" width="600" height="380" rx="8" fill="#0f172a" stroke="rgba(56, 189, 248, 0.3)" />
      <rect x="0" y="0" width="600" height="32" rx="8" fill="#1e293b" />
      <text x="20" y="21" font-family="'Fira Code', monospace" font-size="11" fill="#38bdf8">DESKTOP VIEWPORT (1920 × 1080 @ 100%)</text>
      <rect x="30" y="60" width="540" height="290" rx="4" fill="#020617" />
      <text x="300" y="210" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="#94a3b8" text-anchor="middle">Desktop Layout Container</text>

      <!-- Tablet Device -->
      <g transform="translate(630, 0)">
        <rect x="0" y="0" width="300" height="380" rx="8" fill="#0f172a" stroke="rgba(245, 158, 11, 0.3)" />
        <rect x="0" y="0" width="300" height="32" rx="8" fill="#1e293b" />
        <text x="20" y="21" font-family="'Fira Code', monospace" font-size="11" fill="#f59e0b">TABLET (768 × 1024)</text>
        <rect x="20" y="60" width="260" height="290" rx="4" fill="#020617" />
        <text x="150" y="210" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="#94a3b8" text-anchor="middle">Tablet Layout</text>
      </g>

      <!-- Mobile Device -->
      <g transform="translate(960, 0)">
        <rect x="0" y="0" width="200" height="380" rx="8" fill="#0f172a" stroke="rgba(16, 185, 129, 0.3)" />
        <rect x="0" y="0" width="200" height="32" rx="8" fill="#1e293b" />
        <text x="15" y="21" font-family="'Fira Code', monospace" font-size="11" fill="#10b981">MOBILE (375 × 812)</text>
        <rect x="15" y="60" width="170" height="290" rx="4" fill="#020617" />
        <text x="100" y="210" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="#94a3b8" text-anchor="middle">Mobile View</text>
      </g>

      <!-- Bottom controls -->
      <rect x="0" y="410" width="1160" height="130" rx="8" fill="#0a0f1d" stroke="rgba(255,255,255,0.08)" />
      <text x="30" y="450" font-family="'Fira Code', monospace" font-size="13" font-weight="700" fill="#f8fafc">LOCAL-FIRST PRIVACY AUDIT</text>
      <text x="30" y="480" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8">No external analytics, zero tracking beacons, and zero telemetry payloads dispatched during live editing sessions.</text>
      <text x="30" y="508" font-family="'Fira Code', monospace" font-size="11" fill="#10b981">✓ All state stored in browser IndexedDB + LocalStorage</text>
    </g>
    `
  ),

  // 9. AI-Discord-Bot-GEMM-X - Multimodal Bot
  'ai-discord-bot-gemm-x-1.svg': svgWrapper(
    'GEMM_X // MULTI-PROVIDER AUTONOMOUS AGENT',
    'Imagen-3 Image Generation • MusicLM Synthesis • Multi-Provider Model Routing',
    'MULTI-AI',
    '#818cf8',
    `
    <g transform="translate(30, 20)">
      <!-- Discord Card Style -->
      <rect x="0" y="0" width="1160" height="540" rx="12" fill="#0f172a" stroke="rgba(129, 140, 248, 0.3)" />
      
      <g transform="translate(40, 30)">
        <text x="0" y="20" font-family="'Fira Code', monospace" font-size="13" fill="#818cf8">/generate-concept-art prompt: "solitary timber cabin on snowy mountain summit under aurora borealis"</text>

        <!-- Output Art Card -->
        <g transform="translate(0, 50)">
          <rect x="0" y="0" width="640" height="380" rx="10" fill="#060913" stroke="rgba(255, 255, 255, 0.15)" />
          
          <!-- Vector Art Preview -->
          <rect x="10" y="10" width="620" height="360" rx="8" fill="#0a1226" />
          <path d="M 10 320 L 160 220 L 320 280 L 480 180 L 630 330 Z" fill="#1e293b" />
          <polygon points="320,190 300,240 340,240" fill="#f59e0b" />
          <circle cx="500" cy="80" r="30" fill="#38bdf8" opacity="0.4" filter="url(#glow)" />
          <path d="M 40 70 Q 240 30, 440 90 T 600 50" fill="none" stroke="#10b981" stroke-width="6" opacity="0.6" filter="url(#glow)" />
          
          <text x="30" y="40" font-family="'Fira Code', monospace" font-size="11" fill="#38bdf8">IMAGEN 3 // 2048 × 2048 ULTRA-RES</text>
        </g>

        <!-- Right: Multi-Agent Voice Synthesis & Music -->
        <g transform="translate(680, 50)">
          <rect x="0" y="0" width="440" height="180" rx="10" fill="#0b1322" stroke="rgba(56, 189, 248, 0.25)" />
          <text x="24" y="32" font-family="'Fira Code', monospace" font-size="12" font-weight="700" fill="#38bdf8">SYNTHESIZED AMBIENT AUDIO</text>
          
          <!-- Audio Waveform -->
          <path d="M 24 100 Q 80 40, 140 100 T 260 100 T 380 100" fill="none" stroke="#818cf8" stroke-width="3" />
          <text x="24" y="150" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">Model: MusicLM Ambient Chill • 44.1 kHz</text>

          <rect x="0" y="200" width="440" height="180" rx="10" fill="#0b1322" stroke="rgba(16, 185, 129, 0.25)" />
          <text x="24" y="232" font-family="'Fira Code', monospace" font-size="12" font-weight="700" fill="#10b981">AUTONOMOUS FAILOVER ROUTER</text>
          <text x="24" y="265" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#e2e8f0">Primary: Gemini 2.0 Flash (Online)</text>
          <text x="24" y="295" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8">Secondary: Claude 3.5 Sonnet (Standby)</text>
          <text x="24" y="325" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8">Tertiary: Local Ollama Llama-3 (Fallback)</text>
          <text x="24" y="355" font-family="'Fira Code', monospace" font-size="11" fill="#10b981">Uptime: 99.98% Across 180,000 Messages</text>
        </g>
      </g>
    </g>
    `
  ),

  // 10. AI-Discord-Bot-GEMM-X - Router Matrix
  'ai-discord-bot-gemm-x-2.svg': svgWrapper(
    'GEMM_X // PROVIDER LOAD BALANCER &amp; ROUTING',
    'Dynamic Cost &amp; Latency Optimization Matrix Across Foundation Models',
    'FAILOVER ACTIVE',
    '#10b981',
    `
    <g transform="translate(30, 20)">
      <rect x="0" y="0" width="1160" height="540" rx="12" fill="#0f172a" stroke="rgba(255, 255, 255, 0.08)" />
      <text x="30" y="40" font-family="'Fira Code', monospace" font-size="14" font-weight="700" fill="#f8fafc">FOUNDATION MODEL ROUTING TELEMETRY</text>

      <!-- Routing Nodes Grid -->
      <g transform="translate(30, 70)">
        <rect x="0" y="0" width="340" height="200" rx="8" fill="#1e293b" stroke="#38bdf8" />
        <text x="20" y="35" font-family="'Fira Code', monospace" font-size="13" font-weight="700" fill="#38bdf8">GOOGLE GEMINI 2.0</text>
        <text x="20" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8">Weight: 65% Traffic</text>
        <text x="20" y="100" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8">Latency: 220ms Avg</text>
        <text x="20" y="130" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8">Features: Multimodal, Audio, Search</text>
        <text x="20" y="165" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">STATUS: HEALTHY</text>

        <rect x="380" y="0" width="340" height="200" rx="8" fill="#1e293b" stroke="#818cf8" />
        <text x="400" y="35" font-family="'Fira Code', monospace" font-size="13" font-weight="700" fill="#818cf8">ANTHROPIC CLAUDE 3.5</text>
        <text x="400" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8">Weight: 25% Traffic (Complex Code)</text>
        <text x="400" y="100" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8">Latency: 480ms Avg</text>
        <text x="400" y="130" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8">Features: Deep Refactoring</text>
        <text x="400" y="165" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">STATUS: HEALTHY</text>

        <rect x="760" y="0" width="340" height="200" rx="8" fill="#1e293b" stroke="#f59e0b" />
        <text x="780" y="35" font-family="'Fira Code', monospace" font-size="13" font-weight="700" fill="#f59e0b">LOCAL OLLAMA (LLAMA 3)</text>
        <text x="780" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8">Weight: 10% (Zero-Cloud Mode)</text>
        <text x="780" y="100" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8">Latency: 85ms Local</text>
        <text x="780" y="130" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8">Features: Offline Resilient</text>
        <text x="780" y="165" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">STATUS: LOCAL RUNNING</text>
      </g>
    </g>
    `
  ),

  // 11. g1-simplified - Thinking LLM Engine
  'g1-simplified-1.svg': svgWrapper(
    'G1_SIMPLIFIED // REASONING VERIFICATION ENGINE',
    'Flash Thinking Loop • Chain-of-Thought Reflection • Open Source Logic Solver',
    'REASONING',
    '#f59e0b',
    `
    <g transform="translate(30, 20)">
      <rect x="0" y="0" width="1160" height="540" rx="12" fill="#080c16" stroke="rgba(245, 158, 11, 0.3)" />
      
      <!-- CLI Execution Header -->
      <text x="30" y="40" font-family="'Fira Code', monospace" font-size="13" fill="#f59e0b">g1-simplified --prompt "Prove graph colorability with 3 colors on cycle graph C_5"</text>
      
      <!-- Reasoning Steps Container -->
      <g transform="translate(30, 70)">
        <rect x="0" y="0" width="1100" height="420" rx="8" fill="#0e172a" stroke="rgba(255,255,255,0.08)" />

        <text x="30" y="40" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">STEP 1: Problem Decomposition [Confidence: 0.99]</text>
        <text x="50" y="65" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94a3b8">Cycle graph C_5 has 5 vertices (V0 to V4) arranged in a closed loop. Chi(C_5) for odd cycles is known to be 3.</text>

        <text x="30" y="115" font-family="'Fira Code', monospace" font-size="12" fill="#f59e0b">STEP 2: Conflict Verification &amp; Backtracking [Confidence: 0.98]</text>
        <text x="50" y="140" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94a3b8">Attempting 2-coloring: V0=Red, V1=Blue, V2=Red, V3=Blue. Then V4 is adjacent to both V0 (Red) and V3 (Blue).</text>
        <text x="50" y="165" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#ef4444">Monochromatic edge detected if 2 colors are used. Requires color 3 (Green) for V4.</text>

        <text x="30" y="215" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">STEP 3: Formal Proof Synthesis [Verified]</text>
        <text x="50" y="240" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#f1f5f9">Assigned coloring {V0: Red, V1: Blue, V2: Red, V3: Blue, V4: Green} satisfies all adjacent vertex constraints.</text>
        <text x="50" y="265" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#10b981">Q.E.D. Chromatic number Chi(C_5) = 3.</text>

        <!-- Stats Bar -->
        <rect x="30" y="310" width="1040" height="70" rx="6" fill="#070c18" />
        <text x="50" y="340" font-family="'Fira Code', monospace" font-size="11" fill="#38bdf8">Thinking Tokens: 842</text>
        <text x="250" y="340" font-family="'Fira Code', monospace" font-size="11" fill="#10b981">Verification Passes: 3/3</text>
        <text x="480" y="340" font-family="'Fira Code', monospace" font-size="11" fill="#f59e0b">Inference Time: 0.76s</text>
        <text x="720" y="340" font-family="'Fira Code', monospace" font-size="11" fill="#e2e8f0">Model: Gemini 2.0 Flash Thinking</text>
      </g>
    </g>
    `
  ),

  // 12. g1-simplified - Benchmarks
  'g1-simplified-2.svg': svgWrapper(
    'G1_SIMPLIFIED // LOGIC BENCHMARK EVALUATION',
    'Comparing Raw Foundation Models vs G1 Recursive Thinking Passes',
    '+32% ACCURACY',
    '#10b981',
    `
    <g transform="translate(30, 20)">
      <rect x="0" y="0" width="1160" height="540" rx="12" fill="#0f172a" stroke="rgba(255, 255, 255, 0.08)" />
      <text x="30" y="40" font-family="'Fira Code', monospace" font-size="14" font-weight="700" fill="#f8fafc">ACCURACY COMPARISON ON REASONING BENCHMARKS</text>

      <!-- Bar charts -->
      <g transform="translate(50, 90)">
        <text x="0" y="30" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">GSM8K (Math Reasoning)</text>
        <rect x="250" y="10" width="300" height="24" rx="4" fill="#334155" />
        <rect x="250" y="10" width="225" height="24" rx="4" fill="#64748b" />
        <text x="485" y="27" font-family="'Fira Code', monospace" font-size="11" fill="#fff">Raw: 75%</text>
        <rect x="570" y="10" width="282" height="24" rx="4" fill="#10b981" />
        <text x="860" y="27" font-family="'Fira Code', monospace" font-size="11" fill="#10b981">G1 Thinking: 94.2%</text>

        <text x="0" y="100" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">HumanEval (Code Logic)</text>
        <rect x="250" y="80" width="300" height="24" rx="4" fill="#334155" />
        <rect x="250" y="80" width="210" height="24" rx="4" fill="#64748b" />
        <text x="470" y="97" font-family="'Fira Code', monospace" font-size="11" fill="#fff">Raw: 70%</text>
        <rect x="570" y="80" width="265" height="24" rx="4" fill="#10b981" />
        <text x="845" y="97" font-family="'Fira Code', monospace" font-size="11" fill="#10b981">G1 Thinking: 88.5%</text>

        <text x="0" y="170" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">LogicGrid Puzzles</text>
        <rect x="250" y="150" width="300" height="24" rx="4" fill="#334155" />
        <rect x="250" y="150" width="180" height="24" rx="4" fill="#64748b" />
        <text x="440" y="167" font-family="'Fira Code', monospace" font-size="11" fill="#fff">Raw: 60%</text>
        <rect x="570" y="150" width="270" height="24" rx="4" fill="#10b981" />
        <text x="850" y="167" font-family="'Fira Code', monospace" font-size="11" fill="#10b981">G1 Thinking: 90.0%</text>
      </g>
    </g>
    `
  ),

  // 13. WebADB-Explorer - Android File Browser
  'webadb-explorer-1.svg': svgWrapper(
    'WEBADB_EXPLORER // CLIENT-SIDE ANDROID FILE MANAGER',
    'Direct WebUSB File Transfers • APK Installation Sandbox • Storage Partitions',
    'WEBUSB V2',
    '#38bdf8',
    `
    <g transform="translate(30, 20)">
      <rect x="0" y="0" width="1160" height="540" rx="10" fill="#0f172a" stroke="rgba(56, 189, 248, 0.25)" />
      
      <!-- Toolbar -->
      <rect x="0" y="0" width="1160" height="48" rx="10" fill="#1e293b" />
      <text x="24" y="30" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">DEVICE: Pixel 8 Pro</text>
      <text x="220" y="30" font-family="'Fira Code', monospace" font-size="12" fill="#94a3b8">PATH: /sdcard/Download/</text>
      
      <rect x="980" y="10" width="150" height="28" rx="6" fill="#38bdf8" />
      <text x="1055" y="28" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="#000" text-anchor="middle">+ INSTALL APK</text>

      <!-- File Table -->
      <g transform="translate(30, 70)">
        <text x="10" y="20" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="#64748b">NAME</text>
        <text x="480" y="20" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="#64748b">SIZE</text>
        <text x="680" y="20" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="#64748b">PERMISSIONS</text>
        <text x="920" y="20" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="#64748b">ACTIONS</text>
        <line x1="0" y1="35" x2="1100" y2="35" stroke="rgba(255,255,255,0.08)" />

        <text x="10" y="70" font-family="'Fira Code', monospace" font-size="12" fill="#e2e8f0">📁 DCIM/</text>
        <text x="480" y="70" font-family="'Fira Code', monospace" font-size="12" fill="#94a3b8">4.2 GB</text>
        <text x="680" y="70" font-family="'Fira Code', monospace" font-size="12" fill="#94a3b8">drwxrwx---</text>
        <text x="920" y="70" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">Browse ↗</text>

        <text x="10" y="115" font-family="'Fira Code', monospace" font-size="12" fill="#e2e8f0">📦 alpine-companion-v2.apk</text>
        <text x="480" y="115" font-family="'Fira Code', monospace" font-size="12" fill="#94a3b8">28.4 MB</text>
        <text x="680" y="115" font-family="'Fira Code', monospace" font-size="12" fill="#94a3b8">-rw-rw----</text>
        <text x="920" y="115" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">Install ✓</text>

        <text x="10" y="160" font-family="'Fira Code', monospace" font-size="12" fill="#e2e8f0">📄 summit_telemetry_dump.json</text>
        <text x="480" y="160" font-family="'Fira Code', monospace" font-size="12" fill="#94a3b8">1.8 MB</text>
        <text x="680" y="160" font-family="'Fira Code', monospace" font-size="12" fill="#94a3b8">-rw-rw----</text>
        <text x="920" y="160" font-family="'Fira Code', monospace" font-size="12" fill="#38bdf8">Pull ⭳</text>
      </g>
    </g>
    `
  ),

  // 14. WebADB-Explorer - Streaming Logcat Terminal
  'webadb-explorer-2.svg': svgWrapper(
    'WEBADB_EXPLORER // REAL-TIME LOGCAT BUFFER',
    'Hardware-Accelerated Android System Log Streaming via WebUSB Interface',
    'STREAMING',
    '#10b981',
    `
    <g transform="translate(30, 20)">
      <rect x="0" y="0" width="1160" height="540" rx="10" fill="#070c18" stroke="rgba(16, 185, 129, 0.3)" />
      <text x="24" y="36" font-family="'Fira Code', monospace" font-size="13" font-weight="700" fill="#10b981">LOGCAT STREAM // FILTER: [ActivityManager|HardwareRenderer|AudioFlinger]</text>

      <g transform="translate(24, 70)">
        <text x="0" y="30" font-family="'Fira Code', monospace" font-size="11" fill="#38bdf8">09:42:10.112  1280  1340 I ActivityManager: Displayed com.android.chrome: +114ms</text>
        <text x="0" y="65" font-family="'Fira Code', monospace" font-size="11" fill="#10b981">09:42:10.220  2400  2450 D HardwareRenderer: Loaded Vulkan pipeline cache (3,412 shaders)</text>
        <text x="0" y="100" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">09:42:10.340  1040  1080 V AudioFlinger: MixerThread 0xb4000078 active tracks: 1</text>
        <text x="0" y="135" font-family="'Fira Code', monospace" font-size="11" fill="#f59e0b">09:42:10.450  1500  1520 W PowerManagerService: Screen dim timeout deferred by active touch</text>
        <text x="0" y="170" font-family="'Fira Code', monospace" font-size="11" fill="#10b981">09:42:10.590  2400  2450 I WebADB: Buffer sync flushed 64 KB over WebUSB bulk endpoint</text>
      </g>
    </g>
    `
  ),

  // 15. Alpine 3D Engine - Viewport & Shaders
  'alpine-3d-engine-1.svg': svgWrapper(
    'ALPINE_3D_ENGINE // LOW-POLY WILDERNESS VIEWPORT',
    'Custom Three.js Shaders • Procedural Terrain • Web Audio Multi-Layer Soundscape',
    '60 FPS WEBGL',
    '#38bdf8',
    `
    <g transform="translate(30, 20)">
      <rect x="0" y="0" width="1160" height="540" rx="12" fill="#080e1c" stroke="rgba(56, 189, 248, 0.3)" />
      
      <!-- Mountain Skyline Vector -->
      <path d="M 0 420 L 220 200 L 440 340 L 680 140 L 920 300 L 1160 180 L 1160 540 L 0 540 Z" fill="#0f1d38" />
      <path d="M 0 460 L 320 280 L 620 400 L 900 240 L 1160 380 L 1160 540 L 0 540 Z" fill="#16294e" />

      <!-- Cabin Geometry -->
      <rect x="520" y="320" width="140" height="90" rx="2" fill="#3a2416" stroke="#5c381e" stroke-width="2" />
      <polygon points="510,320 590,260 670,320" fill="#24140b" stroke="#3a2416" stroke-width="2" />
      <rect x="575" y="345" width="30" height="40" fill="#ffaa33" opacity="0.85" filter="url(#glow)" />

      <!-- Campfire glow -->
      <circle cx="760" cy="400" r="16" fill="#f59e0b" filter="url(#glow)" />
      <circle cx="760" cy="400" r="6" fill="#fff" />

      <!-- Telemetry overlay -->
      <g transform="translate(30, 30)">
        <rect x="0" y="0" width="260" height="100" rx="8" fill="rgba(8, 12, 22, 0.85)" stroke="rgba(255, 255, 255, 0.15)" />
        <text x="20" y="30" font-family="'Fira Code', monospace" font-size="12" fill="#10b981">60.0 FPS // 16.6ms</text>
        <text x="20" y="55" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">Draw Calls: 18</text>
        <text x="20" y="80" font-family="'Fira Code', monospace" font-size="11" fill="#94a3b8">Triangles: 42,850 (Instanced)</text>
      </g>
    </g>
    `
  ),

  // 16. Alpine 3D Engine - Telemetry & Audio Mixer
  'alpine-3d-engine-2.svg': svgWrapper(
    'ALPINE_3D_ENGINE // SHADER &amp; AUDIO GRAPH PIPELINE',
    'Custom PBR Lighting Passes • Procedural Synthesizers for Wind, Fire, Crickets',
    'WEB AUDIO',
    '#f59e0b',
    `
    <g transform="translate(30, 20)">
      <rect x="0" y="0" width="1160" height="540" rx="12" fill="#0f172a" stroke="rgba(255, 255, 255, 0.08)" />
      
      <!-- Audio Mixer Pipeline -->
      <g transform="translate(30, 30)">
        <text x="0" y="24" font-family="'Fira Code', monospace" font-size="13" font-weight="700" fill="#f8fafc">PROCEDURAL WEB AUDIO SYNTHESIS ENGINE</text>
        
        <!-- Audio Channels -->
        <g transform="translate(0, 50)">
          <rect x="0" y="0" width="260" height="180" rx="8" fill="#1e293b" stroke="#38bdf8" />
          <text x="20" y="30" font-family="'Fira Code', monospace" font-size="12" font-weight="700" fill="#38bdf8">WIND SYNTHESIZER</text>
          <text x="20" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">Pink noise buffer + Dual Biquad low-pass filters with LFO cutoff sweep</text>

          <rect x="290" y="0" width="260" height="180" rx="8" fill="#1e293b" stroke="#10b981" />
          <text x="310" y="30" font-family="'Fira Code', monospace" font-size="12" font-weight="700" fill="#10b981">RIVER STREAM</text>
          <text x="310" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">White noise generator + High-pass &amp; resonant bandpass modulated by camera altitude</text>

          <rect x="580" y="0" width="260" height="180" rx="8" fill="#1e293b" stroke="#f59e0b" />
          <text x="600" y="30" font-family="'Fira Code', monospace" font-size="12" font-weight="700" fill="#f59e0b">CAMPFIRE CRACKLE</text>
          <text x="600" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">Poisson-distributed burst pulses + dynamic low-frequency ember rumbles</text>

          <rect x="870" y="0" width="260" height="180" rx="8" fill="#1e293b" stroke="#818cf8" />
          <text x="890" y="30" font-family="'Fira Code', monospace" font-size="12" font-weight="700" fill="#818cf8">NIGHT CRICKETS</text>
          <text x="890" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8">High-frequency AM chirp oscillator bank synchronized to night sky shader</text>
        </g>
      </g>
    </g>
    `
  )
};

for (const [filename, svg] of Object.entries(screenshots)) {
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, svg, 'utf-8');
  console.log(`Generated: ${filename}`);
}

console.log('All 16 SVG screenshots generated successfully!');
