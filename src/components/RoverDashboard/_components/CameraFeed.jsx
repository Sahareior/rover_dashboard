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
        <div className={`relative flex-1 min-h-[55vh] bg-black/40 backdrop-blur-md rounded-md overflow-hidden flex items-center justify-center transition-all duration-500 ${dangerMode ? 'border border-red-500/50 glow-red' : 'border border-[#00e5ff]/20 glow-cyan'}`}>
            {/* Decorative sci-fi corners */}
            <div className={`absolute top-0 left-0 w-[clamp(8px,1vw,20px)] h-[clamp(8px,1vw,20px)] border-t-2 border-l-2 z-20 transition-colors duration-500 ${dangerMode ? 'border-red-500' : 'border-[#00e5ff]'}`}></div>
            <div className={`absolute top-0 right-0 w-[clamp(8px,1vw,20px)] h-[clamp(8px,1vw,20px)] border-t-2 border-r-2 z-20 transition-colors duration-500 ${dangerMode ? 'border-red-500' : 'border-[#00e5ff]'}`}></div>
            <div className={`absolute bottom-0 left-0 w-[clamp(8px,1vw,20px)] h-[clamp(8px,1vw,20px)] border-b-2 border-l-2 z-20 transition-colors duration-500 ${dangerMode ? 'border-red-500' : 'border-[#00e5ff]'}`}></div>
            <div className={`absolute bottom-0 right-0 w-[clamp(8px,1vw,20px)] h-[clamp(8px,1vw,20px)] border-b-2 border-r-2 z-20 transition-colors duration-500 ${dangerMode ? 'border-red-500' : 'border-[#00e5ff]'}`}></div>

            {/* Live Camera Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Fallback / Offline Screen */}
            {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020a12]">
                    <div className="relative w-[clamp(80px,20vw,180px)] h-[clamp(80px,20vw,180px)] flex items-center justify-center">
                        {/* Animated radar sweep */}
                        <svg className="w-full h-full animate-spin" style={{ animationDuration: '4s' }} viewBox="0 0 100 100">
                            <defs>
                                <radialGradient id="sweep" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
                                </radialGradient>
                            </defs>
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#00e5ff" strokeWidth="0.5" opacity="0.3" />
                            <circle cx="50" cy="50" r="30" fill="none" stroke="#00e5ff" strokeWidth="0.3" opacity="0.2" strokeDasharray="4 4" />
                            <circle cx="50" cy="50" r="15" fill="none" stroke="#00e5ff" strokeWidth="0.3" opacity="0.15" />
                            <path d="M 50 50 L 50 5 A 45 45 0 0 1 95 50 Z" fill="url(#sweep)" />
                        </svg>
                        {/* Center dot */}
                        <div className="absolute w-[clamp(6px,1vw,12px)] h-[clamp(6px,1vw,12px)] rounded-full bg-[#00e5ff] animate-pulse"></div>
                    </div>
                    <div className="mt-4 text-[clamp(8px,0.8vw,12px)] text-[#00e5ff]/70 tracking-[0.3em] font-bold animate-pulse">
                        {cameraError || 'INITIALIZING CAMERA...'}
                    </div>
                    <div className="mt-2 text-[clamp(7px,0.6vw,10px)] text-[#64748b] tracking-wider">
                        AWAITING VIDEO FEED
                    </div>
                </div>
            )}

            {/* Leak warning overlay */}
            {dangerMode && leakDetected && (
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-900/20 animate-danger-pulse"></div>
                    <div className="relative bg-red-950/90 border-2 border-red-500 rounded-lg px-[clamp(1rem,3vw,4rem)] py-[clamp(0.75rem,2vw,2.5rem)] text-center backdrop-blur-sm animate-bounce-in max-w-[90%]">
                        <div className="text-red-400 font-extrabold text-[clamp(1rem,2vw,2rem)] tracking-[0.3em] mb-2 animate-pulse">⚠ WATER INGRESS ⚠</div>
                        <div className="text-red-300 text-[clamp(0.6rem,0.8vw,1rem)] tracking-wider">HULL BREACH DETECTED — INITIATE EMERGENCY ASCENT</div>
                        <div className="mt-3 flex justify-center gap-3 flex-wrap">
                            <span className="text-[clamp(7px,0.6vw,10px)] text-red-400 bg-red-900/50 px-2 py-0.5 rounded border border-red-500/30 animate-pulse">SECTOR A</span>
                            <span className="text-[clamp(7px,0.6vw,10px)] text-red-400 bg-red-900/50 px-2 py-0.5 rounded border border-red-500/30 animate-pulse" style={{ animationDelay: '0.3s' }}>SECTOR C</span>
                        </div>
                    </div>
                </div>
            )}

            {/* HUD Reticle Overlay */}
            <svg className={`absolute w-[clamp(120px,35vw,450px)] h-[clamp(120px,35vw,450px)] opacity-25 pointer-events-none animate-pulse-slow z-10 transition-colors duration-500 ${dangerMode ? 'text-red-500' : 'text-[#00e5ff]'}`} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="0.5" stroke="currentColor" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="30" fill="none" strokeWidth="0.8" stroke="currentColor" />
                <circle cx="50" cy="50" r="4" fill="currentColor" />
                <line x1="5" y1="50" x2="45" y2="50" strokeWidth="0.5" stroke="currentColor" />
                <line x1="55" y1="50" x2="95" y2="50" strokeWidth="0.5" stroke="currentColor" />
                <line x1="50" y1="5" x2="50" y2="45" strokeWidth="0.5" stroke="currentColor" />
                <line x1="50" y1="55" x2="50" y2="95" strokeWidth="0.5" stroke="currentColor" />
                <path d="M 20 20 L 25 20 L 25 25" fill="none" strokeWidth="1" stroke="currentColor" />
                <path d="M 80 20 L 75 20 L 75 25" fill="none" strokeWidth="1" stroke="currentColor" />
                <path d="M 20 80 L 25 80 L 25 75" fill="none" strokeWidth="1" stroke="currentColor" />
                <path d="M 80 80 L 75 80 L 75 75" fill="none" strokeWidth="1" stroke="currentColor" />
            </svg>

            {/* Deep-sea light gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none z-10 transition-colors duration-500 ${dangerMode ? 'from-red-950/30 via-transparent to-red-950/20' : 'from-[#021f30]/40 via-transparent to-[#021f30]/20'}`}></div>

            {/* Recording indicator */}
            {cameraActive && (
                <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-[clamp(0.5rem,1vw,1.5rem)] py-[clamp(0.15rem,0.3vw,0.5rem)] rounded-full backdrop-blur-sm transition-colors duration-300 ${dangerMode ? 'bg-red-600/90 animate-flash' : 'bg-red-600/80'}`}>
                    <div className="w-[clamp(6px,0.6vw,10px)] h-[clamp(6px,0.6vw,10px)] rounded-full bg-white animate-pulse"></div>
                    <span className="text-[clamp(8px,0.7vw,12px)] text-white font-bold tracking-wider">{dangerMode ? '⚠ DANGER' : 'LIVE'}</span>
                </div>
            )}

            {/* Depth HUD Block */}
            <div className={`absolute top-4 left-4 border bg-[#030712]/90 backdrop-blur-md px-[clamp(0.5rem,1vw,1.5rem)] py-[clamp(0.4rem,0.8vw,1rem)] min-w-[clamp(80px,15vw,160px)] rounded shadow-lg z-20 transition-all duration-500 ${depthFault ? 'border-red-500/60 glow-red animate-pulse' : 'border-[#00e5ff]/30 glow-cyan'}`}>
                <div className={`text-[clamp(8px,0.6vw,11px)] tracking-widest font-bold ${depthFault ? 'text-red-400' : 'text-[#00e5ff]/70'}`}>DEPTH (M)</div>
                <div className={`text-[clamp(1rem,2.5vw,2.8rem)] font-extrabold tracking-tight ${depthFault ? 'text-red-400 animate-pulse' : 'text-[#00e5ff] text-neon'}`}>{depth}</div>
                {depthFault && <div className="text-[clamp(6px,0.5vw,9px)] text-red-500 font-bold animate-pulse tracking-wider mt-1">⚠ LIMIT EXCEEDED</div>}
                {!depthFault && (
                    <div className="text-[clamp(8px,0.6vw,11px)] text-[#4ade80] mt-1 flex items-center gap-1">
                        <span className="w-[clamp(5px,0.4vw,8px)] h-[clamp(5px,0.4vw,8px)] rounded-full bg-[#4ade80] animate-ping"></span>
                        +0.5 M/S
                    </div>
                )}
            </div>

            {/* Heading HUD Block */}
            <div className="absolute top-4 right-4 border border-[#00e5ff]/30 bg-[#030712]/90 backdrop-blur-md px-[clamp(0.5rem,1vw,1.5rem)] py-[clamp(0.4rem,0.8vw,1rem)] min-w-[clamp(80px,15vw,160px)] text-center rounded shadow-lg glow-cyan z-20">
                <div className="text-[clamp(8px,0.6vw,11px)] text-[#00e5ff]/70 tracking-widest font-bold">HEADING (T)</div>
                <div className="text-[clamp(1rem,2.5vw,2.8rem)] text-[#00e5ff] font-extrabold tracking-tight text-neon">{heading}°</div>
                <div className="text-[clamp(7px,0.6vw,10px)] text-[#64748b] mt-1">NAV SYS: LOCKED</div>
            </div>

            {/* Pitch, Roll, Yaw Telemetry Overlay & Attitude Meter */}
            <div className={`absolute bottom-4 left-4 border bg-[#030712]/90 backdrop-blur-md px-[clamp(0.5rem,1vw,1.5rem)] py-[clamp(0.4rem,0.8vw,1rem)] flex flex-wrap items-center gap-[clamp(0.5rem,1.5vw,2rem)] rounded shadow-lg z-20 transition-all duration-500 ${(pitchFault || rollFault) ? 'border-red-500/60 glow-red' : 'border-[#00e5ff]/20'}`}>
                {/* Attitude Horizon Meter */}
                <div className={`relative w-[clamp(35px,5vw,75px)] h-[clamp(35px,5vw,75px)] rounded-full border overflow-hidden bg-slate-900/60 flex items-center justify-center transition-colors duration-500 ${(pitchFault || rollFault) ? 'border-red-500/50' : 'border-[#00e5ff]/40'}`}>
                    <div
                        className={`absolute w-[clamp(45px,7vw,110px)] h-[clamp(45px,7vw,110px)] bg-gradient-to-b to-transparent transition-all duration-300 border-t ${(pitchFault || rollFault) ? 'from-red-500/20 border-red-500' : 'from-[#00e5ff]/20 border-[#00e5ff]'}`}
                        style={{
                            transform: `translateY(${pitch * 1.5}px) rotate(${roll}deg)`,
                        }}
                    ></div>
                    <div className="w-[clamp(6px,0.6vw,12px)] h-[clamp(6px,0.6vw,12px)] rounded-full bg-red-500 relative z-10 border border-white"></div>
                    <div className="absolute left-1 right-1 h-[0.5px] bg-[#64748b]/50"></div>
                    <div className="absolute top-1 bottom-1 w-[0.5px] bg-[#64748b]/50"></div>
                </div>

                <div className="flex gap-[clamp(0.5rem,1.5vw,2rem)] flex-wrap">
                    {[
                        { label: 'PITCH', value: `${pitch}°`, fault: pitchFault },
                        { label: 'ROLL', value: `${roll}°`, fault: rollFault },
                        { label: 'YAW', value: `${yaw}°`, fault: false },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className={`text-[clamp(7px,0.5vw,10px)] tracking-wider mb-0.5 ${stat.fault ? 'text-red-400 font-bold' : 'text-[#64748b]'}`}>{stat.label}</div>
                            <div className={`text-[clamp(0.6rem,0.8vw,1.2rem)] font-semibold ${stat.fault ? 'text-red-400 animate-pulse font-bold' : 'text-[#e2e8f0]'}`}>{stat.value}</div>
                            {stat.fault && <div className="text-[clamp(6px,0.4vw,9px)] text-red-500 font-bold animate-pulse">⚠ OOR</div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Battery Status Indicator */}
            <div className={`absolute bottom-4 right-4 border bg-[#030712]/90 backdrop-blur-md px-[clamp(0.5rem,1vw,1.5rem)] py-[clamp(0.4rem,0.8vw,1rem)] flex items-center gap-[clamp(0.5rem,1vw,1.5rem)] rounded shadow-lg z-20 transition-all duration-500 ${batteryFault ? 'border-red-500/60 glow-red animate-pulse' : 'border-[#00e5ff]/20'}`}>
                <div className="flex flex-col items-end">
                    <div className={`text-[clamp(7px,0.5vw,10px)] tracking-wider ${batteryFault ? 'text-red-400 font-bold' : 'text-[#64748b]'}`}>BATTERY</div>
                    <div className={`text-[clamp(0.7rem,0.8vw,1.2rem)] font-bold ${batteryFault ? 'text-red-400 animate-pulse' : 'text-[#e2e8f0]'}`}>{battery}%</div>
                    {batteryFault && <div className="text-[clamp(6px,0.4vw,9px)] text-red-500 font-bold animate-pulse tracking-wider">LOW</div>}
                </div>
                <div className="w-[clamp(0.5rem,0.8vw,1rem)] h-[clamp(1.5rem,3vw,3.5rem)] bg-[#1e293b] rounded-sm relative overflow-hidden flex flex-col justify-end p-[clamp(1px,0.1vw,2px)] border border-[#64748b]/40">
                    <div
                        className={`w-full rounded-sm transition-all duration-500 ${batteryFault ? 'bg-red-500 animate-pulse' : 'bg-[#00e5ff]'}`}
                        style={{ height: `${battery}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default CameraFeed;