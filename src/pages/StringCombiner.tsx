import { useState } from 'react';
import { Type, ArrowRight, Copy, Check, Shuffle, Trash2 } from 'lucide-react';

export function StringCombiner() {
  const [str1, setStr1] = useState('');
  const [str2, setStr2] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  function combineAlt(a: string, b: string): string {
    let out = '';
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i++) {
      if (i < a.length) out += a[i];
      if (i < b.length) out += b[i];
    }
    return out;
  }

  function handleCombine() {
    setResult(combineAlt(str1, str2));
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClear() {
    setStr1('');
    setStr2('');
    setResult('');
  }

  // Live preview while typing
  const livePreview = str1 || str2 ? combineAlt(str1, str2) : '';

  function fillExample() {
    setStr1('Hello');
    setStr2('World');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Alternate String Combiner</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
          Enter two strings and they will be merged character-by-character in alternating
          order. If one string is longer, the remaining characters are appended at the end.
        </p>
      </div>

      <div className="card p-8">
        {/* Input fields */}
        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 mb-2">
              <span className="w-5 h-5 rounded-md bg-sky-100 text-sky-600 flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              First String
            </label>
            <input
              type="text"
              value={str1}
              onChange={(e) => setStr1(e.target.value)}
              placeholder="e.g. Hello"
              className="input-field"
            />
            <div className="mt-1.5 text-xs text-slate-400 font-mono">
              length: {str1.length}
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 mb-2">
              <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              Second String
            </label>
            <input
              type="text"
              value={str2}
              onChange={(e) => setStr2(e.target.value)}
              placeholder="e.g. World"
              className="input-field"
            />
            <div className="mt-1.5 text-xs text-slate-400 font-mono">
              length: {str2.length}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleCombine}
            disabled={!str1 && !str2}
            className="btn-primary flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" /> Combine Alternately
          </button>
          <button onClick={fillExample} className="btn-ghost flex items-center gap-2">
            <Type className="w-3.5 h-3.5" /> Try Example
          </button>
          {(str1 || str2) && (
            <button onClick={handleClear} className="btn-ghost flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Visual character mapping */}
        {(str1 || str2) && (
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-medium text-slate-500 mb-3">Character Mapping</div>
            <div className="flex flex-wrap gap-1.5 items-center">
              {Array.from({ length: Math.max(str1.length, str2.length) }).map((_, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {i < str1.length && (
                    <span className="w-7 h-7 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-mono font-semibold">
                      {str1[i]}
                    </span>
                  )}
                  {i < str2.length && (
                    <span className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-mono font-semibold">
                      {str2[i]}
                    </span>
                  )}
                  {i < Math.max(str1.length, str2.length) - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center bg-slate-50/30">
          <div className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wide">
            Combined Result
          </div>
          {result ? (
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <code className="text-2xl font-mono font-semibold text-slate-900 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
                {result}
              </code>
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
              </button>
            </div>
          ) : (
            <div className="text-slate-300 text-sm py-4">
              {livePreview ? (
                <span className="font-mono text-slate-400">
                  Live preview: <span className="text-slate-600">{livePreview}</span>
                </span>
              ) : (
                'Enter two strings and click "Combine Alternately"'
              )}
            </div>
          )}
        </div>

        {/* Algorithm explanation */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs leading-relaxed overflow-x-auto scrollbar-thin">
          <div className="text-slate-500 mb-2">// JavaScript logic</div>
          <pre>{`function combineAlt(a, b) {
  let out = '';
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) out += a[i];
    if (i < b.length) out += b[i];
  }
  return out;
}

// "Hello" + "World" → "HWeolrllod"`}</pre>
        </div>
      </div>
    </div>
  );
}
