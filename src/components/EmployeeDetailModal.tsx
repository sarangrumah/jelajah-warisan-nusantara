import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, GraduationCap, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  birth_date?: string;
  education_history?: Education[];
  career_history?: Career[];
}

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ employee, isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!employee) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('organizationalStructure.employeeDetail')}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="flex-shrink-0 flex flex-col items-center">
            <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-primary/10">
              <AvatarImage src={employee.image_url} alt={employee.name} className="object-cover" />
              <AvatarFallback className="text-4xl">{employee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-4 text-center">
              <Badge variant="secondary" className="mb-2">{employee.level}</Badge>
            </div>
          </div>

          <div className="flex-grow space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">{employee.name}</h2>
              <p className="text-xl text-muted-foreground">{employee.role}</p>
              {employee.birth_date && (
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{t('organizationalStructure.born')}: {formatDate(employee.birth_date)}</span>
                </div>
              )}
            </div>

            {employee.education_history && employee.education_history.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-3">
                  <GraduationCap className="w-5 h-5 mr-2 text-primary" />
                  {t('organizationalStructure.education')}
                </h3>
                <div className="space-y-3 pl-2 border-l-2 border-primary/20">
                  {employee.education_history.map((edu, index) => (
                    <div key={index} className="relative pl-4">
                      <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-primary" />
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {employee.career_history && employee.career_history.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-3">
                  <Briefcase className="w-5 h-5 mr-2 text-primary" />
                  {t('organizationalStructure.career')}
                </h3>
                <div className="space-y-3 pl-2 border-l-2 border-primary/20">
                  {employee.career_history.map((career, index) => (
                    <div key={index} className="relative pl-4">
                      <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-primary" />
                      <h4 className="font-medium">{career.role}</h4>
                      <p className="text-sm text-muted-foreground">{career.company}</p>
                      <p className="text-xs text-muted-foreground">{career.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailModal;