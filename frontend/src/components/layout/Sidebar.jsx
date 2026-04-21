import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import Icon from '../common/Icon.jsx';
import { useNavigate } from 'react-router-dom';

const navItemClass =
  'text-slate-300 hover:text-white flex items-center px-4 py-3 mx-2 my-1 transition-all hover:bg-[#4F46E5]/20 cursor-pointer rounded-lg group';
const activeClass =
  'bg-[#3525cd] text-white rounded-lg mx-2 my-1 flex items-center px-4 py-3 transition-all';

function NavItem({ to, icon, label, end, isCustomActive }) {
  const location = useLocation();
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive: routerIsActive }) =>
        (isCustomActive ? isCustomActive(location) : routerIsActive) ? activeClass : navItemClass
      }
    >
      {({ isActive: routerIsActive }) => {
        const active = isCustomActive ? isCustomActive(location) : routerIsActive;
        return (
          <>
            <Icon
              name={icon}
              className={`mr-3 ${active ? '' : 'group-hover:translate-x-1 duration-200'}`}
            />
            <span className="font-manrope text-sm tracking-wide">{label}</span>
          </>
        );
      }}
    </NavLink>
  );
}

function catalogueNavActive({ pathname }) {
  if (pathname === '/resources/new') return false;
  return pathname === '/resources' || (pathname.startsWith('/resources/') && !pathname.startsWith('/resources/new'));
}

function schedulingNavActive({ pathname }) {
  return pathname === '/scheduling' || pathname.endsWith('/schedules');
}

export default function Sidebar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#545f73] dark:bg-slate-900 flex flex-col py-7 shadow-2xl z-50">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#3525cd] flex items-center justify-center">
          <Icon name="school" className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white font-manrope">Operations Hub</h2>
          <p className="text-xs text-slate-300 font-manrope">University Facilities</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        <NavItem to="/" icon="dashboard" label="Dashboard" end />
        <NavItem
          to="/resources"
          icon="inventory_2"
          label="Resources Catalogue"
          isCustomActive={catalogueNavActive}
        />
        <NavItem to="/resources/new" icon="add_circle" label="Add Resource" />
        <NavItem
          to="/scheduling"
          icon="calendar_today"
          label="Status Scheduling"
          isCustomActive={schedulingNavActive}
        />
        <NavItem to="/notifications" icon="notifications" label="Notifications" />
        <NavItem to="/bookings" icon="event" label="Bookings" />
        <NavItem to="/tickets" icon="confirmation_number" label="Tickets" />
        <NavItem to="/tags" icon="sell" label="Tag Management" />
        {isAdmin ? <NavItem to="/users" icon="group" label="User Management" /> : null}
        <NavItem to="/settings" icon="settings" label="Settings" />
      </nav>
      <div className="mt-auto px-4 py-4 bg-[#4a5568]/30 mx-2 rounded-xl mb-4 text-center">
        <button
          type="button"
          className="bg-white text-[#3525cd] font-bold py-2.5 px-4 rounded-lg w-full text-xs font-manrope shadow-sm hover:scale-95 transition-transform"
        >
          Quick Schedule
        </button>
      </div>
      <div className="border-t border-slate-600/50 pt-4">
        <div className="text-slate-300 hover:text-white flex items-center px-4 py-2 mx-2 cursor-pointer rounded-lg group">
          <Icon name="contact_support" className="mr-3 text-sm" />
          <span className="font-manrope text-sm tracking-wide">Support</span>
        </div>
        <button
          type="button"
          className="w-full text-left text-slate-300 hover:text-white flex items-center px-4 py-2 mx-2 cursor-pointer rounded-lg group"
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
        >
          <Icon name="logout" className="mr-3 text-sm" />
          <span className="font-manrope text-sm tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
}
