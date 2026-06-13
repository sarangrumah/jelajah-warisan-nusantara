import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  LineChart,
  Menu,
  Key,
  Languages,
  ShoppingBag,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
  isAdmin: boolean;
  canEdit: boolean;
  onSignOut: () => void;
  onOpenChangePassword: () => void;
}

type MenuItem = { id: string; label: string; icon: any };
type MenuGroup = { id: string; label: string; items: MenuItem[] };

const menuGroups: MenuGroup[] = [
  {
    id: 'ringkasan',
    label: 'Ringkasan',
    items: [
      { id: 'overview', label: 'Overview', icon: BarChart3 },
      { id: 'analytics', label: 'Analytics', icon: LineChart },
    ],
  },
  {
    id: 'konten',
    label: 'Konten',
    items: [
      { id: 'banner', label: 'Banner', icon: FileText },
      { id: 'museum', label: 'Museum', icon: Settings },
      { id: 'master-collection', label: 'Collections', icon: FileText },
      { id: 'agenda', label: 'Event', icon: Calendar },
      { id: 'media', label: 'Media', icon: FileText },
      { id: 'publication', label: 'Publication', icon: FileText },
      { id: 'memoryworld', label: 'Memory World', icon: FileText },
      { id: 'pemanfaatan-asset', label: 'Pemanfaatan Aset', icon: FileText },
      { id: 'conservation', label: 'Lab. Konservasi', icon: FileText },
    ],
  },
  {
    id: 'profil',
    label: 'Profil & Halaman',
    items: [
      { id: 'company', label: 'Company Profile', icon: Settings },
      { id: 'sop', label: 'SOP & Regulation', icon: FileText },
      { id: 'organizational-structure', label: 'Org. Structure', icon: Users },
      { id: 'faq', label: 'FAQ', icon: Settings },
    ],
  },
  {
    id: 'karir-toko',
    label: 'Karir & Toko',
    items: [
      { id: 'career-mgmt', label: 'Career Mgmt', icon: FileText },
      { id: 'career-submissions', label: 'Submissions', icon: Users },
      { id: 'merchandise', label: 'Merchandise', icon: ShoppingBag },
    ],
  },
  {
    id: 'pengaturan',
    label: 'Pengaturan & Sistem',
    items: [
      { id: 'menu', label: 'Menu Navigasi', icon: Settings },
      { id: 'site-settings', label: 'Site Settings', icon: Settings },
      { id: 'translations', label: 'Translations', icon: Languages },
      { id: 'content-translations', label: 'Terjemahan Konten', icon: Languages },
      { id: 'activity-log', label: 'Activity Log', icon: FileText },
      { id: 'users', label: 'Users', icon: Shield },
    ],
  },
];

const STORAGE_KEY = 'admin-sidebar-open-groups';

const AdminSidebar = ({ activeTab, setActiveTab, userRole, isAdmin, canEdit, onSignOut, onOpenChangePassword }: AdminSidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Which group contains the active tab (kept open by default).
  const activeGroupId = menuGroups.find((g) => g.items.some((i) => i.id === activeTab))?.id;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    let stored: Record<string, boolean> = {};
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch { /* ignore */ }
    // Default: all groups open on first load; always ensure the active group is open.
    const initial: Record<string, boolean> = {};
    menuGroups.forEach((g) => {
      initial[g.id] = g.id in stored ? stored[g.id] : true;
    });
    if (activeGroupId) initial[activeGroupId] = true;
    return initial;
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      const next = { ...prev, [groupId]: !prev[groupId] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const isMenuItemDisabled = (itemId: string) => {
    if (itemId === 'overview') {return false};
    if (itemId === 'users') {return !isAdmin};
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

      {/* Navigation (grouped, collapsible) */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto min-h-0">
        {menuGroups.map((group) => {
          const visibleItems = group.items.filter((item) => !isMenuItemDisabled(item.id));
          if (visibleItems.length === 0) return null;
          const isOpen = openGroups[group.id] ?? true;
          return (
            <Collapsible key={group.id} open={isOpen} onOpenChange={() => toggleGroup(group.id)}>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
                <span>{group.label}</span>
                <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pb-2">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? 'default' : 'ghost'}
                      className="w-full justify-start pl-4"
                      onClick={() => handleTabChange(item.id)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            onOpenChangePassword();
            setIsMobileMenuOpen(false);
          }}
        >
          <Key className="w-4 h-4 mr-3" />
          Ubah Kata Sandi
        </Button>
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
