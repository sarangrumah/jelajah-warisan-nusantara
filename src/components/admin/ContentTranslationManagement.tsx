import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, RotateCcw, Languages, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { contentTranslationOverrideService } from '@/lib/api-services';

// Mirrors the backend getTranslatableFields whitelist (human-text fields only).
const TRANSLATABLE: Record<string, { label: string; fields: string[] }> = {
  tb_sites: { label: 'Museum & Cagar Budaya', fields: ['name', 'subtitle', 'description', 'address'] },
  tb_events: { label: 'Agenda / Event', fields: ['name', 'subtitle', 'description', 'location', 'address'] },
  tb_master_collection: { label: 'Koleksi', fields: ['title', 'subtitle', 'description', 'museum_name', 'condition', 'material', 'origin'] },
  tb_media: { label: 'Media / Berita', fields: ['title', 'subtitle', 'description'] },
  tb_banner: { label: 'Banner', fields: ['title', 'subtitle'] },
  tb_faqs: { label: 'FAQ', fields: ['question', 'answer'] },
  tb_memoryoftheworld: { label: 'Memory of the World', fields: ['title', 'subtitle', 'description'] },
  tb_pemanfaatanasset: { label: 'Pemanfaatan Aset', fields: ['title', 'description', 'location'] },
  tb_sop: { label: 'SOP & Regulasi', fields: ['title', 'subtitle', 'description'] },
  tb_publication: { label: 'Publikasi', fields: ['title', 'description'] },
  tb_career_management: { label: 'Karir', fields: ['title', 'subtitle', 'description', 'requirement', 'responsibility'] },
};

const FIELD_LABEL: Record<string, string> = {
  name: 'Nama', title: 'Judul', subtitle: 'Subjudul', description: 'Deskripsi',
  address: 'Alamat', location: 'Lokasi', question: 'Pertanyaan', answer: 'Jawaban',
  museum_name: 'Nama Museum', condition: 'Kondisi', material: 'Material', origin: 'Asal',
  requirement: 'Persyaratan', responsibility: 'Tanggung Jawab',
};

const stripHtml = (s: string) => (s || '').replace(/<[^>]*>/g, '').trim();
const rowTitle = (row: any) =>
  stripHtml(row.title || row.name || row.question || '').slice(0, 80) || `#${String(row.id).slice(0, 8)}`;

const ContentTranslationManagement = () => {
  const { toast } = useToast();
  const [table, setTable] = useState<string>('tb_sites');
  const lang = 'en'; // app currently localizes ID -> EN
  const [idRows, setIdRows] = useState<any[]>([]);
  const [enRows, setEnRows] = useState<any[]>([]);
  const [overrideMap, setOverrideMap] = useState<Record<string, { id: string; translation: string }>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fields = TRANSLATABLE[table]?.fields || [];

  const load = async (tbl: string) => {
    setLoading(true);
    setEdits({});
    try {
      const [idRes, enRes, ovRes] = await Promise.all([
        contentTranslationOverrideService.getRows(tbl, 'id'),
        contentTranslationOverrideService.getRows(tbl, 'en'),
        contentTranslationOverrideService.list(tbl, lang),
      ]);
      setIdRows(idRes.data || []);
      setEnRows(enRes.data || []);
      const map: Record<string, { id: string; translation: string }> = {};
      (ovRes.data || []).forEach((o: any) => {
        map[`${o.row_id}::${o.field}`] = { id: o.id, translation: o.translation };
      });
      setOverrideMap(map);
    } catch (e) {
      toast({ title: 'Gagal memuat data', description: e instanceof Error ? e.message : 'Error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(table);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  // Build an id-keyed lookup of the EN rows for quick access
  const enById = useMemo(() => {
    const m: Record<string, any> = {};
    enRows.forEach((r) => { m[r.id] = r; });
    return m;
  }, [enRows]);

  const visibleRows = useMemo(() => {
    if (!search.trim()) return idRows;
    const q = search.toLowerCase();
    return idRows.filter((r) => rowTitle(r).toLowerCase().includes(q));
  }, [idRows, search]);

  const enValueFor = (rowId: string, field: string) => {
    const ov = overrideMap[`${rowId}::${field}`];
    if (ov) return ov.translation;
    return enById[rowId]?.[field] ?? '';
  };

  const currentValue = (rowId: string, field: string) => {
    const key = `${rowId}::${field}`;
    return key in edits ? edits[key] : enValueFor(rowId, field);
  };

  const isDirty = (rowId: string, field: string) => {
    const key = `${rowId}::${field}`;
    return key in edits && edits[key] !== enValueFor(rowId, field);
  };

  const saveField = async (row: any, field: string) => {
    const key = `${row.id}::${field}`;
    setSavingKey(key);
    try {
      await contentTranslationOverrideService.upsert({
        table_name: table,
        row_id: row.id,
        field,
        lang,
        source_text: stripHtml(row[field] || ''),
        translation: edits[key],
      });
      toast({ title: 'Tersimpan', description: `${FIELD_LABEL[field] || field} diperbarui.` });
      await load(table);
    } catch (e) {
      toast({ title: 'Gagal menyimpan', description: e instanceof Error ? e.message : 'Error', variant: 'destructive' });
    } finally {
      setSavingKey(null);
    }
  };

  const resetField = async (rowId: string, field: string) => {
    const ov = overrideMap[`${rowId}::${field}`];
    if (!ov) return;
    const key = `${rowId}::${field}`;
    setSavingKey(key);
    try {
      await contentTranslationOverrideService.remove(ov.id);
      toast({ title: 'Direset', description: 'Kembali ke terjemahan otomatis.' });
      await load(table);
    } catch (e) {
      toast({ title: 'Gagal mereset', description: e instanceof Error ? e.message : 'Error', variant: 'destructive' });
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Languages className="w-6 h-6" /> Terjemahan Konten (EN)
          </h2>
          <p className="text-muted-foreground">
            Koreksi terjemahan otomatis Bahasa Inggris per konten. Kosongkan & reset untuk memakai terjemahan otomatis lagi.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Select value={table} onValueChange={setTable}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(TRANSLATABLE).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari konten..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 max-w-sm"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : visibleRows.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">Tidak ada konten.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {visibleRows.map((row) => (
            <Card key={row.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{rowTitle(row)}</CardTitle>
                <CardDescription className="text-xs">{table} · {String(row.id).slice(0, 8)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field) => {
                  const key = `${row.id}::${field}`;
                  const idText = row[field];
                  if (!idText || !stripHtml(String(idText))) return null;
                  const hasOverride = !!overrideMap[key];
                  const dirty = isDirty(row.id, field);
                  const busy = savingKey === key;
                  return (
                    <div key={field} className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t pt-3 first:border-t-0 first:pt-0">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground flex items-center gap-2">
                          {FIELD_LABEL[field] || field} <span className="opacity-60">(ID — sumber)</span>
                        </Label>
                        <div className="text-sm rounded-md border bg-muted/40 px-3 py-2 whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {stripHtml(String(idText))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-2">
                          {FIELD_LABEL[field] || field} <span className="opacity-60">(EN)</span>
                          {hasOverride && <Badge variant="secondary" className="text-[10px]">Manual</Badge>}
                        </Label>
                        <Textarea
                          value={currentValue(row.id, field)}
                          onChange={(e) => setEdits((prev) => ({ ...prev, [key]: e.target.value }))}
                          rows={3}
                          className="text-sm"
                        />
                        <div className="flex items-center gap-2 pt-1">
                          <Button size="sm" disabled={!dirty || busy} onClick={() => saveField(row, field)}>
                            {busy ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1" />}
                            Simpan
                          </Button>
                          {hasOverride && (
                            <Button size="sm" variant="outline" disabled={busy} onClick={() => resetField(row.id, field)}>
                              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset ke otomatis
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentTranslationManagement;
