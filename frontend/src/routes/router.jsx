import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import AddResourcePage from '../features/resources/pages/AddResourcePage.jsx';
import ResourceCataloguePage from '../features/resources/pages/ResourceCataloguePage.jsx';
import ResourceDetailsPage from '../features/resources/pages/ResourceDetailsPage.jsx';
import ResourceStatusSchedulingPage from '../features/resources/pages/ResourceStatusSchedulingPage.jsx';
import EditResourcePage from '../features/resources/pages/EditResourcePage.jsx';
import StatusSchedulingOverviewPage from '../features/scheduling/pages/StatusSchedulingOverviewPage.jsx';
import TagManagementPage from '../features/tags/pages/TagManagementPage.jsx';

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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <PlaceholderPage title="Dashboard" />, handle: { crumb: 'Dashboard' } },
      {
        path: 'resources',
        element: <ResourceCataloguePage />,
        handle: { crumb: 'Facilities Catalogue' },
      },
      {
        path: 'resources/new',
        element: <AddResourcePage />,
        handle: { crumb: 'Add New Resource' },
      },
      {
        path: 'resources/:resourceId/schedules',
        element: <ResourceStatusSchedulingPage />,
        handle: { crumb: 'Status schedules' },
      },
      {
        path: 'resources/:resourceId/edit',
        element: <EditResourcePage />,
        handle: { crumb: 'Edit Resource' },
      },
      {
        path: 'resources/:resourceId',
        element: <ResourceDetailsPage />,
        handle: { crumb: 'Resource details' },
      },
      {
        path: 'status-scheduling',
        element: <StatusSchedulingOverviewPage />,
        handle: { crumb: 'Status scheduling' },
      },
      {
        path: 'scheduling',
        element: <Navigate to="/status-scheduling" replace />,
        handle: { crumb: 'Status scheduling' },
      },
      {
        path: 'tag-management',
        element: <TagManagementPage />,
        handle: { crumb: 'Campus Tag Manager' },
      },
      {
        path: 'tags',
        element: <Navigate to="/tag-management" replace />,
        handle: { crumb: 'Campus Tag Manager' },
      },
      {
        path: 'settings',
        element: <PlaceholderPage title="Settings" />,
        handle: { crumb: 'Settings' },
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
