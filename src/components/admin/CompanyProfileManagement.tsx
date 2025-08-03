import { useState, useEffect } from 'react';
import { contentService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Edit, Save, X, Plus, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const CompanyProfileManagement = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await contentService.getAll();
      if (response.error) throw new Error(response.error);
      // Filter company profiles on the client side for now
      const companyProfiles = (response.data || []).filter(
        (item: any) => item.section_key === 'company_profile'
      );
      setProfiles(companyProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load company profiles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (formData: any) => {
    setSaving(true);
    try {
      const profileData = {
        section_key: 'company_profile',
        title: formData.title,
        content: {
          logo_url: formData.logo_url,
          company_name: formData.company_name,
          description: formData.description,
          vision: formData.vision,
          mission: formData.mission,
          history: formData.history,
          contact_info: {
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            website: formData.website,
          },
          services: formData.services?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
          values: formData.values?.split(',').map((v: string) => v.trim()).filter(Boolean) || [],
        },
        is_published: formData.is_published,
      };

      if (editingProfile?.id) {
        const response = await contentService.update(editingProfile.id, profileData);
        if (response.error) throw new Error(response.error);
        
        setProfiles(prev => prev.map(p => 
          p.id === editingProfile.id ? { ...p, ...profileData } : p
        ));
        
        toast({
          title: 'Success',
          description: 'Company profile updated successfully',
        });
      } else {
        const response = await contentService.create(profileData);
        if (response.error) throw new Error(response.error);
        
        setProfiles(prev => [response.data, ...prev]);
        
        toast({
          title: 'Success',
          description: 'Company profile created successfully',
        });
      }
      
      setEditingProfile(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save company profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const response = await contentService.update(id, { is_published: isPublished });
      if (response.error) throw new Error(response.error);
      
      setProfiles(prev => prev.map(profile => 
        profile.id === id ? { ...profile, is_published: isPublished } : profile
      ));
      
      toast({
        title: 'Success',
        description: `Profile ${isPublished ? 'published' : 'unpublished'}`,
      });
    } catch (error) {
      console.error('Error toggling profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile status',
        variant: 'destructive',
      });
    }
  };

  const ProfileForm = ({ profile, onSave, onCancel }: {
    profile?: any;
    onSave: (data: any) => void;
    onCancel: () => void;
  }) => {
    const content = profile?.content || {};
    const contactInfo = content.contact_info || {};
    
    const [formData, setFormData] = useState({
      title: profile?.title || '',
      logo_url: content.logo_url || '',
      company_name: content.company_name || '',
      description: content.description || '',
      vision: content.vision || '',
      mission: content.mission || '',
      history: content.history || '',
      address: contactInfo.address || '',
      phone: contactInfo.phone || '',
      email: contactInfo.email || '',
      website: contactInfo.website || '',
      services: (content.services || []).join(', '),
      values: (content.values || []).join(', '),
      is_published: profile?.is_published ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Profile Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input
            id="logo_url"
            value={formData.logo_url}
            onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
            placeholder="https://example.com/logo.jpg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vision">Vision</Label>
            <Textarea
              id="vision"
              value={formData.vision}
              onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mission">Mission</Label>
            <Textarea
              id="mission"
              value={formData.mission}
              onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="history">Company History</Label>
          <Textarea
            id="history"
            value={formData.history}
            onChange={(e) => setFormData(prev => ({ ...prev, history: e.target.value }))}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="services">Services (comma separated)</Label>
          <Textarea
            id="services"
            value={formData.services}
            onChange={(e) => setFormData(prev => ({ ...prev, services: e.target.value }))}
            placeholder="Museum Tours, Educational Programs, Research Services"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="values">Company Values (comma separated)</Label>
          <Textarea
            id="values"
            value={formData.values}
            onChange={(e) => setFormData(prev => ({ ...prev, values: e.target.value }))}
            placeholder="Heritage Preservation, Education, Cultural Awareness"
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={formData.is_published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
          />
          <Label htmlFor="is_published">Publish Profile</Label>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            Save
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
          <h2 className="text-2xl font-bold">Company Profile Management</h2>
          <p className="text-muted-foreground">Manage company information and content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProfile(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingProfile ? 'Edit Company Profile' : 'Add New Company Profile'}
              </DialogTitle>
              <DialogDescription>
                {editingProfile ? 'Update company profile information' : 'Create a new company profile section'}
              </DialogDescription>
            </DialogHeader>
            <ProfileForm
              profile={editingProfile}
              onSave={saveProfile}
              onCancel={() => {
                setEditingProfile(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No company profiles created yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {profile.title}
                      <Badge variant={profile.is_published ? 'default' : 'secondary'}>
                        {profile.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{profile.content?.company_name}</CardDescription>
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
                      onClick={() => {
                        setEditingProfile(profile);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-muted-foreground line-clamp-2">
                      {profile.content?.description || 'No description'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Last updated:</span>
                    <p className="text-muted-foreground">
                      {new Date(profile.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyProfileManagement;