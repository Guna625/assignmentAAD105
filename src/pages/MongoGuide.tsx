import { useState } from 'react';
import {
  Database,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Terminal,
  Copy,
  Check,
  Server,
  Folder,
  FileText,
} from 'lucide-react';

interface QueryBlock {
  title: string;
  description: string;
  code: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const FilterIcon = (props: { className?: string }) => <Eye {...props} />;

const COLLECTIONS = [
  {
    name: 'students',
    icon: '🎓',
    keys: ['_id', 'name', 'email', 'course', 'gpa'],
    docs: [
      { _id: 1, name: 'Alice Johnson', email: 'alice@uni.edu', course: 'Computer Science', gpa: 3.8 },
      { _id: 2, name: 'Bob Smith', email: 'bob@uni.edu', course: 'Mathematics', gpa: 3.5 },
      { _id: 3, name: 'Charlie Brown', email: 'charlie@uni.edu', course: 'Physics', gpa: 3.9 },
      { _id: 4, name: 'Diana Prince', email: 'diana@uni.edu', course: 'Computer Science', gpa: 3.7 },
      { _id: 5, name: 'Evan Wright', email: 'evan@uni.edu', course: 'Biology', gpa: 3.2 },
      { _id: 6, name: 'Fiona Green', email: 'fiona@uni.edu', course: 'Chemistry', gpa: 3.6 },
      { _id: 7, name: 'George King', email: 'george@uni.edu', course: 'Mathematics', gpa: 3.4 },
      { _id: 8, name: 'Hannah Lee', email: 'hannah@uni.edu', course: 'Computer Science', gpa: 3.95 },
      { _id: 9, name: 'Ian Cole', email: 'ian@uni.edu', course: 'Physics', gpa: 3.1 },
      { _id: 10, name: 'Jane Doe', email: 'jane@uni.edu', course: 'Biology', gpa: 3.55 },
    ],
  },
  {
    name: 'courses',
    icon: '📚',
    keys: ['_id', 'courseName', 'department', 'credits', 'instructor'],
    docs: [
      { _id: 101, courseName: 'Data Structures', department: 'CS', credits: 4, instructor: 'Dr. White' },
      { _id: 102, courseName: 'Calculus I', department: 'Math', credits: 3, instructor: 'Dr. Brown' },
      { _id: 103, courseName: 'Quantum Physics', department: 'Physics', credits: 4, instructor: 'Dr. Feynman' },
      { _id: 104, courseName: 'Organic Chemistry', department: 'Chem', credits: 3, instructor: 'Dr. Curie' },
      { _id: 105, courseName: 'Cell Biology', department: 'Bio', credits: 3, instructor: 'Dr. Watson' },
      { _id: 106, courseName: 'Algorithms', department: 'CS', credits: 4, instructor: 'Dr. Turing' },
      { _id: 107, courseName: 'Linear Algebra', department: 'Math', credits: 3, instructor: 'Dr. Gauss' },
      { _id: 108, courseName: 'Thermodynamics', department: 'Physics', credits: 4, instructor: 'Dr. Boltzmann' },
      { _id: 109, courseName: 'Microbiology', department: 'Bio', credits: 3, instructor: 'Dr. Pasteur' },
      { _id: 110, courseName: 'Database Systems', department: 'CS', credits: 4, instructor: 'Dr. Codd' },
    ],
  },
  {
    name: 'faculty',
    icon: '👨‍🏫',
    keys: ['_id', 'facultyName', 'department', 'designation', 'salary'],
    docs: [
      { _id: 201, facultyName: 'Dr. Alan White', department: 'CS', designation: 'Professor', salary: 95000 },
      { _id: 202, facultyName: 'Dr. Sarah Brown', department: 'Math', designation: 'Associate Prof', salary: 80000 },
      { _id: 203, facultyName: 'Dr. Richard Feynman', department: 'Physics', designation: 'Professor', salary: 110000 },
      { _id: 204, facultyName: 'Dr. Marie Curie', department: 'Chem', designation: 'Professor', salary: 100000 },
      { _id: 205, facultyName: 'Dr. James Watson', department: 'Bio', designation: 'Assistant Prof', salary: 75000 },
      { _id: 206, facultyName: 'Dr. Alan Turing', department: 'CS', designation: 'Professor', salary: 105000 },
      { _id: 207, facultyName: 'Dr. Carl Gauss', department: 'Math', designation: 'Professor', salary: 98000 },
      { _id: 208, facultyName: 'Dr. Ludwig Boltzmann', department: 'Physics', designation: 'Associate Prof', salary: 85000 },
      { _id: 209, facultyName: 'Dr. Louis Pasteur', department: 'Bio', designation: 'Professor', salary: 92000 },
      { _id: 210, facultyName: 'Dr. Edgar Codd', department: 'CS', designation: 'Professor', salary: 115000 },
    ],
  },
] as const;

const QUERY_BLOCKS: QueryBlock[] = [
  {
    title: 'View a Collection',
    description: 'Retrieve all documents from a collection',
    icon: Eye,
    color: 'sky',
    code: `// View all documents in students collection
db.students.find()

// View all documents in courses collection
db.courses.find()

// View all documents in faculty collection
db.faculty.find()

// Pretty-print for readability
db.students.find().pretty()`,
  },
  {
    title: 'View with Condition',
    description: 'Find specific documents matching a criteria',
    icon: FilterIcon,
    color: 'emerald',
    code: `// students: find by course
db.students.find({ course: "Computer Science" })

// students: find by GPA greater than 3.5
db.students.find({ gpa: { $gt: 3.5 } })

// courses: find by department
db.courses.find({ department: "CS" })

// courses: find credits equal to 4
db.courses.find({ credits: 4 })

// faculty: find by designation
db.faculty.find({ designation: "Professor" })

// faculty: find salary greater than 90000
db.faculty.find({ salary: { $gt: 90000 } })`,
  },
  {
    title: 'Update a Document',
    description: 'Edit a single detail in each collection',
    icon: Pencil,
    color: 'amber',
    code: `// students: update GPA for Alice
db.students.updateOne(
  { name: "Alice Johnson" },
  { $set: { gpa: 4.0 } }
)

// courses: update instructor for Data Structures
db.courses.updateOne(
  { courseName: "Data Structures" },
  { $set: { instructor: "Dr. Turing" } }
)

// faculty: update salary for Dr. White
db.faculty.updateOne(
  { facultyName: "Dr. Alan White" },
  { $set: { salary: 100000 } }
)`,
  },
  {
    title: 'Delete Documents',
    description: 'Remove data from each collection',
    icon: Trash2,
    color: 'rose',
    code: `// students: delete by name
db.students.deleteOne({ name: "Ian Cole" })

// courses: delete by courseName
db.courses.deleteOne({ courseName: "Thermodynamics" })

// faculty: delete by facultyName
db.faculty.deleteOne({ facultyName: "Dr. Ludwig Boltzmann" })

// Delete multiple matching documents
db.students.deleteMany({ course: "Biology" })`,
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', dot: 'bg-sky-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-500' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', dot: 'bg-rose-500' },
};

export function MongoGuide() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeCollection, setActiveCollection] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  function copyCode(code: string, id: string) {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const col = COLLECTIONS[activeCollection];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">MongoDB CRUD Operations</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
          A visual reference for creating a database, 3 collections with 10 documents each
          (5 keys per document), and the four essential CRUD queries — view, view with
          condition, update, and delete.
        </p>
      </div>

      {/* Setup section */}
      <div className="card p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-slate-700" />
          <h3 className="font-semibold text-slate-900">Database & Collection Setup</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <CodeCard
            id="setup"
            title="Create Database & Collections"
            code={`// Create / switch to the database
use universityDB

// Create 3 collections
db.createCollection("students")
db.createCollection("courses")
db.createCollection("faculty")

// Verify collections
show collections`}
            copied={copied}
            onCopy={copyCode}
          />
          <CodeCard
            id="insert"
            title="Insert 10 Documents (5 keys each)"
            code={`// Insert into students collection
db.students.insertMany([
  { _id: 1, name: "Alice Johnson", email: "alice@uni.edu", course: "Computer Science", gpa: 3.8 },
  { _id: 2, name: "Bob Smith", email: "bob@uni.edu", course: "Mathematics", gpa: 3.5 },
  // ... 8 more documents
])

// Similarly for courses and faculty
db.courses.insertMany([...])
db.faculty.insertMany([...])`}
            copied={copied}
            onCopy={copyCode}
          />
        </div>
      </div>

      {/* Collection viewer */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Folder className="w-5 h-5 text-slate-700" />
          <h3 className="font-semibold text-slate-900">Collection Data Preview</h3>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {COLLECTIONS.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setActiveCollection(i)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2
                ${
                  i === activeCollection
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }
              `}
            >
              <span>{c.icon}</span>
              {c.name}
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  i === activeCollection ? 'bg-white/20' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {c.docs.length}
              </span>
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono text-slate-500">
              db.{col.name}.find().pretty()
            </span>
            <span className="badge bg-slate-100 text-slate-500 ml-auto">
              {col.docs.length} docs · {col.keys.length} keys
            </span>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {col.keys.map((k) => (
                    <th
                      key={k}
                      className="text-left px-4 py-2.5 font-semibold text-slate-400 text-xs uppercase tracking-wide"
                    >
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {col.docs.map((doc, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    {col.keys.map((k) => (
                      <td key={k} className="px-4 py-2.5 text-slate-700 font-mono text-xs">
                        {String(doc[k as keyof typeof doc])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Query tabs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-slate-700" />
          <h3 className="font-semibold text-slate-900">CRUD Queries</h3>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {QUERY_BLOCKS.map((q, i) => {
            const c = COLOR_MAP[q.color];
            const Icon = q.icon;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`
                  px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2
                  ${
                    i === activeTab
                      ? `${c.bg} ${c.text} border ${c.border}`
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {q.title}
              </button>
            );
          })}
        </div>

        {QUERY_BLOCKS.map((q, i) => {
          if (i !== activeTab) return null;
          const c = COLOR_MAP[q.color];
          const Icon = q.icon;
          return (
            <div key={i} className="card p-6 animate-fade-in">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{q.title}</h4>
                  <p className="text-sm text-slate-500">{q.description}</p>
                </div>
              </div>
              <CodeBlock code={q.code} id={`query-${i}`} copied={copied} onCopy={copyCode} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CodeCard({
  title,
  code,
  id,
  copied,
  onCopy,
}: {
  title: string;
  code: string;
  id: string;
  copied: string | null;
  onCopy: (code: string, id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-900 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-300">{title}</span>
        <button
          onClick={() => onCopy(code, id)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          {copied === id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <pre className="p-4 bg-slate-900 text-slate-300 text-xs font-mono overflow-x-auto scrollbar-thin leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

function CodeBlock({
  code,
  id,
  copied,
  onCopy,
}: {
  code: string;
  id: string;
  copied: string | null;
  onCopy: (code: string, id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
        <button
          onClick={() => onCopy(code, id)}
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
        >
          {copied === id ? (
            <>
              <Check className="w-3.5 h-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-5 bg-slate-900 text-slate-300 text-xs font-mono overflow-x-auto scrollbar-thin leading-relaxed">
        {code}
      </pre>
    </div>
  );
}
