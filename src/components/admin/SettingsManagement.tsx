import { useEffect, useState } from 'react';
import { siteSettingsService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/ui/image-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  label?: string;
}

// Settings whose key looks like an image get an image uploader instead of a text box.
const isImageSetting = (key: string) => /image|img|gambar|photo|foto|logo/i.test(key);

/**
 * CMS for simple key-value site content (e.g. homepage statistics) stored in tb_site_settings.
 * Values are free text; labels describe where each value appears on the visitor site.
 */
const SettingsManagement = ({ userRole }: { userRole: string }) => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const canEdit = userRole !== 'approver' && userRole !== 'viewer';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await siteSettingsService.getAll();
        if (response.error) { throw new Error(response.error); }
        const rows = (response.data as SiteSetting[]) || [];
        setSettings(rows);
        const initialDrafts: Record<string, string> = {};
        rows.forEach((row) => { initialDrafts[row.id] = row.value ?? ''; });
        setDrafts(initialDrafts);
      } catch (error) {
        console.error('Error fetching site settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load site settings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [toast]);

  const saveSetting = async (setting: SiteSetting, valueOverride?: string) => {
    const newValue = valueOverride ?? drafts[setting.id] ?? '';
    setSavingId(setting.id);
    try {
      const response = await siteSettingsService.update(setting.id, { value: newValue });
      if (response.error) { throw new Error(response.error); }
      setSettings(prev => prev.map(s => (s.id === setting.id ? { ...s, value: newValue } : s)));
      toast({ title: 'Tersimpan', description: `${setting.label || setting.key} berhasil diperbarui.` });
    } catch (error) {
      console.error('Error saving setting:', error);
      toast({
        title: 'Error',
        description: 'Failed to save setting',
        variant: 'destructive',
      });
    } finally {
      setSavingId(null);
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
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <p className="text-muted-foreground">Kelola nilai konten statis halaman pengunjung (mis. statistik Beranda)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Konten</CardTitle>
          <CardDescription>Ubah nilai lalu klik Simpan. Perubahan langsung tampil di halaman pengunjung.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {settings.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Belum ada pengaturan. Jalankan migrasi 011 untuk seed awal.</p>
          ) : settings.map((setting) => (
            <div key={setting.id} className="flex items-start gap-3 border border-border rounded-lg p-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{setting.label || setting.key}</p>
                <p className="text-xs text-muted-foreground truncate">{setting.key}</p>
              </div>
              {isImageSetting(setting.key) ? (
                <div className="w-64">
                  <ImageUpload
                    label=""
                    value={drafts[setting.id] || setting.value}
                    bucket="images"
                    onChange={(url) => {
                      setDrafts(prev => ({ ...prev, [setting.id]: url }));
                      // Persist immediately after upload/clear.
                      saveSetting(setting, url);
                    }}
                  />
                </div>
              ) : (
                <>
                  <Input
                    value={drafts[setting.id] ?? ''}
                    onChange={(e) => setDrafts(prev => ({ ...prev, [setting.id]: e.target.value }))}
                    disabled={!canEdit || savingId === setting.id}
                    className="w-40"
                  />
                  {canEdit ? (
                    <Button
                      size="sm"
                      onClick={() => saveSetting(setting)}
                      disabled={savingId === setting.id || (drafts[setting.id] ?? '') === (setting.value ?? '')}
                    >
                      {savingId === setting.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </Button>
                  ) : null}
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManagement;
