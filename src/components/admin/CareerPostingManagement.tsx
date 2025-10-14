import { useEffect, useState } from 'react';
import { careerMgmtService, careerSubmissionService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { Loader2, Edit, Save, X, Plus, Trash, UserPlus } from 'lucide-react';
import FileUploadPDF from '@/components/FileUploadPDF';
import QuillEditor from '@/components/ui/quill-editor';
import { RejectReasonDialog } from '@/components/admin/RejectReasonDialog';
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

interface CareerPosting {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  requirement?: string;
  responsibility?: string;
  supervisor?: string;
  publish_date?: string;
  end_publish_date?: string;
  position_needed?: number;
  period?: string;
  location?: string;
  is_active: boolean;
  is_approved?: boolean;
  is_rejected?: boolean;
  reason_rejected?: string;
  created_at?: string;
  updated_at?: string;
}

const emptyPosting: CareerPosting = {
  title: '',
  subtitle: '',
  description: '',
  requirement: '',
  responsibility: '',
  supervisor: '',
  publish_date: '',
  end_publish_date: '',
  position_needed: undefined,
  period: '',
  location: '',
  is_active: true,
  is_approved: false,
  is_rejected: false,
  reason_rejected: '',
};

const CareerPostingForm = ({ data, onSave, onCancel, saving }: {
  data?: CareerPosting;
  onSave: (d: CareerPosting) => void;
  onCancel: () => void;
  saving: boolean;
}) => {
  // Convert various date formats to input[type=datetime-local] friendly (YYYY-MM-DDTHH:MM)
  const toDateTimeLocal = (value?: string) => {
    if (!value) {return ''};
    let d = new Date(value);
    if (isNaN(d.getTime())) {
      // Try common "YYYY-MM-DD HH:MM:SS" format
      d = new Date(value.replace(' ', 'T'));
    }
    if (isNaN(d.getTime())) {return ''};
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  const [formData, setFormData] = useState<CareerPosting>(() => {
    const b = data || emptyPosting;
    return {
      ...b,
      publish_date: toDateTimeLocal(b.publish_date),
      end_publish_date: toDateTimeLocal(b.end_publish_date),
    };
  });

  // Keep form in sync when switching edited item
  useEffect(() => {
    const b = data || emptyPosting;
    setFormData({
      ...b,
      publish_date: toDateTimeLocal(b.publish_date),
      end_publish_date: toDateTimeLocal(b.end_publish_date),
    });
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normalize numeric
    const payload: CareerPosting = {
      ...formData,
      position_needed: formData.position_needed === undefined || formData.position_needed === null || formData.position_needed === ('' as any)
        ? undefined
        : Number(formData.position_needed),
    };
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={formData.title} onChange={(e) => setFormData(p => ({...p, title: e.target.value}))} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input id="subtitle" value={formData.subtitle} onChange={(e) => setFormData(p => ({...p, subtitle: e.target.value}))} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <QuillEditor
          value={formData.description || ''}
          onChange={(html) => setFormData(p => ({ ...p, description: html }))}
          height={100}
          placeholder="Write a brief description"
        />
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
        <div className="space-y-2">
          <Label htmlFor="requirement">Requirement</Label>
          <QuillEditor
            value={formData.requirement || ''}
            onChange={(html) => setFormData(p => ({ ...p, requirement: html }))}
            height={100}
            placeholder="Write requirements…"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="responsibility">Responsibility</Label>
          <QuillEditor
            value={formData.responsibility || ''}
            onChange={(html) => setFormData(p => ({ ...p, responsibility: html }))}
            height={100}
            placeholder="Write responsibilities…"
          />
        </div>
      {/* </div> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="supervisor">Supervisor</Label>
          <Input id="supervisor" value={formData.supervisor} onChange={(e) => setFormData(p => ({...p, supervisor: e.target.value}))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publish_date">Publish Date</Label>
          <Input id="publish_date" type="datetime-local" value={formData.publish_date || ''} onChange={(e) => setFormData(p => ({...p, publish_date: e.target.value}))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_publish_date">End Publish Date</Label>
          <Input id="end_publish_date" type="datetime-local" value={formData.end_publish_date || ''} onChange={(e) => setFormData(p => ({...p, end_publish_date: e.target.value}))} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position_needed">Position Needed</Label>
          <Input id="position_needed" type="number" min="0" value={formData.position_needed as any || ''} onChange={(e) => setFormData(p => ({...p, position_needed: e.target.value === '' ? undefined : Number(e.target.value)}))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="period">Period</Label>
          <Input id="period" value={formData.period} onChange={(e) => setFormData(p => ({...p, period: e.target.value}))} placeholder="e.g., 6 months" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={formData.location} onChange={(e) => setFormData(p => ({...p, location: e.target.value}))} />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="is_active" checked={!!formData.is_active} onCheckedChange={(checked) => setFormData(p => ({...p, is_active: checked}))} />
        <Label htmlFor="is_active">Publish</Label>
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

const CareerPostingManagement = ({ userRole }: { userRole: string }) => {
  const [items, setItems] = useState<CareerPosting[]>([]);
  const [selected, setSelected] = useState<CareerPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<CareerPosting | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogDelete, setIsDialogDelete] = useState(false);
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [submissionFor, setSubmissionFor] = useState<CareerPosting | null>(null);
  const { toast } = useToast();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const response = await careerMgmtService.getAll();
      if (response.error) {throw new Error(response.error)};
      const data = (response.data as CareerPosting[] | undefined) || [];
      setItems(data.map((item) => ({
        ...item,
        reason_rejected: item.reason_rejected ?? '',
      })));
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to load career postings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Submission form types and handlers
  type SubmissionFormData = {
    name_volunteer: string;
    email: string;
    mobile_phone?: string;
    university_name?: string;
    major?: string;
    semester?: number | '';
    ipk?: number | '';
    motivation?: string;
    cv_url?: string;
    transcript_url?: string;
    cover_letter_url?: string;
  };

  const [submissionSaving, setSubmissionSaving] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionFormData>({
    name_volunteer: '',
    email: '',
    mobile_phone: '',
    university_name: '',
    major: '',
    semester: '',
    ipk: '',
    motivation: '',
    cv_url: '',
    transcript_url: '',
    cover_letter_url: ''
  });

  const openSubmissionDialog = (posting: CareerPosting) => {
    setSubmissionFor(posting);
    setSubmissionData({
      name_volunteer: '',
      email: '',
      mobile_phone: '',
      university_name: '',
      major: '',
      semester: '',
      ipk: '',
      motivation: '',
      cv_url: '',
      transcript_url: '',
      cover_letter_url: ''
    });
    setIsSubmissionDialogOpen(true);
  };

  const saveSubmission = async () => {
    if (!submissionFor) {return};
    setSubmissionSaving(true);
    try {
      const payload: any = {
        career_id: submissionFor.id,
        name_volunteer: submissionData.name_volunteer,
        email: submissionData.email,
        mobile_phone: submissionData.mobile_phone || null,
        university_name: submissionData.university_name || null,
        major: submissionData.major || null,
        semester: submissionData.semester === '' ? null : Number(submissionData.semester),
        ipk: submissionData.ipk === '' ? null : Number(submissionData.ipk),
        motivation: submissionData.motivation || null,
        cv_url: submissionData.cv_url || null,
        transcript_url: submissionData.transcript_url || null,
        cover_letter_url: submissionData.cover_letter_url || null,
        application_status: 'pending',
        is_active: true,
      };
      const res = await careerSubmissionService.create(payload);
      if (res.error) {throw new Error(res.error)};
      toast({ title: 'Success', description: 'Submission added' });
      setIsSubmissionDialogOpen(false);
      setSubmissionFor(null);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to add submission', variant: 'destructive' });
    } finally {
      setSubmissionSaving(false);
    }
  };

  const saveItem = async (formData: CareerPosting) => {
    setSaving(true);
    try {
      const payload: CareerPosting = {
        ...formData,
        is_rejected: false,
        reason_rejected: '',
      };
      if (editingItem?.id) {
        const res = await careerMgmtService.update(editingItem.id, payload);
        if (res.error) {throw new Error(res.error)};
        setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...payload } : i));
        toast({ title: 'Success', description: 'Posting updated' });
      } else {
        const res = await careerMgmtService.create(payload);
        if (res.error) {throw new Error(res.error)};
        setItems(prev => [
          {
            ...(res.data as CareerPosting),
            reason_rejected: (res.data as CareerPosting)?.reason_rejected ?? '',
          },
          ...prev,
        ]);
        toast({ title: 'Success', description: 'Posting created' });
      }
      setEditingItem(null);
      setIsDialogOpen(false);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to save posting', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await careerMgmtService.update(id, { is_active: isActive });
      if (res.error) {throw new Error(res.error)};
      setItems(prev => prev.map(i => i.id === id ? { ...i, is_active: isActive } : i));
      toast({ title: 'Success', description: `Posting ${isActive ? 'published' : 'draft'}` });
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const toggleApproved = async (id: string) => {
    try {
      const res = await careerMgmtService.approve(id);
      if (res.error) {throw new Error(res.error)};
      const updated = (res.data || {}) as Partial<CareerPosting>;
      setItems(prev => prev.map(i => i.id === id ? {
        ...i,
        is_approved: updated.is_approved ?? true,
        is_rejected: updated.is_rejected ?? false,
        reason_rejected: '',
      } : i));
      toast({ title: 'Success', description: 'Posting approved' });
      fetchItems();
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to approve posting', variant: 'destructive' });
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
      toast({ title: 'Reason required', description: 'Please enter a rejection reason.', variant: 'destructive' });
      return;
    }

    try {
      setRejectSubmitting(true);
      const res = await careerMgmtService.reject(rejectingId, trimmedReason);
      if (res.error) {throw new Error(res.error)};
      const updated = (res.data || {}) as Partial<CareerPosting>;
      setItems(prev => prev.map(i => i.id === rejectingId ? {
        ...i,
        is_approved: updated.is_approved ?? false,
        is_rejected: updated.is_rejected ?? true,
        reason_rejected: updated.reason_rejected ?? trimmedReason,
      } : i));
      toast({ title: 'Success', description: 'Posting rejected' });
      closeRejectDialog();
      fetchItems();
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to reject posting', variant: 'destructive' });
    } finally {
      setRejectSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDialogDelete(false);
      const res = await careerMgmtService.delete(id);
      if (res.error) {throw new Error(res.error)};
      toast({ title: 'Success', description: 'Posting deleted' });
      fetchItems();
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to delete posting', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Career Posting Management</h2>
          <p className="text-muted-foreground">Manage career postings</p>
        </div>
          {userRole === 'admin' || userRole === 'super-admin' ?
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(emptyPosting)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Posting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingItem?.id ? 'Edit Posting' : 'Add New Posting'}</DialogTitle>
              <DialogDescription>
                {editingItem?.id ? 'Update posting information' : 'Create new career posting'}
              </DialogDescription>
            </DialogHeader>
            <CareerPostingForm
              data={editingItem || emptyPosting}
              onSave={saveItem}
              onCancel={() => { setEditingItem(null); setIsDialogOpen(false); }}
              saving={saving}
            />
          </DialogContent>
        </Dialog> : <></>}
      </div>

      <div className="flex justify-between items-center">
        {selected ? (
          <Dialog open={isDialogDelete} onOpenChange={setIsDialogDelete}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{'Delete ' + selected.title}</DialogTitle>
                <DialogDescription>{'Are you sure you want to delete ' + selected.title + '?'}</DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogDelete(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isDialogOpen} onClick={() => handleDelete(selected.id!)}>
                  {isDialogOpen && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <RejectReasonDialog
        open={rejectDialogOpen}
        reason={rejectReason}
        loading={rejectSubmitting}
        onReasonChange={(value) => setRejectReason(value)}
        onSubmit={submitReject}
        onClose={closeRejectDialog}
        title="Reject Career Posting"
      />

      {items.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No postings created yet</p>
            <Button onClick={() => { setEditingItem(emptyPosting); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Posting
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map(item => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {item.title}
                    <Badge variant={item.is_active ? 'default' : 'secondary'}>
                      {item.is_active ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge variant={item.is_approved ? 'success' : item.is_rejected ? 'destructive' : 'secondary'}>
                      {item.is_approved ? 'Approved' : item.is_rejected ? 'Rejected' : 'Pending'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{item.subtitle}</CardDescription>
                </div>
                  {userRole === 'admin' || userRole === 'super-admin' ? (
                    <div className="flex items-center space-x-2">
                      {/* <Button variant="outline" size="sm" onClick={() => openSubmissionDialog(item)}>
                        <UserPlus className="w-4 h-4" />
                      </Button> */}
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={!!item.is_active}
                          onCheckedChange={(checked) => toggleActive(item.id!, checked)}
                        />
                      </div>
                      {(userRole === 'super-admin' || userRole === 'approver') && !item.is_approved && !item.is_rejected ? (
                        <>
                          <Button variant="success" size="sm" onClick={() => toggleApproved(item.id!)}>
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => item.id && openRejectDialog(item.id)}>
                            Reject
                          </Button>
                        </>
                      ) : null}
                      <Button variant="outline" size="sm" onClick={() => { setEditingItem(item); setIsDialogOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => { setSelected(item); setIsDialogDelete(true); }}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : userRole === 'approver' && !item.is_approved && !item.is_rejected ? (
                    <div className="flex items-center space-x-2">
                      <Button variant="success" className="w-full" onClick={() => toggleApproved(item.id!)}>
                        Approve
                      </Button>
                      <Button variant="destructive" className="w-full" onClick={() => item.id && openRejectDialog(item.id)}>
                        Reject
                      </Button>
                    </div>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Publish:</span>
                    <p className="text-muted-foreground">
                      {item.publish_date ? new Date(item.publish_date).toLocaleString() : '-'}
                      {item.end_publish_date ? ' - ' + new Date(item.end_publish_date).toLocaleString() : ''}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <p className="text-muted-foreground">{item.location || '-'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                  <div>
                    <span className="font-medium">Supervisor:</span>
                    <p className="text-muted-foreground">{item.supervisor || '-'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Positions Needed:</span>
                    <p className="text-muted-foreground">{item.position_needed ?? '-'}</p>
                  </div>
                </div>
                {item.description && (
                  <div className="mt-4">
                    <span className="font-medium">Description:</span>
                    <div
                      className="text-sm text-muted-foreground mt-1"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(fixBrokenHtmlTags(item.description || '')) }}
                    />
                  </div>
                )}
                {(item.requirement || item.responsibility) && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Requirements:</span>
                      <div
                        className="prose prose-sm text-muted-foreground mt-1"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(fixBrokenHtmlTags(item.requirement || '')) }}
                      />
                    </div>
                    <div>
                      <span className="font-medium">Responsibilities:</span>
                      <div
                        className="prose prose-sm text-muted-foreground mt-1"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(fixBrokenHtmlTags(item.responsibility || '')) }}
                      />
                    </div>
                  </div>
                )}
                {item.is_rejected && item.reason_rejected?.trim() ? (
                  <div className="mt-4 text-sm">
                    <span className="font-medium">Alasan Penolakan : </span>
                    <p className="text-muted-foreground">{item.reason_rejected}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Submission {submissionFor ? `— ${submissionFor.title}` : ''}</DialogTitle>
            <DialogDescription>Fill in the volunteer applicant details</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveSubmission(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name Volunteer</Label>
                <Input value={submissionData.name_volunteer} onChange={(e) => setSubmissionData(p => ({...p, name_volunteer: e.target.value}))} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={submissionData.email} onChange={(e) => setSubmissionData(p => ({...p, email: e.target.value}))} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mobile Phone / Whatsapp</Label>
                <Input value={submissionData.mobile_phone} onChange={(e) => setSubmissionData(p => ({...p, mobile_phone: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>University Name</Label>
                <Input value={submissionData.university_name} onChange={(e) => setSubmissionData(p => ({...p, university_name: e.target.value}))} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Major</Label>
                <Input value={submissionData.major} onChange={(e) => setSubmissionData(p => ({...p, major: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Input type="number" min="1" value={submissionData.semester as any} onChange={(e) => setSubmissionData(p => ({...p, semester: e.target.value === '' ? '' : Number(e.target.value)}))} />
              </div>
              <div className="space-y-2">
                <Label>IPK</Label>
                <Input type="number" step="0.01" min="0" max="4" value={submissionData.ipk as any} onChange={(e) => setSubmissionData(p => ({...p, ipk: e.target.value === '' ? '' : Number(e.target.value)}))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Motivasi & Tujuan</Label>
              <QuillEditor
                value={submissionData?.motivation ?? ''}
                onChange={(html) => setSubmissionData(p => (p ? { ...p, motivation: html } : p))}
                height={100}
                placeholder="Volunteer motivation"
              />
            </div>

            <FileUploadPDF bucket="cv-uploads" label="CV Upload (PDF)" onUploadComplete={(url) => setSubmissionData(p => ({...p, cv_url: url}))} />
            <FileUploadPDF bucket="transcripts" label="Transkrip Nilai (PDF)" onUploadComplete={(url) => setSubmissionData(p => ({...p, transcript_url: url}))} />
            <FileUploadPDF bucket="cover-letters" label="Surat Pengantar (PDF)" onUploadComplete={(url) => setSubmissionData(p => ({...p, cover_letter_url: url}))} />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsSubmissionDialogOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={submissionSaving}>
                {submissionSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Submission
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareerPostingManagement;
