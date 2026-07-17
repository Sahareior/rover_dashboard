import React from 'react';

const ThrusterMonitor = ({ thrusterTelemetry, dangerMode }) => {
    return (
        <div>
            <div className="flex items-center gap-2 border-l-2 border-[#00e5ff] pl-2 mb-3">
                <h3 className="text-[11px] font-extrabold text-[#e2e8f0] tracking-widest">THRUSTER ARRAY</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {thrusterTelemetry.map((thruster) => (
                    <div key={thruster.label} className="bg-[#111927]/60 border border-[#1e293b] rounded p-2.5 flex flex-col gap-1.5">
                        <div className="flex justify-between text-[10px] font-semibold">
                            <span className={`tracking-wider ${thruster.value < 20 && dangerMode ? 'text-red-400' : 'text-[#94a3b8]'}`}>{thruster.label}</span>
                            <span className={`${thruster.value < 20 && dangerMode ? 'text-red-400 animate-pulse font-bold' : 'text-[#00e5ff]'}`}>{thruster.value}%</span>
                        </div>

                        <div className="h-2 w-full bg-[#1e293b] rounded-full overflow-hidden p-0.5 border border-[#334155]">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${thruster.value < 20 && dangerMode ? 'bg-gradient-to-r from-red-700 to-red-500 animate-pulse' : 'bg-gradient-to-r from-[#00b0ff] to-[#00e5ff]'}`}
                                style={{ width: `${thruster.value}%` }}
                            />
                        </div>
                        {thruster.value < 20 && dangerMode && (
                            <div className="text-[7px] text-red-400 font-bold tracking-wider animate-pulse">⚠ LOW THRUST</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThrusterMonitor;
