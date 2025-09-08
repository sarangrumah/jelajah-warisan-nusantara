import { useState, useEffect } from 'react';
import { userService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
import { useAuth } from '@/hooks/useAuth';

interface User {
  id: string;
  email: string;
  created_at: string;
  email_verified?: boolean;
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
  role: 'admin' | 'approver' | 'viewer' | 'super-admin';
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>('viewer');
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  // Create user dialog state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<string>('viewer');
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const isSuperAdmin = Array.isArray(authUser?.roles) ? authUser!.roles.includes('super-admin') : false;
  const [showEditInfoDialog, setShowEditInfoDialog] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch user profiles
      const profilesResponse = await userService.getProfiles();
      
      if (profilesResponse.error) {
        throw new Error(profilesResponse.error);
      }

      const profilesData = profilesResponse.data || [];


      
      // Transform the data for display
      const transformedUsers: User[] = Array.isArray(profilesData) ? profilesData.map((profile: any) => (
      {
        id: profile.user_id || profile.id,
        email: profile.email || '', 
        created_at: profile.created_at,
        email_verified: profile.email_verified,
        profiles: {
          display_name: profile.display_name || 'No Name',
        },
        user_roles: Array.isArray(profile.roles) && profile.roles.length > 0 
          ? [{ role: profile.roles[0] || 'viewer' }] 
          : [{ role: 'viewer' }],
      })) : [];

      console.log(profilesResponse)
      console.log(transformedUsers)

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

  const resetCreateForm = () => {
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserName('');
    setNewUserRole('viewer');
  };

  const handleCreateUser = async () => {
    if (!isSuperAdmin) return;
    if (!newUserEmail || !newUserPassword) {
      toast({ title: 'Validasi', description: 'Email dan password wajib diisi', variant: 'destructive' });
      return;
    }
    setCreating(true);
    try {
      const resp = await userService.create({
        email: newUserEmail,
        password: newUserPassword,
        display_name: newUserName,
      });

      if (resp.error) throw new Error(resp.error);

      const created: any = resp.data || {};
      const createdUserId: string | undefined = created.id || created.user_id || created.user?.id;

      if (createdUserId) {
        const roleResp = await userService.updateRole(createdUserId, newUserRole);
        if (roleResp.error) throw new Error(roleResp.error);
      }

      toast({ title: 'Berhasil', description: 'Pengguna berhasil dibuat' });
      setShowCreateDialog(false);
      resetCreateForm();
      await fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
      toast({ title: 'Error', description: 'Gagal membuat pengguna', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    setSaving(true);
    try {
      const response = await userService.updateRole(userId, role);
      
      if (response.error) {
        throw new Error(response.error);
      }

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
      case 'super-admin':
        return 'default';
      case 'approver':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'super-admin':
        return 'Super Administrator';
      case 'approver':
        return 'Approved';
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
        {isSuperAdmin && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Buat Pengguna
          </Button>
        )}
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
                <TableHead>Status</TableHead>
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
                    <div className="flex items-center gap-3">
                      <Badge variant={user.email_verified ? 'default' : 'secondary'}>
                        {user.email_verified ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch
                        id={`active_${user.id}`}
                        checked={!!user.email_verified}
                        onCheckedChange={async (checked) => {
                          if (!isSuperAdmin) return;
                          setSaving(true);
                          try {
                            const resp = await userService.setActive(user.id, checked);
                            if (resp.error) throw new Error(resp.error);
                            setUsers((prev) => prev.map(u => u.id === user.id ? { ...u, email_verified: checked } : u));
                            toast({ title: 'Berhasil', description: `Pengguna ${checked ? 'diaktifkan' : 'dinonaktifkan'}` });
                          } catch (err) {
                            console.error('Set active error:', err);
                            toast({ title: 'Error', description: 'Gagal mengubah status pengguna', variant: 'destructive' });
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={!isSuperAdmin}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    {isSuperAdmin ? (
                      <div className="flex items-center gap-2">
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setEditName(user.profiles?.display_name || '');
                            setEditEmail(user.email || '');
                            setShowEditInfoDialog(true);
                          }}
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Info
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            const activate = confirm(`Aktifkan pengguna ${user.email}? Klik Cancel untuk nonaktifkan.`);
                            setSaving(true);
                            try {
                              const resp = await userService.setActive(user.id, activate);
                              if (resp.error) throw new Error(resp.error);
                              toast({ title: 'Berhasil', description: `Pengguna ${activate ? 'diaktifkan' : 'dinonaktifkan'}` });
                              await fetchUsers();
                            } catch (err) {
                              console.error('Set active error:', err);
                              toast({ title: 'Error', description: 'Gagal mengubah status pengguna', variant: 'destructive' });
                            } finally {
                              setSaving(false);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Badge variant="outline">No actions</Badge>
                    )}
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
                      Administrator - Akses penuh mengelola kontent
                    </div>
                  </SelectItem>
                  <SelectItem value="super-admin">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Super Administrator - Akses penuh
                    </div>
                  </SelectItem>
                  <SelectItem value="approver">
                    <div className="flex items-center">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Approver - Dapat mengelola approver kontent
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

  {/* Create User Dialog - Super Admin Only */}
  <Dialog open={showCreateDialog} onOpenChange={(open) => { setShowCreateDialog(open); if (!open) resetCreateForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Pengguna Baru</DialogTitle>
            <DialogDescription>
              Hanya Super Admin yang dapat membuat pengguna baru
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-name" className="text-right">Nama</Label>
              <Input id="new-name" className="col-span-3" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Nama lengkap" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-email" className="text-right">Email</Label>
              <Input id="new-email" type="email" className="col-span-3" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">Password</Label>
              <Input id="new-password" type="password" className="col-span-3" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-role" className="text-right">Role</Label>
              <Select value={newUserRole} onValueChange={setNewUserRole}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">
                    <div className="flex items-center"><Users className="w-4 h-4 mr-2" />Viewer - Hanya melihat</div>
                  </SelectItem>
                  <SelectItem value="approver">
                    <div className="flex items-center"><Edit3 className="w-4 h-4 mr-2" />Approver - Persetujuan konten</div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center"><Shield className="w-4 h-4 mr-2" />Administrator - Kelola konten</div>
                  </SelectItem>
                  <SelectItem value="super-admin">
                    <div className="flex items-center"><Shield className="w-4 h-4 mr-2" />Super Administrator - Akses penuh</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { setShowCreateDialog(false); resetCreateForm(); }}>
              Batal
            </Button>
            <Button type="button" onClick={handleCreateUser} disabled={creating}>
              {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Simpan
            </Button>
          </DialogFooter>
      </DialogContent>
  </Dialog>

      {/* Edit User Info Dialog - Super Admin Only */}
      <Dialog open={showEditInfoDialog} onOpenChange={setShowEditInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Info Pengguna</DialogTitle>
            <DialogDescription>
              Perbarui nama dan email pengguna
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Nama</Label>
              <Input className="col-span-3" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Email</Label>
              <Input type="email" className="col-span-3" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowEditInfoDialog(false)}>Batal</Button>
            <Button
              type="button"
              onClick={async () => {
                if (!selectedUser) return;
                setSaving(true);
                try {
                  const resp = await userService.update(selectedUser.id, { email: editEmail, display_name: editName });
                  if (resp.error) throw new Error(resp.error);
                  toast({ title: 'Berhasil', description: 'Info pengguna diperbarui' });
                  setShowEditInfoDialog(false);
                  await fetchUsers();
                } catch (err) {
                  console.error('Update user error:', err);
                  toast({ title: 'Error', description: 'Gagal memperbarui info', variant: 'destructive' });
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
