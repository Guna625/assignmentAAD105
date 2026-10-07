import { useState, useEffect } from 'react';
import { NavItem, PageId } from '@/types';
import {
  Users,
  Database,
  Type,
  Play,
  Cloud,
  Sparkles,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';
import { StudentForm } from '@/pages/StudentForm';
import { MongoGuide } from '@/pages/MongoGuide';
import { StringCombiner } from '@/pages/StringCombiner';
import { Multimedia } from '@/pages/Multimedia';
import { Weather } from '@/pages/Weather';
import { Interactive } from '@/pages/Interactive';

const NAV_ITEMS: NavItem[] = [
  {
    id: 'student-form',
    label: 'Student Details',
    question: 'Q1',
    icon: 'users',
    description: 'Store up to 5 students in an array and display them as cards',
  },
  {
    id: 'mongodb-guide',
    label: 'MongoDB Queries',
    question: 'Q2',
    icon: 'database',
    description: 'Create collections, insert data, and run CRUD queries',
  },
  {
    id: 'string-combiner',
    label: 'String Combiner',
    question: 'Q3',
    icon: 'type',
    description: 'Alternately combine two strings into one',
  },
  {
    id: 'multimedia',
    label: 'Multimedia Showcase',
    question: 'Q4',
    icon: 'play',
    description: 'Audio, video, images, animation & interactive graphics',
  },
  {
    id: 'weather',
    label: 'Weather App',
    question: 'Q5',
    icon: 'cloud',
    description: 'Real-time weather using a live API',
  },
  {
    id: 'interactive',
    label: 'Interactive Playground',
    question: 'Q6',
    icon: 'sparkles',
    description: 'A responsive, interactive site built with HTML, CSS & JS',
  },
];

function getIcon(name: string) {
  const map: Record<string, typeof Users> = {
    users: Users,
    database: Database,
    type: Type,
    play: Play,
    cloud: Cloud,
    sparkles: Sparkles,
  };
  return map[name] ?? BookOpen;
}

function App() {
  const [activePage, setActivePage] = useState<PageId>('student-form');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [activePage]);

  function renderPage() {
    switch (activePage) {
      case 'student-form':
        return <StudentForm />;
      case 'mongodb-guide':
        return <MongoGuide />;
      case 'string-combiner':
        return <StringCombiner />;
      case 'multimedia':
        return <Multimedia />;
      case 'weather':
        return <Weather />;
      case 'interactive':
        return <Interactive />;
    }
  }

  const activeItem = NAV_ITEMS.find((i) => i.id === activePage)!;

  return (
    <div className="min-h-screen bg-slate-50 gradient-mesh">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-slate-200/60 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-slate-900 text-sm">Web Dev Lab</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-72 bg-white border-r border-slate-200
          transition-transform duration-300 ease-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm leading-tight">
              Web Dev Lab
            </div>
            <div className="text-xs text-slate-400">6 Assignments</div>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin h-[calc(100%-4rem)]">
          {NAV_ITEMS.map((item) => {
            const Icon = getIcon(item.icon);
            const isActive = item.id === activePage;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`
                  w-full text-left px-3 py-3 rounded-xl transition-all duration-200 group
                  ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15'
                      : 'hover:bg-slate-50 text-slate-600'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                      w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                      transition-colors
                      ${
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }
                    `}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {item.question}
                      </span>
                      <span
                        className={`text-sm font-medium leading-tight truncate ${
                          isActive ? 'text-white' : 'text-slate-700'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 leading-relaxed line-clamp-2 ${
                        isActive ? 'text-white/60' : 'text-slate-400'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="lg:pl-72 min-h-screen">
        <div className="pt-16 lg:pt-0">
          {/* Page header bar */}
          <div className="sticky top-16 lg:top-0 z-20 glass border-b border-slate-200/60 px-6 lg:px-10 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-slate-400">
                    {activeItem.question}
                  </span>
                  <span className="text-slate-300">/</span>
                  <span className="text-xs text-slate-400">Assignment</span>
                </div>
                <h1 className="text-lg font-semibold text-slate-900">
                  {activeItem.label}
                </h1>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`
                      w-2.5 h-2.5 rounded-full transition-all duration-200
                      ${
                        item.id === activePage
                          ? 'bg-slate-900 w-6'
                          : 'bg-slate-300 hover:bg-slate-400'
                      }
                    `}
                    aria-label={item.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Page content */}
          <div key={activePage} className="px-6 lg:px-10 py-8 animate-fade-in">
            {renderPage()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
