import React from 'react';
const AlarmBanner = ({ alarms }) => {
    if (!alarms || alarms.length === 0) return null;
    const hasEmergency = alarms.some(a => a.type === 'EMERGENCY');
    const hasCritical = alarms.some(a => a.type === 'CRITICAL');
    return (
        <div className={`absolute top-0 left-0 right-0 z-40 pointer-events-none ${hasEmergency ? 'animate-danger-pulse' : ''}`}>
            {hasEmergency && (
                <div className="bg-red-600/90 backdrop-blur-sm border-b border-red-400/40 px-4 py-1.5 flex items-center justify-center gap-3">
                    <svg className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '1.5s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white font-extrabold text-[10px] tracking-[0.25em] animate-pulse">
                        ⚠ EMERGENCY — HULL BREACH DETECTED ⚠
                    </span>
                    <svg className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '1.5s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            )}
            <div className={`overflow-hidden backdrop-blur-sm ${
                hasEmergency ? 'bg-red-900/60' : hasCritical ? 'bg-red-950/50' : 'bg-red-950/30'
            }`}>
                <div className="flex items-center gap-8 py-1 px-4 animate-ticker">
                    {[...alarms, ...alarms].map((alarm, i) => (
                        <div key={i} className="flex items-center gap-2 whitespace-nowrap shrink-0">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                                alarm.type === 'EMERGENCY' ? 'bg-red-500 animate-ping' :
                                alarm.type === 'CRITICAL' ? 'bg-red-400 animate-pulse' :
                                'bg-yellow-500 animate-pulse'
                            }`} />
                            <span className={`text-[9px] font-bold tracking-wider ${
                                alarm.type === 'EMERGENCY' ? 'text-red-300' :
                                alarm.type === 'CRITICAL' ? 'text-red-400/90' :
                                'text-yellow-400/80'
                            }`}>
                                [{alarm.type}] {alarm.msg}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default AlarmBanner;