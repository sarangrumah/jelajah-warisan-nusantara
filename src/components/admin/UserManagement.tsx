import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users,
  Shield,
  UserPlus,
  Edit3,
  Trash2,
  Loader2,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  created_at: string;
  profiles?: {
    display_name: string;
  };
  user_roles?: {
    role: string;
  }[];
}

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'editor' | 'viewer';
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>('viewer');
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch users with their profiles and roles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch user roles separately
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine the data
      const transformedUsers: User[] = profilesData?.map(profile => {
        const userRoles = rolesData?.filter(role => role.user_id === profile.user_id) || [];
        return {
          id: profile.user_id,
          email: '', // We'll need to get this from another source or skip it
          created_at: profile.created_at,
          profiles: {
            display_name: profile.display_name || 'No Name',
          },
          user_roles: userRoles.map(role => ({ role: role.role })),
        };
      }) || [];

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data pengguna',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    setSaving(true);
    try {
      // First, remove existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then add new role with proper typing
      const { error } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: userId, 
          role: role as 'admin' | 'editor' | 'viewer'
        });

      if (error) throw error;

      // Update local state
      setUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? {
                ...user,
                user_roles: [{ role: role }]
              }
            : user
        )
      );

      toast({
        title: 'Berhasil',
        description: 'Role pengguna berhasil diperbarui',
      });
      
      setShowRoleDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Gagal memperbarui role pengguna',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'editor':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'editor':
        return 'Editor';
      default:
        return 'Viewer';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Pengguna</h2>
          <p className="text-muted-foreground">
            Kelola pengguna dan hak akses sistem
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Daftar Pengguna
          </CardTitle>
          <CardDescription>
            Kelola role dan hak akses pengguna sistem
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Bergabung</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.profiles?.display_name || 'No Name'}
                  </TableCell>
                  <TableCell>{user.email || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.user_roles?.[0]?.role || 'viewer')}>
                      <Shield className="w-3 h-3 mr-1" />
                      {getRoleLabel(user.user_roles?.[0]?.role || 'viewer')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setNewRole(user.user_roles?.[0]?.role || 'viewer');
                        setShowRoleDialog(true);
                      }}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Role
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {users.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Belum ada pengguna
              </h3>
              <p className="text-muted-foreground">
                Pengguna akan muncul di sini setelah mereka mendaftar
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Edit Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role Pengguna</DialogTitle>
            <DialogDescription>
              Ubah role untuk {selectedUser?.profiles?.display_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Administrator - Akses penuh
                    </div>
                  </SelectItem>
                  <SelectItem value="editor">
                    <div className="flex items-center">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editor - Dapat mengelola konten
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Viewer - Hanya melihat
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRoleDialog(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={() => selectedUser && updateUserRole(selectedUser.id, newRole)}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;