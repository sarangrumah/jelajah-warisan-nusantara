import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MediaManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Media & Publication Management</h2>
        <p className="text-muted-foreground">Manage news articles and publications</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Media & Publication CMS</CardTitle>
          <CardDescription>Manage news articles, publications, and documents</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Media and publication management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaManagement;