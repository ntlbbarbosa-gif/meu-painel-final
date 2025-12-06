import { Globe, GlobeLock, Calendar, AlertTriangle, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { SitesTable } from '@/components/sites/SitesTable';
import { useSites } from '@/hooks/useSites';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { sites, loading, toggleSiteStatus, getStats } = useSites();
  const stats = getStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema de aluguel de sites</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Sites Ativos"
          value={stats.activeSites}
          icon={Globe}
          variant="success"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Sites Desativados"
          value={stats.inactiveSites}
          icon={GlobeLock}
          variant="danger"
        />
        <StatCard
          title="Próximos Pagamentos"
          value={stats.upcomingPayments}
          icon={Calendar}
          variant="default"
        />
        <StatCard
          title="Pagamentos Atrasados"
          value={stats.overduePayments}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Receita Estimada"
          value={`R$ ${stats.estimatedRevenue.toLocaleString('pt-BR')}`}
          icon={DollarSign}
          variant="success"
          trend={{ value: 8, positive: true }}
        />
      </div>

      {/* Charts */}
      <RevenueChart />

      {/* Recent Sites */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Sites Recentes</h2>
            <p className="text-sm text-muted-foreground">Últimos sites cadastrados no sistema</p>
          </div>
        </div>
        <SitesTable sites={sites.slice(0, 5)} onToggleStatus={toggleSiteStatus} />
      </div>
    </div>
  );
}
