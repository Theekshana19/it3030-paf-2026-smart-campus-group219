import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import AddResourcePage from '../features/resources/pages/AddResourcePage.jsx';

function PlaceholderPage({ title }) {
  return (
    <div className="p-8 md:p-10 max-w-3xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold font-headline text-on-surface tracking-tight">{title}</h2>
      <p className="text-on-surface-variant mt-3 font-body text-sm md:text-base leading-relaxed">
        This area is not implemented yet. Use the sidebar to continue exploring the hub.
      </p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<PlaceholderPage title="Dashboard" />} handle={{ crumb: 'Dashboard' }} />
        <Route
          path="resources"
          element={<PlaceholderPage title="Resources catalogue" />}
          handle={{ crumb: 'Resources' }}
        />
        <Route path="resources/new" element={<AddResourcePage />} handle={{ crumb: 'Add New Resource' }} />
        <Route
          path="scheduling"
          element={<PlaceholderPage title="Status scheduling" />}
          handle={{ crumb: 'Scheduling' }}
        />
        <Route path="tags" element={<PlaceholderPage title="Tag management" />} handle={{ crumb: 'Tags' }} />
        <Route path="settings" element={<PlaceholderPage title="Settings" />} handle={{ crumb: 'Settings' }} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
