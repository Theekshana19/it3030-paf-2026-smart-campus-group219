import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function UserDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Dashboard</CardTitle>
            <CardDescription>
              Welcome, {user?.name || 'Student'}. This is the role-based dashboard for USER accounts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Your modules, requests, and personal activities should appear here. Admin-only tools are hidden from this view.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
