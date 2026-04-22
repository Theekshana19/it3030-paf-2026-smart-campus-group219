import { useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/common/Icon.jsx';
import CampusMapPreviewCard from '../components/CampusMapPreviewCard.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import DashboardQuickActions from '../components/DashboardQuickActions.jsx';
import DashboardSummaryCards from '../components/DashboardSummaryCards.jsx';
import RecentChangesSection from '../components/RecentChangesSection.jsx';
import ResourceDistributionSection from '../components/ResourceDistributionSection.jsx';
import useDashboardOverview from '../hooks/useDashboardOverview.js';

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    overview,
    distribution,
    recentChanges,
    recentPage,
    recentSize,
    recentTotalPages,
    recentTotalItems,
    recentLoading,
    loading,
    error,
    loadRecentChanges,
    retry,
  } = useDashboardOverview();

  useEffect(() => {
    retry();
  }, [retry]);

  return (
    <div className="p-8 space-y-8">
      <DashboardHeader
        onFilter={() => toast.message('Dashboard filters will be available in a follow-up enhancement.')}
        onNewResource={() => navigate('/resources/new')}
      />

      {error ? (
        <section className="rounded-xl bg-error-container text-on-error-container px-6 py-4 flex items-center justify-between gap-4">
          <span className="font-medium text-sm">{error}</span>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-error text-on-error text-sm font-semibold shrink-0"
            onClick={retry}
          >
            Retry
          </button>
        </section>
      ) : null}

      <DashboardSummaryCards overview={overview} loading={loading} />

      <section className="grid grid-cols-12 gap-8">
        <div className="col-span-12 xl:col-span-8 space-y-8">
          <ResourceDistributionSection distribution={distribution} loading={loading} />
          <RecentChangesSection
            items={recentChanges}
            loading={recentLoading}
            page={recentPage}
            size={recentSize}
            totalPages={recentTotalPages}
            totalItems={recentTotalItems}
            onPrevPage={() => loadRecentChanges(Math.max(0, recentPage - 1))}
            onNextPage={() => loadRecentChanges(recentPage + 1)}
          />
        </div>
        <div className="col-span-12 xl:col-span-4 space-y-8">
          <DashboardQuickActions
            onAddResource={() => navigate('/resources/new')}
            onManageTags={() => navigate('/tag-management')}
            onViewSchedule={() => navigate('/status-scheduling')}
          />
          <CampusMapPreviewCard />
        </div>
      </section>

      <button
        type="button"
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
        aria-label="Assistant"
      >
        <Icon name="smart_toy" className="text-3xl" />
      </button>
    </div>
  );
}
