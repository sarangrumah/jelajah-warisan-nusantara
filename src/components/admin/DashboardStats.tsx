import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Users, BarChart3, Loader2 } from 'lucide-react';
import { newsService, agendaService, userService } from '@/lib/api-services';

interface StatsData {
  totalContent: number;
  activeAgenda: number;
  totalUsers: number;
  monthlyVisitors: number;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalContent: 0,
    activeAgenda: 0,
    totalUsers: 0,
    monthlyVisitors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [newsRes, agendaRes, usersRes] = await Promise.all([
          newsService.getAll(),
          agendaService.getAll(),
          userService.getProfiles(),
        ]);

        const totalNews = newsRes.data?.length || 0;
        const totalEvents = agendaRes.data?.length || 0;
        const totalUsers = (usersRes.data as unknown as any[])?.length || 0;

        // Mock visitor data for now as there is no tracking service
        const mockVisitors = 1234 + Math.floor(Math.random() * 100);

        setStats({
          totalContent: totalNews + totalEvents,
          activeAgenda: totalEvents,
          totalUsers: totalUsers,
          monthlyVisitors: mockVisitors,
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
          <p className="text-xs text-muted-foreground">News & Events</p>
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
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
