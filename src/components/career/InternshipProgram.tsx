import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, MapPin } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const InternshipProgram = ({internshipPrograms, form, onSetIsDialogOpen}) => {
  return (
    <div>
      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        {internshipPrograms.length > 0 && internshipPrograms.map((program, index) => (
          <Card key={index} className="heritage-glow hover:scale-105 transition-bounce">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{program.department}</p>
                </div>
                <div className="text-right">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {program.slots} posisi
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{program.description}</p>        
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-primary" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-primary" />
                  <span>{program.location}</span>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">Persyaratan:</h4>
                <ul className="space-y-1">
                {/* {program.requirements.slice(0, 3).map((req, reqIndex) => ( */}
                {(program.requirements ?? []).map((req, reqIndex) => (
                  <li key={reqIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    {req}
                  </li>
                ))}
                {(program.requirements ?? []).length > 3 && (
                  <li className="text-xs text-muted-foreground/70 italic">
                    +{program.requirements.length - 3} persyaratan lainnya
                  </li>
                )}
                </ul>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">Tanggung Jawab:</h4>
                <ul className="space-y-1">
                {/* {program.responsibilities.slice(0, 2).map((resp, respIndex) => ( */}
                {(program.responsibilities ?? []).map((resp, respIndex) => (
                  <li key={respIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    {resp}
                  </li>
                ))}
                {(program.responsibilities ?? []).length > 2 && (
                  <li className="text-xs text-muted-foreground/70 italic">
                    +{program.responsibilities.length - 2} tanggung jawab lainnya
                  </li>
                )}
                </ul>
              </div>
              <div className="border-t border-border pt-3 mb-4">
                <p className="text-xs text-muted-foreground">
                  <strong>Supervisor:</strong> {program.supervisor}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Deadline: </span>
                  <span className="font-semibold text-primary">{program.deadline}</span>
                </div>
                <Dialog onOpenChange={onSetIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => form.setValue('internshipProgram', program.id)}>
                      <FileText size={16} className="mr-2" />
                      Daftar
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-16 text-center">
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ada Pertanyaan?</h3>
          <p className="text-muted-foreground mb-6">
            Tim HR kami siap membantu Anda dengan informasi lebih lanjut 
            tentang program magang dan proses pendaftaran.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className='bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow'>
              <MapPin size={16} className="mr-2" />
              Lokasi Kantor
            </Button>
            <Button variant="outline" className='bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow'>
              Hubungi HR
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InternshipProgram