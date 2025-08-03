import { useState, useEffect } from 'react';
import { contentService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Edit3, 
  Eye, 
  EyeOff, 
  Loader2,
  Plus,
  Trash2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentSection {
  id: string;
  section_key: string;
  title: string;
  content: any;
  is_published: boolean;
  updated_at: string;
}

const ContentManagement = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContentSections();
  }, []);

  const fetchContentSections = async () => {
    try {
      const response = await contentService.getAll();
      if (response.error) throw new Error(response.error);
      setSections((response.data as ContentSection[]) || []);
    } catch (error) {
      console.error('Error fetching content sections:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat konten',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (sectionId: string, updates: Partial<ContentSection>) => {
    setSaving(sectionId);
    try {
      const response = await contentService.update(sectionId, updates);
      if (response.error) throw new Error(response.error);

      setSections(prev => 
        prev.map(section => 
          section.id === sectionId 
            ? { ...section, ...updates }
            : section
        )
      );

      toast({
        title: 'Berhasil',
        description: 'Konten berhasil diperbarui',
      });
      
      setEditingSection(null);
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: 'Error',
        description: 'Gagal memperbarui konten',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  const togglePublished = async (sectionId: string, currentStatus: boolean) => {
    await updateSection(sectionId, { is_published: !currentStatus });
  };

  const updateContent = (sectionId: string, field: string, value: any) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              content: { ...section.content, [field]: value }
            }
          : section
      )
    );
  };

  const saveSection = async (section: ContentSection) => {
    await updateSection(section.id, {
      title: section.title,
      content: section.content,
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
          <h2 className="text-2xl font-bold">Manajemen Konten</h2>
          <p className="text-muted-foreground">
            Kelola konten yang ditampilkan di website
          </p>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList>
          {sections.map((section) => (
            <TabsTrigger key={section.id} value={section.section_key}>
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.section_key}>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {section.title}
                      <Badge variant={section.is_published ? 'default' : 'secondary'}>
                        {section.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Terakhir diperbarui: {new Date(section.updated_at).toLocaleDateString('id-ID')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={section.is_published}
                      onCheckedChange={() => togglePublished(section.id, section.is_published)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => 
                        setEditingSection(editingSection === section.id ? null : section.id)
                      }
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {editingSection === section.id ? 'Batal' : 'Edit'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {editingSection === section.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Judul</Label>
                      <Input
                        id="title"
                        value={section.title}
                        onChange={(e) => 
                          setSections(prev =>
                            prev.map(s =>
                              s.id === section.id ? { ...s, title: e.target.value } : s
                            )
                          )
                        }
                      />
                    </div>

                    {section.section_key === 'hero' && (
                      <>
                        <div>
                          <Label htmlFor="hero-title">Judul Hero</Label>
                          <Input
                            id="hero-title"
                            value={section.content.title || ''}
                            onChange={(e) => updateContent(section.id, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="hero-subtitle">Subtitle</Label>
                          <Input
                            id="hero-subtitle"
                            value={section.content.subtitle || ''}
                            onChange={(e) => updateContent(section.id, 'subtitle', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="hero-description">Deskripsi</Label>
                          <Textarea
                            id="hero-description"
                            value={section.content.description || ''}
                            onChange={(e) => updateContent(section.id, 'description', e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    {section.section_key === 'about' && (
                      <>
                        <div>
                          <Label htmlFor="about-title">Judul</Label>
                          <Input
                            id="about-title"
                            value={section.content.title || ''}
                            onChange={(e) => updateContent(section.id, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="about-description">Deskripsi</Label>
                          <Textarea
                            id="about-description"
                            rows={4}
                            value={section.content.description || ''}
                            onChange={(e) => updateContent(section.id, 'description', e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    {section.section_key === 'contact' && (
                      <>
                        <div>
                          <Label htmlFor="contact-phone">Telepon</Label>
                          <Input
                            id="contact-phone"
                            value={section.content.phone || ''}
                            onChange={(e) => updateContent(section.id, 'phone', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact-email">Email</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            value={section.content.email || ''}
                            onChange={(e) => updateContent(section.id, 'email', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact-address">Alamat</Label>
                          <Textarea
                            id="contact-address"
                            value={section.content.address || ''}
                            onChange={(e) => updateContent(section.id, 'address', e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingSection(null)}
                      >
                        Batal
                      </Button>
                      <Button
                        onClick={() => saveSection(section)}
                        disabled={saving === section.id}
                      >
                        {saving === section.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Simpan
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Alert>
                      <AlertDescription>
                        <strong>Preview:</strong> Ini adalah tampilan konten yang akan ditampilkan di website.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="p-4 border rounded-lg bg-card">
                      {section.section_key === 'hero' && (
                        <div className="text-center space-y-2">
                          <h1 className="text-2xl font-bold">{section.content.title}</h1>
                          <p className="text-lg text-muted-foreground">{section.content.subtitle}</p>
                          <p className="text-sm">{section.content.description}</p>
                        </div>
                      )}
                      
                      {section.section_key === 'about' && (
                        <div className="space-y-2">
                          <h2 className="text-xl font-semibold">{section.content.title}</h2>
                          <p className="text-muted-foreground">{section.content.description}</p>
                        </div>
                      )}
                      
                      {section.section_key === 'contact' && (
                        <div className="space-y-2">
                          <p><strong>Telepon:</strong> {section.content.phone}</p>
                          <p><strong>Email:</strong> {section.content.email}</p>
                          <p><strong>Alamat:</strong> {section.content.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ContentManagement;