import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, MapPin, Briefcase, Calendar } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { Badge } from '@/components/ui/badge';

const InternshipProgram = ({internshipPrograms, form, onSetIsDialogOpen}: {internshipPrograms: any[], form: any, onSetIsDialogOpen: (open: boolean) => void}) => {
  return (
    <div>
      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        {internshipPrograms.length > 0 && internshipPrograms.map((program, index) => (
          <Card key={index} className="heritage-glow hover:scale-105 transition-bounce">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="capitalize">
                      {program.type || 'Internship'}
                    </Badge>
                    {program.subtitle && (
                      <Badge variant="outline">{program.subtitle}</Badge>
                    )}
                  </div>
                </div>
                {program.position_needed && (
                  <div className="text-right">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {program.position_needed} posisi
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="text-muted-foreground mb-4 text-sm prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(program.description || '') }}
              />
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-primary" />
                  <span>{program.period}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-primary" />
                  <span>{program.location}</span>
                </div>
                {(program.publish_date && program.end_publish_date) && (
                  <div className="col-span-2 flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-primary" />
                    <span>
                      Periode: {new Date(program.publish_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(program.end_publish_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              {program.requirement && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Persyaratan:</h4>
                  <div
                    className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(program.requirement) }}
                  />
                </div>
              )}

              {program.benefits && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Benefit:</h4>
                  <div
                    className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(program.benefits) }}
                  />
                </div>
              )}

              {program.responsibility && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Tanggung Jawab:</h4>
                  <div
                    className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(program.responsibility) }}
                  />
                </div>
              )}

              {program.supervisor && (
                <div className="border-t border-border pt-3 mb-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Supervisor:</strong> {program.supervisor}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="text-sm">
                  <span className="text-muted-foreground">Deadline: </span>
                  <span className="font-semibold text-primary">
                    {program.application_deadline
                      ? new Date(program.application_deadline).toLocaleDateString()
                      : (program.deadline || 'Open')}
                  </span>
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