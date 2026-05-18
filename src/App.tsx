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
const STATUS_OPTIONS: Status[] = ['Open', 'In Progress', 'Resolved'];
const PRIORITY_OPTIONS: Priority[] = ['Low', 'Medium', 'High', 'Critical'];

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

const priorityColors: Record<Priority, string> = {
  Low: 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-300/40',
  Medium: 'bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-300/40',
  High: 'bg-amber-500/20 text-amber-100 ring-1 ring-amber-300/40',
  Critical: 'bg-rose-500/20 text-rose-100 ring-1 ring-rose-300/40',
};

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | Status>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return setTickets(seed);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    if (tickets.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    }
  }, [tickets]);

  const visibleTickets = useMemo(
    () =>
      tickets.filter(
        (t) =>
          (statusFilter === 'All' || t.status === statusFilter) &&
          (priorityFilter === 'All' || t.priority === priorityFilter),
      ),
    [tickets, statusFilter, priorityFilter],
  );

  const metrics = useMemo(() => {
    const open = tickets.filter((t) => t.status === 'Open').length;
    const inProgress = tickets.filter((t) => t.status === 'In Progress').length;
    const resolved = tickets.filter((t) => t.status === 'Resolved').length;
    return {
      total: tickets.length,
      open,
      inProgress,
      resolved,
      completionRate: tickets.length ? Math.round((resolved / tickets.length) * 100) : 0,
    };
  }, [tickets]);

  const updateStatus = (id: string, status: Status) => {
    setTickets((curr) => curr.map((t) => (t.id === id ? { ...t, status } : t)));
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

    if (!ticket.title || !ticket.requester || !ticket.assignee) return;
    if (!ticket.title || !ticket.requester || !ticket.assignee) {
      return;
    }

    setTickets((current) => [ticket, ...current]);
    event.currentTarget.reset();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.2),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.25),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.2),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl space-y-8 p-6 md:p-10">
        <header className="glass rounded-3xl p-8">
          <p className="chip">Support Operations Suite</p>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">IT Support Ticket Dashboard</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            A polished workflow console to create, prioritize, assign, and resolve incidents with confidence.
          </p>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500"
              style={{ width: `${metrics.completionRate}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-400">Resolution rate: {metrics.completionRate}%</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Total Tickets', metrics.total, 'from-slate-400 to-slate-200'],
            ['Open', metrics.open, 'from-cyan-400 to-blue-400'],
            ['In Progress', metrics.inProgress, 'from-violet-400 to-fuchsia-400'],
            ['Resolved', metrics.resolved, 'from-emerald-400 to-lime-300'],
          ].map(([label, value, color]) => (
            <article key={String(label)} className="glass rounded-2xl p-5">
              <p
                className={`bg-gradient-to-r ${String(
                  color,
                )} bg-clip-text text-sm font-semibold uppercase tracking-wider text-transparent`}
              >
                {label}
              </p>
              <p className="mt-2 text-4xl font-black">{value}</p>
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

        <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <form onSubmit={handleSubmit} className="glass rounded-3xl p-6">
            <h2 className="mb-4 text-xl font-bold">Create Ticket</h2>
            <div className="space-y-3">
              {['title', 'requester', 'assignee'].map((field) => (
                <label key={field} className="block text-sm">
                  <span className="mb-1 block text-slate-300 capitalize">{field}</span>
                  <input name={field} required className="input-glass" />
                </label>
              ))}
              <label className="block text-sm">
                <span className="mb-1 block text-slate-300">Description</span>
                <textarea name="description" rows={3} className="input-glass" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-slate-300">Priority</span>
                <select name="priority" className="input-glass">
                  {PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority}>{priority}</option>
                  ))}
                </select>
              </label>
              <button className="btn-primary w-full">Create Ticket</button>
            </div>
          </form>

          <section className="glass rounded-3xl p-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-xl font-bold">Ticket Queue</h2>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'All' | Status)}
                  className="input-glass text-sm"
                >
                  <option>All</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as 'All' | Priority)}
                  className="input-glass text-sm"
                >
                  <option>All</option>
                  {PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-3">
              {visibleTickets.map((ticket) => (
                <article key={ticket.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold">{ticket.title}</h3>
                      <p className="text-xs text-slate-400">
                        {ticket.id} · {new Date(ticket.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityColors[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{ticket.description || 'No description provided.'}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Requester: <strong>{ticket.requester}</strong> · Assignee: <strong>{ticket.assignee}</strong>
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(ticket.id, status)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                          ticket.status === status
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
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
