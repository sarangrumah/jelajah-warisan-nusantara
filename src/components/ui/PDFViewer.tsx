import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ExternalLink, FileText, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PDFViewerProps {
  documentUrl: string;
  title?: string;
  className?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ documentUrl, title = 'Document', className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = title.endsWith('.pdf') ? title : `${title}.pdf`;
    link.rel = 'noopener noreferrer';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(documentUrl, '_blank', 'noopener,noreferrer');
  };

  if (!documentUrl) {
    return (
      <Card className={`border-dashed border-2 border-muted ${className}`}>
        <CardContent className="p-6 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Tidak ada dokumen tersedia</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Dokumen Terkait
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-muted-foreground">PDF Document</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsModalOpen(true)}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              Lihat Dokumen
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Unduh
            </Button>
            {/* <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpenInNewTab}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Buka Tab Baru
            </Button> */}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1">
            <iframe
              src={documentUrl}
              title={title}
              className="w-full h-full border-0 rounded-lg"
              style={{ minHeight: '500px' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PDFViewer;