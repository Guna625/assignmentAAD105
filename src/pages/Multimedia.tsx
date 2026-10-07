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
  Mouse,
  Square,
  Circle,
  Triangle,
  RotateCw,
} from 'lucide-react';

export function Multimedia() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Multimedia Showcase</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
          A responsive page demonstrating audio playback, video, images, CSS animations, and
          an interactive graphics canvas — all in one place.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <AudioPlayer />
        <VideoPlayer />
        <ImageGallery />
        <AnimationShowcase />
        <InteractiveCanvas />
      </div>
    </div>
  );
}

/* ---------- Audio Player ---------- */

function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrent(audio.currentTime);
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };
    const onLoaded = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  }

  function fmt(s: number) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
          <Music className="w-4 h-4 text-sky-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Audio Player</h3>
          <p className="text-xs text-slate-400">HTML5 audio with custom controls</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <div
            className={`w-full h-full rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center ${
              playing ? 'animate-pulse-ring' : ''
            }`}
          >
            <Music className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-slate-900 text-sm truncate">Ambient Sample</div>
          <div className="text-xs text-slate-400">Royalty-free audio</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div
          onClick={seek}
          className="h-1.5 bg-slate-200 rounded-full cursor-pointer overflow-hidden group"
        >
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-sky-600 group-hover:from-sky-500 group-hover:to-sky-700 transition-colors"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>{fmt(current)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button
          onClick={toggleMute}
          className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <div className="flex-1" />
        <span className="badge bg-sky-50 text-sky-600">
          {playing ? 'Playing' : 'Paused'}
        </span>
      </div>

      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" preload="metadata" />
    </div>
  );
}

/* ---------- Video Player ---------- */

function VideoPlayer() {
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
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Video className="w-4 h-4 text-emerald-500" />
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
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          poster="https://images.pexels.com/photos/73830/lily-flowers-branch-blossom-73830.jpeg?auto=compress&cs=tinysrgb&w=800"
        />
        {!playing && (
          <button
            onClick={toggle}
            className="absolute inset-0 flex items-center justify-center bg-slate-900/30 transition-opacity"
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
              <Play className="w-7 h-7 text-slate-900 ml-1" />
            </div>
          </button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Big Buck Bunny (sample video)</span>
        <span className="badge bg-emerald-50 text-emerald-600">
          {playing ? 'Playing' : 'Stopped'}
        </span>
      </div>
    </div>
  );
}

/* ---------- Image Gallery ---------- */

function ImageGallery() {
  const [selected, setSelected] = useState(0);
  const [images, setImages] = useState<{ url: string; alt: string }[]>([]);

  useEffect(() => {
    fetch('https://picsum.photos/v2/list?page=1&limit=6')
      .then((r) => r.json())
      .then((data) => {
        setImages(
          data.map((d: { download_url: string; author: string }) => ({
            url: `https://picsum.photos/id/${d.download_url.match(/id\/(\d+)/)?.[1]}/600/400`,
            alt: d.author,
          }))
        );
      })
      .catch(() => {
        setImages(
          Array.from({ length: 6 }).map((_, i) => ({
            url: `https://picsum.photos/seed/${i}/600/400`,
            alt: `Image ${i + 1}`,
          }))
        );
      });
  }, []);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Image Gallery</h3>
          <p className="text-xs text-slate-400">Responsive grid with lightbox</p>
        </div>
      </div>

      {images.length > 0 ? (
        <>
          <div className="rounded-xl overflow-hidden mb-3 aspect-video bg-slate-100">
            <img
              src={images[selected].url}
              alt={images[selected].alt}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>
          <div className="grid grid-cols-6 gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`
                  aspect-square rounded-lg overflow-hidden transition-all
                  ${i === selected ? 'ring-2 ring-slate-900 ring-offset-1' : 'opacity-60 hover:opacity-100'}
                `}
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

/* ---------- Animation Showcase ---------- */

function AnimationShowcase() {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-rose-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">CSS Animations</h3>
          <p className="text-xs text-slate-400">Float, spin, pulse & morph</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AnimCard label="Float" bg="from-sky-400 to-sky-600">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 animate-float" />
        </AnimCard>
        <AnimCard label="Spin Slow" bg="from-emerald-400 to-emerald-600">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin-slow" />
        </AnimCard>
        <AnimCard label="Pulse Ring" bg="from-amber-400 to-amber-600">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 animate-pulse-ring" />
        </AnimCard>
        <AnimCard label="Morph" bg="from-rose-400 to-rose-600">
          <div
            className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600"
            style={{ animation: 'morph 3s ease-in-out infinite', borderRadius: '30%' }}
          />
        </AnimCard>
      </div>

      <style>{`
        @keyframes morph {
          0%, 100% { border-radius: 30%; transform: rotate(0deg); }
          50% { border-radius: 50%; transform: rotate(180deg); }
        }
      `}</style>
    </div>
  );
}

function AnimCard({ label, children }: { label: string; bg: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex flex-col items-center gap-3">
      <div className="h-16 flex items-center justify-center">{children}</div>
      <span className="text-xs font-medium text-slate-500">{label}</span>
    </div>
  );
}

/* ---------- Interactive Canvas ---------- */

function InteractiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shape, setShape] = useState<'circle' | 'square' | 'triangle'>('circle');
  const [color, setColor] = useState('#0ea5e9');
  const [drawing, setDrawing] = useState(false);
  const [size, setSize] = useState(20);
  const [cleared, setCleared] = useState(false);

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
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  function drawShape(x: number, y: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = color;

    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === 'square') {
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    } else if (shape === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x - size / 2, y + size / 2);
      ctx.lineTo(x + size / 2, y + size / 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!drawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    drawShape(e.clientX - rect.left, e.clientY - rect.top);
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    setDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    drawShape(e.clientX - rect.left, e.clientY - rect.top);
  }

  function handleTouch(e: React.TouchEvent<HTMLCanvasElement>) {
    const touch = e.touches[0];
    if (!touch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    drawShape(touch.clientX - rect.left, touch.clientY - rect.top);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setCleared(true);
    setTimeout(() => setCleared(false), 1000);
  }

  const shapes: { id: typeof shape; icon: typeof Circle; label: string }[] = [
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'square', icon: Square, label: 'Square' },
    { id: 'triangle', icon: Triangle, label: 'Triangle' },
  ];

  const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="card p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <Mouse className="w-4 h-4 text-violet-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Interactive Graphics Canvas</h3>
            <p className="text-xs text-slate-400">Draw shapes by clicking and dragging</p>
          </div>
        </div>
        <button
          onClick={clearCanvas}
          className="btn-ghost flex items-center gap-1.5"
        >
          <RotateCw className="w-3.5 h-3.5" /> {cleared ? 'Cleared!' : 'Clear'}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex gap-1.5">
          {shapes.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setShape(s.id)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5
                  ${
                    shape === s.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="h-5 w-px bg-slate-200" />

        <div className="flex gap-1.5">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full transition-all ${
                color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="h-5 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Size</span>
          <input
            type="range"
            min="5"
            max="60"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-24 accent-slate-900"
          />
          <span className="text-xs font-mono text-slate-600 w-8">{size}px</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={() => setDrawing(false)}
          onMouseLeave={() => setDrawing(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
          className="w-full h-64 cursor-crosshair touch-none block"
        />
      </div>
    </div>
  );
}
