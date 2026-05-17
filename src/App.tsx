import { FormEvent, useEffect, useMemo, useState } from 'react';

type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
type Status = 'Open' | 'In Progress' | 'Resolved';

interface Ticket {
  id: string;
  title: string;
  description: string;
  requester: string;
  assignee: string;
  priority: Priority;
  status: Status;
  createdAt: string;
}

const STORAGE_KEY = 'it-support-tickets-v1';

const seed: Ticket[] = [
  {
    id: 'TCK-1001',
    title: 'VPN login failure',
    description: 'Remote team members cannot connect using corporate credentials.',
    requester: 'Anna M',
    assignee: 'Network Team',
    priority: 'High',
    status: 'In Progress',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'TCK-1002',
    title: 'Email outage on mobile',
    description: 'iOS devices are not syncing mailbox for multiple users.',
    requester: 'Jordan K',
    assignee: 'Messaging Team',
    priority: 'Medium',
    status: 'Open',
    createdAt: new Date().toISOString(),
  },
];

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | Status>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setTickets(seed);
      return;
    }
    try {
      setTickets(JSON.parse(raw) as Ticket[]);
    } catch {
      setTickets(seed);
    }
  }, []);

  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    }
  }, [tickets]);

  const visibleTickets = useMemo(
    () =>
      tickets.filter((ticket) => {
        const statusMatch = statusFilter === 'All' || ticket.status === statusFilter;
        const priorityMatch = priorityFilter === 'All' || ticket.priority === priorityFilter;
        return statusMatch && priorityMatch;
      }),
    [tickets, statusFilter, priorityFilter],
  );

  const updateStatus = (id: string, status: Status) => {
    setTickets((current) => current.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket)));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const ticket: Ticket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: String(formData.get('title') ?? '').trim(),
      description: String(formData.get('description') ?? '').trim(),
      requester: String(formData.get('requester') ?? '').trim(),
      assignee: String(formData.get('assignee') ?? '').trim(),
      priority: formData.get('priority') as Priority,
      status: 'Open',
      createdAt: new Date().toISOString(),
    };

    if (!ticket.title || !ticket.requester || !ticket.assignee) {
      return;
    }

    setTickets((current) => [ticket, ...current]);
    event.currentTarget.reset();
  };

  const metrics = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'Open').length,
    inProgress: tickets.filter((t) => t.status === 'In Progress').length,
    resolved: tickets.filter((t) => t.status === 'Resolved').length,
  };

  return (
    <main className="min-h-screen p-6 text-slate-900 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">IT Support Ticket Dashboard</h1>
          <p className="mt-2 text-slate-600">Create, prioritize, assign, and resolve support tickets in one place.</p>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {Object.entries(metrics).map(([label, value]) => (
            <article key={label} className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm uppercase tracking-wide text-slate-500">{label}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Create Ticket</h2>
            {['title', 'requester', 'assignee'].map((field) => (
              <label key={field} className="block">
                <span className="mb-1 block text-sm font-medium capitalize">{field}</span>
                <input name={field} required className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400" />
              </label>
            ))}
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Description</span>
              <textarea name="description" rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Priority</span>
              <select name="priority" className="w-full rounded-md border border-slate-300 px-3 py-2">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>
            <button className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">Add Ticket</button>
          </form>

          <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-xl font-semibold">Ticket Queue</h2>
              <div className="flex gap-2">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'All' | Status)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
                  <option>All</option><option>Open</option><option>In Progress</option><option>Resolved</option>
                </select>
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as 'All' | Priority)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
                  <option>All</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {visibleTickets.map((ticket) => (
                <article key={ticket.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{ticket.title}</h3>
                      <p className="text-xs text-slate-500">{ticket.id} · {new Date(ticket.createdAt).toLocaleString()}</p>
                    </div>
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold">{ticket.priority}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{ticket.description || 'No description provided.'}</p>
                  <p className="mt-2 text-sm">Requester: <strong>{ticket.requester}</strong> · Assignee: <strong>{ticket.assignee}</strong></p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm">Status:</span>
                    {(['Open', 'In Progress', 'Resolved'] as Status[]).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(ticket.id, status)}
                        className={`rounded px-2 py-1 text-xs ${ticket.status === status ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

export default App;
