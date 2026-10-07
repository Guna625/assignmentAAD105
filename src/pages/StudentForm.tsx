import { useState } from 'react';
import { User, Trash2, Plus, X, GraduationCap, Mail, Phone, Hash } from 'lucide-react';

interface Student {
  name: string;
  email: string;
  phone: string;
  rollNo: string;
  course: string;
}

const EMPTY_FORM: Student = {
  name: '',
  email: '',
  phone: '',
  rollNo: '',
  course: '',
};

const MAX_STUDENTS = 5;

export function StudentForm() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState<Student>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof Student, string>>>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function validate(data: Student) {
    const e: Partial<Record<keyof Student, string>> = {};
    if (!data.name.trim()) e.name = 'Name is required';
    if (!data.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Invalid email format';
    if (!data.phone.trim()) e.phone = 'Phone is required';
    if (!data.rollNo.trim()) e.rollNo = 'Roll number is required';
    if (!data.course.trim()) e.course = 'Course is required';
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (editingIndex !== null) {
      const updated = [...students];
      updated[editingIndex] = form;
      setStudents(updated);
      setEditingIndex(null);
    } else {
      if (students.length >= MAX_STUDENTS) return;
      setStudents([...students, form]);
    }
    setForm(EMPTY_FORM);
  }

  function handleEdit(index: number) {
    setForm(students[index]);
    setEditingIndex(index);
    setErrors({});
  }

  function handleDelete(index: number) {
    setStudents(students.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setForm(EMPTY_FORM);
      setEditingIndex(null);
    }
  }

  function handleClearAll() {
    setStudents([]);
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingIndex(null);
  }

  const isFull = students.length >= MAX_STUDENTS && editingIndex === null;

  const fields: { key: keyof Student; label: string; placeholder: string; icon: typeof User; type?: string }[] = [
    { key: 'name', label: 'Full Name', placeholder: 'John Doe', icon: User },
    { key: 'email', label: 'Email Address', placeholder: 'john@university.edu', icon: Mail, type: 'email' },
    { key: 'phone', label: 'Phone Number', placeholder: '+1 234 567 8900', icon: Phone, type: 'tel' },
    { key: 'rollNo', label: 'Roll Number', placeholder: 'CS2024-001', icon: Hash },
    { key: 'course', label: 'Course / Major', placeholder: 'Computer Science', icon: GraduationCap },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Student Details Manager</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
          Enter student information using the form below. Details are stored in a JavaScript
          array (up to {MAX_STUDENTS} students) and displayed as individual cards. You can
          edit or remove any entry at any time.
        </p>
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-8">
        {/* Form panel */}
        <div className="card p-6 h-fit lg:sticky lg:top-28">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-500" />
              {editingIndex !== null ? 'Edit Student' : 'Add Student'}
            </h3>
            {editingIndex !== null && (
              <button
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setEditingIndex(null);
                  setErrors({});
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    {f.label}
                  </label>
                  <div className="relative">
                    <Icon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={f.type ?? 'text'}
                      value={form[f.key]}
                      onChange={(e) =>
                        setForm({ ...form, [f.key]: e.target.value })
                      }
                      placeholder={f.placeholder}
                      className={`input-field pl-10 ${
                        errors[f.key] ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''
                      }`}
                    />
                  </div>
                  {errors[f.key] && (
                    <p className="text-xs text-red-500 mt-1">{errors[f.key]}</p>
                  )}
                </div>
              );
            })}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isFull}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {editingIndex !== null ? (
                  <>
                    <GraduationCap className="w-4 h-4" /> Update Student
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add to Array
                  </>
                )}
              </button>
              {students.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="btn-ghost flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            {isFull && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                Maximum of {MAX_STUDENTS} students reached. Remove or edit an existing entry.
              </p>
            )}
          </form>

          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Array Length</span>
              <span className="font-mono font-semibold text-slate-700">
                {students.length} / {MAX_STUDENTS}
              </span>
            </div>
            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-500"
                style={{ width: `${(students.length / MAX_STUDENTS) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cards display */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">
              Stored Students{' '}
              <span className="text-slate-400 font-normal">({students.length})</span>
            </h3>
            {students.length > 0 && (
              <span className="badge bg-sky-50 text-sky-600">Array Output</span>
            )}
          </div>

          {students.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 text-sm">
                No students added yet. Fill out the form to get started.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {students.map((s, i) => (
                <div
                  key={i}
                  className="card p-5 animate-slide-up relative overflow-hidden"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sky-50 to-transparent rounded-bl-full" />
                  <div className="flex items-start justify-between mb-3 relative">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-semibold text-sm">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{s.name}</div>
                        <div className="text-xs text-slate-400 font-mono">
                          index[{i}]
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(i)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                        aria-label="Edit"
                      >
                        <Plus className="w-3.5 h-3.5 rotate-45" />
                      </button>
                      <button
                        onClick={() => handleDelete(i)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs relative">
                    <Row icon={Mail} label="Email" value={s.email} />
                    <Row icon={Phone} label="Phone" value={s.phone} />
                    <Row icon={Hash} label="Roll No" value={s.rollNo} />
                    <Row icon={GraduationCap} label="Course" value={s.course} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
      <span className="text-slate-400 w-14">{label}</span>
      <span className="font-medium text-slate-700 truncate">{value}</span>
    </div>
  );
}
