import React, { useState, useEffect, useRef, useCallback } from 'react';
import CameraFeed from './_components/CameraFeed';
import CommandConsole from './_components/CommandConsole';
import ThrusterMonitor from './_components/ThrusterMonitor';
import EnvironmentalSensors from './_components/EnvironmentalSensors';
import DepthProfile from './_components/DepthProfile';
import AlarmBanner from './_components/AlarmBanner';
import StatusBar from './_components/StatusBar';
const RoverDashboard = () => {
    const [depth, setDepth] = useState(4821.5);
    const [targetDepth, setTargetDepth] = useState(15);
    const [heading, setHeading] = useState(184.2);
    const [pitch, setPitch] = useState(-2.4);
    const [roll, setRoll] = useState(0.1);
    const [yaw, setYaw] = useState(0.9);
    const [battery, setBattery] = useState(88);
    const [temp, setTemp] = useState(2.4);
    const [pressure, setPressure] = useState(482);
    const [sonarOn, setSonarOn] = useState(false);
    const [floodlightsOn, setFloodlightsOn] = useState(true);
    const [dangerMode, setDangerMode] = useState(false);
    const [leakDetected, setLeakDetected] = useState(false);
    const [activeAlarms, setActiveAlarms] = useState([]);
    const audioCtxRef = useRef(null);
    const beepIntervalRef = useRef(null);
    const [missionTime, setMissionTime] = useState(0);
    const [latency, setLatency] = useState(12);
    const [bandwidth, setBandwidth] = useState(4.2);
    const [thrusterData, setThrusterData] = useState([
        { label: 'FWD PORT', value: 42 },
        { label: 'FWD STBD', value: 42 },
        { label: 'VERT PORT', value: 15 },
        { label: 'VERT STBD', value: 15 },
    ]);
    const THRESHOLDS = {
        pitchMax: 15,
        rollMax: 15,
        batteryLow: 20,
        depthMax: 5000,
        pressureHigh: 500,
        tempHigh: 5,
    };
    const pitchFault = dangerMode && (pitch > THRESHOLDS.pitchMax || pitch < -THRESHOLDS.pitchMax);
    const rollFault = dangerMode && (roll > THRESHOLDS.rollMax || roll < -THRESHOLDS.rollMax);
    const batteryFault = dangerMode && battery <= THRESHOLDS.batteryLow;
    const depthFault = dangerMode && depth >= THRESHOLDS.depthMax;
    const pressureFault = dangerMode && pressure >= THRESHOLDS.pressureHigh;
    const tempFault = dangerMode && temp >= THRESHOLDS.tempHigh;
    useEffect(() => {
        const timer = setInterval(() => setMissionTime(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        const conn = setInterval(() => {
            setLatency(prev => Math.max(5, Math.min(50, prev + (Math.random() - 0.5) * 4)));
            setBandwidth(prev => Math.max(1, Math.min(10, prev + (Math.random() - 0.5) * 1.5)));
        }, 3000);
        return () => clearInterval(conn);
    }, []);
    const evaluateFaults = useCallback(() => {
        const faults = [];
        if (dangerMode) {
            if (pitchFault) faults.push({ type: 'CRITICAL', msg: `PITCH OUT OF RANGE: ${pitch}°` });
            if (rollFault) faults.push({ type: 'CRITICAL', msg: `ROLL OUT OF RANGE: ${roll}°` });
            if (batteryFault) faults.push({ type: 'WARNING', msg: `LOW BATTERY: ${battery}%` });
            if (depthFault) faults.push({ type: 'CRITICAL', msg: `DEPTH LIMIT EXCEEDED: ${depth}m` });
            if (pressureFault) faults.push({ type: 'WARNING', msg: `HIGH PRESSURE: ${pressure} ATM` });
            if (tempFault) faults.push({ type: 'WARNING', msg: `HIGH TEMPERATURE: ${temp}°C` });
            if (leakDetected) faults.push({ type: 'EMERGENCY', msg: 'HULL BREACH DETECTED — WATER INGRESS' });
        }
        setActiveAlarms(faults);
    }, [dangerMode, pitchFault, rollFault, batteryFault, depthFault, pressureFault, tempFault, leakDetected, pitch, roll, battery, depth, pressure, temp]);
    useEffect(() => { evaluateFaults(); }, [evaluateFaults]);
    useEffect(() => {
        if (activeAlarms.length > 0 && dangerMode && audioCtxRef.current) {
            if (!beepIntervalRef.current) {
                // Play a loud repeating two-tone beep for alarms
                beepIntervalRef.current = setInterval(() => {
                    const osc = audioCtxRef.current.createOscillator();
                    const gain = audioCtxRef.current.createGain();
                    osc.type = 'square';
                    
                    // Two-tone siren effect
                    osc.frequency.setValueAtTime(880, audioCtxRef.current.currentTime);
                    osc.frequency.setValueAtTime(1100, audioCtxRef.current.currentTime + 0.15);
                    
                    gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
                    gain.gain.linearRampToValueAtTime(0.08, audioCtxRef.current.currentTime + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.3);
                    
                    osc.connect(gain).connect(audioCtxRef.current.destination);
                    osc.start();
                    osc.stop(audioCtxRef.current.currentTime + 0.3);
                }, 600);
            }
        } else {
            if (beepIntervalRef.current) {
                clearInterval(beepIntervalRef.current);
                beepIntervalRef.current = null;
            }
        }
        return () => {
            if (beepIntervalRef.current) {
                clearInterval(beepIntervalRef.current);
                beepIntervalRef.current = null;
            }
        };
    }, [activeAlarms.length, dangerMode]);
    useEffect(() => {
        let leakTimer = null;
        if (dangerMode) {
            leakTimer = setTimeout(() => {
                setLeakDetected(true);
                appendTerminalLog('⚠ EMERGENCY: HULL BREACH DETECTED — WATER INGRESS');
            }, 3000);
        } else {
            setLeakDetected(false);
        }
        return () => { if (leakTimer) clearTimeout(leakTimer); };
    }, [dangerMode]);
    useEffect(() => {
        if (!dangerMode) return;
        const faultPush = setInterval(() => {
            setPitch(prev => {
                const spike = (Math.random() > 0.7) ? (Math.random() * 10 + 16) * (Math.random() > 0.5 ? 1 : -1) : 0;
                const nextVal = +(prev + spike + (Math.random() - 0.5) * 2).toFixed(1);
                return nextVal > 30 ? 30 : nextVal < -30 ? -30 : nextVal;
            });
            setRoll(prev => {
                const spike = (Math.random() > 0.7) ? (Math.random() * 10 + 16) * (Math.random() - 0.5) : 0;
                const nextVal = +(prev + spike + (Math.random() - 0.5) * 2).toFixed(2);
                return nextVal > 30 ? 30 : nextVal < -30 ? -30 : nextVal;
            });
            setPressure(prev => +(prev + (Math.random() - 0.3) * 2).toFixed(1));
        }, 2000);
        return () => clearInterval(faultPush);
    }, [dangerMode]);
    useEffect(() => {
        if (!dangerMode) {
            setThrusterData([
                { label: 'FWD PORT', value: 42 },
                { label: 'FWD STBD', value: 42 },
                { label: 'VERT PORT', value: 15 },
                { label: 'VERT STBD', value: 15 },
            ]);
            return;
        }
        const thrusterDeg = setInterval(() => {
            setThrusterData(prev => prev.map(t => ({
                ...t,
                value: Math.max(5, t.value + (Math.random() - 0.6) * 8),
            })));
        }, 2500);
        return () => clearInterval(thrusterDeg);
    }, [dangerMode]);
    const [logs, setLogs] = useState([
        'Initializing descent sequence...',
        'Thruster array calibrated.',
        'Systems online. Awaiting pilot input.'
    ]);
    const appendTerminalLog = React.useCallback((msg) => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogs(prev => [...prev.slice(-4), `[${timestamp}] ${msg}`]);
    }, []);
    const toggleDangerMode = () => {
        // Initialize AudioContext on user gesture to bypass browser autoplay restrictions
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }

        if (!dangerMode) {
            setDangerMode(true);
            appendTerminalLog('⚠ DANGER MODE ACTIVATED — FAULT SIMULATION ENGAGED');
        } else {
            setDangerMode(false);
            setLeakDetected(false);
            appendTerminalLog('DANGER MODE DEACTIVATED — ALL SYSTEMS NOMINAL');
        }
    };
    useEffect(() => {
        if (!dangerMode) return;
        const drain = setInterval(() => {
            setBattery(prev => Math.max(0, prev - 2));
        }, 2000);
        return () => clearInterval(drain);
    }, [dangerMode]);
    useEffect(() => {
        const handleTelemetryFeed = setInterval(() => {
            setDepth(prev => +(prev + (Math.random() - 0.48) * 0.4).toFixed(1));
            setHeading(prev => +((prev + (Math.random() - 0.5) * 0.2 + 360) % 360).toFixed(1));
            setPitch(prev => {
                const delta = (Math.random() - 0.5) * 0.5;
                const nextVal = +(prev + delta).toFixed(1);
                return nextVal > 25 ? 25 : nextVal < -25 ? -25 : nextVal;
            });
            setRoll(prev => {
                const delta = (Math.random() - 0.5) * 0.5;
                const nextVal = +(prev + delta).toFixed(2);
                return nextVal > 25 ? 25 : nextVal < -25 ? -25 : nextVal;
            });
            setYaw(prev => +(prev + (Math.random() - 0.5) * 0.05).toFixed(2));
            setTemp(prev => +(prev + (Math.random() - 0.5) * 0.02).toFixed(2));
            setPressure(prev => +(prev + (Math.random() - 0.5) * 0.1).toFixed(1));
            if (Math.random() > 0.95) setBattery(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(handleTelemetryFeed);
    }, []);
    return (
        <div className={`flex flex-col h-full w-full text-[#e2e8f0] font-mono overflow-hidden relative transition-colors duration-500 ${dangerMode ? 'bg-[#0a0000]' : 'bg-[#030712]'}`}>
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 transition-opacity duration-500 ${dangerMode ? 'opacity-[0.03]' : 'opacity-[0.02]'}`}>
                    <div className={`w-full h-full ${dangerMode ? 'bg-red-500' : 'bg-[#00e5ff]'}`} style={{
                        backgroundImage: `linear-gradient(${dangerMode ? 'rgba(239,68,68,0.03)' : 'rgba(0,229,255,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${dangerMode ? 'rgba(239,68,68,0.03)' : 'rgba(0,229,255,0.03)'} 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }} />
                </div>
            </div>
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04] z-30">
                <div className={`w-full h-[2px] animate-scanline ${dangerMode ? 'bg-red-500' : 'bg-[#00e5ff]'}`}></div>
            </div>
            {dangerMode && leakDetected && (
                <div className="absolute inset-0 pointer-events-none z-50 animate-danger-pulse border-2 border-red-500/60 rounded-lg"></div>
            )}
            <StatusBar
                dangerMode={dangerMode}
                leakDetected={leakDetected}
                activeAlarms={activeAlarms}
                missionTime={missionTime}
                latency={latency}
                bandwidth={bandwidth}
                battery={battery}
                depth={depth}
            />
            {dangerMode && <AlarmBanner alarms={activeAlarms} />}
            <div className="flex flex-col xl:flex-row flex-1 min-h-0 p-3 gap-3 relative z-10 overflow-y-auto xl:overflow-hidden hide-scrollbar">
                <div className="flex flex-col flex-1 min-w-0 gap-3">
                    <CameraFeed
                        depth={depth}
                        heading={heading}
                        pitch={pitch}
                        roll={roll}
                        yaw={yaw}
                        battery={battery}
                        dangerMode={dangerMode}
                        leakDetected={leakDetected}
                        pitchFault={pitchFault}
                        rollFault={rollFault}
                        batteryFault={batteryFault}
                        depthFault={depthFault}
                    />
                    <div className={`h-48 overflow-y-auto ${dangerMode ? 'danger-scrollbar' : 'custom-scrollbar'}`}>
                        <CommandConsole
                            depth={depth}
                            targetDepth={targetDepth}
                            setTargetDepth={setTargetDepth}
                            floodlightsOn={floodlightsOn}
                            setFloodlightsOn={setFloodlightsOn}
                            appendTerminalLog={appendTerminalLog}
                            dangerMode={dangerMode}
                            toggleDangerMode={toggleDangerMode}
                            activeAlarms={activeAlarms}
                        />
                    </div>
                </div>
                <div className={`w-full xl:w-[400px] shrink-0 overflow-y-visible xl:overflow-y-auto ${dangerMode ? 'danger-scrollbar' : 'custom-scrollbar'} bg-[#060b12]/90 backdrop-blur-md rounded-md p-4 flex flex-col gap-5 relative z-10 transition-all duration-500 ${dangerMode ? 'border border-red-500/30 glow-red' : 'border border-[#00e5ff]/15 glow-cyan'}`}>
                    <ThrusterMonitor thrusterTelemetry={thrusterData} dangerMode={dangerMode} />
                    <EnvironmentalSensors temp={temp} pressure={pressure} sonarOn={sonarOn} dangerMode={dangerMode} leakDetected={leakDetected} tempFault={tempFault} pressureFault={pressureFault} />
                    <DepthProfile dangerMode={dangerMode} depth={depth} depthFault={depthFault} />
                </div>
            </div>
        </div>
    );
};
export default RoverDashboard;