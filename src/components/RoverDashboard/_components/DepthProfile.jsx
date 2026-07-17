import React, { useState, useEffect, useRef } from 'react';
const MAX_POINTS = 60;
const DepthProfile = ({ dangerMode, depth, depthFault }) => {
    const [history, setHistory] = useState(() =>
        Array.from({ length: MAX_POINTS }, (_, i) => ({ t: i, d: depth }))
    );
    const tickRef = useRef(0);
    useEffect(() => {
        tickRef.current += 1;
        setHistory(prev => {
            const next = [...prev, { t: tickRef.current, d: depth }];
            return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
        });
    }, [depth]);
    const buildPolyline = () => {
        if (history.length < 2) return '';
        const minD = Math.min(...history.map(p => p.d));
        const maxD = Math.max(...history.map(p => p.d));
        const range = maxD - minD || 1;
        return history.map((p, i) => {
            const x = (i / (MAX_POINTS - 1)) * 100;
            const y = 5 + ((p.d - minD) / range) * 90;
            return `${x},${y}`;
        }).join(' ');
    };
    const polyline = buildPolyline();
    const minDepth = history.length ? Math.min(...history.map(p => p.d)).toFixed(1) : depth;
    const maxDepth = history.length ? Math.max(...history.map(p => p.d)).toFixed(1) : depth;
    const color = depthFault ? '#ef4444' : '#00e5ff';
    return (
        <div className="flex-1 flex flex-col">
            <div className={`flex items-center justify-between border-l-2 pl-2 mb-2 transition-colors duration-500 ${depthFault ? 'border-red-500/60' : 'border-[#00e5ff]'}`}>
                <h3 className={`text-sm font-tech font-bold tracking-[0.2em] transition-colors duration-500 ${depthFault ? 'text-red-400/80 animate-pulse' : 'text-[#e2e8f0]'}`}>
                    DEPTH PROFILE
                </h3>
                <span className={`text-10px] tracking-wider font-bold ${depthFault ? 'text-red-400/60' : 'text-[#a3b3ca]'}`}>
                    T-60S
                </span>
            </div>
            <div className={`flex-1 border bg-[#0a0f18]/60 rounded p-3 relative min-h-[150px] flex flex-col transition-all duration-500 ${depthFault ? 'border-red-500/30 glow-red' : 'border-[#1e293b]/60 hover:border-[#1e293b]'}`}>
                <div className="absolute inset-0 rounded overflow-hidden pointer-events-none">
                    <div className={`w-full h-full ${dangerMode ? 'cyber-grid-red' : 'cyber-grid'} opacity-20`} />
                </div>
                <div className="absolute top-3 left-1 bottom-5 flex flex-col justify-between text-[8.5px] text-[#ffffff] pointer-events-none z-10 tabular-nums">
                    <span>{minDepth}</span>
                    <span>{((parseFloat(minDepth) + parseFloat(maxDepth)) / 2).toFixed(1)}</span>
                    <span>{maxDepth}</span>
                </div>
                <div className="w-full flex-1 pl-8 pr-1 pb-1 relative z-10">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id={`depth-fill-${depthFault ? 'red' : 'cyan'}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                                <stop offset="100%" stopColor={color} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {[25, 50, 75].map(y => (
                            <line key={y} x1="0" y1={y} x2="100" y2={y}
                                stroke={dangerMode ? '#2a0a0a' : '#1e293b'} strokeWidth="0.4" strokeDasharray="2 4" />
                        ))}
                        {polyline && (
                            <polygon
                                points={`${polyline} 100,100 0,100`}
                                fill={`url(#depth-fill-${depthFault ? 'red' : 'cyan'})`}
                            />
                        )}
                        {polyline && (
                            <polyline
                                points={polyline}
                                fill="none"
                                stroke={color}
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity="0.9"
                            />
                        )}
                        {history.length > 0 && (() => {
                            const last = history[history.length - 1];
                            const minD = Math.min(...history.map(p => p.d));
                            const maxD = Math.max(...history.map(p => p.d));
                            const range = maxD - minD || 1;
                            const cy = 5 + ((last.d - minD) / range) * 90;
                            return (
                                <g>
                                    <circle cx="100" cy={cy} r="3" fill={color} opacity="0.15">
                                        <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                    <circle cx="100" cy={cy} r="1.5" fill={color}>
                                        <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
                                    </circle>
                                </g>
                            );
                        })()}
                    </svg>
                </div>
                <div className="flex justify-between text-[8.5px] text-[#f2f2f2] pl-8 pr-1 tabular-nums">
                    <span>-60s</span>
                    <span>-30s</span>
                    <span>now</span>
                </div>
            </div>
        </div>
    );
};
export default DepthProfile;