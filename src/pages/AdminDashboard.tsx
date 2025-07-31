import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  LogOut, 
  Shield,
  Home,
  BarChart3
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import ContentManagement from '@/components/admin/ContentManagement';
import AgendaManagement from '@/components/admin/AgendaManagement';
import UserManagement from '@/components/admin/UserManagement';

const AdminDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('viewer');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      // Fetch user role
      const fetchUserRole = async () => {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setUserRole(data.role);
        }
      };
      
      fetchUserRole();
    }
  }, [user]);

  // Redirect if not authenticated
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isAdmin = userRole === 'admin';
  const canEdit = userRole === 'admin' || userRole === 'editor';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-heritage-gradient">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">
                  Museum dan Cagar Budaya
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant={isAdmin ? 'default' : 'secondary'}>
                <Shield className="w-3 h-3 mr-1" />
                {userRole}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4 mr-2" />
                Lihat Website
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 mb-8">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" disabled={!canEdit}>
              <FileText className="w-4 h-4 mr-2" />
              Konten
            </TabsTrigger>
            <TabsTrigger value="agenda" disabled={!canEdit}>
              <Calendar className="w-4 h-4 mr-2" />
              Agenda
            </TabsTrigger>
            <TabsTrigger value="users" disabled={!isAdmin}>
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Konten</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 dari bulan lalu</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agenda Aktif</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">+4 minggu ini</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">+1 bulan ini</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Visitor Bulanan</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% dari bulan lalu</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Selamat Datang di Admin Panel</CardTitle>
                <CardDescription>
                  Kelola konten website Museum dan Cagar Budaya dengan mudah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Anda login sebagai <Badge variant="secondary">{userRole}</Badge>. 
                  {canEdit ? ' Anda dapat mengelola konten dan agenda.' : ' Anda memiliki akses view-only.'}
                  {isAdmin && ' Sebagai admin, Anda memiliki akses penuh untuk mengelola pengguna dan pengaturan sistem.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="agenda">
            <AgendaManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;