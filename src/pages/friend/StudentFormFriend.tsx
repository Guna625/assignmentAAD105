import { useState } from 'react';
import { User, Trash2, Plus, X, GraduationCap, Mail, Hash, Calendar, Book } from 'lucide-react';

interface Student {
  name: string;
  email: string;
  rollNo: string;
  age: string;
  branch: string;
}

const EMPTY_FORM: Student = {
  name: '',
  email: '',
  rollNo: '',
  age: '',
  branch: '',
};

const MAX_STUDENTS = 5;

const BRANCHES = ['Computer Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Information Technology'];

export function StudentFormFriend() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState<Student>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof Student, string>>>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function validate(data: Student) {
    const e: Partial<Record<keyof Student, string>> = {};
    if (!data.name.trim()) e.name = 'Name is required';
    if (!data.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Invalid email';
    if (!data.rollNo.trim()) e.rollNo = 'Roll number is required';
    if (!data.age.trim()) e.age = 'Age is required';
    else if (isNaN(Number(data.age)) || Number(data.age) < 1 || Number(data.age) > 120) e.age = 'Enter a valid age';
    if (!data.branch.trim()) e.branch = 'Branch is required';
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

  const isFull = students.length >= MAX_STUDENTS && editingIndex === null;

  const fields: { key: keyof Student; label: string; placeholder: string; icon: typeof User; type?: string; dropdown?: boolean }[] = [
    { key: 'name', label: 'Full Name', placeholder: 'Sarah Connor', icon: User },
    { key: 'email', label: 'Email Address', placeholder: 'sarah@college.edu', icon: Mail, type: 'email' },
    { key: 'rollNo', label: 'Roll Number', placeholder: 'CE2024-051', icon: Hash },
    { key: 'age', label: 'Age', placeholder: '20', icon: Calendar, type: 'number' },
    { key: 'branch', label: 'Branch', placeholder: 'Select branch', icon: Book, dropdown: true },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Student Records</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
          Enter student details below — up to {MAX_STUDENTS} entries are stored in a JavaScript
          array and rendered as individual blocks. Edit or remove any record at any time.
        </p>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-8">
        {/* Form */}
        <div className="card p-6 h-fit lg:sticky lg:top-28">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              {editingIndex !== null ? 'Edit Record' : 'Add Record'}
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
                    {f.dropdown ? (
                      <select
                        value={form[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className={`input-field pl-10 appearance-none ${
                          errors[f.key] ? 'border-red-400' : ''
                        }`}
                      >
                        <option value="">Select branch</option>
                        {BRANCHES.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={f.type ?? 'text'}
                        value={form[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className={`input-field pl-10 ${
                          errors[f.key] ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''
                        }`}
                      />
                    )}
                  </div>
                  {errors[f.key] && (
                    <p className="text-xs text-red-500 mt-1">{errors[f.key]}</p>
                  )}
                </div>
              );
            })}

            <button
              type="submit"
              disabled={isFull}
              className="btn-primary w-full flex items-center justify-center gap-2"
              style={isFull ? undefined : { background: '#059669' }}
            >
              {editingIndex !== null ? (
                <>
                  <GraduationCap className="w-4 h-4" /> Save Changes
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add to Array
                </>
              )}
            </button>

            {isFull && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                Limit of {MAX_STUDENTS} students reached. Remove or edit an existing entry.
              </p>
            )}
          </form>

          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Array slots used</span>
              <span className="font-mono font-semibold text-slate-700">
                {students.length} / {MAX_STUDENTS}
              </span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: MAX_STUDENTS }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    i < students.length ? 'bg-emerald-500' : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Block display */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">
              Student Blocks{' '}
              <span className="text-slate-400 font-normal">({students.length})</span>
            </h3>
            {students.length > 0 && (
              <button
                onClick={() => {
                  setStudents([]);
                  setForm(EMPTY_FORM);
                  setEditingIndex(null);
                }}
                className="btn-ghost flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
          </div>

          {students.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-emerald-300" />
              </div>
              <p className="text-slate-400 text-sm">
                No records yet. Use the form to add student details.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {students.map((s, i) => (
                <div
                  key={i}
                  className="card p-5 animate-slide-up border-l-4 border-l-emerald-500"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-semibold">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{s.name}</div>
                        <div className="text-xs text-emerald-500 font-mono">
                          block[{i}]
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(i)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(i)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs border-t border-slate-50 pt-3">
                    <DetailRow icon={Mail} label="Email" value={s.email} />
                    <DetailRow icon={Hash} label="Roll No" value={s.rollNo} />
                    <DetailRow icon={Calendar} label="Age" value={s.age} />
                    <DetailRow icon={Book} label="Branch" value={s.branch} />
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

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
      <span className="text-slate-400 w-16">{label}</span>
      <span className="font-medium text-slate-700 truncate">{value}</span>
    </div>
  );
}
