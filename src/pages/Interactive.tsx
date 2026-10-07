import { useState, useEffect, useRef } from 'react';
import {
  Palette,
  MousePointerClick,
  Timer,
  Calculator as CalculatorIcon,
  Sparkles,
  RotateCw,
  Play,
  Shuffle,
  Hash,
} from 'lucide-react';

export function Interactive() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Interactive Playground</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
          A collection of interactive mini-apps built with HTML, CSS, and JavaScript —
          fully responsive and engaging.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ColorPalette />
        <ClickCounter />
        <Stopwatch />
        <Calculator />
        <RandomImage />
      </div>
    </div>
  );
}

/* ---------- Color Palette Generator ---------- */

function ColorPalette() {
  const [colors, setColors] = useState<string[]>(['#0f172a', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444']);
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  function randomHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  function generate() {
    setColors(colors.map((c, i) => (locked[i] ? c : randomHex())));
  }

  function toggleLock(i: number) {
    setLocked(locked.map((l, idx) => (idx === i ? !l : l)));
  }

  function copyColor(c: string, i: number) {
    navigator.clipboard.writeText(c);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <Palette className="w-4 h-4 text-violet-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Color Palette</h3>
            <p className="text-xs text-slate-400">Generate & lock colors</p>
          </div>
        </div>
        <button onClick={generate} className="btn-ghost flex items-center gap-1.5">
          <Shuffle className="w-3.5 h-3.5" /> Generate
        </button>
      </div>

      <div className="flex flex-col gap-2 h-64">
        {colors.map((c, i) => (
          <button
            key={i}
            onClick={() => copyColor(c, i)}
            className="relative flex-1 rounded-xl flex items-center justify-between px-4 group transition-all hover:scale-[1.02] cursor-pointer"
            style={{ backgroundColor: c }}
          >
            <span
              className="text-sm font-mono font-semibold"
              style={{ color: isLight(c) ? '#0f172a' : '#ffffff' }}
            >
              {copiedIdx === i ? 'Copied!' : c.toUpperCase()}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLock(i);
              }}
              className="opacity-50 group-hover:opacity-100 transition-opacity"
              style={{ color: isLight(c) ? '#0f172a' : '#ffffff' }}
            >
              {locked[i] ? '🔒' : '🔓'}
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

/* ---------- Click Counter with Effects ---------- */

function ClickCounter() {
  const [count, setCount] = useState(0);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    setCount(count + 1);
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setBursts([...bursts, { id, x, y }]);
    setTimeout(() => setBursts((b) => b.filter((burst) => burst.id !== id)), 800);
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
          <MousePointerClick className="w-4 h-4 text-sky-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Click Burst Counter</h3>
          <p className="text-xs text-slate-400">Click with particle effects</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        <div className="text-5xl font-bold text-slate-900 mb-6 tabular-nums">{count}</div>
        <button
          onClick={handleClick}
          className="relative w-32 h-32 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white font-semibold text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform overflow-visible"
        >
          Click Me
          {bursts.map((burst) => (
            <span
              key={burst.id}
              className="absolute w-2 h-2 rounded-full bg-white pointer-events-none"
              style={{
                left: burst.x,
                top: burst.y,
                animation: 'burst 0.8s ease-out forwards',
              }}
            />
          ))}
        </button>
        <button
          onClick={() => setCount(0)}
          className="btn-ghost mt-4 flex items-center gap-1.5"
        >
          <RotateCw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <style>{`
        @keyframes burst {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx, 40px)), calc(-50% + var(--ty, -40px))) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ---------- Stopwatch ---------- */

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      const start = Date.now() - elapsed;
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - start);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  function format(ms: number) {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${cs
      .toString()
      .padStart(2, '0')}`;
  }

  function lap() {
    setLaps([...laps, elapsed]);
  }

  function reset() {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Timer className="w-4 h-4 text-emerald-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Stopwatch</h3>
          <p className="text-xs text-slate-400">Precise timer with laps</p>
        </div>
      </div>

      <div className="text-center py-4">
        <div className="text-4xl font-bold font-mono text-slate-900 tabular-nums mb-1">
          {format(elapsed)}
        </div>
        <div className="text-xs text-slate-400">
          {running ? 'Running' : elapsed > 0 ? 'Paused' : 'Ready'}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setRunning(!running)}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          {running ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start'}
        </button>
        <button
          onClick={lap}
          disabled={!running}
          className="btn-ghost flex items-center gap-1.5"
        >
          Lap
        </button>
        <button onClick={reset} className="btn-ghost flex items-center gap-1.5">
          <RotateCw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className="max-h-32 overflow-y-auto scrollbar-thin space-y-1">
          {laps.map((lapTime, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 text-sm font-mono"
            >
              <span className="text-slate-400 text-xs">Lap {i + 1}</span>
              <span className="text-slate-700">{format(lapTime)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Calculator ---------- */

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState(true);

  function inputDigit(d: string) {
    if (overwrite) {
      setDisplay(d);
      setOverwrite(false);
    } else {
      setDisplay(display === '0' ? d : display + d);
    }
  }

  function inputDot() {
    if (overwrite) {
      setDisplay('0.');
      setOverwrite(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }

  function clearAll() {
    setDisplay('0');
    setPrev(null);
    setOp(null);
    setOverwrite(true);
  }

  function compute(a: number, b: number, operator: string): number {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  }

  function setOperator(nextOp: string) {
    const current = parseFloat(display);
    if (prev !== null && op && !overwrite) {
      const result = compute(prev, current, op);
      setPrev(result);
      setDisplay(String(result));
    } else {
      setPrev(current);
    }
    setOp(nextOp);
    setOverwrite(true);
  }

  function equals() {
    if (op === null || prev === null) return;
    const current = parseFloat(display);
    const result = compute(prev, current, op);
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setOverwrite(true);
  }

  function percent() {
    setDisplay(String(parseFloat(display) / 100));
  }

  function toggleSign() {
    setDisplay(String(-parseFloat(display)));
  }

  const buttons = [
    { label: 'AC', action: clearAll, type: 'fn' },
    { label: '±', action: toggleSign, type: 'fn' },
    { label: '%', action: percent, type: 'fn' },
    { label: '÷', action: () => setOperator('÷'), type: 'op' },
    { label: '7', action: () => inputDigit('7'), type: 'num' },
    { label: '8', action: () => inputDigit('8'), type: 'num' },
    { label: '9', action: () => inputDigit('9'), type: 'num' },
    { label: '×', action: () => setOperator('×'), type: 'op' },
    { label: '4', action: () => inputDigit('4'), type: 'num' },
    { label: '5', action: () => inputDigit('5'), type: 'num' },
    { label: '6', action: () => inputDigit('6'), type: 'num' },
    { label: '-', action: () => setOperator('-'), type: 'op' },
    { label: '1', action: () => inputDigit('1'), type: 'num' },
    { label: '2', action: () => inputDigit('2'), type: 'num' },
    { label: '3', action: () => inputDigit('3'), type: 'num' },
    { label: '+', action: () => setOperator('+'), type: 'op' },
    { label: '0', action: () => inputDigit('0'), type: 'num' },
    { label: '.', action: inputDot, type: 'num' },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
          <CalculatorIcon className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Calculator</h3>
          <p className="text-xs text-slate-400">Basic arithmetic operations</p>
        </div>
      </div>

      {/* Display */}
      <div className="bg-slate-900 rounded-xl p-4 mb-4 text-right">
        <div className="text-xs text-slate-500 font-mono h-4">
          {prev !== null && op ? `${prev} ${op}` : ''}
        </div>
        <div className="text-3xl font-bold font-mono text-white tabular-nums truncate">
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((b) => (
          <button
            key={b.label}
            onClick={b.action}
            className={`
              h-12 rounded-xl font-semibold text-sm transition-all active:scale-95
              ${
                b.type === 'op'
                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                  : b.type === 'fn'
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
              }
            `}
          >
            {b.label}
          </button>
        ))}
        <button
          onClick={equals}
          className="h-12 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-all active:scale-95 col-span-2"
        >
          =
        </button>
      </div>
    </div>
  );
}

/* ---------- Random Image Gallery ---------- */

function RandomImage() {
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000));
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    setImgUrl(`https://picsum.photos/seed/${seed}/500/400`);
  }, [seed]);

  function newImage() {
    setSeed(Math.floor(Math.random() * 1000));
  }

  return (
    <div className="card p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Random Image Gallery</h3>
            <p className="text-xs text-slate-400">Fetch a new image on demand</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <Hash className="w-3 h-3" />
            seed: {seed}
          </span>
          <button onClick={newImage} className="btn-ghost flex items-center gap-1.5">
            <Shuffle className="w-3.5 h-3.5" /> New Image
          </button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-slate-100 aspect-[5/3] relative">
        {imgUrl && (
          <img
            key={seed}
            src={imgUrl}
            alt="Random"
            className="w-full h-full object-cover animate-fade-in"
          />
        )}
      </div>
    </div>
  );
}
