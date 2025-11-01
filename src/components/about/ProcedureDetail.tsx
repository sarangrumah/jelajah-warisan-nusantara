import React, { useEffect, useState } from 'react'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLocation, useParams } from 'react-router-dom';
import { sopService } from '@/lib/api-services';
import { Calendar, User } from 'lucide-react';
import parse from 'html-react-parser';

// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  // Replace < tag > and < / tag > with <tag> and </tag>
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

const ProcedureDetail = () => {
    const { pathname } = useLocation();
    const [procedures, setProcedures] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const fetchProcedures = async () => {
            try {
                const response = await sopService.getAll();
                if(response.error || response.data.length === 0) {
                    console.error('Error fetching procedures:', response.error);
                } else {
                    setProcedures(response.data);
                }
            } catch (error) {
                console.error('Error fetching procedures:', error);
            }
        };

        fetchProcedures();
    }, [id]);

    const procedure = procedures.find((item) => item.id.toString() === id);
    if (!procedure) {
        return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-20">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">SOP tidak ditemukan</h1>
            </div>
            </div>
            <Footer />
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <article className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        <span className="text-muted-foreground">Tentang Kami</span>
                        <span className="mx-2">/</span>
                        <span className="text-muted-foreground">Standar Operasional Prosedur</span>
                        <span className="mx-2">/</span>
                        <span className="text-muted-foreground">{procedure.title}</span>
                    </div>
                    <div className="mb-8">
                        <div className="mb-4">
                            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">{procedure.category}</span>
                        </div>
                        <h1 className="text-4xl md:text-4xl font-bold text-foreground mb-6">{procedure.title}</h1>
                        <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{parse(procedure.description)}</p>
                        <div className="flex items-center justify-between border-t border-b border-border py-4">
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{new Date(procedure.publish_date).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    <div>{procedure.author}</div>
                                </div>
                            </div>
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
                </div>
            </article>
            <Footer />
        </div>
    )
}

export default ProcedureDetail