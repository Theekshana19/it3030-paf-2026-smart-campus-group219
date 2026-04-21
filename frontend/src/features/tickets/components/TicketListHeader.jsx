import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/common/Icon.jsx';

// this component shows the gradient banner header for the ticket list page
export default function TicketListHeader({ totalItems }) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#b45309] via-[#c2410c] to-[#dc2626] p-6 md:p-8 mb-5 shadow-lg">
      {/* decorative circles */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <Icon name="confirmation_number" className="text-white text-base" />
            </div>
            <span className="text-white/70 text-sm font-manrope font-medium tracking-wide uppercase">Module C</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-white">
            Incident Tickets
          </h1>
          <p className="text-white/60 text-sm mt-1 font-body">
            Report and track campus maintenance issues
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* total count pill */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
            <div className="text-2xl font-bold text-white font-manrope">{totalItems}</div>
            <div className="text-white/60 text-xs font-body">Total</div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/tickets/new')}
            className="flex items-center gap-2 bg-white text-[#c2410c] px-5 py-2.5 rounded-xl font-bold text-sm font-manrope hover:bg-white/90 transition-all shadow-sm active:scale-95"
          >
            <Icon name="add" className="text-lg" />
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
}
