import React from 'react';

const AlarmBanner = ({ alarms }) => {
    if (!alarms || alarms.length === 0) return null;

    const hasEmergency = alarms.some(a => a.type === 'EMERGENCY');
    const hasCritical = alarms.some(a => a.type === 'CRITICAL');

    return (
        <div className={`absolute top-0 left-0 right-0 z-50 pointer-events-none ${hasEmergency ? 'animate-danger-pulse' : ''}`}>
            {/* Emergency bar */}
            {hasEmergency && (
                <div className="bg-red-600/90 backdrop-blur-sm border-b border-red-400/60 px-4 py-2 flex items-center justify-center gap-3 animate-flash">
                    <svg className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '1s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white font-extrabold text-xs tracking-[0.3em] animate-pulse">
                        ⚠ EMERGENCY — HULL BREACH DETECTED ⚠
                    </span>
                    <svg className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '1s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            )}

            {/* Alarm ticker */}
            <div className={`overflow-hidden ${hasEmergency ? 'bg-red-900/70' : hasCritical ? 'bg-red-950/60' : 'bg-red-950/40'} backdrop-blur-sm`}>
                <div className="flex items-center gap-6 py-1.5 px-4 animate-ticker">
                    {alarms.map((alarm, i) => (
                        <div key={i} className="flex items-center gap-2 whitespace-nowrap shrink-0">
                            <span className={`w-2 h-2 rounded-full ${
                                alarm.type === 'EMERGENCY' ? 'bg-red-500 animate-ping' :
                                alarm.type === 'CRITICAL' ? 'bg-red-400 animate-pulse' :
                                'bg-yellow-500 animate-pulse'
                            }`}></span>
                            <span className={`text-[10px] font-bold tracking-wider ${
                                alarm.type === 'EMERGENCY' ? 'text-red-300' :
                                alarm.type === 'CRITICAL' ? 'text-red-400' :
                                'text-yellow-400'
                            }`}>
                                [{alarm.type}] {alarm.msg}
                            </span>
                        </div>
                    ))}
                    {/* Duplicate for seamless scroll */}
                    {alarms.map((alarm, i) => (
                        <div key={`dup-${i}`} className="flex items-center gap-2 whitespace-nowrap shrink-0">
                            <span className={`w-2 h-2 rounded-full ${
                                alarm.type === 'EMERGENCY' ? 'bg-red-500 animate-ping' :
                                alarm.type === 'CRITICAL' ? 'bg-red-400 animate-pulse' :
                                'bg-yellow-500 animate-pulse'
                            }`}></span>
                            <span className={`text-[10px] font-bold tracking-wider ${
                                alarm.type === 'EMERGENCY' ? 'text-red-300' :
                                alarm.type === 'CRITICAL' ? 'text-red-400' :
                                'text-yellow-400'
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
