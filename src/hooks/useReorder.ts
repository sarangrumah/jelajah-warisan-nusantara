import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

/**
 * Persist manual ordering for tables that support display_order
 * (tb_sites, tb_banner, tb_menu) via POST /api/{table}/reorder.
 */
export function useReorder(tableName: string) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const saveOrder = async (items: { id: string }[]) => {
    setSaving(true);
    try {
      const payload = items.map((item, index) => ({
        id: item.id,
        display_order: index + 1,
      }));
      const response = await apiClient.reorder(tableName, payload);
      if (response.error) {
        throw new Error(response.error);
      }
      toast({ title: 'Urutan tersimpan', description: 'Urutan tampilan berhasil diperbarui.' });
      return true;
    } catch (error) {
      console.error(`Failed to reorder ${tableName}:`, error);
      toast({
        title: 'Gagal menyimpan urutan',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saveOrder, saving };
}
