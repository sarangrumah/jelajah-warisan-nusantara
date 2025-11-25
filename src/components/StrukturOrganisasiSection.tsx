import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import EmployeeDetailModal from '@/components/EmployeeDetailModal';
import { Loader2 } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  image_url: string;
  level: string;
  order: number;
  birth_date?: string;
  education_history?: any[];
  career_history?: any[];
}

const StrukturOrganisasiSection = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/organizational-structure`);
        if (!response.ok) throw new Error('Failed to fetch employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleViewProfile = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const groupedEmployees = employees.reduce((acc, employee) => {
    if (!acc[employee.level]) {
      acc[employee.level] = [];
    }
    acc[employee.level].push(employee);
    return acc;
  }, {} as Record<string, Employee[]>);

  // Define the order of levels
  const levelOrder = ['Executive Board', 'Management', 'Staff'];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className='py-20 w-full flex flex-col items-center bg-background'>
      <div className="container mx-auto px-4 scroll-reveal">
        <div className="text-center scroll-reveal mb-12">
          <h2 className="text-4xl md:text-4xl font-bold pb-6 text-heritage-gradient">
            {t('organizationalStructure.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('organizationalStructure.description')}
          </p>
        </div>

        <div className="space-y-16">
          {levelOrder.map((level) => {
            const levelEmployees = groupedEmployees[level];
            if (!levelEmployees || levelEmployees.length === 0) return null;

            return (
              <div key={level} className="scroll-reveal">
                <h3 className="text-2xl font-bold text-center mb-8 text-primary relative">
                  <span className="bg-background px-4 relative z-10">{level}</span>
                  <div className="absolute top-1/2 left-0 w-full h-px bg-border -z-0"></div>
                </h3>
                
                <div className="flex flex-wrap justify-center gap-8">
                  {levelEmployees.map((employee) => (
                    <Card key={employee.id} className="w-full max-w-xs hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <Avatar className="w-32 h-32 mb-4 border-4 border-primary/10">
                          <AvatarImage src={employee.image_url} alt={employee.name} className="object-cover" />
                          <AvatarFallback className="text-2xl">{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h4 className="text-xl font-bold text-foreground mb-1">{employee.name}</h4>
                        <p className="text-sm text-muted-foreground mb-4 min-h-[2.5rem]">{employee.role}</p>
                        <Button 
                          variant="outline" 
                          className="w-full mt-auto"
                          onClick={() => handleViewProfile(employee)}
                        >
                          {t('organizationalStructure.viewProfile')}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
};

export default StrukturOrganisasiSection;