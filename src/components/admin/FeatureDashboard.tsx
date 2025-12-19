import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import {
  newsService, agendaService, museumService, heritageService
} from '@/lib/api-services';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const FeatureDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [contentData, setContentData] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, agendaRes, museumRes, heritageRes] = await Promise.all([
          newsService.getAll(),
          agendaService.getAll(),
          museumService.getAll(),
          heritageService.getAll(),
        ]);

        // Content Distribution Data
        const contentStats = [
          { name: 'News', value: newsRes.data?.length || 0 },
          { name: 'Events', value: agendaRes.data?.length || 0 },
          { name: 'Museums', value: museumRes.data?.length || 0 },
          { name: 'Heritage', value: heritageRes.data?.length || 0 },
        ];
        setContentData(contentStats);

        // Mock User Growth Data (since we don't have historical data endpoint)
        // In a real app, this would come from an analytics endpoint
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const mockGrowth = months.map(month => ({
          name: month,
          users: Math.floor(Math.random() * 50) + 10,
          visitors: Math.floor(Math.random() * 500) + 100,
        }));
        setUserGrowthData(mockGrowth);

        // Fetch Activity Logs
        // We'll use the same endpoint as ActivityLogManagement
        const token = localStorage.getItem("auth_token");
        const logsRes = await fetch(`/api/activity-log?page=1&pageSize=5&sort=timestamp&order=desc`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const logsData = await logsRes.json();
        setActivityLogs(logsData.data || []);

      } catch (error) {
        console.error('Error fetching feature dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>Breakdown of content types across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User & Visitor Growth</CardTitle>
            <CardDescription>Monthly user registration and visitor trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="visitors" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>Latest actions performed by administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No recent activity found</TableCell>
                </TableRow>
              ) : (
                activityLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{new Date(log.timestamp).toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.user_type}</Badge>
                    </TableCell>
                    <TableCell>{log.activity_type}</TableCell>
                    <TableCell>
                      {log.success ? (
                        <Badge variant="default" className="bg-green-500">Success</Badge>
                      ) : (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureDashboard;
