import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { SessionTimeoutIndicator } from '@/components/SessionTimeoutIndicator';
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
import UserManagement from '@/components/admin/UserManagement';
import CareerPostingManagement from '@/components/admin/CareerPostingManagement';
import CareerSubmissionManagement from '@/components/admin/CareerSubmissionManagement';
import SOPManagement from '@/components/admin/SOPManagement';
import MasterCollectionManagement from '@/components/admin/MasterCollectionManagement';
import MemoryWorldManagement from '@/components/admin/MemoryWorldManagement';
import PemanfaatanAssetManagement from '@/components/admin/PemanfaatanAssetManagement';
import OrganizationalStructureManagement from '@/components/admin/OrganizationalStructureManagement';
import MerchandiseManagement from '@/components/admin/MerchandiseManagement';
import PublicationManagement from '@/components/admin/PublicationManagement';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';
import { authService } from '@/lib/api-services';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ActivityLogManagement from '@/components/admin/ActivityLogManagement';
import TranslationManagement from '@/components/admin/TranslationManagement';
import ConservationManagement from '@/components/admin/ConservationManagement';
import DashboardStats from '@/components/admin/DashboardStats';
import FeatureDashboard from '@/components/admin/FeatureDashboard';

const AdminDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('viewer');
  const [activeTab, setActiveTab] = useState('overview');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const { toast } = useToast();

  // Initialize idle timeout for admin session management (5 minutes)
  useIdleTimeout({
    timeoutMinutes: 5,
    warningMinutes: 1,
    onTimeout: () => {
      // Additional cleanup or logging can be added here
      console.log('Admin session timed out due to inactivity');
    },
    onWarning: () => {
      // Additional warning handling can be added here
      console.log('Admin session warning displayed');
    }
  });

  useEffect(() => {
    if (user) {
      // User roles are already included in the auth response
      // Get the primary role (first role if multiple)
      const primaryRole = user.roles && user.roles.length > 0 ? user.roles[0] : 'viewer';
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

  const isAdmin = userRole === 'super-admin';
  const canEdit = userRole === 'admin' || userRole === 'approver' || userRole === 'super-admin';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Session timeout indicator */}
      <SessionTimeoutIndicator timeoutMinutes={5} warningMinutes={1} />
      
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        isAdmin={isAdmin}
        canEdit={canEdit}
        onSignOut={handleSignOut}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
      />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <DashboardStats />
              
              <FeatureDashboard />

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
          {activeTab === 'master-collection' && <MasterCollectionManagement userRole={userRole} />}
          {activeTab === 'agenda' && <AgendaManagement userRole={userRole}/>}
          {activeTab === 'media' && <MediaManagement userRole={userRole}/>}
          {activeTab === 'faq' && <FAQManagement userRole={userRole}/>}
          {activeTab === 'sop' && <SOPManagement userRole={userRole} />}
          {activeTab === 'career-mgmt' && <CareerPostingManagement userRole={userRole} />}
          {activeTab === 'career-submissions' && <CareerSubmissionManagement userRole={userRole} />}
          {activeTab === 'memoryworld' && <MemoryWorldManagement userRole={userRole} />}
          {activeTab === 'pemanfaatan-asset' && <PemanfaatanAssetManagement userRole={userRole} />}
          {activeTab === 'conservation' && <ConservationManagement />}
          {activeTab === 'organizational-structure' && <OrganizationalStructureManagement userRole={userRole} />}
          {activeTab === 'translations' && <TranslationManagement />}
          {activeTab === 'activity-log' && <ActivityLogManagement userRole={userRole} />}
          {activeTab === 'merchandise' && <MerchandiseManagement userRole={userRole} />}
          {activeTab === 'publication' && <PublicationManagement userRole={userRole} />}
          {/* {activeTab === 'career' && <CareerManagement />} */}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </main>

      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ubah Kata Sandi</DialogTitle>
          </DialogHeader>
          <ChangePasswordForm
            onSubmit={async (payload) => {
              const response = await authService.changePassword(payload);

              if (response.error) {
                throw new Error(response.error);
              }

              toast({
                title: 'Berhasil',
                description: response.data?.message ?? 'Password berhasil diperbarui.',
              });
              setIsChangePasswordOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
