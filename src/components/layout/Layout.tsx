
import { ReactNode } from "react";
import Header from "./Header";
import { Footer } from "./Footer";
import { CTAStickyMobile } from "@/components/ui/CTAStickyMobile";
import { usePublicContactInfo } from "@/hooks/usePublicContactInfo";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { getPublicPhone } = usePublicContactInfo();
  const phone = getPublicPhone() || '+5511999999999';
  const cleanPhone = phone.replace(/[^\d]/g, '');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 pb-20 md:pb-0" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <CTAStickyMobile 
        whatsappNumber={cleanPhone}
        phoneNumber={phone}
        whatsappMessage="Olá! Gostaria de saber mais sobre os serviços da Guilds."
        showOnDesktop={false}
      />
    </div>
  );
};

export default Layout;
