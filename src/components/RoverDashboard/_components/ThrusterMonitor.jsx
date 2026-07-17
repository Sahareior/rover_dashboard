import React from 'react';
const ThrusterMonitor = ({ thrusterTelemetry, dangerMode }) => {
    return (
        <div>
            <div className={`flex items-center gap-2 border-l-2 pl-2 mb-3 transition-colors duration-500 ${dangerMode ? 'border-red-500/60' : 'border-[#00e5ff]'}`}>
                <h3 className={`text-sm font-tech font-bold tracking-[0.2em] transition-colors duration-500 ${dangerMode ? 'text-red-400/80' : 'text-[#e2e8f0]'}`}>
                    THRUSTER ARRAY
                </h3>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
                {thrusterTelemetry.map((thruster, index) => {
                    const isLow = thruster.value < 20 && dangerMode;
                    return (
                        <div
                            key={thruster.label}
                            className={`bg-[#0a0f18]/50 border rounded p-2.5 flex flex-col gap-1.5 transition-all duration-300 ${
                                isLow ? 'border-red-500/40 glow-red' : 'border-[#1e293b]/60 hover:border-[#1e293b]'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className={`text-[10px] font-bold tracking-wider ${
                                    isLow ? 'text-red-400' : 'text-[#cad8eb]'
                                }`}>
                                    {thruster.label}
                                </span>
                                <span className={`text-[10px] font-bold tabular-nums ${
                                    isLow ? 'text-red-400 animate-pulse' : 'text-[#00e5ff]'
                                }`}>
                                    {thruster.value}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                                        isLow
                                            ? 'bg-gradient-to-r from-red-700 to-red-500'
                                            : 'bg-gradient-to-r from-[#00b0ff] to-[#00e5ff]'
                                    }`}
                                    style={{ width: `${thruster.value}%` }}
                                />
                            </div>
                            {isLow && (
                                <div className="text-[7px] text-red-400 font-bold tracking-wider animate-pulse flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-400 animate-ping" />
                                    LOW THRUST
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[9px] text-[#e4a32a] tracking-wider">
                <span>TOTAL OUTPUT</span>
                <span className={`font-bold tabular-nums ${dangerMode ? 'text-red-400/60' : 'text-[#00e5ff]/60'}`}>
                    {Math.round(thrusterTelemetry.reduce((sum, t) => sum + t.value, 0) / thrusterTelemetry.length)}% AVG
                </span>
            </div>
        </div>
    );
};
export default ThrusterMonitor;