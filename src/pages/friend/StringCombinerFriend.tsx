import { useState } from 'react';
import { Shuffle, Copy, Check, Trash2, ArrowRight, Type as TypeIcon, Zap } from 'lucide-react';

export function StringCombinerFriend() {
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

  const livePreview = str1 || str2 ? combineAlt(str1, str2) : '';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Alternate String Merger</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
          Type two strings and merge them character-by-character in alternating order.
          Extra characters from the longer string are appended at the end.
        </p>
      </div>

      <div className="card p-8">
        {/* Inputs */}
        <div className="space-y-5 mb-6">
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 mb-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-[11px] font-bold">A</span>
              String One
            </label>
            <input
              type="text"
              value={str1}
              onChange={(e) => setStr1(e.target.value)}
              placeholder="e.g. ABCDEF"
              className="input-field text-lg font-mono"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 mb-2">
              <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center text-[11px] font-bold">B</span>
              String Two
            </label>
            <input
              type="text"
              value={str2}
              onChange={(e) => setStr2(e.target.value)}
              placeholder="e.g. 12345"
              className="input-field text-lg font-mono"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mb-6">
          <button onClick={handleCombine} disabled={!str1 && !str2} className="btn-primary flex items-center gap-2" style={{ background: '#059669' }}>
            <Zap className="w-4 h-4" /> Merge Strings
          </button>
          <button
            onClick={() => { setStr1('ABCDEF'); setStr2('12345'); }}
            className="btn-ghost flex items-center gap-2"
          >
            <TypeIcon className="w-3.5 h-3.5" /> Sample
          </button>
          {(str1 || str2) && (
            <button onClick={handleClear} className="btn-ghost flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Visual interleaving */}
        {(str1 || str2) && (
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
            <div className="text-xs font-medium text-emerald-700 mb-3 uppercase tracking-wide">Interleaving Visualization</div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: Math.max(str1.length, str2.length) }).map((_, i) => (
                <div key={i} className="flex items-center gap-1">
                  {i < str1.length && (
                    <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm font-mono font-bold shadow-sm">
                      {str1[i]}
                    </span>
                  )}
                  {i < str2.length && (
                    <span className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center text-sm font-mono font-bold shadow-sm">
                      {str2[i]}
                    </span>
                  )}
                  {i < Math.max(str1.length, str2.length) - 1 && (
                    <ArrowRight className="w-3 h-3 text-emerald-300" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-emerald-600">
              <span className="font-medium">Pattern:</span> A[0] → B[0] → A[1] → B[1] → ...
            </div>
          </div>
        )}

        {/* Result */}
        <div className="rounded-2xl border-2 border-dashed border-emerald-200 p-8 text-center bg-emerald-50/20">
          <div className="text-xs font-medium text-emerald-500 mb-3 uppercase tracking-wide">Merged Output</div>
          {result ? (
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <code className="text-3xl font-mono font-bold text-slate-900 bg-white px-6 py-4 rounded-2xl border border-emerald-200 shadow-sm">
                {result}
              </code>
              <button onClick={handleCopy} className="p-3 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 transition-colors">
                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-emerald-600" />}
              </button>
            </div>
          ) : (
            <div className="text-slate-300 text-sm py-4">
              {livePreview ? (
                <span className="font-mono">Live: <span className="text-emerald-600 font-semibold">{livePreview}</span></span>
              ) : (
                'Enter two strings and click "Merge Strings"'
              )}
            </div>
          )}
        </div>

        {/* Code */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs leading-relaxed overflow-x-auto scrollbar-thin">
          <div className="text-slate-500 mb-2">// JavaScript logic</div>
          <pre>{`function mergeAlt(a, b) {
  let result = '';
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) result += a[i];
    if (i < b.length) result += b[i];
  }
  return result;
}

// "ABCDEF" + "12345" → "A1B2C3D4E5F"`}</pre>
        </div>
      </div>
    </div>
  );
}
