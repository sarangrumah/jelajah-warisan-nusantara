import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';
import { Plus, Pencil, Trash2, X, GripVertical } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Career {
  role: string;
  company: string;
  duration: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  image_url: string;
  level: string;
  order: number;
  birth_date: string;
  education_history: Education[];
  career_history: Career[];
  is_active: boolean;
}

interface OrganizationalStructureManagementProps {
  userRole: string;
}

const OrganizationalStructureManagement: React.FC<OrganizationalStructureManagementProps> = ({ userRole }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee>>({});
  const [isEditing, setIsEditing] = useState(false);

  const canEdit = userRole === 'admin' || userRole === 'super-admin';

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/organizational-structure/admin`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: t('common.error'),
        description: t('organizationalStructure.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/api/organizational-structure/${currentEmployee.id}`
        : `${import.meta.env.VITE_API_URL}/api/organizational-structure`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(currentEmployee),
      });

      if (!response.ok) throw new Error('Failed to save employee');

      toast({
        title: t('common.success'),
        description: isEditing ? t('organizationalStructure.updateSuccess') : t('organizationalStructure.createSuccess'),
      });

      setIsDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: t('common.error'),
        description: t('organizationalStructure.saveError'),
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('common.confirmDelete'))) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/organizational-structure/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete employee');

      toast({
        title: t('common.success'),
        description: t('organizationalStructure.deleteSuccess'),
      });

      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: t('common.error'),
        description: t('organizationalStructure.deleteError'),
        variant: 'destructive',
      });
    }
  };

  const handleAddEducation = () => {
    const newEducation = [...(currentEmployee.education_history || []), { degree: '', institution: '', year: '' }];
    setCurrentEmployee({ ...currentEmployee, education_history: newEducation });
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = [...(currentEmployee.education_history || [])];
    newEducation.splice(index, 1);
    setCurrentEmployee({ ...currentEmployee, education_history: newEducation });
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...(currentEmployee.education_history || [])];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setCurrentEmployee({ ...currentEmployee, education_history: newEducation });
  };

  const handleAddCareer = () => {
    const newCareer = [...(currentEmployee.career_history || []), { role: '', company: '', duration: '' }];
    setCurrentEmployee({ ...currentEmployee, career_history: newCareer });
  };

  const handleRemoveCareer = (index: number) => {
    const newCareer = [...(currentEmployee.career_history || [])];
    newCareer.splice(index, 1);
    setCurrentEmployee({ ...currentEmployee, career_history: newCareer });
  };

  const handleCareerChange = (index: number, field: keyof Career, value: string) => {
    const newCareer = [...(currentEmployee.career_history || [])];
    newCareer[index] = { ...newCareer[index], [field]: value };
    setCurrentEmployee({ ...currentEmployee, career_history: newCareer });
  };

  const openDialog = (employee?: Employee) => {
    if (employee) {
      setCurrentEmployee(employee);
      setIsEditing(true);
    } else {
      setCurrentEmployee({
        name: '',
        role: '',
        image_url: '',
        level: 'Staff',
        order: 0,
        is_active: true,
        education_history: [],
        career_history: []
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('organizationalStructure.title')}</CardTitle>
        {canEdit && (
          <Button onClick={() => openDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            {t('organizationalStructure.addEmployee')}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">{t('common.loading')}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('organizationalStructure.name')}</TableHead>
                <TableHead>{t('organizationalStructure.role')}</TableHead>
                <TableHead>{t('organizationalStructure.level')}</TableHead>
                <TableHead>{t('organizationalStructure.order')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.level}</TableCell>
                  <TableCell>{employee.order}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${employee.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {employee.is_active ? t('common.active') : t('common.inactive')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {canEdit && (
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(employee)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? t('organizationalStructure.editEmployee') : t('organizationalStructure.addEmployee')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('organizationalStructure.name')}</Label>
                <Input
                  value={currentEmployee.name || ''}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('organizationalStructure.role')}</Label>
                <Input
                  value={currentEmployee.role || ''}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, role: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('organizationalStructure.level')}</Label>
                <Select
                  value={currentEmployee.level}
                  onValueChange={(value) => setCurrentEmployee({ ...currentEmployee, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Executive Board">Executive Board</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('organizationalStructure.order')}</Label>
                <Input
                  type="number"
                  value={currentEmployee.order || 0}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, order: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('organizationalStructure.birthDate')}</Label>
              <Input
                type="date"
                value={currentEmployee.birth_date ? new Date(currentEmployee.birth_date).toISOString().split('T')[0] : ''}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, birth_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('organizationalStructure.photo')}</Label>
              <ImageUpload
                label={t('organizationalStructure.photo')}
                value={currentEmployee.image_url || ''}
                onChange={(url) => setCurrentEmployee({ ...currentEmployee, image_url: url })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('organizationalStructure.education')}</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddEducation}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('common.add')}
                </Button>
              </div>
              {currentEmployee.education_history?.map((edu, index) => (
                <div key={index} className="flex gap-2 items-start border p-2 rounded">
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <Input
                      placeholder={t('organizationalStructure.degree')}
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    />
                    <Input
                      placeholder={t('organizationalStructure.institution')}
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    />
                    <Input
                      placeholder={t('organizationalStructure.year')}
                      value={edu.year}
                      onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveEducation(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('organizationalStructure.career')}</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddCareer}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('common.add')}
                </Button>
              </div>
              {currentEmployee.career_history?.map((career, index) => (
                <div key={index} className="flex gap-2 items-start border p-2 rounded">
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <Input
                      placeholder={t('organizationalStructure.role')}
                      value={career.role}
                      onChange={(e) => handleCareerChange(index, 'role', e.target.value)}
                    />
                    <Input
                      placeholder={t('organizationalStructure.company')}
                      value={career.company}
                      onChange={(e) => handleCareerChange(index, 'company', e.target.value)}
                    />
                    <Input
                      placeholder={t('organizationalStructure.duration')}
                      value={career.duration}
                      onChange={(e) => handleCareerChange(index, 'duration', e.target.value)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveCareer(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={currentEmployee.is_active}
                onCheckedChange={(checked) => setCurrentEmployee({ ...currentEmployee, is_active: checked })}
              />
              <Label>{t('common.active')}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OrganizationalStructureManagement;