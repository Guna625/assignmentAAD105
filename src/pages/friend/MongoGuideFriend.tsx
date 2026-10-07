import { useState } from 'react';
import {
  Database,
  Eye,
  Pencil,
  Trash2,
  Terminal,
  Copy,
  Check,
  Server,
  Folder,
  FileText,
  Search,
} from 'lucide-react';

interface QueryBlock {
  title: string;
  description: string;
  code: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const COLLECTIONS = [
  {
    name: 'books',
    icon: '📖',
    keys: ['_id', 'title', 'author', 'genre', 'price'],
    docs: [
      { _id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', price: 15.99 },
      { _id: 2, title: '1984', author: 'George Orwell', genre: 'Dystopian', price: 12.50 },
      { _id: 3, title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', price: 18.00 },
      { _id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', price: 9.99 },
      { _id: 5, title: 'The Shining', author: 'Stephen King', genre: 'Horror', price: 14.75 },
      { _id: 6, title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Non-Fiction', price: 22.00 },
      { _id: 7, title: 'The Road', author: 'Cormac McCarthy', genre: 'Post-Apocalyptic', price: 11.25 },
      { _id: 8, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', price: 19.99 },
      { _id: 9, title: 'Wuthering Heights', author: 'Emily Bronte', genre: 'Classic', price: 8.50 },
      { _id: 10, title: 'Neuromancer', author: 'William Gibson', genre: 'Sci-Fi', price: 16.00 },
    ],
  },
  {
    name: 'members',
    icon: '👤',
    keys: ['_id', 'memberName', 'email', 'membershipType', 'joinDate'],
    docs: [
      { _id: 101, memberName: 'Oliver Smith', email: 'oliver@lib.com', membershipType: 'Premium', joinDate: '2023-01-15' },
      { _id: 102, memberName: 'Emma Watson', email: 'emma@lib.com', membershipType: 'Basic', joinDate: '2023-03-20' },
      { _id: 103, memberName: 'Liam Johnson', email: 'liam@lib.com', membershipType: 'Premium', joinDate: '2023-05-10' },
      { _id: 104, memberName: 'Sophia Brown', email: 'sophia@lib.com', membershipType: 'Student', joinDate: '2023-06-01' },
      { _id: 105, memberName: 'Noah Davis', email: 'noah@lib.com', membershipType: 'Basic', joinDate: '2023-07-22' },
      { _id: 106, memberName: 'Ava Miller', email: 'ava@lib.com', membershipType: 'Premium', joinDate: '2023-08-14' },
      { _id: 107, memberName: 'James Wilson', email: 'james@lib.com', membershipType: 'Student', joinDate: '2023-09-05' },
      { _id: 108, memberName: 'Isabella Moore', email: 'bella@lib.com', membershipType: 'Basic', joinDate: '2023-10-30' },
      { _id: 109, memberName: 'Mason Taylor', email: 'mason@lib.com', membershipType: 'Premium', joinDate: '2023-11-12' },
      { _id: 110, memberName: 'Mia Anderson', email: 'mia@lib.com', membershipType: 'Student', joinDate: '2024-01-08' },
    ],
  },
  {
    name: 'loans',
    icon: '📋',
    keys: ['_id', 'bookTitle', 'memberName', 'loanDate', 'status'],
    docs: [
      { _id: 501, bookTitle: 'The Hobbit', memberName: 'Oliver Smith', loanDate: '2024-01-10', status: 'Returned' },
      { _id: 502, bookTitle: '1984', memberName: 'Emma Watson', loanDate: '2024-01-15', status: 'Active' },
      { _id: 503, bookTitle: 'Dune', memberName: 'Liam Johnson', loanDate: '2024-02-01', status: 'Active' },
      { _id: 504, bookTitle: 'Sapiens', memberName: 'Sophia Brown', loanDate: '2024-02-10', status: 'Overdue' },
      { _id: 505, bookTitle: 'The Shining', memberName: 'Noah Davis', loanDate: '2024-02-20', status: 'Returned' },
      { _id: 506, bookTitle: 'Atomic Habits', memberName: 'Ava Miller', loanDate: '2024-03-01', status: 'Active' },
      { _id: 507, bookTitle: 'Neuromancer', memberName: 'James Wilson', loanDate: '2024-03-05', status: 'Overdue' },
      { _id: 508, bookTitle: 'The Road', memberName: 'Isabella Moore', loanDate: '2024-03-12', status: 'Returned' },
      { _id: 509, bookTitle: 'Pride and Prejudice', memberName: 'Mason Taylor', loanDate: '2024-03-20', status: 'Active' },
      { _id: 510, bookTitle: 'Wuthering Heights', memberName: 'Mia Anderson', loanDate: '2024-04-01', status: 'Active' },
    ],
  },
] as const;

const FilterIcon = (props: { className?: string }) => <Search {...props} />;

const QUERY_BLOCKS: QueryBlock[] = [
  {
    title: 'View a Collection',
    description: 'Retrieve all documents from a collection',
    icon: Eye,
    color: 'emerald',
    code: `// View all books
db.books.find()

// View all members
db.members.find()

// View all loans
db.loans.find()

// Pretty-print output
db.books.find().pretty()`,
  },
  {
    title: 'View with Condition',
    description: 'Find specific documents matching a criteria',
    icon: FilterIcon,
    color: 'sky',
    code: `// books: find by genre
db.books.find({ genre: "Sci-Fi" })

// books: find price less than 15
db.books.find({ price: { $lt: 15 } })

// members: find by membership type
db.members.find({ membershipType: "Premium" })

// members: find joined after a date
db.members.find({ joinDate: { $gte: "2023-08-01" } })

// loans: find active loans
db.loans.find({ status: "Active" })

// loans: find overdue
db.loans.find({ status: "Overdue" })`,
  },
  {
    title: 'Update a Document',
    description: 'Edit a single detail in each collection',
    icon: Pencil,
    color: 'amber',
    code: `// books: update price of Dune
db.books.updateOne(
  { title: "Dune" },
  { $set: { price: 20.00 } }
)

// members: upgrade Emma to Premium
db.members.updateOne(
  { memberName: "Emma Watson" },
  { $set: { membershipType: "Premium" } }
)

// loans: mark overdue loan as returned
db.loans.updateOne(
  { _id: 504 },
  { $set: { status: "Returned" } }
)`,
  },
  {
    title: 'Delete Documents',
    description: 'Remove data from each collection',
    icon: Trash2,
    color: 'rose',
    code: `// books: delete by title
db.books.deleteOne({ title: "Wuthering Heights" })

// members: delete by name
db.members.deleteOne({ memberName: "Mia Anderson" })

// loans: delete by id
db.loans.deleteOne({ _id: 507 })

// Delete multiple returned loans
db.loans.deleteMany({ status: "Returned" })`,
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
};

export function MongoGuideFriend() {
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
          A library database with 3 collections — books, members, and loans — each containing
          10 documents with 5 keys. Includes setup, insert, and all four CRUD query types.
        </p>
      </div>

      {/* Setup */}
      <div className="card p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-slate-900">Database & Collection Setup</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <CodeCard id="setup" title="Create Database & Collections" code={`// Create / switch to the database
use libraryDB

// Create 3 collections
db.createCollection("books")
db.createCollection("members")
db.createCollection("loans")

// Verify
show collections`} copied={copied} onCopy={copyCode} />
          <CodeCard id="insert" title="Insert 10 Documents (5 keys each)" code={`// Insert into books collection
db.books.insertMany([
  { _id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", price: 15.99 },
  { _id: 2, title: "1984", author: "George Orwell", genre: "Dystopian", price: 12.50 },
  // ... 8 more documents
])

// Similarly for members and loans
db.members.insertMany([...])
db.loans.insertMany([...])`} copied={copied} onCopy={copyCode} />
        </div>
      </div>

      {/* Collection viewer */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Folder className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-slate-900">Collection Data Preview</h3>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {COLLECTIONS.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setActiveCollection(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                i === activeCollection
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span>{c.icon}</span>
              {c.name}
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                i === activeCollection ? 'bg-white/20' : 'bg-slate-100 text-slate-400'
              }`}>
                {c.docs.length}
              </span>
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-emerald-50/30 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-slate-500">db.{col.name}.find().pretty()</span>
            <span className="badge bg-emerald-50 text-emerald-600 ml-auto">
              {col.docs.length} docs · {col.keys.length} keys
            </span>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {col.keys.map((k) => (
                    <th key={k} className="text-left px-4 py-2.5 font-semibold text-slate-400 text-xs uppercase tracking-wide">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {col.docs.map((doc, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-emerald-50/20 transition-colors">
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
          <Terminal className="w-5 h-5 text-emerald-600" />
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
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  i === activeTab ? `${c.bg} ${c.text} border ${c.border}` : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
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

function CodeCard({ title, code, id, copied, onCopy }: { title: string; code: string; id: string; copied: string | null; onCopy: (c: string, id: string) => void }) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-900 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-300">{title}</span>
        <button onClick={() => onCopy(code, id)} className="text-slate-400 hover:text-white transition-colors">
          {copied === id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <pre className="p-4 bg-slate-900 text-slate-300 text-xs font-mono overflow-x-auto scrollbar-thin leading-relaxed">{code}</pre>
    </div>
  );
}

function CodeBlock({ code, id, copied, onCopy }: { code: string; id: string; copied: string | null; onCopy: (c: string, id: string) => void }) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
        <button onClick={() => onCopy(code, id)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs">
          {copied === id ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
        </button>
      </div>
      <pre className="p-5 bg-slate-900 text-slate-300 text-xs font-mono overflow-x-auto scrollbar-thin leading-relaxed">{code}</pre>
    </div>
  );
}
