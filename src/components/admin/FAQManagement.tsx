import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Edit, Save, X, Plus, Eye, EyeOff, Trash2, HelpCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  is_published: boolean;
  helpful_count: number;
  not_helpful_count: number;
  created_at: string;
  updated_at: string;
}

const FAQManagement = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const { toast } = useToast();

  const categories = ['Umum', 'Kunjungan', 'Koleksi', 'Penelitian', 'Edukasi', 'Teknis'];

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data FAQ',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveFaq = async (faq: Partial<FAQ>) => {
    setSaving(true);
    try {
      if (editingFaq?.id) {
        const { error } = await supabase
          .from('faqs')
          .update(faq)
          .eq('id', editingFaq.id);
        
        if (error) throw error;
        
        setFaqs(prev => prev.map(f => 
          f.id === editingFaq.id ? { ...f, ...faq } : f
        ));
        
        toast({
          title: 'Berhasil',
          description: 'FAQ berhasil diperbarui',
        });
      } else {
        // Get next order index
        const maxOrder = Math.max(...faqs.map(f => f.order_index), 0);
        const faqData = { ...faq, order_index: maxOrder + 1 };
        
        const { data, error } = await supabase
          .from('faqs')
          .insert([faqData])
          .select()
          .single();
        
        if (error) throw error;
        
        setFaqs(prev => [...prev, data].sort((a, b) => a.order_index - b.order_index));
        
        toast({
          title: 'Berhasil',
          description: 'FAQ berhasil ditambahkan',
        });
      }
      
      setEditingFaq(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan FAQ',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteFaq = async (id: string) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setFaqs(prev => prev.filter(f => f.id !== id));
      
      toast({
        title: 'Berhasil',
        description: 'FAQ berhasil dihapus',
      });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus FAQ',
        variant: 'destructive',
      });
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({ is_published: isPublished })
        .eq('id', id);
      
      if (error) throw error;
      
      setFaqs(prev => prev.map(faq => 
        faq.id === id ? { ...faq, is_published: isPublished } : faq
      ));
      
      toast({
        title: 'Berhasil',
        description: `FAQ ${isPublished ? 'dipublikasikan' : 'diturunkan'}`,
      });
    } catch (error) {
      console.error('Error toggling FAQ:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengubah status FAQ',
        variant: 'destructive',
      });
    }
  };

  const updateOrder = async (id: string, newOrderIndex: number) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({ order_index: newOrderIndex })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh data to get updated order
      await fetchFaqs();
      
      toast({
        title: 'Berhasil',
        description: 'Urutan FAQ berhasil diubah',
      });
    } catch (error) {
      console.error('Error updating FAQ order:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengubah urutan FAQ',
        variant: 'destructive',
      });
    }
  };

  const moveUp = (faq: FAQ) => {
    const currentIndex = faqs.findIndex(f => f.id === faq.id);
    if (currentIndex > 0) {
      const prevFaq = faqs[currentIndex - 1];
      updateOrder(faq.id, prevFaq.order_index);
      updateOrder(prevFaq.id, faq.order_index);
    }
  };

  const moveDown = (faq: FAQ) => {
    const currentIndex = faqs.findIndex(f => f.id === faq.id);
    if (currentIndex < faqs.length - 1) {
      const nextFaq = faqs[currentIndex + 1];
      updateOrder(faq.id, nextFaq.order_index);
      updateOrder(nextFaq.id, faq.order_index);
    }
  };

  const FAQForm = ({ faq, onSave, onCancel }: {
    faq?: FAQ | null;
    onSave: (data: Partial<FAQ>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      question: faq?.question || '',
      answer: faq?.answer || '',
      category: faq?.category || 'Umum',
      is_published: faq?.is_published ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question">Pertanyaan</Label>
          <Input
            id="question"
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            required
            placeholder="Masukkan pertanyaan yang sering ditanyakan"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="answer">Jawaban</Label>
          <Textarea
            id="answer"
            value={formData.answer}
            onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
            rows={4}
            required
            placeholder="Berikan jawaban yang jelas dan informatif"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={formData.is_published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
          />
          <Label htmlFor="is_published">Publikasikan FAQ</Label>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
        </div>
      </form>
    );
  };

  const filteredFaqs = faqs.filter(faq => 
    filterCategory === 'all' || faq.category === filterCategory
  );

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
          <h2 className="text-2xl font-bold">Manajemen FAQ</h2>
          <p className="text-muted-foreground">Kelola pertanyaan yang sering ditanyakan pengunjung</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingFaq(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFaq ? 'Edit FAQ' : 'Tambah FAQ Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingFaq ? 'Perbarui pertanyaan dan jawaban' : 'Tambahkan pertanyaan dan jawaban baru'}
              </DialogDescription>
            </DialogHeader>
            <FAQForm
              faq={editingFaq}
              onSave={saveFaq}
              onCancel={() => {
                setEditingFaq(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterCategory('all')}
        >
          Semua ({faqs.length})
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={filterCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory(category)}
          >
            {category} ({faqs.filter(f => f.category === category).length})
          </Button>
        ))}
      </div>

      {filteredFaqs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {filterCategory === 'all' 
                ? 'Belum ada FAQ yang ditambahkan' 
                : `Belum ada FAQ kategori ${filterCategory} yang ditambahkan`
              }
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah FAQ Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredFaqs.map((faq, index) => (
            <Card key={faq.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <HelpCircle className="w-4 h-4" />
                      {faq.question}
                      <Badge variant="outline">{faq.category}</Badge>
                      <Badge variant={faq.is_published ? 'default' : 'secondary'}>
                        {faq.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {faq.answer.substring(0, 150)}...
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveUp(faq)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveDown(faq)}
                      disabled={index === filteredFaqs.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(faq.id, !faq.is_published)}
                    >
                      {faq.is_published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingFaq(faq);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus FAQ</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus FAQ ini? Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteFaq(faq.id)}>
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Urutan:</span>
                    <p className="text-muted-foreground">#{faq.order_index}</p>
                  </div>
                  <div>
                    <span className="font-medium">Rating:</span>
                    <p className="text-muted-foreground">
                      👍 {faq.helpful_count || 0} | 👎 {faq.not_helpful_count || 0}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Terakhir diperbarui:</span>
                    <p className="text-muted-foreground">
                      {new Date(faq.updated_at).toLocaleDateString()}
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

export default FAQManagement;