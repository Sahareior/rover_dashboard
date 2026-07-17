import React, { useState, useEffect, useRef } from 'react';

const MAX_POINTS = 60; // 60 seconds of rolling history

const DepthProfile = ({ dangerMode, depth, depthFault }) => {
    // Rolling buffer of { time, depth } readings
    const [history, setHistory] = useState(() => {
        // Pre-fill with initial flat line so chart isn't empty on mount
        return Array.from({ length: MAX_POINTS }, (_, i) => ({
            t: i,
            d: depth,
        }));
    });

    const tickRef = useRef(0);

    useEffect(() => {
        tickRef.current += 1;
        setHistory(prev => {
            const next = [...prev, { t: tickRef.current, d: depth }];
            return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
        });
    }, [depth]);

    // Build SVG polyline from rolling depth history
    const buildPolyline = () => {
        if (history.length < 2) return '';

        const minD = Math.min(...history.map(p => p.d));
        const maxD = Math.max(...history.map(p => p.d));
        const range = maxD - minD || 1; // avoid divide-by-zero

        return history.map((p, i) => {
            const x = (i / (MAX_POINTS - 1)) * 100;
            // Invert Y: deeper = lower on chart (higher Y value in SVG)
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
            <div className={`flex items-center gap-2 border-l-2 pl-2 mb-2 transition-colors duration-500 ${depthFault ? 'border-red-500' : 'border-[#00e5ff]'}`}>
                <h3 className={`text-[11px] font-extrabold tracking-widest ${depthFault ? 'text-red-400 animate-pulse' : 'text-[#e2e8f0]'}`}>
                    DEPTH PROFILE (T-60S)
                </h3>
            </div>

            <div className={`flex-1 border bg-[#0b111a]/60 rounded p-2.5 relative min-h-[160px] flex flex-col transition-all duration-500 ${depthFault ? 'border-red-500/40' : 'border-[#1e293b]'}`}>
                <div className="absolute inset-0 cyber-grid opacity-10 rounded"></div>

                {/* Y-axis labels */}
                <div className="absolute top-2 left-1 bottom-4 flex flex-col justify-between text-[8px] text-[#64748b] pointer-events-none z-10">
                    <span>{minDepth}</span>
                    <span>{((parseFloat(minDepth) + parseFloat(maxDepth)) / 2).toFixed(1)}</span>
                    <span>{maxDepth}</span>
                </div>

                {/* SVG live chart */}
                <div className="w-full flex-1 pl-8 pr-1 pb-1 relative z-10">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id={`depth-fill-${depthFault ? 'red' : 'cyan'}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                                <stop offset="100%" stopColor={color} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Horizontal grid lines */}
                        {[25, 50, 75].map(y => (
                            <line key={y} x1="0" y1={y} x2="100" y2={y}
                                stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2 3" />
                        ))}

                        {/* Area fill under curve */}
                        {polyline && (
                            <polygon
                                points={`${polyline} 100,100 0,100`}
                                fill={`url(#depth-fill-${depthFault ? 'red' : 'cyan'})`}
                            />
                        )}

                        {/* Line */}
                        {polyline && (
                            <polyline
                                points={polyline}
                                fill="none"
                                stroke={color}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )}

                        {/* Live cursor dot at rightmost point */}
                        {history.length > 0 && (() => {
                            const last = history[history.length - 1];
                            const minD = Math.min(...history.map(p => p.d));
                            const maxD = Math.max(...history.map(p => p.d));
                            const range = maxD - minD || 1;
                            const cy = 5 + ((last.d - minD) / range) * 90;
                            return (
                                <circle cx="100" cy={cy} r="2" fill={color}>
                                    <animate attributeName="r" values="1.5;3;1.5" dur="1.5s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
                                </circle>
                            );
                        })()}
                    </svg>
                </div>

                {/* X-axis label */}
                <div className="flex justify-between text-[7px] text-[#475569] pl-8 pr-1">
                    <span>-60s</span>
                    <span>-30s</span>
                    <span>now</span>
                </div>
            </div>
        </div>
    );
};

export default DepthProfile;
