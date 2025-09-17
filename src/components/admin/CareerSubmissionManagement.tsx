import { useEffect, useMemo, useState } from 'react';
import { careerSubmissionService } from '@/lib/api-services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Submission = {
  id: string;
  career_id: string;
  career?: { id: string; title: string } | null; // from relationship
  name_volunteer: string;
  email: string;
  mobile_phone?: string;
  university_name?: string;
  major?: string;
  semester?: number;
  ipk?: number;
  motivation?: string;
  cv_url?: string;
  transcript_url?: string;
  cover_letter_url?: string;
  application_status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  is_active: boolean;
  created_at?: string;
};

const statusOptions = ['pending', 'reviewed', 'accepted', 'rejected'] as const;

const CareerSubmissionManagement = ({ userRole }: { userRole: string }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [detail, setDetail] = useState<Submission | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await careerSubmissionService.getAll();
      if (res.error) {throw new Error(res.error)};
      setSubmissions((res.data as Submission[]) || []);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to load submissions', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return submissions.filter(s => {
      const matchesSearch = [
        s.name_volunteer,
        s.email,
        s.mobile_phone || '',
        s.career?.title || '',
      ].some(v => v?.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || s.application_status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [submissions, search, statusFilter]);

  const updateStatus = async (id: string, application_status: Submission['application_status']) => {
    try {
      const res = await careerSubmissionService.update(id, { application_status });
      if (res.error) {throw new Error(res.error)};
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, application_status } : s));
      toast({ title: 'Success', description: `Status updated to ${application_status}` });
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Career Submissions</h2>
          <p className="text-muted-foreground">Manage volunteer applications for career postings</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <Input placeholder="Search by name, email, career title..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="w-full md:w-56">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {statusOptions.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No submissions found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map(sub => (
            <Card key={sub.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {sub.name_volunteer}
                      <Badge variant={
                        sub.application_status === 'accepted' ? 'default' :
                        sub.application_status === 'rejected' ? 'destructive' :
                        sub.application_status === 'reviewed' ? 'outline' : 'secondary'
                      }>
                        {sub.application_status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {sub.email} • {sub.mobile_phone || '-'} • Career: {sub.career?.title || sub.career_id}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={sub.application_status} onValueChange={(v) => updateStatus(sub.id, v as Submission['application_status'])}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => setDetail(sub)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">University:</span>
                    <p className="text-muted-foreground">{sub.university_name || '-'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Major:</span>
                    <p className="text-muted-foreground">{sub.major || '-'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Semester / IPK:</span>
                    <p className="text-muted-foreground">{sub.semester ?? '-'} / {sub.ipk ?? '-'}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sub.cv_url && <Button asChild variant="outline" size="sm"><a href={sub.cv_url} target="_blank" rel="noopener noreferrer">View CV</a></Button>}
                  {sub.transcript_url && <Button asChild variant="outline" size="sm"><a href={sub.transcript_url} target="_blank" rel="noopener noreferrer">View Transcript</a></Button>}
                  {sub.cover_letter_url && <Button asChild variant="outline" size="sm"><a href={sub.cover_letter_url} target="_blank" rel="noopener noreferrer">View Cover Letter</a></Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-3xl">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle>Submission Detail — {detail.name_volunteer}</DialogTitle>
                <DialogDescription>
                  Career: {detail.career?.title || detail.career_id}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground">{detail.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm text-muted-foreground">{detail.mobile_phone || '-'}</p>
                </div>
                <div>
                  <Label>University</Label>
                  <p className="text-sm text-muted-foreground">{detail.university_name || '-'}</p>
                </div>
                <div>
                  <Label>Major / Semester / IPK</Label>
                  <p className="text-sm text-muted-foreground">{detail.major || '-'} / {detail.semester ?? '-'} / {detail.ipk ?? '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <Label>Motivation</Label>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{detail.motivation || '-'}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {detail.cv_url && <Button asChild variant="outline" size="sm"><a href={detail.cv_url} target="_blank" rel="noopener noreferrer">View CV</a></Button>}
                {detail.transcript_url && <Button asChild variant="outline" size="sm"><a href={detail.transcript_url} target="_blank" rel="noopener noreferrer">View Transcript</a></Button>}
                {detail.cover_letter_url && <Button asChild variant="outline" size="sm"><a href={detail.cover_letter_url} target="_blank" rel="noopener noreferrer">View Cover Letter</a></Button>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareerSubmissionManagement;

