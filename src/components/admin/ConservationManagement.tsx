import { useState, useEffect } from 'react';
import { conservationService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';
import { GalleryUpload } from '@/components/ui/gallery-upload';
import QuillEditor from '@/components/ui/quill-editor';

interface ConservationData {
  id?: string;
  title: string;
  description: string;
  banner_title: string;
  banner_subtitle: string;
  banner_image: string;
  gallery_images: string[];
  is_active: boolean;
}

const emptyData: ConservationData = {
  title: '',
  description: '',
  banner_title: '',
  banner_subtitle: '',
  banner_image: '',
  gallery_images: [],
  is_active: true,
};

const ConservationManagement = () => {
  const [data, setData] = useState<ConservationData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await conservationService.getAll();
      if (response.error) {
        throw new Error(response.error);
      }
      
      const items = response.data as ConservationData[];
      if (items && items.length > 0) {
        // Use the first item found, as this is a single-page content
        const item = items[0];
        
        // Parse gallery_images if it's a string (JSON)
        let galleryImages: string[] = [];
        if (typeof item.gallery_images === 'string') {
          try {
            galleryImages = JSON.parse(item.gallery_images);
          } catch (e) {
            console.error('Failed to parse gallery images', e);
            galleryImages = [];
          }
        } else if (Array.isArray(item.gallery_images)) {
          galleryImages = item.gallery_images;
        }

        setData({
          ...item,
          gallery_images: galleryImages
        });
      }
    } catch (error) {
      console.error('Error fetching conservation data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conservation data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...data,
        // Ensure gallery_images is stringified for the backend if needed, 
        // but based on other components, the backend might handle JSONB automatically.
        // However, looking at PemanfaatanAssetManagement, it seems we might need to serialize it if the backend expects a string for JSON columns in some cases, 
        // but tableConfigs says it's JSONB. Let's send as array and see if the generic controller handles it.
        // If the generic controller expects JSONB, sending an object/array usually works with node-postgres.
      };

      let response;
      if (data.id) {
        response = await conservationService.update(data.id, payload);
      } else {
        response = await conservationService.create(payload);
      }

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Success',
        description: 'Conservation page updated successfully',
      });
      
      // Refresh data to get the latest state (including ID if it was a create)
      fetchData();
    } catch (error) {
      console.error('Error saving conservation data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save conservation data',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
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
      <div>
        <h2 className="text-2xl font-bold">Laboratorium Konservasi Management</h2>
        <p className="text-muted-foreground">Manage content for the Laboratorium Konservasi page</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Banner Section */}
        <Card>
          <CardHeader>
            <CardTitle>Banner Section</CardTitle>
            <CardDescription>Customize the top banner of the page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="banner_title">Banner Title</Label>
                <Input
                  id="banner_title"
                  value={data.banner_title}
                  onChange={(e) => setData(prev => ({ ...prev, banner_title: e.target.value }))}
                  placeholder="e.g., Laboratorium Konservasi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner_subtitle">Banner Subtitle</Label>
                <Input
                  id="banner_subtitle"
                  value={data.banner_subtitle}
                  onChange={(e) => setData(prev => ({ ...prev, banner_subtitle: e.target.value }))}
                  placeholder="e.g., Pusat Riset dan Pelestarian"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Banner Image</Label>
              <ImageUpload
                value={data.banner_image}
                onChange={(url) => setData(prev => ({ ...prev, banner_image: url }))}
                bucket="conservation"
                label="Upload Banner Image"
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Content Section */}
        <Card>
          <CardHeader>
            <CardTitle>Main Content</CardTitle>
            <CardDescription>The main description and title of the conservation section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Tentang Laboratorium"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <QuillEditor
                value={data.description}
                onChange={(content) => setData(prev => ({ ...prev, description: content }))}
                placeholder="Write the main description here..."
                height={200}
              />
            </div>
          </CardContent>
        </Card>

        {/* Gallery Section */}
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
            <CardDescription>Images shown in the gallery carousel</CardDescription>
          </CardHeader>
          <CardContent>
            <GalleryUpload
              value={(data.gallery_images || []).map(img => ({ path: img, sites: '' }))}
              onChange={(images) => setData(prev => ({ ...prev, gallery_images: images.map(img => img.path) }))}
              bucket="conservation"
              label="Upload Gallery Images"
              maxImages={10}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConservationManagement;