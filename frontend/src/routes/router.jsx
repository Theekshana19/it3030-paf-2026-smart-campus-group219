import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import ProtectedRoute from '../features/auth/components/ProtectedRoute.jsx';
import { useAuth } from '../features/auth/hooks/useAuth.js';
import LoginPage from '../features/auth/pages/LoginPage.jsx';
import RegisterPage from '../features/auth/pages/RegisterPage.jsx';
import NotificationsPage from '../features/notifications/pages/NotificationsPage.jsx';
import BookingsPage from '../features/bookings/pages/BookingsPage.jsx';
import TicketsPage from '../features/tickets/pages/TicketsPage.jsx';
import TicketDetailPage from '../features/tickets/pages/TicketDetailPage.jsx';
import AddResourcePage from '../features/resources/pages/AddResourcePage.jsx';
import ResourceCataloguePage from '../features/resources/pages/ResourceCataloguePage.jsx';
import ResourceDetailsPage from '../features/resources/pages/ResourceDetailsPage.jsx';
import ResourceStatusSchedulingPage from '../features/resources/pages/ResourceStatusSchedulingPage.jsx';
import EditResourcePage from '../features/resources/pages/EditResourcePage.jsx';
import UserManagementPage from '../features/users/pages/UserManagementPage.jsx';

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

function AdminRoute({ children }) {
  const { currentUser } = useAuth();

  if (currentUser?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
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
        path: 'scheduling',
        element: <PlaceholderPage title="Status scheduling" />,
        handle: { crumb: 'Scheduling' },
      },
      {
        path: 'tags',
        element: <PlaceholderPage title="Tag management" />,
        handle: { crumb: 'Tags' },
      },
      {
        path: 'settings',
        element: <PlaceholderPage title="Settings" />,
        handle: { crumb: 'Settings' },
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
        handle: { crumb: 'Notifications' },
      },
      {
        path: 'bookings',
        element: <BookingsPage />,
        handle: { crumb: 'Bookings' },
      },
      {
        path: 'tickets',
        element: <TicketsPage />,
        handle: { crumb: 'Tickets' },
      },
      {
        path: 'tickets/:ticketId',
        element: <TicketDetailPage />,
        handle: { crumb: 'Ticket' },
      },
      {
        path: 'users',
        element: (
          <AdminRoute>
            <UserManagementPage />
          </AdminRoute>
        ),
        handle: { crumb: 'Users' },
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
