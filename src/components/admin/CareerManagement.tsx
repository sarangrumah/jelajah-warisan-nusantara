import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CareerManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Career Management</h2>
        <p className="text-muted-foreground">Manage career opportunities and applications</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Career CMS</CardTitle>
          <CardDescription>Manage job postings and internship applications</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Career management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerManagement;