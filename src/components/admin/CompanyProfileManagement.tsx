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
import { ImageUpload } from '@/components/ui/image-upload';

interface CompanyProfileContent {
  logo_url?: string;
  company_name?: string;
  description?: string;
  vision?: string;
  mission?: string;
  history?: string;
  contact_info?: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  services?: string[];
  values?: string[];
}

interface CompanyProfile {
  id : string;
  section_key: 'company_profile';
  title: string;
  content: CompanyProfileContent;
  is_published?: boolean;
  updated_at: string;
}

const CompanyProfileManagement = () => {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProfile, setEditingProfile] = useState<CompanyProfile>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);


  
  const EmptyprofileData: CompanyProfile = {
    id: "",
    section_key: 'company_profile',
    title: "",
    content: {
      logo_url:  "",
      company_name:  "",
      description:  "",
      vision:  "",
      mission:  "",
      history: "",
      contact_info: {
        address:  "",
        phone:  "",
        email:  "",
        website: "",
      },
      services:  [],
      values:  []
    },
    is_published: true,
    updated_at: ""
  };
  const fetchProfiles = async () => {
    try {
      const response = await contentService.getAll();
      if (response.error) throw new Error(response.error);
      // Filter company profiles on the client side for now
      const companyProfiles = (response.data as CompanyProfile[]|| []).filter(
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

  const saveProfile = async (formData: CompanyProfile) => {
    setSaving(true);
    try {
      const profileData = {
        section_key: 'company_profile',
        title: formData.title,
        content: {
          logo_url: formData.content.logo_url || "",
          company_name: formData.content.company_name || "",
          description: formData.content.description || "",
          vision: formData.content.vision || "",
          mission: formData.content.mission || "",
          history: formData.content.history || "",
          contact_info: {
            address: formData.content.contact_info?.address || "",
            phone: formData.content.contact_info?.phone || "",
            email: formData.content.contact_info?.email || "",
            website: formData.content.contact_info?.website || "",
          },
          services: Array.isArray(formData.content.services) 
            ? formData.content.services 
            : [],
          values: Array.isArray(formData.content.values) 
            ? formData.content.values 
            : []
        },
        is_published: formData.is_published,
      };

      let response;
      if (editingProfile?.id) {
        response = await contentService.update(editingProfile.id, profileData);
        if (response.error) throw new Error(response.error);
        
        setProfiles(prev => 
          prev.map(profile => 
            profile.id === editingProfile.id 
              ? { ...profile, ...response.data, updated_at: new Date().toISOString() }
              : profile
          )
        );
      } else {
        response = await contentService.create(profileData);
        if (response.error) throw new Error(response.error);
        
        setProfiles(prev => [{ ...response.data, updated_at: new Date().toISOString() }, ...prev]);
      }
      
      toast({
        title: 'Success',
        description: editingProfile?.id 
          ? 'Company profile updated successfully' 
          : 'Company profile created successfully',
      });
      
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
    profile: CompanyProfile;
    onSave: (data: CompanyProfile) => void;
    onCancel: () => void;
  }) => {
    
    const [formData, setFormData] = useState<CompanyProfile>({
    id: profile?.id || '',
    section_key: 'company_profile',
    title: profile?.title || '',
    content: {
      logo_url: profile?.content?.logo_url || '',
      company_name: profile?.content?.company_name || '',
      description: profile?.content?.description || '',
      vision: profile?.content?.vision || '',
      mission: profile?.content?.mission || '',
      history: profile?.content?.history || '',
      contact_info: {
        address: profile?.content?.contact_info?.address || '',
        phone: profile?.content?.contact_info?.phone || '',
        email: profile?.content?.contact_info?.email || '',
        website: profile?.content?.contact_info?.website || '',
      },
      services: profile?.content?.services || [],
      values: profile?.content?.values || []
    },
    is_published: profile?.is_published || false,
    updated_at: profile?.updated_at || ''
  });
    

    const handleChange = async (url: string) => {
      setEditingProfile((prev) => ({
        ...prev,
        content: {
          ...prev.content,  // Spread the existing content
          logo_url: url     // Update just the logo_url
        }
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log(formData);
      
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
              value={formData.content.company_name}
              onChange={(e) => setFormData(prev => ({ ...prev, content: {
                ...prev.content
              }, company_name: e.target.value }))}
              required
            />
          </div>
        </div>

        <ImageUpload
          label="Logo"
          value={formData.content.logo_url}
          onChange={(url) => handleChange(url)}
          bucket="logos"
          maxSize={2}
        />

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.content.description}
            onChange={(e) => setFormData(prev => ({...prev, content: {
                ...prev.content
              },  description: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vision">Vision</Label>
            <Textarea
              id="vision"
              value={formData.content.vision}
              onChange={(e) => setFormData(prev => ({...prev, content: {
                ...prev.content
              },  vision: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mission">Mission</Label>
            <Textarea
              id="mission"
              value={formData.content.mission}
              onChange={(e) => setFormData(prev => ({...prev, content: {
                ...prev.content
              },  mission: e.target.value }))}
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="history">Company History</Label>
          <Textarea
            id="history"
            value={formData.content.history}
            onChange={(e) => setFormData(prev => ({...prev, content: {
                ...prev.content
              },  history: e.target.value }))}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.content.contact_info.address}
              onChange={(e) => setFormData(prev => ({  ...prev,
              content: {
                ...prev.content,
                contact_info: {
                  ...prev.content.contact_info, address: e.target.value }}}))}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.content.contact_info.phone}
              onChange={(e) => setFormData(prev => ({  ...prev,
              content: {
                ...prev.content,
                contact_info: {
                  ...prev.content.contact_info, phone: e.target.value }}}))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.content.contact_info.email}
              onChange={(e) => setFormData(prev => ({  ...prev,
              content: {
                ...prev.content,
                contact_info: {
                  ...prev.content.contact_info, email: e.target.value }}}))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.content.contact_info.website}
              onChange={(e) => setFormData(prev => ({  ...prev,
              content: {
                ...prev.content,
                contact_info: {
                  ...prev.content.contact_info, website: e.target.value }}}))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="services">Services (comma separated)</Label>
          <Textarea
            id="services"
            value={formData.content.services?.join(', ') || ''} 
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: {
                ...prev.content,
                services: e.target.value.split(',').map(s => s.trim())
              }
            }))}
            placeholder="Museum Tours, Educational Programs, Research Services"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="values">Company Values (comma separated)</Label>
          <Textarea
            id="values"
            value={formData.content.values?.join(', ') || ''} 
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: {
                ...prev.content,
                values: e.target.value.split(',').map(s => s.trim())
              }
            }))}
            placeholder="Heritage Preservation, Education, Cultural Awareness"
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={formData.is_published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev , is_published: checked }))}
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
            <Button onClick={() => setEditingProfile(EmptyprofileData)}>
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