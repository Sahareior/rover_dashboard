import React from 'react';
const EnvironmentalSensors = ({ temp, pressure, sonarOn, dangerMode, leakDetected, tempFault, pressureFault }) => {
    const sensors = [
        { label: 'EXT TEMP', value: `${temp} °C`, highlight: tempFault, oor: tempFault, icon: '🌡️' },
        { label: 'SALINITY', value: '34.8 PSU', highlight: false, oor: false, icon: '🧂' },
        { label: 'PRESSURE', value: `${pressure} ATM`, highlight: pressureFault, oor: pressureFault, icon: '⏲️' },
        { label: 'SONAR', value: sonarOn ? 'DETECTED' : 'NONE', highlight: sonarOn, oor: false, icon: '📡' },
        { label: 'HULL INTEG', value: leakDetected ? 'BREACH' : 'SEALED', highlight: leakDetected, oor: leakDetected, icon: '🔒' },
        { label: 'LEAK DET.', value: leakDetected ? 'ACTIVE' : 'CLEAR', highlight: leakDetected, oor: leakDetected, icon: '💧' },
    ];
    return (
        <div>
            <div className={`flex items-center gap-2 border-l-2 pl-2 mb-3 transition-colors duration-500 ${dangerMode ? 'border-red-500/60' : 'border-[#00e5ff]'}`}>
                <h3 className={`text-sm font-tech font-bold tracking-[0.2em] transition-colors duration-500 ${dangerMode ? 'text-red-400/80' : 'text-[#e2e8f0]'}`}>
                    ENVIRONMENTAL
                </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {sensors.map((sensor) => (
                    <div
                        key={sensor.label}
                        className={`border p-2.5 rounded transition-all duration-300 ${
                            sensor.highlight && dangerMode
                                ? 'border-red-500/50 bg-red-950/25 glow-red'
                                : sensor.highlight
                                    ? 'border-red-500/30 bg-red-950/15'
                                    : 'border-[#1e293b]/60 bg-[#0a0f18]/40 hover:border-[#1e293b]'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] text-[#8a9aaf] tracking-[0.1em] font-bold uppercase">
                                {sensor.label}
                            </span>
                            <span className="text-[10px]">{sensor.icon}</span>
                        </div>
                        <div className={`text-sm font-tech font-bold tracking-[0.2em] tabular-nums ${
                            sensor.highlight ? 'text-red-400 animate-pulse' : 'text-[#e2e8f0]'
                        }`}>
                            {sensor.value}
                        </div>
                        {sensor.oor && dangerMode && (
                            <div className="text-[7px] text-red-400 font-bold tracking-wider mt-1 animate-pulse flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-red-400 animate-ping" />
                                OUT OF RANGE
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default EnvironmentalSensors;