import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Users, BarChart3, Loader2 } from 'lucide-react';
import { dashboardService } from '@/lib/api-services';

interface StatsData {
  totalContent: number;
  activeAgenda: number;
  totalUsers: number;
  monthlyVisitors: number;
  visitorDelta: number | null;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalContent: 0,
    activeAgenda: 0,
    totalUsers: 0,
    monthlyVisitors: 0,
    visitorDelta: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getStats();
        const d: any = res.data || {};
        // Month-over-month visitor delta from the series (last vs previous month)
        const series: any[] = Array.isArray(d.monthlySeries) ? d.monthlySeries : [];
        let visitorDelta: number | null = null;
        if (series.length >= 2) {
          const cur = Number(series[series.length - 1]?.visitors || 0);
          const prev = Number(series[series.length - 2]?.visitors || 0);
          visitorDelta = prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null;
        }
        setStats({
          totalContent: d.totalContent || 0,
          activeAgenda: d.activeAgenda || 0,
          totalUsers: d.totalUsers || 0,
          monthlyVisitors: d.visitorsThisMonth || 0,
          visitorDelta,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <Loader2 className="h-4 w-4 animate-spin" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Konten</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalContent}</div>
          <p className="text-xs text-muted-foreground">Media, Publikasi & Agenda</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agenda Aktif</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeAgenda}</div>
          <p className="text-xs text-muted-foreground">Upcoming Events</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">Registered Users</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visitor Bulanan</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.monthlyVisitors.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.visitorDelta === null
              ? 'Pengunjung unik bulan ini'
              : `${stats.visitorDelta >= 0 ? '+' : ''}${stats.visitorDelta}% dari bulan lalu`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
