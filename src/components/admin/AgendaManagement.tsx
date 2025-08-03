import { useState, useEffect } from 'react';
import { agendaService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Edit3,
  Trash2,
  Plus,
  Loader2,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';

interface AgendaItem {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  image_url: string;
  is_published: boolean;
  created_at: string;
}

const AgendaManagement = () => {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const emptyItem: Partial<AgendaItem> = {
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    image_url: '',
    is_published: true,
  };

  useEffect(() => {
    fetchAgendaItems();
  }, []);

  const fetchAgendaItems = async () => {
    try {
      const response = await agendaService.getAll();
      if (response.error) throw new Error(response.error);
      setAgendaItems((response.data as AgendaItem[]) || []);
    } catch (error) {
      console.error('Error fetching agenda items:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat agenda',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveAgendaItem = async (item: Partial<AgendaItem>) => {
    setSaving(true);
    try {
      let response;
      if (item.id) {
        // Update existing item
        response = await agendaService.update(item.id, item);
        if (response.error) throw new Error(response.error);
        
        setAgendaItems(prev =>
          prev.map(existing =>
            existing.id === item.id ? { ...existing, ...item } as AgendaItem : existing
          )
        );
      } else {
        // Create new item
        const newItem = {
          title: item.title || '',
          description: item.description || '',
          event_date: item.event_date || '',
          event_time: item.event_time || '',
          location: item.location || '',
          image_url: item.image_url || '',
          is_published: item.is_published ?? true,
        };
        
        response = await agendaService.create(newItem);
        if (response.error) throw new Error(response.error);
        setAgendaItems(prev => [response.data, ...prev]);
      }

      toast({
        title: 'Berhasil',
        description: item.id ? 'Agenda berhasil diperbarui' : 'Agenda berhasil ditambahkan',
      });
      
      setShowDialog(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving agenda item:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan agenda',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteAgendaItem = async (id: string) => {
    try {
      const response = await agendaService.delete(id);
      if (response.error) throw new Error(response.error);
      
      setAgendaItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Berhasil',
        description: 'Agenda berhasil dihapus',
      });
    } catch (error) {
      console.error('Error deleting agenda item:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus agenda',
        variant: 'destructive',
      });
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await agendaService.update(id, { is_published: !currentStatus });
      if (response.error) throw new Error(response.error);
      
      setAgendaItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, is_published: !currentStatus } : item
        )
      );
    } catch (error) {
      console.error('Error toggling published status:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengubah status publikasi',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
          <h2 className="text-2xl font-bold">Manajemen Agenda</h2>
          <p className="text-muted-foreground">
            Kelola agenda kegiatan museum
          </p>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingItem(emptyItem as AgendaItem);
                setShowDialog(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Agenda
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem?.id ? 'Edit Agenda' : 'Tambah Agenda Baru'}
              </DialogTitle>
              <DialogDescription>
                Isi informasi agenda kegiatan museum
              </DialogDescription>
            </DialogHeader>
            
            {editingItem && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Judul
                  </Label>
                  <Input
                    id="title"
                    value={editingItem.title}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right">
                    Deskripsi
                  </Label>
                  <Textarea
                    id="description"
                    value={editingItem.description}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, description: e.target.value })
                    }
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event_date" className="text-right">
                    Tanggal
                  </Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={editingItem.event_date}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, event_date: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event_time" className="text-right">
                    Waktu
                  </Label>
                  <Input
                    id="event_time"
                    type="time"
                    value={editingItem.event_time}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, event_time: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Lokasi
                  </Label>
                  <Input
                    id="location"
                    value={editingItem.location}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, location: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <ImageUpload
                    label="Event Image"
                    value={editingItem.image_url}
                    onChange={(url) => setEditingItem({ ...editingItem, image_url: url })}
                    bucket="images"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="is_published" className="text-right">
                    Publikasikan
                  </Label>
                  <Switch
                    id="is_published"
                    checked={editingItem.is_published}
                    onCheckedChange={(checked) =>
                      setEditingItem({ ...editingItem, is_published: checked })
                    }
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={() => editingItem && saveAgendaItem(editingItem)}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {editingItem?.id ? 'Perbarui' : 'Simpan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {agendaItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge variant={item.is_published ? 'default' : 'secondary'}>
                      {item.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={item.is_published}
                    onCheckedChange={() => togglePublished(item.id, item.is_published)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingItem(item);
                      setShowDialog(true);
                    }}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAgendaItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {formatDate(item.event_date)}
                </div>
                {item.event_time && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {item.event_time}
                  </div>
                )}
                {item.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {item.location}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {agendaItems.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Belum ada agenda
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Mulai dengan menambahkan agenda kegiatan museum pertama Anda.
              </p>
              <Button
                onClick={() => {
                  setEditingItem(emptyItem as AgendaItem);
                  setShowDialog(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Agenda
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AgendaManagement;