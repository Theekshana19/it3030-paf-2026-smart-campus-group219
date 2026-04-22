const statusConfig = {
  PENDING:   { dot: 'bg-amber-400',  text: 'text-amber-700',  bg: 'bg-amber-50',   border: 'border-amber-200',  label: 'Pending'   },
  APPROVED:  { dot: 'bg-emerald-500',text: 'text-emerald-700',bg: 'bg-emerald-50', border: 'border-emerald-200',label: 'Approved'  },
  REJECTED:  { dot: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50',     border: 'border-red-200',    label: 'Rejected'  },
  CANCELLED: { dot: 'bg-slate-400',  text: 'text-slate-600',  bg: 'bg-slate-50',   border: 'border-slate-200',  label: 'Cancelled' },
};

export default function BookingStatusBadge({ status }) {
  const c = statusConfig[status] ?? statusConfig.CANCELLED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
