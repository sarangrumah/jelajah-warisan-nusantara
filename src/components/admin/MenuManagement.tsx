import { useEffect, useState } from 'react';
import { menuService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Edit, Plus, Save, Trash, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SortableList } from '@/components/admin/SortableList';
import { useReorder } from '@/hooks/useReorder';

interface MenuItem {
  id?: string;
  label: string;
  label_en?: string;
  href?: string;
  parent_id?: string | null;
  display_order?: number;
  is_active?: boolean;
}

const NO_PARENT = '__top__';

const emptyMenuItem: MenuItem = {
  label: '',
  label_en: '',
  href: '',
  parent_id: null,
  is_active: true,
};

/**
 * CMS for the visitor navigation menu (tb_menu, 2 levels).
 * Ordering within each level reuses SortableList (drag-and-drop + manual number).
 */
const MenuManagement = ({ userRole }: { userRole: string }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();
  const { saveOrder, saving: savingOrder } = useReorder('tb_menu');

  const canEdit = userRole !== 'approver' && userRole !== 'viewer';

  const fetchItems = async () => {
    try {
      const response = await menuService.getAll();
      if (response.error) { throw new Error(response.error); }
      setItems((response.data as MenuItem[]) || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast({ title: 'Error', description: 'Failed to load menu', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const byOrder = (a: MenuItem, b: MenuItem) => (a.display_order ?? 0) - (b.display_order ?? 0);
  const topLevel = items.filter((i) => !i.parent_id).sort(byOrder);
  const childrenOf = (parentId?: string) => items.filter((i) => i.parent_id === parentId).sort(byOrder);

  const saveItem = async () => {
    if (!editingItem || !editingItem.label.trim()) {
      toast({ title: 'Label wajib diisi', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        label: editingItem.label.trim(),
        label_en: editingItem.label_en?.trim() || null,
        href: editingItem.href?.trim() || null,
        parent_id: editingItem.parent_id || null,
        is_active: editingItem.is_active ?? true,
        display_order: editingItem.display_order
          ?? (items.filter((i) => (i.parent_id || null) === (editingItem.parent_id || null)).length + 1),
      };
      const response = editingItem.id
        ? await menuService.update(editingItem.id, payload)
        : await menuService.create(payload);
      if (response.error) { throw new Error(response.error); }
      toast({ title: 'Tersimpan', description: 'Menu berhasil disimpan.' });
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({ title: 'Error', description: 'Failed to save menu item', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async () => {
    if (!deletingItem?.id) { return; }
    try {
      const response = await menuService.delete(deletingItem.id);
      if (response.error) { throw new Error(response.error); }
      toast({ title: 'Terhapus', description: 'Menu berhasil dihapus.' });
      setDeletingItem(null);
      fetchItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({ title: 'Error', description: 'Failed to delete menu item', variant: 'destructive' });
    }
  };

  const handleReorder = async (newItems: MenuItem[]) => {
    const renumbered = newItems.map((item, index) => ({ ...item, display_order: index + 1 }));
    setItems(prev => prev.map(item => {
      const updated = renumbered.find(r => r.id === item.id);
      return updated ? { ...item, display_order: updated.display_order } : item;
    }));
    await saveOrder(renumbered as { id: string }[]);
  };

  const renderRow = (item: MenuItem) => (
    <div className="flex items-center justify-between gap-2 min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-medium truncate">{item.label}</span>
        {item.href ? <span className="text-xs text-muted-foreground truncate">{item.href}</span> : null}
        <Badge variant={item.is_active !== false ? 'default' : 'secondary'}>
          {item.is_active !== false ? 'Aktif' : 'Nonaktif'}
        </Badge>
      </div>
      {canEdit ? (
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeletingItem(item)}>
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Menu Management</h2>
          <p className="text-muted-foreground">Kelola menu navigasi halaman pengunjung (2 level). Seret atau ketik nomor untuk mengatur urutan.</p>
        </div>
        {canEdit ? (
          <Button onClick={() => setEditingItem({ ...emptyMenuItem })}>
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </Button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Belum ada data menu. Jalankan migrasi 012 untuk seed dari menu bawaan.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Menu Utama</CardTitle>
              <CardDescription>Urutan item level atas pada header</CardDescription>
            </CardHeader>
            <CardContent>
              <SortableList
                items={topLevel}
                getId={(item) => item.id!}
                disabled={savingOrder || !canEdit}
                onOrderChange={handleReorder}
                renderItem={renderRow}
              />
            </CardContent>
          </Card>

          {topLevel.filter((parent) => childrenOf(parent.id).length > 0).map((parent) => (
            <Card key={parent.id}>
              <CardHeader>
                <CardTitle className="text-lg">Submenu: {parent.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <SortableList
                  items={childrenOf(parent.id)}
                  getId={(item) => item.id!}
                  disabled={savingOrder || !canEdit}
                  onOrderChange={handleReorder}
                  renderItem={renderRow}
                />
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {/* Edit/Create dialog */}
      <Dialog open={editingItem !== null} onOpenChange={(open) => { if (!open) { setEditingItem(null); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
            <DialogDescription>Label tampil di navigasi; href adalah path tujuan (mis. /tentang-kami).</DialogDescription>
          </DialogHeader>
          {editingItem ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="menu-label">Label (Indonesia)</Label>
                <Input
                  id="menu-label"
                  value={editingItem.label}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, label: e.target.value } : prev)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="menu-label-en">Label (English, opsional)</Label>
                <Input
                  id="menu-label-en"
                  value={editingItem.label_en || ''}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, label_en: e.target.value } : prev)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="menu-href">Href</Label>
                <Input
                  id="menu-href"
                  placeholder="/tentang-kami"
                  value={editingItem.href || ''}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, href: e.target.value } : prev)}
                />
              </div>
              <div className="space-y-2">
                <Label>Parent</Label>
                <Select
                  value={editingItem.parent_id || NO_PARENT}
                  onValueChange={(value) =>
                    setEditingItem(prev => prev ? { ...prev, parent_id: value === NO_PARENT ? null : value } : prev)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Menu utama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_PARENT}>— Menu utama —</SelectItem>
                    {topLevel
                      .filter((p) => p.id !== editingItem.id)
                      .map((p) => (
                        <SelectItem key={p.id} value={p.id!}>{p.label}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="menu-active"
                  checked={editingItem.is_active !== false}
                  onCheckedChange={(checked) => setEditingItem(prev => prev ? { ...prev, is_active: checked } : prev)}
                />
                <Label htmlFor="menu-active">Aktif</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={saveItem} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deletingItem !== null} onOpenChange={(open) => { if (!open) { setDeletingItem(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus "{deletingItem?.label}"?</DialogTitle>
            <DialogDescription>
              Menu beserta seluruh submenunya akan dihapus dari navigasi pengunjung.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeletingItem(null)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteItem}>
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManagement;
