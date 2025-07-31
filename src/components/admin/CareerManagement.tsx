import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Edit, Save, X, Plus, Eye, EyeOff, Trash2, Users, Calendar, MapPin, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface CareerOpportunity {
  id: string;
  title: string;
  description: string;
  type: 'internship' | 'job' | 'volunteer';
  department: string;
  location: string;
  requirements: string[];
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  duration?: string;
  deadline?: string;
  contact_email?: string;
  application_url?: string;
  is_published: boolean;
  featured: boolean;
  slots_available?: number;
  applications_count?: number;
  created_at: string;
  updated_at: string;
}

interface Application {
  id: string;
  career_id: string;
  full_name: string;
  email: string;
  phone: string;
  motivation: string;
  cv_url?: string;
  transcript_url?: string;
  cover_letter_url?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  submitted_at: string;
  career?: {
    title: string;
    type: string;
  };
}

const CareerManagement = () => {
  const [careers, setCareers] = useState<CareerOpportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCareer, setEditingCareer] = useState<CareerOpportunity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('careers');
  const [filterType, setFilterType] = useState<'all' | CareerOpportunity['type']>('all');
  const [applicationFilter, setApplicationFilter] = useState<'all' | Application['status']>('all');
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'careers') {
      fetchCareers();
    } else {
      fetchApplications();
    }
  }, [activeTab]);

  const fetchCareers = async () => {
    try {
      const { data, error } = await supabase
        .from('career_opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCareers(data || []);
    } catch (error) {
      console.error('Error fetching careers:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data karir',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('career_applications')
        .select(`
          *,
          career:career_opportunities(title, type)
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data aplikasi',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCareer = async (career: Partial<CareerOpportunity>) => {
    setSaving(true);
    try {
      if (editingCareer?.id) {
        const { error } = await supabase
          .from('career_opportunities')
          .update(career)
          .eq('id', editingCareer.id);
        
        if (error) throw error;
        
        setCareers(prev => prev.map(c => 
          c.id === editingCareer.id ? { ...c, ...career } : c
        ));
        
        toast({
          title: 'Berhasil',
          description: 'Karir berhasil diperbarui',
        });
      } else {
        const { data, error } = await supabase
          .from('career_opportunities')
          .insert([career])
          .select()
          .single();
        
        if (error) throw error;
        
        setCareers(prev => [data, ...prev]);
        
        toast({
          title: 'Berhasil',
          description: 'Karir berhasil ditambahkan',
        });
      }
      
      setEditingCareer(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving career:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan karir',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteCareer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('career_opportunities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCareers(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: 'Berhasil',
        description: 'Karir berhasil dihapus',
      });
    } catch (error) {
      console.error('Error deleting career:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus karir',
        variant: 'destructive',
      });
    }
  };

  const updateApplicationStatus = async (id: string, status: Application['status']) => {
    try {
      const { error } = await supabase
        .from('career_applications')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status } : app
      ));
      
      toast({
        title: 'Berhasil',
        description: `Status aplikasi berhasil diubah menjadi ${status}`,
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengubah status aplikasi',
        variant: 'destructive',
      });
    }
  };

  const getTypeIcon = (type: CareerOpportunity['type']) => {
    switch (type) {
      case 'internship':
        return <Users className="w-4 h-4" />;
      case 'job':
        return <MapPin className="w-4 h-4" />;
      case 'volunteer':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: CareerOpportunity['type']) => {
    const labels = {
      internship: 'Magang',
      job: 'Pekerjaan',
      volunteer: 'Relawan'
    };
    return labels[type];
  };

  const getStatusBadge = (status: Application['status']) => {
    const variants = {
      pending: 'secondary',
      reviewed: 'outline',
      accepted: 'default',
      rejected: 'destructive'
    } as const;
    
    const labels = {
      pending: 'Menunggu',
      reviewed: 'Ditinjau',
      accepted: 'Diterima',
      rejected: 'Ditolak'
    };
    
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const CareerForm = ({ career, onSave, onCancel }: {
    career?: CareerOpportunity | null;
    onSave: (data: Partial<CareerOpportunity>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: career?.title || '',
      description: career?.description || '',
      type: career?.type || 'internship' as CareerOpportunity['type'],
      department: career?.department || '',
      location: career?.location || '',
      requirements: career?.requirements?.join('\n') || '',
      responsibilities: career?.responsibilities?.join('\n') || '',
      qualifications: career?.qualifications?.join('\n') || '',
      benefits: career?.benefits?.join('\n') || '',
      duration: career?.duration || '',
      deadline: career?.deadline || '',
      contact_email: career?.contact_email || '',
      application_url: career?.application_url || '',
      slots_available: career?.slots_available || 1,
      is_published: career?.is_published ?? true,
      featured: career?.featured ?? false,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const careerData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        responsibilities: formData.responsibilities.split('\n').filter(r => r.trim()),
        qualifications: formData.qualifications.split('\n').filter(q => q.trim()),
        benefits: formData.benefits.split('\n').filter(b => b.trim()),
      };
      
      onSave(careerData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Posisi</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipe</Label>
            <Select
              value={formData.type}
              onValueChange={(value: CareerOpportunity['type']) => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internship">Magang</SelectItem>
                <SelectItem value="job">Pekerjaan</SelectItem>
                <SelectItem value="volunteer">Relawan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">Departemen</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slots_available">Kuota</Label>
            <Input
              id="slots_available"
              type="number"
              min="1"
              value={formData.slots_available}
              onChange={(e) => setFormData(prev => ({ ...prev, slots_available: parseInt(e.target.value) }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Durasi</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="3 bulan"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Batas Waktu</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email Kontak</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="application_url">URL Aplikasi</Label>
            <Input
              id="application_url"
              value={formData.application_url}
              onChange={(e) => setFormData(prev => ({ ...prev, application_url: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements">Persyaratan (satu per baris)</Label>
          <Textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
            rows={3}
            placeholder="Mahasiswa semester 6 atau lebih&#10;IPK minimal 3.0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsibilities">Tanggung Jawab (satu per baris)</Label>
          <Textarea
            id="responsibilities"
            value={formData.responsibilities}
            onChange={(e) => setFormData(prev => ({ ...prev, responsibilities: e.target.value }))}
            rows={3}
            placeholder="Membantu penelitian arkeologi&#10;Mendokumentasikan artefak"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="qualifications">Kualifikasi (satu per baris)</Label>
          <Textarea
            id="qualifications"
            value={formData.qualifications}
            onChange={(e) => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
            rows={3}
            placeholder="Jurusan Arkeologi atau Sejarah&#10;Memiliki pengalaman penelitian"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="benefits">Manfaat (satu per baris)</Label>
          <Textarea
            id="benefits"
            value={formData.benefits}
            onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
            rows={3}
            placeholder="Sertifikat magang&#10;Pengalaman kerja di bidang arkeologi"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
            />
            <Label htmlFor="is_published">Publikasikan</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="featured">Unggulan</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
        </div>
      </form>
    );
  };

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
          <h2 className="text-2xl font-bold">Manajemen Karir</h2>
          <p className="text-muted-foreground">Kelola lowongan magang, pekerjaan, dan relawan</p>
        </div>
        {activeTab === 'careers' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCareer(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Lowongan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCareer ? 'Edit Lowongan' : 'Tambah Lowongan Baru'}
                </DialogTitle>
                <DialogDescription>
                  {editingCareer ? 'Perbarui informasi lowongan' : 'Tambahkan lowongan karir baru'}
                </DialogDescription>
              </DialogHeader>
              <CareerForm
                career={editingCareer}
                onSave={saveCareer}
                onCancel={() => {
                  setEditingCareer(null);
                  setIsDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="careers">Lowongan Karir</TabsTrigger>
          <TabsTrigger value="applications">Aplikasi Masuk</TabsTrigger>
        </TabsList>

        <TabsContent value="careers" className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              Semua ({careers.length})
            </Button>
            {(['internship', 'job', 'volunteer'] as const).map((type) => (
              <Button
                key={type}
                variant={filterType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type)}
              >
                {getTypeIcon(type)}
                <span className="ml-1">
                  {getTypeLabel(type)} ({careers.filter(c => c.type === type).length})
                </span>
              </Button>
            ))}
          </div>

          {careers.filter(career => filterType === 'all' || career.type === filterType).length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">Belum ada lowongan yang ditambahkan</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Lowongan Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {careers
                .filter(career => filterType === 'all' || career.type === filterType)
                .map((career) => (
                <Card key={career.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getTypeIcon(career.type)}
                          {career.title}
                          <Badge variant="outline">{getTypeLabel(career.type)}</Badge>
                          {career.featured && <Badge variant="default">Unggulan</Badge>}
                          <Badge variant={career.is_published ? 'default' : 'secondary'}>
                            {career.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {career.department} • {career.location}
                          {career.deadline && ` • Deadline: ${new Date(career.deadline).toLocaleDateString()}`}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCareer(career);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Lowongan</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus "{career.title}"? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteCareer(career.id)}>
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {career.description.substring(0, 200)}...
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Kuota:</span>
                        <p className="text-muted-foreground">{career.slots_available} orang</p>
                      </div>
                      <div>
                        <span className="font-medium">Aplikasi:</span>
                        <p className="text-muted-foreground">{career.applications_count || 0}</p>
                      </div>
                      <div>
                        <span className="font-medium">Durasi:</span>
                        <p className="text-muted-foreground">{career.duration || 'Belum ditentukan'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Terakhir diperbarui:</span>
                        <p className="text-muted-foreground">
                          {new Date(career.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={applicationFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setApplicationFilter('all')}
            >
              Semua ({applications.length})
            </Button>
            {(['pending', 'reviewed', 'accepted', 'rejected'] as const).map((status) => (
              <Button
                key={status}
                variant={applicationFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setApplicationFilter(status)}
              >
                {applications.filter(a => a.status === status).length} {status}
              </Button>
            ))}
          </div>

          {applications
            .filter(app => applicationFilter === 'all' || app.status === applicationFilter)
            .length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Belum ada aplikasi yang masuk</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {applications
                .filter(app => applicationFilter === 'all' || app.status === applicationFilter)
                .map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{application.full_name}</CardTitle>
                        <CardDescription>
                          {application.career?.title} • {application.email}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(application.status)}
                        <Select
                          value={application.status}
                          onValueChange={(value: Application['status']) => 
                            updateApplicationStatus(application.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Menunggu</SelectItem>
                            <SelectItem value="reviewed">Ditinjau</SelectItem>
                            <SelectItem value="accepted">Diterima</SelectItem>
                            <SelectItem value="rejected">Ditolak</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <span className="font-medium">Motivasi:</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          {application.motivation}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Telepon:</span>
                          <p className="text-muted-foreground">{application.phone}</p>
                        </div>
                        <div>
                          <span className="font-medium">Tanggal Daftar:</span>
                          <p className="text-muted-foreground">
                            {new Date(application.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">CV:</span>
                          {application.cv_url ? (
                            <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                              <a href={application.cv_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </a>
                            </Button>
                          ) : (
                            <p className="text-muted-foreground">Tidak ada</p>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Transkrip:</span>
                          {application.transcript_url ? (
                            <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                              <a href={application.transcript_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </a>
                            </Button>
                          ) : (
                            <p className="text-muted-foreground">Tidak ada</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CareerManagement;