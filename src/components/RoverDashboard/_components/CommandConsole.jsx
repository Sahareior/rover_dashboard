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
    <div className={`bg-[#060b12]/90 border rounded-md p-4 font-mono text-sm relative overflow-hidden flex flex-col gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-500 ${dangerMode ? 'border-red-500/30' : 'border-[#1e293b]/60'}`}>
      <div className={`absolute top-0 left-0 right-0 h-px transition-colors duration-500 ${dangerMode ? 'bg-gradient-to-r from-transparent via-red-500/40 to-transparent' : 'bg-gradient-to-r from-transparent via-[#00e5ff]/20 to-transparent'}`} />
      <div className="flex justify-between items-center text-xs font-tech tracking-[0.2em] text-[#ffffff] font-bold border-b border-[#1e293b]/30 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[#00e5ff]" />
          <span>COMMAND & CONTROL</span>
        </div>
        <span>ACK FROM VEHICLE</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[#e2e8f0] tracking-wide">Target Depth</span>
          <span className="text-[9px] text-[#475569] tracking-wider font-semibold">STANDBY</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            value={targetDepth}
            onChange={(e) => setTargetDepth(parseInt(e.target.value))}
            className="flex-1 h-1.5"
          />
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={targetDepth}
              onChange={(e) => {
                const num = parseInt(e.target.value) || 0;
                setTargetDepth(Math.min(100, Math.max(0, num)));
              }}
              className="w-14 bg-[#0a0f18] border border-[#1e293b]/60 text-center py-1.5 rounded text-white text-xs font-bold tabular-nums focus:border-[#00e5ff]/40 focus:outline-none transition-colors"
            />
            <span className="text-[10px] text-[#475569] font-bold">m</span>
          </div>
          <button
            onClick={() => appendTerminalLog(`TRANSMITTING DEPTH TARGET: ${targetDepth}m`)}
            className="bg-[#00e5ff] text-black font-extrabold text-[10px] px-5 py-1.5 rounded hover:bg-[#00b0ff] transition-all duration-200 btn-glow tracking-wider"
          >
            SEND
          </button>
        </div>
        <div className="text-[9px] text-[#475569] mt-0.5">
          target: <span className="text-[#94a3b8]">{targetDepth}m</span> · current: <span className="text-[#94a3b8]">{depth}m</span>
        </div>
      </div>
      <div className="border-t border-[#1e293b]/20" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center transition-all duration-300 ${dangerMode ? 'bg-red-500/20 border border-red-500/40' : 'bg-[#111927] border border-[#1e293b]'}`}>
            <span className="text-sm">{dangerMode ? '🚨' : '🛡️'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#e2e8f0] tracking-wide">Danger Mode Simulation</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {dangerMode && activeAlarms?.length > 0 && (
            <span className="text-[9px] text-red-400 font-bold tracking-wider bg-red-950/50 px-2 py-0.5 rounded border border-red-500/20">
              {activeAlarms.length} ALARM{activeAlarms.length > 1 ? 'S' : ''}
            </span>
          )}
          <button
            onClick={toggleDangerMode}
            className={`px-5 py-1.5 rounded text-[10px] font-extrabold tracking-wider transition-all duration-300 ${
              dangerMode
                ? 'bg-red-600 text-white border border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse btn-danger-glow'
                : 'border border-[#1e293b] text-[#94a3b8] hover:bg-[#111927] hover:border-red-500/30 hover:text-red-300 btn-glow'
            }`}
          >
            {dangerMode ? 'DEACTIVATE' : 'ENGAGE'}
          </button>
        </div>
      </div>
      <div className="border-t border-[#1e293b]/20" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center justify-between bg-[#0a0f18]/50 border border-[#1e293b]/30 rounded p-2.5">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded flex items-center justify-center transition-all duration-300 ${floodlightsOn ? 'bg-[#00e5ff]/15 border border-[#00e5ff]/30' : 'bg-[#111927] border border-[#1e293b]'}`}>
              <span className={`text-xs ${floodlightsOn ? 'brightness-125' : 'opacity-40'}`}>💡</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#e2e8f0] tracking-wide">Lights</span>
              <span className={`text-[10px] tracking-wider font-semibold ${floodlightsOn ? 'text-[#4ade80]' : 'text-[#ffffff]'}`}>
                {floodlightsOn ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setFloodlightsOn(!floodlightsOn);
              appendTerminalLog(`FLOODLIGHTS: ${!floodlightsOn ? 'ON' : 'OFF'}`);
            }}
            className={`px-3 py-1 rounded text-[9px] font-bold tracking-wider transition-all duration-200 border ${
              floodlightsOn
                ? 'border-[#00e5ff]/30 text-[#00e5ff] bg-[#00e5ff]/5 hover:bg-[#00e5ff]/10'
                : 'border-[#1e293b] text-[#ffffff] hover:border-[#00e5ff]/20 hover:text-[#94a3b8]'
            }`}
          >
            {floodlightsOn ? 'OFF' : 'ON'}
          </button>
        </div>
        <div className="flex items-center justify-between bg-[#0a0f18]/50 border border-[#1e293b]/30 rounded p-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded flex items-center justify-center bg-[#111927] border border-[#1e293b]">
              <span className="text-xs opacity-60">⚡</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#e7ebf0] tracking-wide">Thrusters</span>
              <span className="text-[10px] tracking-wider font-semibold text-[#fbfbfb]">ARMED</span>
            </div>
          </div>
          <button
            onClick={() => appendTerminalLog('THRUSTER ARRAY: RECALIBRATING')}
            className="px-3 py-1 rounded text-[9px] font-bold tracking-wider border border-[#1e293b] text-[#64748b] hover:border-[#00e5ff]/20 hover:text-[#94a3b8] transition-all duration-200"
          >
            ARM
          </button>
        </div>
      </div>
    </div>
  );
};
export default CommandConsole;