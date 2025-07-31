import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

const Layout = ({ 
  children, 
  showHeader = true, 
  showFooter = true, 
  className = '' 
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      
      <main 
        className={`flex-1 ${showHeader ? 'pt-16 lg:pt-20' : ''} ${className}`}
        role="main"
      >
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;