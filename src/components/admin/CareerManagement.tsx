import { useState, useEffect } from 'react';
import { careerService, careerApplicationService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Edit, Save, X, Plus, Eye, EyeOff, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const CareerManagement = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOpportunities();
    fetchApplications();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await careerService.getAll();
      if (response.error) throw new Error(response.error);
      setOpportunities(response.data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load career opportunities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await careerApplicationService.getAll();
      if (response.error) throw new Error(response.error);
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const saveOpportunity = async (formData: any) => {
    setSaving(true);
    try {
      const opportunityData = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        requirements: formData.requirements,
        benefits: formData.benefits,
        location: formData.location,
        duration: formData.duration,
        application_deadline: formData.application_deadline || null,
        is_published: formData.is_published,
      };

      if (editingOpportunity?.id) {
        const response = await careerService.update(editingOpportunity.id, opportunityData);
        if (response.error) throw new Error(response.error);
        
        setOpportunities(prev => prev.map(o => 
          o.id === editingOpportunity.id ? { ...o, ...opportunityData } : o
        ));
        
        toast({
          title: 'Success',
          description: 'Career opportunity updated successfully',
        });
      } else {
        const response = await careerService.create(opportunityData);
        if (response.error) throw new Error(response.error);
        
        setOpportunities(prev => [response.data, ...prev]);
        
        toast({
          title: 'Success',
          description: 'Career opportunity created successfully',
        });
      }
      
      setEditingOpportunity(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving opportunity:', error);
      toast({
        title: 'Error',
        description: 'Failed to save career opportunity',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const response = await careerService.update(id, { is_published: isPublished });
      if (response.error) throw new Error(response.error);
      
      setOpportunities(prev => prev.map(opportunity => 
        opportunity.id === id ? { ...opportunity, is_published: isPublished } : opportunity
      ));
      
      toast({
        title: 'Success',
        description: `Opportunity ${isPublished ? 'published' : 'unpublished'}`,
      });
    } catch (error) {
      console.error('Error toggling opportunity:', error);
      toast({
        title: 'Error',
        description: 'Failed to update opportunity status',
        variant: 'destructive',
      });
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const response = await careerApplicationService.update(id, { status });
      if (response.error) throw new Error(response.error);
      
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status } : app
      ));
      
      toast({
        title: 'Success',
        description: `Application status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update application status',
        variant: 'destructive',
      });
    }
  };

  const OpportunityForm = ({ opportunity, onSave, onCancel }: {
    opportunity?: any;
    onSave: (data: any) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: opportunity?.title || '',
      type: opportunity?.type || 'internship',
      description: opportunity?.description || '',
      requirements: opportunity?.requirements || '',
      benefits: opportunity?.benefits || '',
      location: opportunity?.location || '',
      duration: opportunity?.duration || '',
      application_deadline: opportunity?.application_deadline || '',
      is_published: opportunity?.is_published ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="fulltime">Full Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements">Requirements</Label>
          <Textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="benefits">Benefits</Label>
          <Textarea
            id="benefits"
            value={formData.benefits}
            onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 3 months"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="application_deadline">Application Deadline</Label>
          <Input
            id="application_deadline"
            type="datetime-local"
            value={formData.application_deadline}
            onChange={(e) => setFormData(prev => ({ ...prev, application_deadline: e.target.value }))}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={formData.is_published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
          />
          <Label htmlFor="is_published">Publish Opportunity</Label>
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
          <h2 className="text-2xl font-bold">Career Management</h2>
          <p className="text-muted-foreground">Manage career opportunities and applications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingOpportunity(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingOpportunity ? 'Edit Career Opportunity' : 'Add New Career Opportunity'}
              </DialogTitle>
              <DialogDescription>
                {editingOpportunity ? 'Update opportunity information' : 'Create a new job posting or internship opportunity'}
              </DialogDescription>
            </DialogHeader>
            <OpportunityForm
              opportunity={editingOpportunity}
              onSave={saveOpportunity}
              onCancel={() => {
                setEditingOpportunity(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList>
          <TabsTrigger value="opportunities">Career Opportunities</TabsTrigger>
          <TabsTrigger value="applications">
            Applications
            <Badge variant="secondary" className="ml-2">
              {applications.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          {opportunities.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">No career opportunities created yet</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Opportunity
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {opportunities.map((opportunity) => (
                <Card key={opportunity.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {opportunity.title}
                          <Badge variant={opportunity.type === 'internship' ? 'default' : opportunity.type === 'fulltime' ? 'outline' : 'secondary'}>
                            {opportunity.type}
                          </Badge>
                          <Badge variant={opportunity.is_published ? 'default' : 'secondary'}>
                            {opportunity.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{opportunity.location} • {opportunity.duration}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublished(opportunity.id, !opportunity.is_published)}
                        >
                          {opportunity.is_published ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingOpportunity(opportunity);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Deadline:</span>
                        <p className="text-muted-foreground">
                          {opportunity.application_deadline 
                            ? new Date(opportunity.application_deadline).toLocaleDateString()
                            : 'No deadline set'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Applications:</span>
                        <p className="text-muted-foreground">
                          {applications.filter(app => app.opportunity_id === opportunity.id).length} received
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {opportunity.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No applications received yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {application.full_name}
                          <Badge variant={
                            application.status === 'accepted' ? 'default' : 
                            application.status === 'rejected' ? 'destructive' : 
                            application.status === 'reviewed' ? 'outline' : 'secondary'
                          }>
                            {application.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Applied for: {application.career_opportunities?.title}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={application.status}
                          onValueChange={(value) => updateApplicationStatus(application.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewed">Reviewed</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Email:</span>
                        <p className="text-muted-foreground">{application.email}</p>
                      </div>
                      <div>
                        <span className="font-medium">University:</span>
                        <p className="text-muted-foreground">{application.university}</p>
                      </div>
                      <div>
                        <span className="font-medium">Applied:</span>
                        <p className="text-muted-foreground">
                          {new Date(application.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {application.motivation && (
                      <div className="mt-4">
                        <span className="font-medium text-sm">Motivation:</span>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                          {application.motivation}
                        </p>
                      </div>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {application.cv_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={application.cv_url} target="_blank" rel="noopener noreferrer">
                            View CV
                          </a>
                        </Button>
                      )}
                      {application.transcript_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={application.transcript_url} target="_blank" rel="noopener noreferrer">
                            View Transcript
                          </a>
                        </Button>
                      )}
                      {application.cover_letter_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={application.cover_letter_url} target="_blank" rel="noopener noreferrer">
                            View Cover Letter
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CareerManagement;