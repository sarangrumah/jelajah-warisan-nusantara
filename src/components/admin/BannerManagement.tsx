import { useState, useEffect } from 'react';
import { bannerService } from '@/lib/api-services';
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


const BannerForm = ({ banner, onSave, onCancel, saving }: {
  banner?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  saving: boolean
}) => {
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    image: banner?.image || '',
    start_publish_date: banner?.start_publish_date || '',
    end_publish_date: banner?.end_publish_date || '',
    is_active: banner?.is_active ?? true,
    is_approved:  banner?.is_approved,
    button_url_1: banner?.button_url_1,
    button_url_2: banner?.button_url_2
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Banner Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
            required
          />
        </div>
      </div>

      {/* <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div> */}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="button_url_1">Button Url 1</Label>
          <Input
            id="button_url_1"
            value={formData.button_url_1}
            onChange={(e) => setFormData(prev => ({ ...prev, button_url_1: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="button_url_2">Button Url 2</Label>
          <Input
            id="button_url_2"
            value={formData.button_url_2}
            onChange={(e) => setFormData(prev => ({ ...prev, button_url_2: e.target.value }))}
            required
          />
        </div>
      </div>


      <ImageUpload
        label="Banner Image"
        value={formData.image}
        onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
        bucket="images"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_publish_date">Start Date</Label>
          <Input
            id="start_publish_date"
            type="datetime-local"
            value={formData.start_publish_date}
            onChange={(e) => setFormData(prev => ({ ...prev, start_publish_date: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_publish_date">End Date</Label>
          <Input
            id="end_publish_date"
            type="datetime-local"
            value={formData.end_publish_date}
            onChange={(e) => setFormData(prev => ({ ...prev, end_publish_date: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Publish Banner</Label>
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

const BannerManagement =  ({ userRole }: { userRole: string }) => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await bannerService.getAll();
      if (response.error) throw new Error(response.error);
      setBanners(response.data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: 'Error',
        description: 'Failed to load banners',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveBanner = async (formData: any) => {
    setSaving(true);
    try {
      if (editingBanner?.id) {
        const response = await bannerService.update(editingBanner.id, formData);
        if (response.error) throw new Error(response.error);
        
        setBanners(prev => prev.map(b => 
          b.id === editingBanner.id ? { ...b, ...formData } : b
        ));
        
        toast({
          title: 'Success',
          description: 'Banner updated successfully',
        });
      } else {
        const response = await bannerService.create(formData);
        if (response.error) throw new Error(response.error);
        
        setBanners(prev => [response.data, ...prev]);
        
        toast({
          title: 'Success',
          description: 'Banner created successfully',
        });
      }
      
      setEditingBanner(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to save banner',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const response = await bannerService.update(id, { is_active: isPublished });
      if (response.error) throw new Error(response.error);
      
      setBanners(prev => prev.map(banner => 
        banner.id === id ? { ...banner, is_active: isPublished } : banner
      ));
      
      toast({
        title: 'Success',
        description: `Banner ${isPublished ? 'published' : 'unpublished'}`,
      });
    } catch (error) {
      console.error('Error toggling banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to update banner status',
        variant: 'destructive',
      });
    }
  };


  const toggleApproved = async (id: string) => {
    try {
      const response = await bannerService.approve(id);
      if (response.error) throw new Error(response.error);
      
      setBanners(prev => prev.map(banner => 
        banner.id === id ? { ...banner, is_approved: response.data["is_approved"] } : banner
      ));
      
      toast({
        title: 'Success',
        description: `Banner Approved`,
      });
      fetchBanners();
    } catch (error) {
      console.error('Error toggling banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to update banner status',
        variant: 'destructive',
      });
    }
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
          <h2 className="text-2xl font-bold">Banner Management</h2>
          <p className="text-muted-foreground">Manage banners for the homepage</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {userRole == "admin" ?<Button onClick={() => setEditingBanner(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button> : <></> }
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </DialogTitle>
              <DialogDescription>
                {editingBanner ? 'Update banner information' : 'Create a new banner for the homepage'}
              </DialogDescription>
            </DialogHeader>
            <BannerForm
              banner={editingBanner}
              onSave={saveBanner}
              onCancel={() => {
                setEditingBanner(null);
                setIsDialogOpen(false);
              }}
              saving={saving}
            />
          </DialogContent>
        </Dialog>
      </div>

      {banners.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No banners created yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Banner
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {banners.map((banner) => (
            <Card key={banner.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {banner.title}
                      <Badge variant={banner.is_active ? 'default' : 'secondary'}>
                        {banner.is_active ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant={banner.is_approved ? 'success' : 'secondary'}>
                        {banner.is_approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{banner.subtitle}</CardDescription>
                  </div>
                 { 
                 userRole == "admin" ? <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(banner.id, !banner.is_active)}
                    >
                      {banner.is_active ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingBanner(banner);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    </div> : userRole == "approver" && !banner.is_approved? <div className="flex items-center space-x-2">
                        <Button
                          variant="success"
                          className="w-full"
                          onClick={() => toggleApproved(banner.id)}
                        >
                          Approve
                        </Button>
                    </div> : <div></div>
                  }
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Period:</span>
                    <p className="text-muted-foreground">
                      {banner.start_publish_date && banner.end_publish_date
                        ? `${new Date(banner.start_publish_date).toLocaleDateString()} - ${new Date(banner.end_publish_date).toLocaleDateString()}`
                        : 'Unlimited'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Last updated:</span>
                    <p className="text-muted-foreground">
                      {new Date(banner.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Button Url 1:</span>
                    <p className="text-muted-foreground">
                      {banner.button_url_1}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Button Url 1:</span>
                    <p className="text-muted-foreground">
                      {banner.button_url_1}
                    </p>
                  </div>
                </div>
                {/* {banner.description && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">{banner.description}</p>
                  </div>
                )} */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerManagement;