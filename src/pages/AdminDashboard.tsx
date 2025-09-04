import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Calendar, 
  BarChart3
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import BannerManagement from '@/components/admin/BannerManagement';
import CompanyProfileManagement from '@/components/admin/CompanyProfileManagement';
import SitesManagement from '@/components/admin/SiteManagement';
import AgendaManagement from '@/components/admin/EventManagement';
import MediaManagement from '@/components/admin/MediaManagement';
import FAQManagement from '@/components/admin/FAQManagement';
import CareerManagement from '@/components/admin/CareerManagement';
import UserManagement from '@/components/admin/UserManagement';
import CareerPostingManagement from '@/components/admin/CareerPostingManagement';
import CareerSubmissionManagement from '@/components/admin/CareerSubmissionManagement';
import SOPManagement from '@/components/admin/SOPManagement';

const AdminDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('viewer');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      console.log('👤 User object:', user);
      console.log('🔐 User roles:', user.roles);
      // User roles are already included in the auth response
      // Get the primary role (first role if multiple)
      const primaryRole = user.roles && user.roles.length > 0 ? user.roles[0] : 'viewer';
      console.log('🎯 Primary role set to:', primaryRole);
      setUserRole(primaryRole);
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
  const canEdit = userRole === 'admin' || userRole === 'editor' || userRole === 'approver';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        isAdmin={isAdmin}
        canEdit={canEdit}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
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
            </div>
          )}

          {activeTab === 'banner' && <BannerManagement userRole={userRole}/>}
          {activeTab === 'company' && <CompanyProfileManagement userRole={userRole} />}
          {activeTab === 'museum' && <SitesManagement userRole={userRole}/>}
          {activeTab === 'agenda' && <AgendaManagement userRole={userRole}/>}
          {activeTab === 'media' && <MediaManagement userRole={userRole}/>}
          {activeTab === 'faq' && <FAQManagement userRole={userRole}/>}
          {activeTab === 'sop' && <SOPManagement userRole={userRole} />}
          {activeTab === 'career-mgmt' && <CareerPostingManagement userRole={userRole} />}
          {activeTab === 'career-submissions' && <CareerSubmissionManagement userRole={userRole} />}
          {/* {activeTab === 'career' && <CareerManagement />} */}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
