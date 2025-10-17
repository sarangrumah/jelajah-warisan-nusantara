import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Languages, Plus, Edit, Trash2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface Translation {
  id: string;
  module: string;
  page: string;
  key: string;
  language_code: string;
  language_name: string;
  flag: string;
  text: string;
  auto_translated: boolean;
  last_updated: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
  is_active: boolean;
}

const TranslationManagement = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  // Form state for new translation
  const [newTranslation, setNewTranslation] = useState({
    module: 'translation',
    page: '',
    key: '',
    text: ''
  });

  useEffect(() => {
    fetchLanguages();
    fetchTranslations();
    checkHealth();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/translations/languages');
      const data = await response.json();
      setLanguages(data);
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast.error('Failed to fetch languages');
    }
  };

  const fetchTranslations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/translations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Error fetching translations:', error);
      toast.error('Failed to fetch translations');
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      const response = await fetch('/api/translations/health');
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      console.error('Error checking health:', error);
    }
  };

  const handleAddTranslation = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/translations/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTranslation)
      });

      if (response.ok) {
        toast.success('Translation added for all languages');
        setIsAddDialogOpen(false);
        setNewTranslation({ module: 'translation', page: '', key: '', text: '' });
        fetchTranslations();
      } else {
        toast.error('Failed to add translation');
      }
    } catch (error) {
      console.error('Error adding translation:', error);
      toast.error('Failed to add translation');
    }
  };

  const handleEditTranslation = async () => {
    if (!editingTranslation) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/translations/${editingTranslation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: editingTranslation.text })
      });

      if (response.ok) {
        toast.success('Translation updated');
        setIsEditDialogOpen(false);
        setEditingTranslation(null);
        fetchTranslations();
      } else {
        toast.error('Failed to update translation');
      }
    } catch (error) {
      console.error('Error updating translation:', error);
      toast.error('Failed to update translation');
    }
  };

  const handleDeleteTranslation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this translation?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/translations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Translation deleted');
        fetchTranslations();
      } else {
        toast.error('Failed to delete translation');
      }
    } catch (error) {
      console.error('Error deleting translation:', error);
      toast.error('Failed to delete translation');
    }
  };

  const handleRetranslateAll = async () => {
    if (!confirm('This will re-translate all auto-translated entries. Continue?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/translations/retranslate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        fetchTranslations();
      } else {
        toast.error('Failed to re-translate');
      }
    } catch (error) {
      console.error('Error re-translating:', error);
      toast.error('Failed to re-translate');
    }
  };

  const filteredTranslations = translations.filter(t => {
    const matchesSearch = 
      t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.page.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLanguage = selectedLanguage === 'all' || t.language_code === selectedLanguage;
    
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Translation Management</h2>
          <p className="text-muted-foreground">
            Manage translations with automatic translation support
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={checkHealth} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Check Health
          </Button>
          <Button onClick={handleRetranslateAll} variant="outline" size="sm">
            <Languages className="h-4 w-4 mr-2" />
            Re-translate All
          </Button>
        </div>
      </div>

      {/* Health Status */}
      {healthStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {healthStatus.healthy ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              Translation Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-medium">{healthStatus.service}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={healthStatus.healthy ? 'default' : 'destructive'}>
                  {healthStatus.healthy ? 'Operational' : 'Unavailable'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supported Languages</p>
                <p className="font-medium">{healthStatus.supportedLanguages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Translations</CardTitle>
          <CardDescription>
            Total: {filteredTranslations.length} translations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search translations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Translation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Translation</DialogTitle>
                  <DialogDescription>
                    Add a translation key. It will be automatically translated to all languages.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Module</Label>
                    <Input
                      value={newTranslation.module}
                      onChange={(e) => setNewTranslation({ ...newTranslation, module: e.target.value })}
                      placeholder="translation"
                    />
                  </div>
                  <div>
                    <Label>Page</Label>
                    <Input
                      value={newTranslation.page}
                      onChange={(e) => setNewTranslation({ ...newTranslation, page: e.target.value })}
                      placeholder="nav, hero, footer, etc."
                    />
                  </div>
                  <div>
                    <Label>Key</Label>
                    <Input
                      value={newTranslation.key}
                      onChange={(e) => setNewTranslation({ ...newTranslation, key: e.target.value })}
                      placeholder="home, about, contact, etc."
                    />
                  </div>
                  <div>
                    <Label>Text (Indonesian)</Label>
                    <Textarea
                      value={newTranslation.text}
                      onChange={(e) => setNewTranslation({ ...newTranslation, text: e.target.value })}
                      placeholder="Enter Indonesian text..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTranslation}>
                    Add Translation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Translations Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Language</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Text</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading translations...
                    </TableCell>
                  </TableRow>
                ) : filteredTranslations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No translations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTranslations.map((translation) => (
                    <TableRow key={translation.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{translation.flag}</span>
                          <span className="text-sm">{translation.language_code}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{translation.module}</TableCell>
                      <TableCell className="font-mono text-xs">{translation.page}</TableCell>
                      <TableCell className="font-mono text-xs">{translation.key}</TableCell>
                      <TableCell className="max-w-md truncate">{translation.text}</TableCell>
                      <TableCell>
                        <Badge variant={translation.auto_translated ? 'secondary' : 'default'}>
                          {translation.auto_translated ? 'Auto' : 'Manual'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingTranslation(translation);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTranslation(translation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Translation</DialogTitle>
            <DialogDescription>
              Editing will mark this translation as manually edited.
            </DialogDescription>
          </DialogHeader>
          {editingTranslation && (
            <div className="space-y-4">
              <div>
                <Label>Language</Label>
                <p className="text-sm text-muted-foreground">
                  {editingTranslation.flag} {editingTranslation.language_name}
                </p>
              </div>
              <div>
                <Label>Key</Label>
                <p className="text-sm font-mono text-muted-foreground">
                  {editingTranslation.module}.{editingTranslation.page}.{editingTranslation.key}
                </p>
              </div>
              <div>
                <Label>Text</Label>
                <Textarea
                  value={editingTranslation.text}
                  onChange={(e) => setEditingTranslation({ ...editingTranslation, text: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTranslation}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TranslationManagement;
