import React from 'react';
const StatusBar = ({ dangerMode, leakDetected, activeAlarms, missionTime, latency, bandwidth, battery, depth }) => {
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };
    const latencyColor = latency < 20 ? 'text-[#4ade80]' : latency < 35 ? 'text-[#fbbf24]' : 'text-red-400';
    const batteryColor = battery > 50 ? 'text-[#4ade80]' : battery > 20 ? 'text-[#fbbf24]' : 'text-red-400';
    return (
        <div className={`flex items-center justify-between px-4 py-2.5 border-b relative z-20 transition-all duration-500 ${dangerMode ? 'bg-[#0a0000]/95 border-red-500/20' : 'bg-[#030712]/95 border-[#00e5ff]/10'}`}>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${dangerMode ? 'bg-red-500 animate-pulse' : 'bg-[#4ade80] animate-pulse'}`} />
                    <span className="text-[10px] text-[#75a2e1] tracking-[0.15em] font-bold">MISSION</span>
                    <span className={`text-[10px] tracking-wider font-bold ${dangerMode ? 'text-red-400' : 'text-[#e2e8f0]'}`}>
                        AQR-0047
                    </span>
                </div>
                <div className="w-px h-3 bg-[#1e293b]" />
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#fcfcfc] tracking-wider font-bold">T+ {formatTime(missionTime)}</span>
                </div>
            </div>
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span className={`text-[10px] font-bold tabular-nums ${dangerMode && depth >= 5000 ? 'text-red-400 animate-pulse' : 'text-[#e2e8f0]'}`}>
                        {depth}m
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className={`text-[10px] font-bold tabular-nums ${batteryColor} ${battery <= 20 ? 'animate-pulse' : ''}`}>{battery}%</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {dangerMode && activeAlarms.length > 0 && (
                    <>
                        <div className="flex items-center gap-1.5">
                            <svg className="w-3 h-3 text-red-400 animate-spin" style={{ animationDuration: '2s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[10px] text-red-400 font-bold animate-pulse tracking-wider">
                                {activeAlarms.length} ALARM{activeAlarms.length > 1 ? 'S' : ''}
                            </span>
                        </div>
                        <div className="w-px h-3 bg-[#1e293b]" />
                    </>
                )}
                <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
                    </svg>
                    <span className={`text-[10px] font-bold tabular-nums ${latencyColor}`}>{latency.toFixed(0)}ms</span>
                </div>
                <div className="w-px h-3 bg-[#1e293b]" />
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#ffffff] tracking-wider">{bandwidth.toFixed(1)} Mb/s</span>
                </div>
                <div className="w-px h-3 bg-[#1e293b]" />
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#ffffff] tracking-wider">1080p</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                </div>
            </div>
        </div>
    );
};
export default StatusBar;