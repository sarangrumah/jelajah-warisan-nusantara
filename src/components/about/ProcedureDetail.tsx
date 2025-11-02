import React, { useEffect, useState } from 'react'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLocation, useParams } from 'react-router-dom';
import { sopService } from '@/lib/api-services';
import { Calendar, User, CheckCircle, XCircle, Clock, FileText, Download } from 'lucide-react';
import PDFViewer from '@/components/ui/PDFViewer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Procedure {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  publish_date: string;
  category: string;
  document_url?: string;
  author: string;
  is_active: string;
  is_approved: string;
  is_rejected: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  reason_rejected?: string;
}

// Enhanced utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  // Replace < tag > and < / tag > with <tag> and </tag>
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>')
             // Additional cleanup for common HTML issues
             .replace(/\s+/g, ' ')
             .trim();
}

const ProcedureDetail = () => {
    const { pathname } = useLocation();
    const [procedure, setProcedure] = useState<Procedure | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const fetchProcedure = async () => {
            try {
                setLoading(true);
                if (id) {
                    const response = await sopService.getById(id);
                    if (response.error) {
                        console.error('Error fetching procedure:', response.error);
                    } else {
                        setProcedure(response.data as Procedure);
                    }
                }
            } catch (error) {
                console.error('Error fetching procedure:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProcedure();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Memuat SOP...</h1>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!procedure) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">SOP tidak ditemukan</h1>
                        <p className="text-muted-foreground">SOP dengan ID tersebut tidak dapat ditemukan.</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getStatusBadge = (isActive: string, isApproved: string, isRejected: string) => {
        if (isRejected === 't') {
            return <Badge variant="destructive" className="flex items-center gap-1"><XCircle size={14} /> Ditolak</Badge>;
        }
        if (isApproved === 't') {
            return <Badge variant="default" className="flex items-center gap-1"><CheckCircle size={14} /> Disetujui</Badge>;
        }
        // return <Badge variant="outline" className="flex items-center gap-1"><Clock size={14} /> Menunggu</Badge>;
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <article className="py-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        <span className="text-muted-foreground">Tentang Kami</span>
                        <span className="mx-2">/</span>
                        <span className="text-muted-foreground">Standar Operasional Prosedur</span>
                        <span className="mx-2">/</span>
                        <span className="text-muted-foreground">{procedure.title}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="mb-8">
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                                        {procedure.category}
                                    </span>
                                    {/* {getStatusBadge(procedure.is_active, procedure.is_approved, procedure.is_rejected)} */}
                                </div>
                                
                                <h1 className="text-4xl md:text-4xl font-bold text-foreground mb-4">{procedure.title}</h1>
                                
                                {procedure.subtitle && (
                                    <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{procedure.subtitle}</p>
                                )}
                                
                                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-t border-b border-border py-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>Diterbitkan: {formatDate(procedure.publish_date)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={16} />
                                        <span>Penulis: {procedure.author}</span>
                                    </div>
                                    {procedure.created_at && (
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>Dibuat: {formatDate(procedure.created_at)}</span>
                                        </div>
                                    )}
                                    {procedure.updated_at && procedure.updated_at !== procedure.created_at && (
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>Diperbarui: {formatDate(procedure.updated_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <div className="prose prose-lg max-w-none">
                                    <div
                                        className="text-foreground leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: fixBrokenHtmlTags(procedure.description) }}
                                    />
                                </div>
                            </div>

                            {/* Additional Information */}
                            {/* <div className="bg-muted/30 rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <FileText size={18} />
                                    Informasi Tambahan
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Status:</span>
                                        <div className="mt-1">
                                            {getStatusBadge(procedure.is_active, procedure.is_approved, procedure.is_rejected)}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Aktif:</span>
                                        <div className="mt-1">
                                            {procedure.is_active === 't' ? (
                                                <Badge variant="default" className="flex items-center gap-1 w-fit">
                                                    <CheckCircle size={14} /> Aktif
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                                    <XCircle size={14} /> Tidak Aktif
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    {procedure.reason_rejected && (
                                        <div className="md:col-span-2">
                                            <span className="font-medium">Alasan Penolakan:</span>
                                            <p className="mt-1 text-muted-foreground">{procedure.reason_rejected}</p>
                                        </div>
                                    )}
                                </div>
                            </div> */}
                        </div>

                        {/* Sidebar with PDF Viewer */}
                        <div className="space-y-6">
                            {procedure.document_url && (
                                <PDFViewer
                                    documentUrl={procedure.document_url}
                                    title={procedure.title}
                                />
                            )}
                            
                            {/* Quick Actions */}
                            {/* <div className="bg-card border rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">Aksi Cepat</h3>
                                <div className="space-y-3">
                                    {procedure.document_url && (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = procedure.document_url;
                                                link.download = `${procedure.title}.pdf`;
                                                link.rel = 'noopener noreferrer';
                                                link.target = '_blank';
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}
                                        >
                                            <Download size={16} className="mr-2" />
                                            Unduh Dokumen
                                        </Button>
                                    )}
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </article>
            <Footer />
        </div>
    )
}

export default ProcedureDetail