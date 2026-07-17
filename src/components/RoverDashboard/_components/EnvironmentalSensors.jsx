import React from 'react';

const EnvironmentalSensors = ({ temp, pressure, sonarOn, dangerMode, leakDetected, tempFault, pressureFault }) => {
    const sensors = [
        { label: 'EXT TEMP', value: `${temp} °C`, highlight: tempFault, oor: tempFault },
        { label: 'SALINITY', value: '34.8 PSU', highlight: false, oor: false },
        { label: 'PRESSURE', value: `${pressure} ATM`, highlight: pressureFault, oor: pressureFault },
        { label: 'SONAR TGT', value: sonarOn ? 'DETECTED' : 'NONE', highlight: sonarOn, oor: false },
        { label: 'HULL INTEG', value: leakDetected ? 'BREACH' : 'SEALED', highlight: leakDetected, oor: leakDetected },
        { label: 'LEAK DET.', value: leakDetected ? 'ACTIVE' : 'CLEAR', highlight: leakDetected, oor: leakDetected },
    ];

    return (
        <div>
            <div className="flex items-center gap-2 border-l-2 border-[#00e5ff] pl-2 mb-3">
                <h3 className="text-[11px] font-extrabold text-[#e2e8f0] tracking-widest">ENVIRONMENTAL</h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {sensors.map((sensor) => (
                    <div
                        key={sensor.label}
                        className={`border p-3 rounded transition-all duration-300 ${
                            sensor.highlight && dangerMode
                                ? 'border-red-500/60 bg-red-950/30 glow-red'
                                : sensor.highlight
                                    ? 'border-red-500/40 bg-red-950/20'
                                    : 'border-[#1e293b] bg-[#111927]/40'
                        }`}
                    >
                        <div className="text-[9px] text-[#64748b] tracking-wider mb-1 font-bold">{sensor.label}</div>
                        <div className={`text-sm font-semibold tracking-tight ${
                            sensor.highlight ? 'text-red-500 animate-pulse' : 'text-[#e2e8f0]'
                        }`}>
                            {sensor.value}
                        </div>
                        {sensor.oor && dangerMode && (
                            <div className="text-[7px] text-red-400 font-bold tracking-wider mt-0.5 animate-pulse">⚠ OUT OF RANGE</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EnvironmentalSensors;
