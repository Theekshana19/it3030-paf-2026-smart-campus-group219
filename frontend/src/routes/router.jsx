import PropTypes from 'prop-types';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PERMISSIONS } from '../features/auth/utils/permissions.js';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import ProtectedRoute from '../features/auth/components/ProtectedRoute.jsx';
import LoginPage from '../features/auth/pages/LoginPage.jsx';
import RegisterPage from '../features/auth/pages/RegisterPage.jsx';
import AddResourcePage from '../features/resources/pages/AddResourcePage.jsx';
import ResourceCataloguePage from '../features/resources/pages/ResourceCataloguePage.jsx';
import ResourceDetailsPage from '../features/resources/pages/ResourceDetailsPage.jsx';
import ResourceStatusSchedulingPage from '../features/resources/pages/ResourceStatusSchedulingPage.jsx';
import EditResourcePage from '../features/resources/pages/EditResourcePage.jsx';
import BookingListPage from '../features/bookings/pages/BookingListPage.jsx';
import CreateBookingPage from '../features/bookings/pages/CreateBookingPage.jsx';
import BookingDetailsPage from '../features/bookings/pages/BookingDetailsPage.jsx';
import EditBookingPage from '../features/bookings/pages/EditBookingPage.jsx';
import TicketListPage from '../features/tickets/pages/TicketListPage.jsx';
import CreateTicketPage from '../features/tickets/pages/CreateTicketPage.jsx';
import TicketDetailsPage from '../features/tickets/pages/TicketDetailsPage.jsx';
import EditTicketPage from '../features/tickets/pages/EditTicketPage.jsx';
import StatusSchedulingOverviewPage from '../features/scheduling/pages/StatusSchedulingOverviewPage.jsx';
import TagManagementPage from '../features/tags/pages/TagManagementPage.jsx';
import UserManagementPage from '../features/users/pages/UserManagementPage.jsx';
import RoleManagementPage from '../features/roles/pages/RoleManagementPage.jsx';
import DashboardPage from '../features/dashboard/pages/DashboardPage.jsx';

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
PlaceholderPage.propTypes = { title: PropTypes.string.isRequired };
export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace />, handle: { crumb: 'Dashboard' } },
          { path: 'dashboard', element: <DashboardPage />, handle: { crumb: 'Dashboard' } },
          {
            path: 'resources',
            element: <ResourceCataloguePage />,
            handle: { crumb: 'Facilities Catalogue' },
          },
          {
            element: <ProtectedRoute requiredPermission={PERMISSIONS.RESOURCE_CREATE} />,
            children: [
              {
                path: 'resources/new',
                element: <AddResourcePage />,
                handle: { crumb: 'Add New Resource' },
              },
              {
                path: 'resources/:resourceId/edit',
                element: <EditResourcePage />,
                handle: { crumb: 'Edit Resource' },
              },
            ],
          },
          {
            path: 'resources/:resourceId/schedules',
            element: <ResourceStatusSchedulingPage />,
            handle: { crumb: 'Status schedules' },
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
            path: 'bookings',
            element: <BookingListPage />,
            handle: { crumb: 'Bookings' },
          },
          {
            path: 'bookings/new',
            element: <CreateBookingPage />,
            handle: { crumb: 'New Booking' },
          },
          {
            path: 'bookings/:bookingId/edit',
            element: <EditBookingPage />,
            handle: { crumb: 'Edit Booking' },
          },
          {
            path: 'bookings/:bookingId',
            element: <BookingDetailsPage />,
            handle: { crumb: 'Booking Details' },
          },
          {
            path: 'tickets',
            element: <TicketListPage />,
            handle: { crumb: 'Incident Tickets' },
          },
          {
            path: 'tickets/new',
            element: <CreateTicketPage />,
            handle: { crumb: 'Report Issue' },
          },
          {
            path: 'tickets/:ticketId/edit',
            element: <EditTicketPage />,
            handle: { crumb: 'Edit Ticket' },
          },
          {
            path: 'tickets/:ticketId',
            element: <TicketDetailsPage />,
            handle: { crumb: 'Ticket Details' },
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
          // User management — requires VIEW_USERS permission
          {
            element: <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_USERS} />,
            children: [
              {
                path: 'users',
                element: <UserManagementPage />,
                handle: { crumb: 'User Management' },
              },
            ],
          },

          // Role management — requires VIEW_ROLES permission
          {
            element: <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ROLES} />,
            children: [
              {
                path: 'roles',
                element: <RoleManagementPage />,
                handle: { crumb: 'Role Management' },
              },
            ],
          },
          {
            path: 'settings',
            element: <PlaceholderPage title="Settings" />,
            handle: { crumb: 'Settings' },
          },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
