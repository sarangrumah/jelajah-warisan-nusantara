import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  LogOut, 
  Shield,
  Home,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
  isAdmin: boolean;
  canEdit: boolean;
  onSignOut: () => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'banner', label: 'Banner', icon: FileText },
  { id: 'company', label: 'Profil', icon: Settings },
  { id: 'museum', label: 'Museum', icon: Settings },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'media', label: 'Media', icon: FileText },
  { id: 'sop', label: 'SOP', icon: FileText },
  { id: 'career-mgmt', label: 'Career Mgmt', icon: FileText },
  { id: 'career-submissions', label: 'Submissions', icon: Users },
  { id: 'faq', label: 'FAQ', icon: Settings },
  // { id: 'career', label: 'Karir', icon: Users },
  { id: 'users', label: 'Users', icon: Shield },
];

const AdminSidebar = ({ activeTab, setActiveTab, userRole, isAdmin, canEdit, onSignOut }: AdminSidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const isMenuItemDisabled = (itemId: string) => {
    if (itemId === 'overview') return false;
    if (itemId === 'users') return !isAdmin;
    return !canEdit;
  };

  const SidebarContent = ({ className = "" }: { className?: string }) => (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Logo section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">M</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-heritage-gradient">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Museum dan Cagar Budaya</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <Badge variant={isAdmin ? 'default' : 'secondary'}>
            <Shield className="w-3 h-3 mr-1" />
            {userRole}
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const disabled = isMenuItemDisabled(item.id);
          
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !disabled && handleTabChange(item.id)}
              disabled={disabled}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => {
            navigate('/');
            setIsMobileMenuOpen(false);
          }}
        >
          <Home className="w-4 h-4 mr-3" />
          Lihat Website
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => {
            onSignOut();
            setIsMobileMenuOpen(false);
          }}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Keluar
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default AdminSidebar;
