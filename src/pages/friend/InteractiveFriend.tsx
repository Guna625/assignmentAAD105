import { useState, useEffect, useRef } from 'react';
import {
  Dice5,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Keyboard,
  ListTodo,
  Plus,
  Check,
  X,
  RotateCw,
  Quote,
  Shuffle,
} from 'lucide-react';

export function InteractiveFriend() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Interactive Playground</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
          A collection of interactive mini-tools built with HTML, CSS, and JavaScript —
          responsive and fun to use.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <DiceRoller />
        <ToggleTheme />
        <TodoList />
        <TypingTest />
        <QuoteGenerator />
      </div>
    </div>
  );
}

/* ---------- Dice Roller ---------- */

function DiceRoller() {
  const [dice, setDice] = useState([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  function roll() {
    setRolling(true);
    const interval = setInterval(() => {
      setDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]);
    }, 80);
    setTimeout(() => {
      clearInterval(interval);
      const final = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
      setDice(final);
      setHistory([final[0] + final[1], ...history].slice(0, 8));
      setRolling(false);
    }, 600);
  }

  const total = dice[0] + dice[1];
  const dots = [
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, true, false, false, false, false],
    [true, false, false, false, false, false, false, false, true],
    [true, false, false, false, true, false, false, false, true],
    [true, false, false, false, true, false, false, false, true],
    [true, false, true, false, false, false, true, false, true],
    [true, false, true, false, true, false, true, false, true],
  ];

  function Die({ value }: { value: number }) {
    return (
      <div className={`w-20 h-20 bg-white rounded-2xl shadow-lg border-2 border-slate-200 grid grid-cols-3 gap-0 p-2.5 ${rolling ? 'animate-pulse' : ''}`}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {dots[value][i] && <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Dice5 className="w-4 h-4 text-emerald-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Dice Roller</h3>
          <p className="text-xs text-slate-400">Roll two dice with animation</p>
        </div>
      </div>

      <div className="flex flex-col items-center py-4">
        <div className="flex gap-4 mb-4">
          <Die value={dice[0]} />
          <Die value={dice[1]} />
        </div>
        <div className="text-3xl font-bold text-slate-900 mb-4 tabular-nums">
          Total: <span className="text-emerald-600">{total}</span>
        </div>
        <button onClick={roll} disabled={rolling} className="btn-primary flex items-center gap-2" style={{ background: '#059669' }}>
          <RotateCw className={`w-4 h-4 ${rolling ? 'animate-spin' : ''}`} /> Roll Dice
        </button>
      </div>

      {history.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-400 mb-2">Recent rolls</div>
          <div className="flex gap-1.5 flex-wrap">
            {history.map((h, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-mono font-semibold">
                {h}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Theme Toggle ---------- */

function ToggleTheme() {
  const [dark, setDark] = useState(false);
  const [color, setColor] = useState('emerald');

  const themes = [
    { name: 'emerald', bg: '#059669', text: 'Emerald' },
    { name: 'teal', bg: '#0d9488', text: 'Teal' },
    { name: 'blue', bg: '#2563eb', text: 'Blue' },
    { name: 'rose', bg: '#e11d48', text: 'Rose' },
    { name: 'amber', bg: '#d97706', text: 'Amber' },
  ];

  const active = themes.find((t) => t.name === color)!;
  const bg = dark ? '#0f172a' : active.bg;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
          <ToggleLeft className="w-4 h-4 text-teal-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Theme Switcher</h3>
          <p className="text-xs text-slate-400">Toggle dark mode & accent colors</p>
        </div>
      </div>

      <div
        className="rounded-2xl p-6 mb-4 transition-all duration-500"
        style={{ backgroundColor: dark ? '#1e293b' : bg }}
      >
        <div className="flex items-center justify-between text-white">
          <div>
            <div className="text-xs opacity-70 mb-1">Preview</div>
            <div className="text-lg font-semibold">{dark ? 'Dark Mode' : `${active.text} Theme`}</div>
          </div>
          <button onClick={() => setDark(!dark)} className="text-white">
            {dark ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
          </button>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {themes.map((t) => (
          <button
            key={t.name}
            onClick={() => { setColor(t.name); setDark(false); }}
            className={`w-9 h-9 rounded-full transition-all ${color === t.name && !dark ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110'}`}
            style={{ backgroundColor: t.bg }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Todo List ---------- */

function TodoList() {
  const [todos, setTodos] = useState<{ id: number; text: string; done: boolean }[]>([
    { id: 1, text: 'Finish assignment', done: false },
    { id: 2, text: 'Submit before deadline', done: false },
  ]);
  const [input, setInput] = useState('');

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input.trim(), done: false }]);
    setInput('');
  }

  function toggle(id: number) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function remove(id: number) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <ListTodo className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Todo List</h3>
            <p className="text-xs text-slate-400">{remaining} tasks remaining</p>
          </div>
        </div>
      </div>

      <form onSubmit={add} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          className="input-field flex-1"
        />
        <button type="submit" className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors flex-shrink-0">
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
        {todos.length === 0 ? (
          <p className="text-center text-slate-300 text-sm py-8">No tasks yet. Add one above!</p>
        ) : (
          todos.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 group transition-all hover:bg-slate-100"
            >
              <button
                onClick={() => toggle(t.id)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  t.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-emerald-400'
                }`}
              >
                {t.done && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className={`text-sm flex-1 ${t.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                {t.text}
              </span>
              <button
                onClick={() => remove(t.id)}
                className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------- Typing Speed Test ---------- */

function TypingTest() {
  const SAMPLES = [
    'The quick brown fox jumps over the lazy dog near the river bank.',
    'Programming is the art of telling a computer what to do step by step.',
    'A journey of a thousand miles begins with a single careful step forward.',
  ];
  const [sample] = useState(SAMPLES[Math.floor(Math.random() * SAMPLES.length)]);
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (startTime === null) setStartTime(Date.now());
    setTyped(val);
    if (val === sample) setDone(true);
  }

  function reset() {
    setTyped('');
    setStartTime(null);
    setDone(false);
    inputRef.current?.focus();
  }

  const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
  const wpm = done && elapsed > 0 ? Math.round((sample.split(' ').length / elapsed) * 60) : 0;
  const accuracy = typed.length > 0
    ? Math.round((typed.split('').filter((c, i) => c === sample[i]).length / typed.length) * 100)
    : 100;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
          <Keyboard className="w-4 h-4 text-sky-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Typing Speed Test</h3>
          <p className="text-xs text-slate-400">Type the sentence below</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-4">
        <p className="text-sm leading-relaxed font-mono">
          {sample.split('').map((c, i) => {
            let cls = 'text-slate-400';
            if (i < typed.length) {
              cls = typed[i] === c ? 'text-emerald-600' : 'text-red-500 bg-red-50 rounded';
            }
            if (i === typed.length) cls = 'text-slate-700 border-b-2 border-emerald-400';
            return <span key={i} className={cls}>{c}</span>;
          })}
        </p>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={handleChange}
        disabled={done}
        placeholder="Start typing here..."
        className="input-field mb-4 font-mono"
        autoFocus
      />

      <div className="flex items-center justify-between">
        {done ? (
          <div className="flex gap-4">
            <div className="text-sm">
              <span className="text-slate-400">Speed: </span>
              <span className="font-bold text-emerald-600 text-lg">{wpm} WPM</span>
            </div>
            <div className="text-sm">
              <span className="text-slate-400">Accuracy: </span>
              <span className="font-bold text-slate-900 text-lg">{accuracy}%</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400">
            {typed.length > 0 ? `${typed.length} / ${sample.length} characters` : 'Click and start typing'}
          </div>
        )}
        <button onClick={reset} className="btn-ghost flex items-center gap-1.5">
          <RotateCw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>
    </div>
  );
}

/* ---------- Quote Generator ---------- */

function QuoteGenerator() {
  const QUOTES = [
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: 'Code is like humor. When you have to explain it, it\'s bad.', author: 'Cory House' },
    { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
    { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
    { text: 'Experience is the name everyone gives to their mistakes.', author: 'Oscar Wilde' },
    { text: 'The best error message is the one that never shows up.', author: 'Thomas Fuchs' },
    { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
    { text: 'Programs must be written for people to read.', author: 'Harold Abelson' },
  ];

  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  function next() {
    setFade(false);
    setTimeout(() => {
      setIdx((prev) => (prev + 1) % QUOTES.length);
      setFade(true);
    }, 200);
  }

  const q = QUOTES[idx];

  return (
    <div className="card p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <Quote className="w-4 h-4 text-violet-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Quote Generator</h3>
            <p className="text-xs text-slate-400">Random coding wisdom</p>
          </div>
        </div>
        <button onClick={next} className="btn-primary flex items-center gap-2" style={{ background: '#059669' }}>
          <Shuffle className="w-4 h-4" /> New Quote
        </button>
      </div>

      <div className={`rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-8 text-center transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <Quote className="w-8 h-8 text-emerald-300 mx-auto mb-4" />
        <p className="text-lg font-medium text-slate-800 leading-relaxed mb-3">
          "{q.text}"
        </p>
        <p className="text-sm text-emerald-600 font-medium">— {q.author}</p>
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {QUOTES.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-emerald-500 w-4' : 'bg-slate-200'}`}
          />
        ))}
      </div>
    </div>
  );
}
