import React, { useState, useEffect, useRef, useCallback } from 'react';
import CameraFeed from './_components/CameraFeed';
import CommandConsole from './_components/CommandConsole';
import ThrusterMonitor from './_components/ThrusterMonitor';
import EnvironmentalSensors from './_components/EnvironmentalSensors';
import DepthProfile from './_components/DepthProfile';
import AlarmBanner from './_components/AlarmBanner';
import ConnectionIndicator from './_components/ConnectionIndicator';

const RoverDashboard = () => {
    // Rover telemetry metrics
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

    // Pilot controls
    const [floodlightsOn, setFloodlightsOn] = useState(true);

    // Danger mode state
    const [dangerMode, setDangerMode] = useState(false);
    const [leakDetected, setLeakDetected] = useState(false);
    const [activeAlarms, setActiveAlarms] = useState([]);
    const alarmAudioRef = useRef(null);

    // Thruster data stored in state (not recalculated on every render)
    const [thrusterData, setThrusterData] = useState([
        { label: 'FWD PORT', value: 42 },
        { label: 'FWD STBD', value: 42 },
        { label: 'VERT PORT', value: 15 },
        { label: 'VERT STBD', value: 15 },
    ]);

    // Thresholds for out-of-range detection
    const THRESHOLDS = {
        pitchMax: 15,
        rollMax: 15,
        batteryLow: 20,
        depthMax: 5000,
        pressureHigh: 500,
        tempHigh: 5,
    };

    // Pre-computed fault booleans for children
    const pitchFault = dangerMode && (pitch > THRESHOLDS.pitchMax || pitch < -THRESHOLDS.pitchMax);
    const rollFault = dangerMode && (roll > THRESHOLDS.rollMax || roll < -THRESHOLDS.rollMax);
    const batteryFault = dangerMode && battery <= THRESHOLDS.batteryLow;
    const depthFault = dangerMode && depth >= THRESHOLDS.depthMax;
    const pressureFault = dangerMode && pressure >= THRESHOLDS.pressureHigh;
    const tempFault = dangerMode && temp >= THRESHOLDS.tempHigh;

    // Evaluate fault conditions
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

    useEffect(() => {
        evaluateFaults();
    }, [evaluateFaults]);

    // Play alarm sound in danger mode when emergency
    useEffect(() => {
        if (dangerMode && leakDetected) {
            if (!alarmAudioRef.current) {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.value = 880;
                gain.gain.value = 0.08;
                osc.connect(gain).connect(ctx.destination);
                osc.start();
                alarmAudioRef.current = { ctx, osc };
            }
        } else {
            if (alarmAudioRef.current) {
                alarmAudioRef.current.osc.stop();
                alarmAudioRef.current.ctx.close();
                alarmAudioRef.current = null;
            }
        }
        return () => {
            if (alarmAudioRef.current) {
                alarmAudioRef.current.osc.stop();
                alarmAudioRef.current.ctx.close();
                alarmAudioRef.current = null;
            }
        };
    }, [dangerMode, leakDetected]);

    // Simulate leak 3 seconds after entering danger mode
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

    // Push telemetry into out-of-range when danger mode is on
    useEffect(() => {
        if (!dangerMode) return;
        const faultPush = setInterval(() => {
            setPitch(prev => {
                const spike = (Math.random() > 0.7) ? (Math.random() * 10 + 16) * (Math.random() > 0.5 ? 1 : -1) : 0;
                const nextVal = +(prev + spike + (Math.random() - 0.5) * 2).toFixed(1);
                return nextVal > 30 ? 30 : nextVal < -30 ? -30 : nextVal;
            });
            setRoll(prev => {
                const spike = (Math.random() > 0.7) ? (Math.random() * 10 + 16) * (Math.random() > 0.5 ? 1 : -1) : 0;
                const nextVal = +(prev + spike + (Math.random() - 0.5) * 2).toFixed(2);
                return nextVal > 30 ? 30 : nextVal < -30 ? -30 : nextVal;
            });
            setPressure(prev => +(prev + (Math.random() - 0.3) * 2).toFixed(1));
        }, 2000);
        return () => clearInterval(faultPush);
    }, [dangerMode]);

    // Simulate thruster degradation in danger mode
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

    const toggleDangerMode = () => {
        if (!dangerMode) {
            setDangerMode(true);
            appendTerminalLog('⚠ DANGER MODE ACTIVATED — FAULT SIMULATION ENGAGED');
        } else {
            setDangerMode(false);
            setLeakDetected(false);
            appendTerminalLog('DANGER MODE DEACTIVATED — ALL SYSTEMS NOMINAL');
        }
    };

    // Simulate battery drain faster in danger mode
    useEffect(() => {
        if (!dangerMode) return;
        const drain = setInterval(() => {
            setBattery(prev => Math.max(0, prev - 2));
        }, 2000);
        return () => clearInterval(drain);
    }, [dangerMode]);

    // Handle telemetry updates simulating live data flow from the ROV
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

            if (Math.random() > 0.95) {
                setBattery(prev => Math.max(0, prev - 1));
            }
        }, 1000);

        return () => clearInterval(handleTelemetryFeed);
    }, []);

    const appendTerminalLog = (msg) => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogs(prev => [...prev.slice(-4), `[${timestamp}] ${msg}`]);
    };

    return (
        <div className={`flex h-full w-full text-[#e2e8f0] p-4 gap-4 font-mono overflow-hidden cyber-grid relative transition-colors duration-500 ${dangerMode ? 'bg-[#0a0000]' : 'bg-[#030712]'}`}>
            {/* Scanline overlay for cyber HUD feel */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
                <div className={`w-full h-[5px] animate-scanline ${dangerMode ? 'bg-red-500' : 'bg-[#00e5ff]'}`}></div>
            </div>

            {/* Danger mode red pulse overlay */}
            {dangerMode && leakDetected && (
                <div className="absolute inset-0 pointer-events-none z-50 animate-danger-pulse border-2 border-red-500/60 rounded-lg"></div>
            )}

            {/* Alarm Banner */}
            {dangerMode && <AlarmBanner alarms={activeAlarms} />}

            {/* Main Center Video & Console Feed */}
            <div className="flex flex-col flex-1 min-w-0 gap-4 relative z-10">
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

                

              <div className='h-52 overflow-y-auto'>
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

            {/* Right Side Sidebar containing Telemetry Panels */}
            <div className={`w-90 overflow-y-auto hide-scrollbar bg-[#030712]/90 backdrop-blur-md rounded-md p-4 flex flex-col gap-6 relative z-10 transition-all duration-500 ${dangerMode ? 'border border-red-500/40 glow-red' : 'border border-[#00e5ff]/20 glow-cyan'}`}>
                <ConnectionIndicator dangerMode={dangerMode} />
                <ThrusterMonitor thrusterTelemetry={thrusterData} dangerMode={dangerMode} />
                <EnvironmentalSensors temp={temp} pressure={pressure} sonarOn={sonarOn} dangerMode={dangerMode} leakDetected={leakDetected} tempFault={tempFault} pressureFault={pressureFault} />
                <DepthProfile dangerMode={dangerMode} depth={depth} depthFault={depthFault} />
            </div>
        </div>
    );
};

export default RoverDashboard;
