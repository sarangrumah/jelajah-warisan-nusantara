import { useState, useEffect } from 'react';
import { faqService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Edit, Save, X, Plus, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const FAQManagement = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await faqService.getAll();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setFaqs(response.data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load FAQs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveFaq = async (formData: any) => {
    setSaving(true);
    try {
      const faqData = {
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        order_index: formData.order_index ? parseInt(formData.order_index) : 0,
        is_published: formData.is_published,
      };

      if (editingFaq?.id) {
        const response = await faqService.update(editingFaq.id, faqData);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setFaqs(prev => prev.map(f => 
          f.id === editingFaq.id ? { ...f, ...faqData } : f
        ).sort((a, b) => a.order_index - b.order_index));
        
        toast({
          title: 'Success',
          description: 'FAQ updated successfully',
        });
      } else {
        const response = await faqService.create(faqData);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setFaqs(prev => [...prev, response.data].sort((a, b) => a.order_index - b.order_index));
        
        toast({
          title: 'Success',
          description: 'FAQ created successfully',
        });
      }
      
      setEditingFaq(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast({
        title: 'Error',
        description: 'Failed to save FAQ',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const response = await faqService.update(id, { is_published: isPublished });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setFaqs(prev => prev.map(faq => 
        faq.id === id ? { ...faq, is_published: isPublished } : faq
      ));
      
      toast({
        title: 'Success',
        description: `FAQ ${isPublished ? 'published' : 'unpublished'}`,
      });
    } catch (error) {
      console.error('Error toggling FAQ:', error);
      toast({
        title: 'Error',
        description: 'Failed to update FAQ status',
        variant: 'destructive',
      });
    }
  };

  const updateOrder = async (id: string, newOrder: number) => {
    try {
      const response = await faqService.update(id, { order_index: newOrder });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setFaqs(prev => prev.map(faq => 
        faq.id === id ? { ...faq, order_index: newOrder } : faq
      ).sort((a, b) => a.order_index - b.order_index));
      
      toast({
        title: 'Success',
        description: 'FAQ order updated successfully',
      });
    } catch (error) {
      console.error('Error updating FAQ order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update FAQ order',
        variant: 'destructive',
      });
    }
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      const currentFaq = faqs[index];
      const prevFaq = faqs[index - 1];
      updateOrder(currentFaq.id, prevFaq.order_index);
      updateOrder(prevFaq.id, currentFaq.order_index);
    }
  };

  const moveDown = (index: number) => {
    if (index < faqs.length - 1) {
      const currentFaq = faqs[index];
      const nextFaq = faqs[index + 1];
      updateOrder(currentFaq.id, nextFaq.order_index);
      updateOrder(nextFaq.id, currentFaq.order_index);
    }
  };

  const FaqForm = ({ faq, onSave, onCancel }: {
    faq?: any;
    onSave: (data: any) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      question: faq?.question || '',
      answer: faq?.answer || '',
      category: faq?.category || '',
      order_index: faq?.order_index?.toString() || '0',
      is_published: faq?.is_published ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question">Question</Label>
          <Textarea
            id="question"
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            required
            rows={2}
            placeholder="What is the question users frequently ask?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="answer">Answer</Label>
          <Textarea
            id="answer"
            value={formData.answer}
            onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
            required
            rows={4}
            placeholder="Provide a comprehensive answer to the question"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., General, Tickets, Exhibitions"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order_index">Display Order</Label>
            <Input
              id="order_index"
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData(prev => ({ ...prev, order_index: e.target.value }))}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={formData.is_published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
          />
          <Label htmlFor="is_published">Publish FAQ</Label>
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
          <h2 className="text-2xl font-bold">FAQ Management</h2>
          <p className="text-muted-foreground">Manage frequently asked questions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingFaq(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </DialogTitle>
              <DialogDescription>
                {editingFaq ? 'Update FAQ information' : 'Create a new frequently asked question'}
              </DialogDescription>
            </DialogHeader>
            <FaqForm
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

      {faqs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No FAQs created yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First FAQ
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {faqs.map((faq, index) => (
            <Card key={faq.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">#{faq.order_index}</span>
                      {faq.question}
                      <Badge variant={faq.is_published ? 'default' : 'secondary'}>
                        {faq.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{faq.category}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveDown(index)}
                      disabled={index === faqs.length - 1}
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="font-medium">Answer:</span>
                  <p className="text-muted-foreground mt-1 line-clamp-3">
                    {faq.answer}
                  </p>
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