import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import {
  userService
} from '@/lib/api-services';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const FeatureDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const usersRes = await userService.getProfiles();
        const users = usersRes.data || [];

        // Group users by month (last 6 months)
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - 5 + i);
          return d;
        });

        // Fetch visitor counts for each month from activity_log
        const growthDataPromises = last6Months.map(async (date) => {
          const monthName = date.toLocaleString('default', { month: 'short' });
          const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
          
          // Calculate start and end date for the month
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
          const lastDay = new Date(year, month, 0).getDate();
          const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay} 23:59:59`;

          // Count users created in this month
          const usersInMonth = (users as any[]).filter(u =>
            u.created_at && u.created_at.startsWith(monthKey)
          ).length;

          // Fetch visitor count (user_type='visitor')
          let visitorsInMonth = 0;
          try {
            const res = await fetch(`/api/activity-log?user_type=visitor&start_date=${startDate}&end_date=${endDate}&pageSize=1`, {
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {})
              }
            });
            const data = await res.json();
            visitorsInMonth = data.total || 0;
          } catch (e) {
            console.error(`Error fetching visitor count for ${monthKey}:`, e);
          }

          return {
            name: monthName,
            users: usersInMonth,
            visitors: visitorsInMonth
          };
        });

        const growthData = await Promise.all(growthDataPromises);
        setUserGrowthData(growthData);

        // Fetch Activity Logs
        // We'll use the same endpoint as ActivityLogManagement
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
      <div className="grid grid-cols-1 gap-6">
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
