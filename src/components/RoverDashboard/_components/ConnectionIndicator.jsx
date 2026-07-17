import React, { useState, useEffect } from 'react';

const ConnectionIndicator = () => {
  // Simplified connection state: 'online', 'offline', 'reconnecting'
  const [status, setStatus] = useState('connecting');
  const [uptime, setUptime] = useState(0);

  // Simple state machine for connection simulation
  useEffect(() => {
    let timer;

    const transition = () => {
      if (status === 'connecting') {
        timer = setTimeout(() => setStatus('online'), 1500);
      } else if (status === 'online') {
        // Simulate random drop after 5-15 seconds
        timer = setTimeout(() => setStatus('offline'), 5000 + Math.random() * 10000);
      } else if (status === 'offline') {
        // Simulate reconnection attempt after 2 seconds
        timer = setTimeout(() => setStatus('reconnecting'), 2000);
      } else if (status === 'reconnecting') {
        // Simulate successful reconnect after 1-3 seconds
        timer = setTimeout(() => {
          setStatus('online');
          setUptime(0); // Reset uptime on successful reconnect
        }, 1000 + Math.random() * 2000);
      }
    };

    transition();

    return () => clearTimeout(timer);
  }, [status]);

  // Uptime counter
  useEffect(() => {
    let interval;
    if (status === 'online') {
      interval = setInterval(() => setUptime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const statusColor = {
    connecting: 'text-yellow-400 border-yellow-500',
    online: 'text-green-400 border-green-500',
    offline: 'text-red-400 border-red-500',
    reconnecting: 'text-orange-400 border-orange-500',
  }[status];

  const statusLabel = {
    connecting: 'Connecting',
    online: 'Online',
    offline: 'Offline',
    reconnecting: 'Reconnecting',
  }[status];

  const isActive = status === 'online';
  const isConnecting = status === 'connecting' || status === 'reconnecting';

  return (
    <div className={`bg-gray-900 border-l-4 ${statusColor} p-4 rounded shadow-sm w-full max-w-md`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          System Link
        </span>
        <span className={`text-sm font-bold flex items-center gap-2 ${statusColor}`}>
          <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-current' : 'bg-current animate-pulse'}`}></span>
          {statusLabel}
        </span>
      </div>

      {/* Signal Bars */}
      <div className="flex gap-1 mb-3 h-6 items-end">
        {[1, 2, 3, 4, 5].map((_, i) => {
          // Simple logic to fake signal strength
          const activeBars = isActive ? 5 : (isConnecting ? i < 2 : 0);
          return (
            <div
              key={i}
              className={`w-2 rounded-sm transition-all duration-300 ${
                i < activeBars ? 'bg-green-400' : 'bg-gray-700'
              }`}
              style={{ height: `${(i + 1) * 4}px` }}
            />
          );
        })}
        <span className="ml-auto text-xs text-gray-400">
          {isActive ? 'Stable' : isConnecting ? 'Weak' : 'No Signal'}
        </span>
      </div>

      {/* Statistics Row */}
      <div className="flex gap-2 text-xs text-gray-400 border-t border-gray-800 pt-2">
        <div className="flex-1">
          <span className="block text-[10px] uppercase text-gray-500">Latency</span>
          <span className="font-mono">{isActive ? '14ms' : '--'}</span>
        </div>
        <div className="flex-1">
          <span className="block text-[10px] uppercase text-gray-500">Pkt Loss</span>
          <span className="font-mono">{isActive ? '0%' : '100%'}</span>
        </div>
        <div className="flex-1">
          <span className="block text-[10px] uppercase text-gray-500">Uptime</span>
          <span className="font-mono">
            {isActive ? `${Math.floor(uptime / 60)}m ${uptime % 60}s` : '--'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConnectionIndicator;