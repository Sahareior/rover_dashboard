import React, { useRef, useEffect, useState } from 'react';
const CameraFeed = ({ depth, heading, pitch, roll, yaw, battery, dangerMode, leakDetected, pitchFault, rollFault, batteryFault, depthFault }) => {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.warn('Camera not available:', err.message);
        setCameraError('CAMERA OFFLINE');
        setCameraActive(false);
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  return (
    <div className={`relative flex-1 min-h-[40vh] md:min-h-[55vh] lg:flex-[3] bg-black/60 backdrop-blur-sm rounded-md overflow-hidden flex items-center justify-center transition-all duration-500 ${dangerMode ? 'border border-red-500/40 glow-red' : 'border border-[#00e5ff]/15 glow-cyan'}`}>
      {[
        'top-0 left-0 border-t-2 border-l-2',
        'top-0 right-0 border-t-2 border-r-2',
        'bottom-0 left-0 border-b-2 border-l-2',
        'bottom-0 right-0 border-b-2 border-r-2',
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-[clamp(12px,1.5vw,24px)] h-[clamp(12px,1.5vw,24px)] z-20 transition-colors duration-500 ${dangerMode ? 'border-red-500/70' : 'border-[#00e5ff]/50'}`} />
      ))}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
      />
      {!cameraActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020a12]">
          <div className="relative w-[clamp(80px,18vw,160px)] h-[clamp(80px,18vw,160px)] flex items-center justify-center">
            <svg className="w-full h-full animate-radar" viewBox="0 0 100 100">
              <defs>
                <radialGradient id="sweep" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#00e5ff" strokeWidth="0.4" opacity="0.2" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#00e5ff" strokeWidth="0.3" opacity="0.12" strokeDasharray="4 6" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="#00e5ff" strokeWidth="0.25" opacity="0.08" />
              <path d="M 50 50 L 50 5 A 45 45 0 0 1 95 50 Z" fill="url(#sweep)" />
            </svg>
            <div className="absolute w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
          </div>
          <div className="mt-4 text-sm text-red-500 tracking-[0.25em] font-bold anime">
            {cameraError || 'INITIALIZING CAMERA...'}
          </div>
          <div className="mt-1.5 text-[clamp(7px,0.55vw,9px)] text-[#334155] tracking-wider">
            AWAITING VIDEO FEED
          </div>
        </div>
      )}
      {dangerMode && leakDetected && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="absolute inset-0 bg-red-900/15 animate-danger-pulse" />
          <div className="relative bg-red-950/95 border-2 border-red-500/70 rounded-lg px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,2vw,2.5rem)] text-center backdrop-blur-sm animate-bounce-in max-w-[85%]">
            <div className="text-red-400 font-extrabold text-[clamp(0.9rem,1.8vw,1.8rem)] tracking-[0.2em] mb-2 animate-pulse">
              ⚠ WATER INGRESS ⚠
            </div>
            <div className="text-red-300/80 text-[clamp(0.55rem,0.7vw,0.9rem)] tracking-wider font-semibold">
              HULL BREACH DETECTED — INITIATE EMERGENCY ASCENT
            </div>
            <div className="mt-3 flex justify-center gap-2 flex-wrap">
              {['SECTOR A', 'SECTOR C'].map((sector, i) => (
                <span key={sector} className="text-[8px] text-red-400 bg-red-900/40 px-2.5 py-0.5 rounded border border-red-500/20 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                  {sector}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      <svg className={`absolute w-[clamp(120px,30vw,400px)] h-[clamp(120px,30vw,400px)] opacity-20 pointer-events-none animate-pulse-slow z-10 transition-colors duration-500 ${dangerMode ? 'text-red-500' : 'text-[#00e5ff]'}`} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" strokeWidth="0.4" stroke="currentColor" strokeDasharray="3 4" />
        <circle cx="50" cy="50" r="28" fill="none" strokeWidth="0.6" stroke="currentColor" opacity="0.6" />
        <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.8" />
        <line x1="8" y1="50" x2="44" y2="50" strokeWidth="0.4" stroke="currentColor" />
        <line x1="56" y1="50" x2="92" y2="50" strokeWidth="0.4" stroke="currentColor" />
        <line x1="50" y1="8" x2="50" y2="44" strokeWidth="0.4" stroke="currentColor" />
        <line x1="50" y1="56" x2="50" y2="92" strokeWidth="0.4" stroke="currentColor" />
        <path d="M 20 20 L 25 20 L 25 25" fill="none" strokeWidth="0.8" stroke="currentColor" />
        <path d="M 80 20 L 75 20 L 75 25" fill="none" strokeWidth="0.8" stroke="currentColor" />
        <path d="M 20 80 L 25 80 L 25 75" fill="none" strokeWidth="0.8" stroke="currentColor" />
        <path d="M 80 80 L 75 80 L 75 75" fill="none" strokeWidth="0.8" stroke="currentColor" />
      </svg>
      <div className={`absolute inset-0 pointer-events-none z-10 transition-all duration-500 ${dangerMode
        ? 'bg-gradient-to-t from-red-950/25 via-transparent to-red-950/15'
        : 'bg-gradient-to-t from-[#021f30]/35 via-transparent to-[#021f30]/15'
      }`} />
      {cameraActive && (
        <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm transition-all duration-300 ${dangerMode ? 'bg-red-600/90 animate-flash' : 'bg-red-600/70'}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[9px] text-white font-bold tracking-wider">
            {dangerMode ? '⚠ DANGER' : 'LIVE'}
          </span>
        </div>
      )}
      <div className={`absolute top-3 left-6 border bg-[#030712]/85 backdrop-blur-md px-3 py-2 min-w-[clamp(80px,14vw,150px)] rounded shadow-lg z-20 transition-all duration-500 ${depthFault ? 'border-red-500/50 glow-red animate-pulse' : 'border-[#00e5ff]/20 glow-cyan'}`}>
        <div className={`text-[9px] tracking-[0.2em] font-bold ${depthFault ? 'text-red-400' : 'text-[#00e5ff]/90'}`}>DEPTH (M)</div>
        <div className={`text-[clamp(1rem,2.2vw,2.4rem)] font-extrabold tracking-tight tabular-nums ${depthFault ? 'text-red-400 animate-pulse' : 'text-[#00e5ff] text-neon'}`}>
          {depth}
        </div>
        {depthFault ? (
          <div className="text-[7px] text-red-500 font-bold animate-pulse tracking-wider mt-1">⚠ LIMIT EXCEEDED</div>
        ) : (
          <div className="text-[8px] text-[#4ade80] mt-1 flex items-center gap-1 tabular-nums">
            <span className="w-1 h-1 rounded-full bg-[#4ade80] animate-pulse" />
            +0.5 M/S
          </div>
        )}
      </div>
      <div className={`absolute top-3 right-3 border bg-[#030712]/85 backdrop-blur-md px-3 py-2 min-w-[clamp(80px,14vw,150px)] text-center rounded shadow-lg z-20 transition-all duration-500 ${dangerMode ? 'border-red-500/30' : 'border-[#00e5ff]/20 glow-cyan'}`}>
        <div className={`text-[9px] tracking-[0.2em] font-bold ${dangerMode ? 'text-red-400/60' : 'text-[#00e5ff]/90'}`}>HEADING (T)</div>
        <div className={`text-[clamp(1rem,2.2vw,2.4rem)] font-extrabold tracking-tight tabular-nums ${dangerMode ? 'text-red-400/80' : 'text-[#00e5ff] text-neon'}`}>
          {heading}°
        </div>
        <div className={`text-[8px] mt-1 tracking-wider font-semibold ${dangerMode ? 'text-[#ffffff]' : 'text-[#ffffff]'}`}>NAV: LOCKED</div>
      </div>
      <div className={`absolute bottom-3 left-3 border bg-[#030712]/85 backdrop-blur-md px-3 py-2.5 flex flex-wrap items-center gap-[clamp(0.5rem,1.5vw,2rem)] rounded shadow-lg z-20 transition-all duration-500 ${(pitchFault || rollFault) ? 'border-red-500/50 glow-red' : 'border-[#00e5ff]/15'}`}>
        <div className={`relative w-[clamp(35px,5vw,70px)] h-[clamp(35px,5vw,70px)] rounded-full border overflow-hidden bg-[#0a0f18]/60 flex items-center justify-center transition-colors duration-500 ${(pitchFault || rollFault) ? 'border-red-500/40' : 'border-[#00e5ff]/30'}`}>
          <div
            className={`absolute w-[clamp(45px,7vw,100px)] h-[clamp(45px,7vw,100px)] bg-gradient-to-b to-transparent transition-all duration-300 border-t ${(pitchFault || rollFault) ? 'from-red-500/15 border-red-500' : 'from-[#00e5ff]/15 border-[#00e5ff]'}`}
            style={{ transform: `translateY(${pitch * 1.5}px) rotate(${roll}deg)` }}
          />
          <div className="w-2 h-2 rounded-full bg-red-500 relative z-10 border border-white/80" />
          <div className="absolute left-1 right-1 h-px bg-[#334155]/40" />
          <div className="absolute top-1 bottom-1 w-px bg-[#334155]/40" />
        </div>
        <div className="flex gap-[clamp(0.5rem,1.5vw,1.5rem)] flex-wrap">
          {[
            { label: 'PITCH', value: `${pitch}°`, fault: pitchFault },
            { label: 'ROLL', value: `${roll}°`, fault: rollFault },
            { label: 'YAW', value: `${yaw}°`, fault: false },
          ].map((stat) => (
            <div key={stat.label} className="text-center min-w-[36px]">
              <div className={`text-[9px] tracking-wider mb-0.5 ${stat.fault ? 'text-red-400 font-bold' : 'text-[#ffffff]'}`}>
                {stat.label}
              </div>
              <div className={`text-[clamp(0.55rem,0.8vw,1.1rem)] font-bold tabular-nums ${stat.fault ? 'text-red-400 animate-pulse' : 'text-[#e2e8f0]'}`}>
                {stat.value}
              </div>
              {stat.fault && (
                <div className="text-[6px] text-red-500 font-bold animate-pulse tracking-wider">⚠ OOR</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={`absolute bottom-3 right-3 border bg-[#030712]/85 backdrop-blur-md px-3 py-2 flex items-center gap-3 rounded shadow-lg z-20 transition-all duration-500 ${
        battery <= 20 ? 'border-red-500/50 glow-red animate-pulse' : 
        battery <= 50 ? 'border-[#fbbf24]/30' : 
        'border-[#00e5ff]/15'
      }`}>
        <div className="flex flex-col items-end">
          <div className={`text-[9px] tracking-wider font-bold ${
            battery <= 20 ? 'text-red-400' : 
            battery <= 50 ? 'text-[#fbbf24]' : 
            'text-[#ffffff]'
          }`}>BATTERY</div>
          <div className={`text-[clamp(0.65rem,0.8vw,1.1rem)] font-bold tabular-nums ${
            battery <= 20 ? 'text-red-400 animate-pulse' : 
            battery <= 50 ? 'text-[#fbbf24]' : 
            'text-[#e2e8f0]'
          }`}>
            {battery}%
          </div>
          {battery <= 20 && (
            <div className="text-[6px] text-red-500 font-bold animate-pulse tracking-wider">CRITICAL</div>
          )}
          {battery > 20 && battery <= 50 && (
            <div className="text-[6px] text-[#fbbf24] font-bold animate-pulse tracking-wider">WARNING</div>
          )}
        </div>
        <div className="w-2.5 h-[clamp(1.5rem,2.5vw,3rem)] bg-[#1e293b] rounded-sm relative overflow-hidden flex flex-col justify-end p-px border border-[#334155]/40">
          <div
            className={`w-full rounded-sm transition-all duration-500 ${
              battery <= 20 ? 'bg-red-500 animate-pulse' : 
              battery <= 50 ? 'bg-[#fbbf24]' : 
              'bg-[#4ade80]'
            }`}
            style={{ height: `${battery}%` }}
          />
        </div>
      </div>
    </div>
  );
};
export default CameraFeed;