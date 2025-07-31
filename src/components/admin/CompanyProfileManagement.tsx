import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Edit, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CompanyProfile {
  id: string;
  section_key: string;
  title: string;
  content: {
    logo_url?: string;
    company_name?: string;
    description?: string;
    vision?: string;
    mission?: string;
    history?: string;
    organizational_structure?: string;
    contact_info?: {
      address?: string;
      phone?: string;
      email?: string;
      website?: string;
    };
    services?: string[];
    values?: string[];
  };
  is_published: boolean;
  updated_at: string;
}

const CompanyProfileManagement = () => {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .in('section_key', ['about', 'company_profile'])
        .order('section_key', { ascending: true });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data profil perusahaan',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (id: string, updates: Partial<CompanyProfile>) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('content_sections')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      setProfiles(prev => prev.map(profile => 
        profile.id === id ? { ...profile, ...updates } : profile
      ));
      
      setEditingProfile(null);
      
      toast({
        title: 'Berhasil',
        description: 'Profil perusahaan berhasil diperbarui',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan profil perusahaan',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('content_sections')
        .update({ is_published: isPublished })
        .eq('id', id);
      
      if (error) throw error;
      
      setProfiles(prev => prev.map(profile => 
        profile.id === id ? { ...profile, is_published: isPublished } : profile
      ));
      
      toast({
        title: 'Berhasil',
        description: `Profil ${isPublished ? 'dipublikasikan' : 'diturunkan'}`,
      });
    } catch (error) {
      console.error('Error toggling profile:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengubah status profil',
        variant: 'destructive',
      });
    }
  };

  const ProfileForm = ({ profile }: { profile: CompanyProfile }) => {
    const [formData, setFormData] = useState({
      title: profile.title,
      content: {
        logo_url: profile.content.logo_url || '',
        company_name: profile.content.company_name || '',
        description: profile.content.description || '',
        vision: profile.content.vision || '',
        mission: profile.content.mission || '',
        history: profile.content.history || '',
        organizational_structure: profile.content.organizational_structure || '',
        contact_info: {
          address: profile.content.contact_info?.address || '',
          phone: profile.content.contact_info?.phone || '',
          email: profile.content.contact_info?.email || '',
          website: profile.content.contact_info?.website || '',
        },
        services: profile.content.services?.join('\n') || '',
        values: profile.content.values?.join('\n') || '',
      },
      is_published: profile.is_published,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const updatedContent = {
        ...formData.content,
        services: formData.content.services.split('\n').filter(s => s.trim()),
        values: formData.content.values.split('\n').filter(v => v.trim()),
      };

      saveProfile(profile.id, {
        title: formData.title,
        content: updatedContent,
        is_published: formData.is_published,
      });
    };

    const updateContent = (field: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        content: { ...prev.content, [field]: value }
      }));
    };

    const updateContactInfo = (field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          contact_info: { ...prev.content.contact_info, [field]: value }
        }
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Judul Bagian</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Dasar</TabsTrigger>
            <TabsTrigger value="vision-mission">Visi & Misi</TabsTrigger>
            <TabsTrigger value="contact">Kontak</TabsTrigger>
            <TabsTrigger value="additional">Tambahan</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo_url">URL Logo</Label>
              <Input
                id="logo_url"
                value={formData.content.logo_url}
                onChange={(e) => updateContent('logo_url', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Nama Perusahaan</Label>
              <Input
                id="company_name"
                value={formData.content.company_name}
                onChange={(e) => updateContent('company_name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.content.description}
                onChange={(e) => updateContent('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="history">Sejarah</Label>
              <Textarea
                id="history"
                value={formData.content.history}
                onChange={(e) => updateContent('history', e.target.value)}
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="vision-mission" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vision">Visi</Label>
              <Textarea
                id="vision"
                value={formData.content.vision}
                onChange={(e) => updateContent('vision', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mission">Misi</Label>
              <Textarea
                id="mission"
                value={formData.content.mission}
                onChange={(e) => updateContent('mission', e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="values">Nilai-nilai (satu per baris)</Label>
              <Textarea
                id="values"
                value={formData.content.values}
                onChange={(e) => updateContent('values', e.target.value)}
                rows={4}
                placeholder="Integritas&#10;Profesionalisme&#10;Inovasi"
              />
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                value={formData.content.contact_info.address}
                onChange={(e) => updateContactInfo('address', e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input
                  id="phone"
                  value={formData.content.contact_info.phone}
                  onChange={(e) => updateContactInfo('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.content.contact_info.email}
                  onChange={(e) => updateContactInfo('email', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.content.contact_info.website}
                onChange={(e) => updateContactInfo('website', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </TabsContent>

          <TabsContent value="additional" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organizational_structure">Struktur Organisasi</Label>
              <Textarea
                id="organizational_structure"
                value={formData.content.organizational_structure}
                onChange={(e) => updateContent('organizational_structure', e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="services">Layanan (satu per baris)</Label>
              <Textarea
                id="services"
                value={formData.content.services}
                onChange={(e) => updateContent('services', e.target.value)}
                rows={4}
                placeholder="Pelestarian Cagar Budaya&#10;Penelitian Arkeologi&#10;Edukasi Publik"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={formData.is_published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
          />
          <Label htmlFor="is_published">Publikasikan Profil</Label>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditingProfile(null)}
          >
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
      <div>
        <h2 className="text-2xl font-bold">Manajemen Profil Perusahaan</h2>
        <p className="text-muted-foreground">
          Kelola informasi tentang kami dan profil perusahaan
        </p>
      </div>

      <div className="grid gap-6">
        {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="capitalize">
                    {profile.section_key.replace('_', ' ')}
                  </CardTitle>
                  <CardDescription>{profile.title}</CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">
                    Terakhir diperbarui: {new Date(profile.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublished(profile.id, !profile.is_published)}
                  >
                    {profile.is_published ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProfile(
                      editingProfile === profile.id ? null : profile.id
                    )}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {editingProfile === profile.id ? (
              <CardContent>
                <ProfileForm profile={profile} />
              </CardContent>
            ) : (
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Nama Perusahaan:</strong> {profile.content.company_name || 'Belum diisi'}</p>
                  <p><strong>Deskripsi:</strong> {profile.content.description ? `${profile.content.description.substring(0, 100)}...` : 'Belum diisi'}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      profile.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {profile.is_published ? 'Published' : 'Draft'}
                    </span>
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompanyProfileManagement;