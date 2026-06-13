import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  Building2, Landmark, Users, Calendar, TrendingUp, 
  Activity, Database, Eye, FileText, Image 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useSitesData } from '@/hooks/useSitesData';
import { newsService, agendaService, dashboardService } from '@/lib/api-services';
import { logError, logInfo } from '@/utils/logger';

interface DashboardStats {
  totalSites: number;
  totalNews: number;
  totalEvents: number;
  totalCompanyProfiles: number;
  museumsCount: number;
  heritageCount: number;
  recentActivity: any[];
  sitesByType: { name: string; value: number; color: string }[];
  monthlyData: { month: string; visitors: number; users: number; content: number }[];
  kpis: { totalContent: number; totalUsers: number; visitorsThisMonth: number; activeAgenda: number };
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { companyData } = useCompanyData();
  const { sitesData, museumsCount, heritageCount } = useSitesData();
  const [stats, setStats] = useState<DashboardStats>({
    totalSites: 0,
    totalNews: 0,
    totalEvents: 0,
    totalCompanyProfiles: 0,
    museumsCount: 0,
    heritageCount: 0,
    recentActivity: [],
    sitesByType: [],
    monthlyData: [],
    kpis: { totalContent: 0, totalUsers: 0, visitorsThisMonth: 0, activeAgenda: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        logInfo('Dashboard: Starting to fetch data');
        
        // Fetch various data (real dashboard stats + counts)
        const [newsResponse, eventsResponse, statsRes] = await Promise.all([
          newsService.getAll(),
          agendaService.getAll(),
          dashboardService.getStats().catch(() => ({ data: null } as any)),
        ]);

        const totalNews = newsResponse.data?.length || 0;
        const totalEvents = eventsResponse.data?.length || 0;
        const sd: any = statsRes?.data || {};
        const monthlyData = (Array.isArray(sd.monthlySeries) ? sd.monthlySeries : []).map((m: any) => ({
          month: m.month,
          visitors: Number(m.visitors || 0),
          users: Number(m.users || 0),
          content: Number(m.content || 0),
        }));
        const recentActivity = (Array.isArray(sd.recentActivity) ? sd.recentActivity : []).map(
          (r: any, i: number) => ({
            id: i,
            type: 'site',
            title: r.activity_type,
            date: r.created_at ? new Date(r.created_at).toLocaleString() : '',
            status: r.user_type || 'system',
          })
        );
        const kpis = {
          totalContent: sd.totalContent || 0,
          totalUsers: sd.totalUsers || 0,
          visitorsThisMonth: sd.visitorsThisMonth || 0,
          activeAgenda: sd.activeAgenda || 0,
        };

        // Calculate sites by type
        const sitesByType = [
          { name: 'Museums', value: museumsCount, color: COLORS[0] },
          { name: 'Heritage Sites', value: heritageCount, color: COLORS[1] },
          { name: 'Other Sites', value: Math.max(0, sitesData.length - museumsCount - heritageCount), color: COLORS[2] },
        ].filter(item => item.value > 0);

        setStats({
          totalSites: sitesData.length,
          totalNews,
          totalEvents,
          totalCompanyProfiles: companyData ? 1 : 0,
          museumsCount,
          heritageCount,
          recentActivity,
          sitesByType,
          monthlyData,
          kpis,
        });
        
        logInfo('Dashboard: Data fetched successfully', {
          totalSites: sitesData.length,
          totalNews,
          totalEvents,
          museumsCount,
          heritageCount
        });
      } catch (error) {
        logError('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [sitesData, museumsCount, heritageCount, companyData]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-300 rounded"></div>
              <div className="h-96 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title', 'Dashboard')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('dashboard.subtitle', 'Overview of museum and heritage site management')}
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <Activity className="w-4 h-4 mr-2" />
            {t('dashboard.refresh', 'Refresh Data')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.totalSites', 'Total Sites')}
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSites}</div>
              <p className="text-xs text-muted-foreground">
                {stats.museumsCount} museums, {stats.heritageCount} heritage sites
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.totalNews', 'News Articles')}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNews}</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.publishedArticles', 'Published articles')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.totalEvents', 'Events')}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.scheduledEvents', 'Scheduled events')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.companyProfiles', 'Company Profiles')}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCompanyProfiles}</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.activeProfiles', 'Active profiles')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t('dashboard.overview', 'Overview')}</TabsTrigger>
            <TabsTrigger value="sites">{t('dashboard.sites', 'Sites')}</TabsTrigger>
            <TabsTrigger value="activity">{t('dashboard.activity', 'Recent Activity')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('dashboard.analytics', 'Analytics')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sites Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.sitesDistribution', 'Sites Distribution')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.sitesDistributionDesc', 'Breakdown of museums and heritage sites')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.sitesByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.sitesByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.monthlyTrends', 'Monthly Trends')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.monthlyTrendsDesc', 'Content creation trends over time')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={stats.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" name="Visitors" dataKey="visitors" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" name="New Users" dataKey="users" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                      <Area type="monotone" name="New Content" dataKey="content" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sites" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.allSites', 'All Sites')}</CardTitle>
                <CardDescription>
                  {t('dashboard.allSitesDesc', 'Comprehensive list of museums and heritage sites')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sitesData.slice(0, 10).map((site) => (
                    <div key={site.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          {site.type === 'museum' ? (
                            <Building2 className="h-4 w-4 text-primary" />
                          ) : (
                            <Landmark className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{site.name}</h4>
                          <p className="text-sm text-muted-foreground">{site.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={site.is_approved ? 'default' : 'secondary'}>
                          {site.is_approved ? t('dashboard.approved', 'Approved') : t('dashboard.pending', 'Pending')}
                        </Badge>
                        <Badge variant="outline">
                          {site.type || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.recentActivity', 'Recent Activity')}</CardTitle>
                <CardDescription>
                  {t('dashboard.recentActivityDesc', 'Latest updates and changes in the system')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {activity.type === 'news' && <FileText className="h-4 w-4 text-primary" />}
                        {activity.type === 'event' && <Calendar className="h-4 w-4 text-primary" />}
                        {activity.type === 'site' && <Building2 className="h-4 w-4 text-primary" />}
                        {activity.type === 'collection' && <Image className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                      <Badge variant={activity.status === 'published' ? 'default' : 'secondary'}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Content Creation Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('dashboard.contentTrends', 'Content Creation Trends')}</CardTitle>
                    <CardDescription>
                      {t('dashboard.contentTrendsDesc', 'Monthly content creation statistics')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar name="Visitors" dataKey="visitors" fill="#8884d8" />
                        <Bar name="New Users" dataKey="users" fill="#82ca9d" />
                        <Bar name="New Content" dataKey="content" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
  
                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('dashboard.performanceMetrics', 'Performance Metrics')}</CardTitle>
                    <CardDescription>
                      {t('dashboard.performanceMetricsDesc', 'Key performance indicators')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t('dashboard.totalContent', 'Total Konten')}</span>
                        <span className="text-sm font-bold">{stats.kpis.totalContent.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t('dashboard.activeAgenda', 'Agenda Aktif')}</span>
                        <span className="text-sm font-bold">{stats.kpis.activeAgenda.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t('dashboard.totalUsers', 'Total Pengguna')}</span>
                        <span className="text-sm font-bold">{stats.kpis.totalUsers.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t('dashboard.visitorsThisMonth', 'Pengunjung Bulan Ini')}</span>
                        <span className="text-sm font-bold">{stats.kpis.visitorsThisMonth.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
    );
  };

export default Dashboard;