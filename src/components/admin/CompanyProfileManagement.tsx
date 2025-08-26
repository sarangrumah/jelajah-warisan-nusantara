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

const ProfileForm = ({ profile, changing, onSave, onCancel,saving}: {
  profile: CompanyProfile;
  changing: (data: CompanyProfile) => void;
  onSave: (data: CompanyProfile) => void;
  onCancel: () => void;
  saving: boolean; //
}) => {
  // Remove all the handleNestedChange, handleContactInfoChange, etc.
  // And use direct inline functions instead

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();      
    onSave(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Profile Title</Label>
          <Input
            id="title"
            value={profile.title}
            onChange={(e) => changing(({ ...profile, title: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            value={profile.content.company_name}
            onChange={(e) => changing(({...profile,
            content: {
              ...profile.content,
              company_name : e.target.value
              }}))}
            required
          />
        </div>
      </div>

      <ImageUpload
        label="Logo"
        value={profile.content.logo_url}
        onChange={(url) => changing(({...profile, content: {
          ...profile.content,
          logo_url: url
        }}))}
        bucket="logos"
        maxSize={2}
      />

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={profile.content.description}
          onChange={(e) => changing(({...profile,
            content: {
              ...profile.content,
              description : e.target.value
              }}))}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vision">Vision</Label>
          <Textarea
            id="vision"
            value={profile.content.vision}
            onChange={(e) => changing(({...profile,
            content: {
              ...profile.content,
              vision : e.target.value
              }}))}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mission">Mission</Label>
          <Textarea
            id="mission"
            value={profile.content.mission}
            onChange={(e) => changing(({...profile,
            content: {
              ...profile.content,
              mission : e.target.value
              }}))}
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="history">Company History</Label>
        <Textarea
          id="history"
          value={profile.content.history}
          onChange={(e) => changing(({...profile,
            content: {
              ...profile.content,
              history : e.target.value
              }}))}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={profile.content.contact_info.address}
            onChange={(e) => changing(({...profile,
            content: {
              ...profile.content,
              contact_info: {
                ...profile.content.contact_info, address: e.target.value }}}))}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={profile.content.contact_info.phone}
            onChange={(e) => changing(({  ...profile,
            content: {
              ...profile.content,
              contact_info: {
                ...profile.content.contact_info, phone: e.target.value }}}))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile.content.contact_info.email}
            onChange={(e) => changing(({  ...profile,
            content: {
              ...profile.content,
              contact_info: {
                ...profile.content.contact_info, email: e.target.value }}}))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={profile.content.contact_info.website}
            onChange={(e) => changing(({  ...profile,
            content: {
              ...profile.content,
              contact_info: {
                ...profile.content.contact_info, website: e.target.value }}}))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="services">Services (comma separated)</Label>
        <Textarea
          id="services"
          value={profile.content.services?.join(', ') || ''} 
          onChange={(e) => changing(({
            ...profile,
            content: {
              ...profile.content,
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
          value={profile.content.values?.join(', ') || ''} 
          onChange={(e) => changing(({
            ...profile,
            content: {
              ...profile.content,
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
          checked={profile.is_published}
          onCheckedChange={(checked) => changing(({ ...profile , is_published: checked }))}
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

const CompanyProfileManagement = () => {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProfile, setEditingProfile] = useState<CompanyProfile>(EmptyprofileData);
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
      
      setEditingProfile(EmptyprofileData);
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

  const handleProfileChange = (updatedProfile: CompanyProfile) => {
    setEditingProfile(updatedProfile);
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
              changing={handleProfileChange}
              onSave={saveProfile}
              onCancel={() => {
                setEditingProfile(EmptyprofileData);
                setIsDialogOpen(false);
              }}
              saving={saving}
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