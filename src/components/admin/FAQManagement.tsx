import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FAQManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">FAQ Management</h2>
        <p className="text-muted-foreground">Manage frequently asked questions</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>FAQ CMS</CardTitle>
          <CardDescription>Manage frequently asked questions and answers</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">FAQ management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQManagement;