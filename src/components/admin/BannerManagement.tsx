import { useState, useEffect } from 'react';
import { bannerService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Edit, Save, X, Plus, Trash, Eye, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';
import { RejectReasonDialog } from '@/components/admin/RejectReasonDialog';
import { SortableList } from '@/components/admin/SortableList';
import { useReorder } from '@/hooks/useReorder';

// Banner data shape used in this module
interface Banner {
  id?: string;
  title: string;
  subtitle: string;
  image: string;
  image_landscape?: string;
  image_portrait?: string;
  start_publish_date?: string;
  end_publish_date?: string;
  is_active: boolean;
  is_approved?: boolean;
  is_rejected?: boolean;
  reason_rejected?: string;
  button_label_1: string;
  button_label_2: string;
  button_url_1?: string;
  button_url_2?: string;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

const BannerForm = ({ banner, onSave, onCancel, saving }: {
  banner?: Banner | null;
  onSave: (data: Banner) => void;
  onCancel: () => void;
  saving: boolean
}) => {
  const emptyBanner: Banner = {
    title: '',
    subtitle: '',
    image: '',
    image_landscape: '',
    image_portrait: '',
    start_publish_date: '',
    end_publish_date: '',
    is_active: true,
    is_approved: false,
    is_rejected: false,
    reason_rejected: '',
    button_label_1: '',
    button_label_2: '',
    button_url_1: '',
    button_url_2: ''
  };

  // Convert ISO/server date string to input[type=date] format (YYYY-MM-DD)
  const toDateInput = (value?: string) => {
    if (!value) {return ''};
    const d = new Date(value);
    if (isNaN(d.getTime())) {return ''};
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [formData, setFormData] = useState<Banner>(() => {
    const b = banner || emptyBanner;
    return {
      ...b,
      start_publish_date: toDateInput(b.start_publish_date),
      end_publish_date: toDateInput(b.end_publish_date),
    };
  });

  // Keep form in sync when editing a different banner
  useEffect(() => {
    const b = banner || emptyBanner;
    setFormData({
      ...b,
      start_publish_date: toDateInput(b.start_publish_date),
      end_publish_date: toDateInput(b.end_publish_date),
    });
  }, [banner]);

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

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="button_label_1">Button Label 1</Label>
          <Input
            id="button_label_1"
            value={formData.button_label_1}
            onChange={(e) => setFormData(prev => ({ ...prev, button_label_1: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="button_url_1">Button Url 1</Label>
          <Input
            id="button_url_1"
            value={formData.button_url_1}
            onChange={(e) => setFormData(prev => ({ ...prev, button_url_1: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="button_label_2">Button Label 2</Label>
          <Input
            id="button_label_2"
            value={formData.button_label_2}
            onChange={(e) => setFormData(prev => ({ ...prev, button_label_2: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="button_url_2">Button Url 2</Label>
          <Input
            id="button_url_2"
            value={formData.button_url_2}
            onChange={(e) => setFormData(prev => ({ ...prev, button_url_2: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageUpload
          label="Banner Landscape (desktop)"
          hint="Rekomendasi 1920×1080 px (16:9). Tampil di layar besar."
          value={formData.image_landscape || formData.image}
          onChange={(url) => setFormData(prev => ({ ...prev, image_landscape: url, image: url }))}
          bucket="hero-sections"
        />
        <ImageUpload
          label="Banner Portrait (mobile)"
          hint="Rekomendasi 1080×1350 px (4:5). Dipakai di HP; jika kosong pakai landscape."
          value={formData.image_portrait}
          onChange={(url) => setFormData(prev => ({ ...prev, image_portrait: url }))}
          bucket="hero-sections"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_publish_date">Start Publish Date</Label>
          <Input
          id="start_published_date"
          type="date"
          value={formData.start_publish_date || ''}
          onChange={(e) => {
            const value = e.target.value;
            const isValid = /^\d{4}-\d{2}-\d{2}$/.test(value);
            if (isValid || value === '') {
              setFormData(prev => ({
                ...prev,
                start_publish_date: value
              }));
            }
          }}
          min="2020-01-01"
          max="2030-12-31"
          required
        />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_publish_date">End Publish Date</Label>
          <Input
              id="end_publish_date"
              type="date"
              value={formData.end_publish_date || ''}
              onChange={(e) => {
                const value = e.target.value;
                const isValid = /^\d{4}-\d{2}-\d{2}$/.test(value);
                if (isValid || value === '') {
                  setFormData(prev => ({
                    ...prev,
                    end_publish_date: value
                  }));
                }
              }}
              min="2020-01-01"
              max="2030-12-31"
              required
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
  const [banners, setBanners] = useState<Banner[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogDelete, setIsDialogDelete] = useState(false);
  const [previewBannerId, setPreviewBannerId] = useState<string | null>(null);
  const { toast } = useToast();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const { saveOrder, saving: savingOrder } = useReorder('tb_banner');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await bannerService.getAll();
      if (response.error) {throw new Error(response.error)};
      const data = (response.data as Banner[] | undefined) || [];
      setBanners(
        data.map((item) => ({
          ...item,
          reason_rejected: item.reason_rejected ?? '',
        }))
      );
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

  const saveBanner = async (formData: Banner) => {
    setSaving(true);
    try {
      const payload = { ...formData, is_rejected: false, reason_rejected: '' };

      // Log the image URL being saved
      if (payload.image) {
        console.log('[BannerManagement] Saving banner with image URL:', payload.image);
      }

      if (editingBanner?.id) {
        const response = await bannerService.update(editingBanner.id, payload);
        if (response.error) {throw new Error(response.error)};
        
        setBanners(prev => prev.map(b =>
          b.id === editingBanner.id ? { ...b, ...payload } : b
        ));
        
        toast({
          title: 'Success',
          description: 'Banner updated successfully',
        });
      } else {
        const response = await bannerService.create(payload);
        if (response.error) {throw new Error(response.error)};
        
        fetchBanners()

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
      if (response.error) {throw new Error(response.error)};
      
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
      if (response.error) {throw new Error(response.error)};
      
      const updated = (response.data || {}) as Partial<Banner>;

      setBanners(prev => prev.map(banner => 
        banner.id === id
          ? {
              ...banner,
              is_approved: updated.is_approved ?? true,
              is_rejected: updated.is_rejected ?? false,
              reason_rejected: '',
            }
          : banner
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

  const openRejectDialog = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    setRejectDialogOpen(false);
    setRejectingId(null);
    setRejectReason('');
  };

  const submitReject = async () => {
    if (!rejectingId) {
      return;
    }

    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) {
      toast({
        title: 'Reason required',
        description: 'Please enter a rejection reason.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setRejectSubmitting(true);
      const response = await bannerService.reject(rejectingId, trimmedReason);
      if (response.error) {throw new Error(response.error)};

      const updated = (response.data || {}) as Partial<Banner>;

      setBanners(prev => prev.map(banner =>
        banner.id === rejectingId
          ? {
              ...banner,
              is_approved: updated.is_approved ?? false,
              is_rejected: updated.is_rejected ?? true,
              reason_rejected: updated.reason_rejected ?? trimmedReason,
            }
          : banner
      ));

      toast({
        title: 'Success',
        description: 'Banner rejected',
      });
      closeRejectDialog();
      fetchBanners();
    } catch (error) {
      console.error('Error rejecting banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject banner',
        variant: 'destructive',
      });
    } finally {
      setRejectSubmitting(false);
    }
  };

  const toggleDelete = async (id: string) => {
    try {
      setIsDialogDelete(false)
      const response = await bannerService.delete(id);
      if (response.error) {throw new Error(response.error)};
      
      // setBanners(prev => prev.map(banner => 
      //   banner.id === id ? { ...banner, is_approved: response.data["is_approved"] } : banner
      // ));
      
      toast({
        title: 'Success',
        description: `Banner Deleted`,
      });

      fetchBanners()
    } catch (error) {
      console.error('Error toggling banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete banner',
        variant: 'destructive',
      });
    }
  };

  const sortedBanners = [...banners].sort(
    (a, b) => (a.display_order ?? Number.MAX_SAFE_INTEGER) - (b.display_order ?? Number.MAX_SAFE_INTEGER)
  );

  const handleReorder = async (newItems: Banner[]) => {
    const renumbered = newItems.map((item, index) => ({ ...item, display_order: index + 1 }));
    setBanners(prev => prev.map(b => {
      const updated = renumbered.find(r => r.id === b.id);
      return updated ? { ...b, display_order: updated.display_order } : b;
    }));
    await saveOrder(renumbered);
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
        <div className="flex items-center gap-2">
        {userRole !== "approver" && userRole !== "viewer" ? (
          <Button variant={reorderMode ? 'default' : 'outline'} onClick={() => setReorderMode(prev => !prev)}>
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {reorderMode ? 'Selesai Mengurutkan' : 'Atur Urutan'}
          </Button>
        ) : null}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {userRole !== "approver" && userRole !== "viewer" ?<Button onClick={() => setEditingBanner(null)}>
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
              banner={editingBanner || undefined}
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
      </div>

      <div className="flex justify-between items-center">
        {banner != null  ?
        <Dialog open={isDialogDelete} onOpenChange={setIsDialogDelete}>
          <DialogContent className="max-w-4xl">
              <DialogHeader>
                  <DialogTitle>
                  {'Delete ' + banner.title + ' content'}
                  </DialogTitle>
                  <DialogDescription>
                  {'Are you sure want delete this' + banner.title + ' content'}
                  </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogDelete(false)}>
                  <X className="w-4 h-4 mr-2" />
                      Cancel
                  </Button>
                  <Button type="submit" disabled={isDialogOpen} onClick={() => toggleDelete(banner.id)}>
                    {isDialogOpen && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Trash className="w-4 h-4 mr-2" />
                      Delete
                  </Button>
              </div>
          </DialogContent>
        </Dialog > : <div></div>}
      </div>
      
      <RejectReasonDialog
        open={rejectDialogOpen}
        reason={rejectReason}
        loading={rejectSubmitting}
        onReasonChange={(value) => setRejectReason(value)}
        onSubmit={submitReject}
        onClose={closeRejectDialog}
        title="Reject Banner"
      />

      {!reorderMode && userRole !== "approver" && userRole !== "viewer" && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground">
          <ArrowUpDown className="w-4 h-4 shrink-0" />
          <span>
            Ingin mengatur urutan banner di Beranda? Klik tombol{' '}
            <span className="font-medium text-foreground">"Atur Urutan"</span> di kanan atas, lalu seret kartunya.
          </span>
        </div>
      )}

      {reorderMode ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atur Urutan Banner</CardTitle>
            <CardDescription>
              Seret kartu atau ketik nomor urutan untuk mengubah posisi. Urutan ini menentukan rotasi banner di Beranda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedBanners.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Belum ada banner</p>
            ) : (
              <SortableList
                items={sortedBanners}
                getId={(item) => item.id!}
                disabled={savingOrder}
                onOrderChange={handleReorder}
                renderItem={(item) => (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium truncate">{item.title}</span>
                    <Badge variant={item.is_active ? 'default' : 'secondary'}>
                      {item.is_active ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                )}
              />
            )}
          </CardContent>
        </Card>
      ) : banners.length === 0 ? (
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
                      <Badge variant={banner.is_approved ? 'success' : banner.is_rejected ? 'destructive' : 'secondary'}>
                        {banner.is_approved ? 'Approved' : banner.is_rejected ? 'Rejected' : 'Pending'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{banner.subtitle}</CardDescription>
                  </div>
                {
                  userRole === "admin" || userRole === "super-admin" ? <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={banner.is_active}
                        onCheckedChange={(checked) => togglePublished(banner.id, checked)}
                      />
                    </div>
                    {banner.image ? (
                      <Dialog open={previewBannerId === banner.id} onOpenChange={(open) => setPreviewBannerId(open ? banner.id! : null)}>
                        <DialogTrigger asChild>
                          {/* <Button variant="outline" size="sm" title="Preview Image" onClick={() => setPreviewBannerId(banner.id!)}>
                            <Eye className="w-4 h-4" />
                          </Button> */}
                        </DialogTrigger>
                        {previewBannerId === banner.id && (
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Banner Image Preview</DialogTitle>
                            </DialogHeader>
                            {(() => {
                              const apiUrl = banner.image?.trim() ?? '';
                              if (!apiUrl) {
                                return <div className="text-sm text-muted-foreground">Gambar tidak tersedia</div>;
                              }

                              const imgUrl = apiUrl;

                              if (typeof window !== 'undefined') {
                                console.log('[Banner Preview] resolved URL:', imgUrl);
                              }

                              return imgUrl ? (
                                <div>
                                  <div style={{ wordBreak: 'break-all', fontSize: '0.8em', color: '#888', marginBottom: 8 }}>
                                    {/* Preview URL: {apiUrl} */}
                                  </div>
                                  <img
                                    src={imgUrl}
                                    alt="Banner image"
                                    className="w-full h-auto rounded-md"
                                  />
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">Gambar tidak tersedia</div>
                              );
                            })()}
                          </DialogContent>
                        )}
                      </Dialog>
                    ) : null}
                    {userRole === 'super-admin' && !banner.is_approved && !banner.is_rejected ? (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => toggleApproved(banner.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openRejectDialog(banner.id)}
                        >
                          Reject
                        </Button>
                      </>
                    ) : null}
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        // setEditingBanner(banner);
                        setBanner(banner)
                        setIsDialogDelete(true);
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                    </div> : userRole === "approver" && !banner.is_approved && !banner.is_rejected ? <div className="flex items-center space-x-2">
                        <Button
                          variant="success"
                          className="w-full"
                          onClick={() => toggleApproved(banner.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => openRejectDialog(banner.id)}
                        >
                          Reject
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
                      
                      {new Date(banner.updated_at ?? banner.created_at).toLocaleDateString()}
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
                    <span className="font-medium">Button Url 2:</span>
                    <p className="text-muted-foreground">
                      {banner.button_url_2}
                    </p>
                  </div>
                </div>
                {banner.is_rejected && banner.reason_rejected?.trim() ? (
                  <div className="mt-4 text-sm">
                    <span className="font-medium">Alasan Penolakan : </span>
                    <p className="text-muted-foreground">{banner.reason_rejected}</p>
                  </div>
                ) : null}
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
