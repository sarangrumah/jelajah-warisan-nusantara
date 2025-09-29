import { useState, useEffect } from 'react';
import { faqService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Edit, Save, X, Plus, ArrowUp, ArrowDown, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EmptyState } from '../ErrorHandling';
import QuillEditor from '@/components/ui/quill-editor';

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  file_url: string;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
}

const FaqForm = ({ faq, onSave, onCancel, saving }: {
  faq?: Faq;
  onSave: (data: Faq) => void;
  onCancel: () => void;
  saving: boolean
}) => {
  const [formData, setFormData] = useState<Faq>(faq);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <QuillEditor
          value={formData.question || ''}
          onChange={(html) => setFormData(prev => ({ ...prev, question: html }))}
          height={100}
          placeholder="What is the question users frequently ask?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="answer">Answer</Label>
        <QuillEditor
          value={formData.answer || ''}
          onChange={(html) => setFormData(prev => ({ ...prev, answer: html }))}
          height={200}
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
             onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                order_index: value === '' ? 0 : parseInt(value, 10) // Handle empty input
              }));
            }}
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

const emptyFaq: Faq = {
  id: "",
  question: '',
  answer: '',
  category: "",
  order_index: 0,
  file_url: '',
  is_active: true,
  is_published: false,
  created_at: '',
  created_by: 0,
  updated_at: '',
  updated_by: 0,
};

const FAQManagement =  ({ userRole }: { userRole: string }) => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [faq, setFaq] = useState<Faq>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq>(emptyFaq);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogDelete, setIsDialogDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
      
      setFaqs(response.data as Faq[]|| []);
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

  const saveFaq = async (formData: Faq) => {
    setSaving(true);
    try {
      let response;
      if (editingFaq?.id) {
        response = await faqService.update(editingFaq.id, formData);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setFaqs(prev => prev.map(f => 
          f.id === editingFaq.id ? { ...f, ...formData } : f
        ).sort((a, b) => a.order_index - b.order_index));
        
        toast({
          title: 'Success',
          description: 'FAQ updated successfully',
        });
      } else {
        response = await faqService.create(formData);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setFaqs(prev => [...prev, response.data].sort((a, b) => a.order_index - b.order_index));
        
        toast({
          title: 'Success',
          description: 'FAQ created successfully',
        });
      }
      
      setEditingFaq(emptyFaq);
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
      
      setFaqs(prev => prev.map(e => 
        e.id === id ? { ...e, is_published: isPublished } : e
      ));
      
      toast({
        title: 'Success',
        description: `FAQ ${isPublished ? 'published' : 'draft'}`,
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

  const toggleDelete = async (id: string) => {
    try {
      setDeleting(true);
      const response = await faqService.delete(id);
      if (response.error) {throw new Error(response.error)};
      toast({
        title: 'Success',
        description: `Faq Deleted`,
      });
      setFaqs(prev => prev.filter(f => f.id !== id));
      setIsDialogDelete(false);
      setFaq(undefined);
    } catch (error) {
      console.error('Error toggling faq:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete FAQ',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
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
          <h2 className="text-2xl font-bold">FAQ Management</h2>
          <p className="text-muted-foreground">Manage frequently asked questions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            { userRole !== "approver" && userRole !== "viewer" ?             
              <Button onClick={() => setEditingFaq(emptyFaq)}>
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button> : 
              <div></div>
            }

          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFaq.id ? 'Edit FAQ' : 'Add New FAQ'}
              </DialogTitle>
              <DialogDescription>
                {editingFaq.id ? 'Update FAQ information' : 'Create a new frequently asked question'}
              </DialogDescription>
            </DialogHeader>
            <FaqForm
              faq={editingFaq}
              onSave={saveFaq}
              onCancel={() => {
                setEditingFaq(emptyFaq);
                setIsDialogOpen(false);
              }}
              saving={saving}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center">
        {faq != null  ? <Dialog open={isDialogDelete} onOpenChange={(open) => {
          if (deleting) {
            return;
          }
          setIsDialogDelete(open);
          if (!open) {
            setFaq(undefined);
          }
        }}>
          <DialogContent className="max-w-4xl">
              <DialogHeader>
                  <DialogTitle>
                  {'Delete ' + faq.question + ' content'}
                  </DialogTitle>
                  <DialogDescription>
                  {'Are you sure want delete this' + faq.question + ' content'}
                  </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" disabled={deleting} onClick={() => setIsDialogDelete(false)}>
                  <X className="w-4 h-4 mr-2" />
                      Cancel
                  </Button>
                  <Button type="button" disabled={deleting} onClick={() => toggleDelete(faq.id)}>
                    {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Trash className="w-4 h-4 mr-2" />
                      Delete
                  </Button>
              </div>
          </DialogContent>
        </Dialog > : <div></div>}
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
                    <div className="flex items-center">
                      <Switch
                        id={`faq-publish-${faq.id}`}
                        checked={faq.is_published}
                        onCheckedChange={(checked) => togglePublished(faq.id, checked)}
                      />
                    </div>
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
                    {userRole !== 'viewer' && userRole !== 'approver' ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setFaq(faq);
                          setIsDialogDelete(true);
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    ) : null}
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
