import React from 'react';

const CommandConsole = ({
    depth,
    targetDepth,
    setTargetDepth,
    floodlightsOn,
    setFloodlightsOn,
    appendTerminalLog,
    dangerMode,
    toggleDangerMode,
    activeAlarms,
}) => {
    return (
        <div className=" bg-[#0c1924]/80 border pb-8 border-[#1e3a5f]/40 rounded-md p-4 font-mono text-sm relative overflow-hidden flex flex-col justify-between shadow-[0_0_20px_rgba(0,0,0,0.4)]">
            {/* Header row */}
            <div className="flex justify-between items-center text-[10px] tracking-wider text-[#64748b] font-bold border-b border-[#1e3a5f]/20 pb-2">
                <span>COMMAND &amp; CONTROL</span>
                <span>ACK FROM VEHICLE</span>
            </div>

            {/* Section 1: Target Depth Slider */}
            <div className="flex flex-col gap-1 mt-2.5">
                <div className="flex justify-between items-center text-xs font-semibold text-white">
                    <span>Target depth</span>
                    <span className="text-[10px] text-[#64748b] tracking-wider">IDLE</span>
                </div>

                <div className="flex items-center gap-4 mt-1">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={targetDepth}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setTargetDepth(val);
                        }}
                        className="flex-1 accent-[#00e5ff] h-1.5 bg-[#1e293b] rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={targetDepth}
                            onChange={(e) => {
                                const num = parseInt(e.target.value) || 0;
                                setTargetDepth(Math.min(100, Math.max(0, num)));
                            }}
                            className="w-16 bg-[#060b13] border border-[#1e3a5f]/50 text-center py-1 rounded text-white text-xs font-semibold"
                        />
                        <span className="text-[10px] text-[#64748b]">m</span>
                    </div>
                    <button
                        onClick={() => appendTerminalLog(`TRANSMITTING DEPTH TARGET DIRECTIVE: ${targetDepth}m`)}
                        className="bg-[#00e5ff] text-black font-extrabold text-xs px-4 py-1.5 rounded hover:bg-[#00b0ff] transition-colors"
                    >
                        SEND
                    </button>
                </div>
                <div className="text-[10px] text-[#64748b] mt-1">
                    vehicle target: <span className="text-[#e2e8f0]">{targetDepth.toFixed(1)} m</span> &middot; current: <span className="text-[#e2e8f0]">{Math.max(0, depth / 320).toFixed(1)} m</span>
                </div>
            </div>

            <div className="border-t border-[#1e3a5f]/20 my-2"></div>

            {/* Danger Mode Toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-lg">🚨</span>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white">Danger Mode Simulation</span>
                        <span className={`text-[10px] ${dangerMode ? 'text-red-400 font-bold animate-pulse' : 'text-[#64748b]'}`}>state: {dangerMode ? 'ACTIVE' : 'STANDBY'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`text-[10px] tracking-wider font-bold ${dangerMode ? 'text-red-400 animate-pulse' : 'text-[#64748b]'}`}>                          {dangerMode ? `ALARMS: ${activeAlarms?.length || 0}` : 'IDLE'}</span>
                    <button
                        onClick={toggleDangerMode}
                        className={`px-4 py-1.5 rounded text-xs font-bold transition-all duration-300 ${dangerMode
                            ? 'bg-red-600 text-white border border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse'
                            : 'border border-[#1e3a5f]/80 text-[#e2e8f0] hover:bg-[#111927] hover:border-red-500/50'
                        }`}
                    >
                        {dangerMode ? 'DEACTIVATE' : 'ENGAGE'}
                    </button>
                </div>
            </div>

            <div className="border-t border-[#1e3a5f]/20 my-2"></div>

            {/* Section 2: Underwater Light & Thrusters Controls */}
            <div className="grid grid-cols-1 gap-2.5 mb-1.5">
                {/* Underwater Light */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-lg text-[#00e5ff]">💡</span>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-white">Underwater light</span>
                            <span className="text-[10px] text-[#64748b]">state: {floodlightsOn ? 'ON' : 'OFF'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] text-[#64748b] tracking-wider">IDLE</span>
                        <button
                            onClick={() => {
                                setFloodlightsOn(!floodlightsOn);
                                appendTerminalLog(`FLOODLIGHTS SET TO: ${!floodlightsOn ? 'ON' : 'OFF'}`);
                            }}
                            className="border border-[#1e3a5f]/80 text-[#e2e8f0] px-4 py-1.5 rounded text-xs font-bold hover:bg-[#111927] hover:border-[#00e5ff]/50 transition-all"
                        >
                            {floodlightsOn ? 'TURN OFF' : 'TURN ON'}
                        </button>
                    </div>
                </div>

                {/* Thrusters */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-lg text-[#00e5ff]">🛡️</span>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-white">Thrusters</span>
                            <span className="text-[10px] text-[#64748b]">state: SAFE</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] text-[#64748b] tracking-wider">IDLE</span>
                        <button
                            onClick={() => appendTerminalLog('THRUSTER ARRAY ARMED')}
                            className="border border-[#1e3a5f]/80 text-[#e2e8f0] px-4 py-1.5 rounded text-xs font-bold hover:bg-[#111927] hover:border-[#00e5ff]/50 transition-all"
                        >
                            ARM
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandConsole;
