import { useEffect, useState } from 'react';
import { ppidDocumentService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FileUploadPDF from '@/components/FileUploadPDF';
import { Edit, FileText, Loader2, Plus, Save, Trash, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PpidDocument {
  id?: string;
  title: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  file_size?: string;
  display_order?: number;
  is_active?: boolean;
}

const empty: PpidDocument = { title: '', description: '', file_url: '', file_type: 'PDF', file_size: '', is_active: true };

const DocForm = ({ value, onSave, onCancel, saving }: {
  value: PpidDocument; onSave: (d: PpidDocument) => void; onCancel: () => void; saving: boolean;
}) => {
  const [form, setForm] = useState<PpidDocument>({ ...value });
  useEffect(() => { setForm({ ...value }); }, [value?.id]);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="space-y-4 max-h-[70vh] overflow-y-auto"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Judul Dokumen</Label>
        <Input id="title" value={form.title} required
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi (opsional)</Label>
        <Textarea id="description" rows={2} value={form.description || ''}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
      </div>

      <FileUploadPDF
        bucket="documents"
        label="File Dokumen (PDF)"
        onUploadComplete={(url) => setForm((p) => ({ ...p, file_url: url }))}
      />
      {form.file_url && (
        <p className="text-xs text-muted-foreground break-all">
          File: <a href={form.file_url} target="_blank" rel="noreferrer" className="text-primary underline">{form.file_url}</a>
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="file_size">Ukuran File (opsional)</Label>
          <Input id="file_size" placeholder="mis. 245 KB" value={form.file_size || ''}
            onChange={(e) => setForm((p) => ({ ...p, file_size: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="display_order">Urutan</Label>
          <Input id="display_order" type="number" value={form.display_order ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, display_order: e.target.value === '' ? undefined : Number(e.target.value) }))} />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="is_active" checked={form.is_active !== false}
          onCheckedChange={(c) => setForm((p) => ({ ...p, is_active: c }))} />
        <Label htmlFor="is_active">Tampilkan di halaman PPID</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />Batal</Button>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Simpan
        </Button>
      </div>
    </form>
  );
};

const PPIDDocumentManagement = ({ userRole }: { userRole: string }) => {
  const { toast } = useToast();
  const [items, setItems] = useState<PpidDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PpidDocument>(empty);
  const canEdit = userRole !== 'approver' && userRole !== 'viewer';

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await ppidDocumentService.getAll();
      if (res.error) { throw new Error(res.error); }
      setItems(res.data || []);
    } catch (e) {
      toast({ title: 'Gagal memuat', description: e instanceof Error ? e.message : 'Error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const save = async (data: PpidDocument) => {
    setSaving(true);
    try {
      const res = data.id ? await ppidDocumentService.update(data.id, data) : await ppidDocumentService.create(data);
      if (res.error) { throw new Error(res.error); }
      toast({ title: 'Tersimpan', description: 'Dokumen PPID disimpan.' });
      setOpen(false);
      fetchAll();
    } catch (e) {
      toast({ title: 'Gagal menyimpan', description: e instanceof Error ? e.message : 'Error', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id?: string) => {
    if (!id) { return; }
    try {
      const res = await ppidDocumentService.delete(id);
      if (res.error) { throw new Error(res.error); }
      toast({ title: 'Dihapus' });
      fetchAll();
    } catch (e) {
      toast({ title: 'Gagal menghapus', description: e instanceof Error ? e.message : 'Error', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dokumen PPID</h2>
          <p className="text-muted-foreground">Kelola dokumen & formulir yang dapat diunduh di halaman PPID</p>
        </div>
        {canEdit && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(empty)}><Plus className="w-4 h-4 mr-2" />Tambah Dokumen</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editing.id ? 'Edit Dokumen' : 'Tambah Dokumen'}</DialogTitle>
                <DialogDescription>Unggah PDF dan beri judul. Dokumen aktif tampil di halaman PPID.</DialogDescription>
              </DialogHeader>
              <DocForm value={editing} onSave={save} onCancel={() => setOpen(false)} saving={saving} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : items.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">Belum ada dokumen.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {items.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex items-center gap-3 py-4">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {doc.file_type || 'PDF'}{doc.file_size ? ` · ${doc.file_size}` : ''}
                    {doc.file_url ? '' : ' · belum ada file'}
                  </p>
                </div>
                <Badge variant={doc.is_active !== false ? 'default' : 'secondary'}>
                  {doc.is_active !== false ? 'Aktif' : 'Nonaktif'}
                </Badge>
                {canEdit && (
                  <>
                    <Button size="icon" variant="outline" onClick={() => { setEditing(doc); setOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => remove(doc.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PPIDDocumentManagement;
