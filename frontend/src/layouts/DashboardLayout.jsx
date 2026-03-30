import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import TopHeader from '../components/layout/TopHeader.jsx';

export default function DashboardLayout() {
  return (
    <div className="bg-surface text-on-surface flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        <TopHeader />
        <Outlet />
      </main>
    </div>
  );
}
