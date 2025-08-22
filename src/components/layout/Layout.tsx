
import { ReactNode } from "react";
import Header from "./Header";
import { Footer } from "./Footer";
import { CTAStickyMobile } from "@/components/ui/CTAStickyMobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <CTAStickyMobile 
        whatsappNumber="5511999999999"
        phoneNumber="5511999999999"
        whatsappMessage="Olá! Gostaria de saber mais sobre os serviços da Guilds."
        showOnDesktop={false}
      />
    </div>
  );
};

export default Layout;
