import React, { useState, useEffect } from 'react';
const ConnectionIndicator = ({ dangerMode }) => {
    const [status, setStatus] = useState('connecting');
    const [uptime, setUptime] = useState(0);
    useEffect(() => {
        let timer;
        const transition = () => {
            if (status === 'connecting') {
                timer = setTimeout(() => setStatus('online'), 1500);
            } else if (status === 'online') {
                timer = setTimeout(() => setStatus('offline'), 5000 + Math.random() * 10000);
            } else if (status === 'offline') {
                timer = setTimeout(() => setStatus('reconnecting'), 2000);
            } else if (status === 'reconnecting') {
                timer = setTimeout(() => {
                    setStatus('online');
                    setUptime(0);
                }, 1000 + Math.random() * 2000);
            }
        };
        transition();
        return () => clearTimeout(timer);
    }, [status]);
    useEffect(() => {
        let interval;
        if (status === 'online') {
            interval = setInterval(() => setUptime(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [status]);
    const statusConfig = {
        connecting: { color: 'text-[#fbbf24]', dot: 'bg-[#fbbf24]', border: 'border-[#fbbf24]/30', label: 'CONNECTING' },
        online: { color: 'text-[#4ade80]', dot: 'bg-[#4ade80]', border: 'border-[#4ade80]/30', label: 'ONLINE' },
        offline: { color: 'text-red-400', dot: 'bg-red-400', border: 'border-red-500/30', label: 'OFFLINE' },
        reconnecting: { color: 'text-[#f97316]', dot: 'bg-[#f97316]', border: 'border-[#f97316]/30', label: 'RECONNECTING' },
    }[status];
    const isActive = status === 'online';
    const isConnecting = status === 'connecting' || status === 'reconnecting';
    return (
        <div className={`bg-[#0a0f18]/60 border rounded p-3 transition-all duration-300 ${statusConfig.border}`}>
            <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-tech font-bold text-[#475569] tracking-[0.2em] uppercase">System Link</span>
                <span className={`text-[10px] font-bold flex items-center gap-1.5 ${statusConfig.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${isActive ? '' : 'animate-pulse'}`} />
                    {statusConfig.label}
                </span>
            </div>
            <div className="flex gap-1 mb-2.5 h-5 items-end">
                {[1, 2, 3, 4, 5].map((_, i) => {
                    const activeBars = isActive ? 5 : (isConnecting ? i < 2 : 0);
                    return (
                        <div
                            key={i}
                            className={`w-1.5 rounded-sm transition-all duration-300 ${i < activeBars ? 'bg-[#4ade80]' : 'bg-[#1e293b]'}`}
                            style={{ height: `${(i + 1) * 4}px` }}
                        />
                    );
                })}
                <span className="ml-auto text-[8px] text-[#475569] tracking-wider">
                    {isActive ? 'STABLE' : isConnecting ? 'WEAK' : 'NO SIGNAL'}
                </span>
            </div>
            <div className="flex gap-2 text-[9px] border-t border-[#1e293b]/40 pt-2">
                <div className="flex-1">
                    <span className="block text-[7px] uppercase text-[#334155] tracking-wider mb-0.5">Latency</span>
                    <span className={`font-bold tabular-nums ${isActive ? 'text-[#94a3b8]' : 'text-[#334155]'}`}>
                        {isActive ? '14ms' : '---'}
                    </span>
                </div>
                <div className="flex-1">
                    <span className="block text-[7px] uppercase text-[#334155] tracking-wider mb-0.5">Pkt Loss</span>
                    <span className={`font-bold tabular-nums ${isActive ? 'text-[#94a3b8]' : 'text-red-400'}`}>
                        {isActive ? '0%' : '100%'}
                    </span>
                </div>
                <div className="flex-1">
                    <span className="block text-[7px] uppercase text-[#334155] tracking-wider mb-0.5">Uptime</span>
                    <span className={`font-bold tabular-nums ${isActive ? 'text-[#94a3b8]' : 'text-[#334155]'}`}>
                        {isActive ? `${Math.floor(uptime / 60)}m ${uptime % 60}s` : '---'}
                    </span>
                </div>
            </div>
        </div>
    );
};
export default ConnectionIndicator;