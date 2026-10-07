import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Video,
  Image as ImageIcon,
  Sparkles,
  MousePointer2,
  Brush,
  Eraser,
  Download,
} from 'lucide-react';

export function MultimediaFriend() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Multimedia Experience</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
          A responsive page featuring audio, video, image gallery, CSS animations, and an
          interactive drawing pad — all in one place.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <AudioPlayerFriend />
        <VideoPlayerFriend />
        <GalleryFriend />
        <AnimationGrid />
        <DrawingPad />
      </div>
    </div>
  );
}

/* ---------- Audio ---------- */

function AudioPlayerFriend() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      setCurrent(a.currentTime);
      setProgress((a.currentTime / (a.duration || 1)) * 100);
    };
    const onLoaded = () => setDuration(a.duration);
    const onEnd = () => setPlaying(false);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onLoaded);
    a.addEventListener('ended', onEnd);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onLoaded);
      a.removeEventListener('ended', onEnd);
    };
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause();
    else a.play();
    setPlaying(!playing);
  }

  function toggleMute() {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - rect.left) / rect.width) * a.duration;
  }

  function fmt(s: number) {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Music className="w-4 h-4 text-emerald-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Audio Player</h3>
          <p className="text-xs text-slate-400">Custom HTML5 audio controls</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center ${playing ? 'animate-pulse-ring' : ''}`}>
          <Music className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-slate-900 text-sm truncate">SoundHelix Song 1</div>
          <div className="text-xs text-slate-400">Royalty-free</div>
        </div>
      </div>

      <div className="mb-3">
        <div onClick={seek} className="h-1.5 bg-slate-200 rounded-full cursor-pointer overflow-hidden group">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-600" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>{fmt(current)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggle} className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors">
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button onClick={toggleMute} className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <div className="flex-1" />
        <span className="badge bg-emerald-50 text-emerald-600">{playing ? 'Playing' : 'Paused'}</span>
      </div>

      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" preload="metadata" />
    </div>
  );
}

/* ---------- Video ---------- */

function VideoPlayerFriend() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.pause();
    else v.play();
    setPlaying(!playing);
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
          <Video className="w-4 h-4 text-teal-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Video Player</h3>
          <p className="text-xs text-slate-400">Responsive HTML5 video</p>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video mb-3 group">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        {!playing && (
          <button onClick={toggle} className="absolute inset-0 flex items-center justify-center bg-slate-900/30">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
              <Play className="w-7 h-7 text-emerald-600 ml-1" />
            </div>
          </button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">For Bigger Blazes (sample)</span>
        <span className="badge bg-teal-50 text-teal-600">{playing ? 'Playing' : 'Stopped'}</span>
      </div>
    </div>
  );
}

/* ---------- Gallery ---------- */

function GalleryFriend() {
  const [selected, setSelected] = useState(0);
  const [images, setImages] = useState<{ url: string; alt: string }[]>([]);

  useEffect(() => {
    setImages(
      Array.from({ length: 6 }).map((_, i) => ({
        url: `https://picsum.photos/seed/friend${i + 10}/600/400`,
        alt: `Photo ${i + 1}`,
      }))
    );
  }, []);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Image Gallery</h3>
          <p className="text-xs text-slate-400">Click thumbnails to browse</p>
        </div>
      </div>

      {images.length > 0 ? (
        <>
          <div className="rounded-xl overflow-hidden mb-3 aspect-video bg-slate-100">
            <img key={selected} src={images[selected].url} alt={images[selected].alt} className="w-full h-full object-cover animate-fade-in" />
          </div>
          <div className="grid grid-cols-6 gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`aspect-square rounded-lg overflow-hidden transition-all ${i === selected ? 'ring-2 ring-emerald-500 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
              >
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="aspect-video rounded-xl bg-slate-100 animate-pulse" />
      )}
    </div>
  );
}

/* ---------- Animations ---------- */

function AnimationGrid() {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-rose-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">CSS Animations</h3>
          <p className="text-xs text-slate-400">Bounce, rotate, glow & wave</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex flex-col items-center gap-3">
          <div className="h-16 flex items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600" style={{ animation: 'bounceAlt 1.5s ease-in-out infinite' }} />
          </div>
          <span className="text-xs font-medium text-slate-500">Bounce</span>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex flex-col items-center gap-3">
          <div className="h-16 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent" style={{ animation: 'spin 3s linear infinite' }} />
          </div>
          <span className="text-xs font-medium text-slate-500">Rotate</span>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex flex-col items-center gap-3">
          <div className="h-16 flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-400" style={{ animation: 'glowAlt 2s ease-in-out infinite' }} />
          </div>
          <span className="text-xs font-medium text-slate-500">Glow</span>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex flex-col items-center gap-3">
          <div className="h-16 flex items-center justify-center">
            <div className="flex gap-1">
              {[0, 1, 2].map((j) => (
                <div key={j} className="w-3 h-12 rounded-full bg-gradient-to-b from-emerald-400 to-teal-600" style={{ animation: `waveAlt 1.2s ease-in-out ${j * 0.15}s infinite` }} />
              ))}
            </div>
          </div>
          <span className="text-xs font-medium text-slate-500">Wave</span>
        </div>
      </div>

      <style>{`
        @keyframes bounceAlt {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes glowAlt {
          0%, 100% { box-shadow: 0 0 5px rgb(16 185 129 / 0.3); }
          50% { box-shadow: 0 0 25px rgb(16 185 129 / 0.8); }
        }
        @keyframes waveAlt {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.4); }
        }
      `}</style>
    </div>
  );
}

/* ---------- Drawing Pad ---------- */

function DrawingPad() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState('#059669');
  const [size, setSize] = useState(4);
  const [drawing, setDrawing] = useState(false);
  const [eraser, setEraser] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  function getPos(e: React.MouseEvent | React.TouchEvent): { x: number; y: number } {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    setDrawing(true);
    lastPos.current = getPos(e);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !lastPos.current) return;
    const pos = getPos(e);
    ctx.strokeStyle = eraser ? '#ffffff' : color;
    ctx.lineWidth = eraser ? size * 4 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  }

  function stopDraw() {
    setDrawing(false);
    lastPos.current = null;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  }

  const colors = ['#059669', '#0d9488', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#0f172a'];

  return (
    <div className="card p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Brush className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Interactive Drawing Pad</h3>
            <p className="text-xs text-slate-400">Draw with mouse or touch</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEraser(!eraser)} className={`btn-ghost flex items-center gap-1.5 ${eraser ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : ''}`}>
            <Eraser className="w-3.5 h-3.5" /> Eraser
          </button>
          <button onClick={clearCanvas} className="btn-ghost">Clear</button>
          <button onClick={download} className="btn-ghost flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex gap-1.5">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setEraser(false); }}
              className={`w-6 h-6 rounded-full transition-all ${color === c && !eraser ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="h-5 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Brush size</span>
          <input type="range" min="1" max="20" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-24 accent-emerald-600" />
          <span className="text-xs font-mono text-slate-600 w-8">{size}px</span>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onMouseMove={draw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          className="w-full h-64 cursor-crosshair touch-none block"
        />
      </div>
    </div>
  );
}
