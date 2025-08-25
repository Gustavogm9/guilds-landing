import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQualificationForm } from '@/hooks/useQualificationForm';

interface QualificationContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  activeForm: any;
  companySettings: any;
  formFields: any[];
  submitForm: (data: any, sourcePage?: string) => Promise<boolean>;
}

const QualificationContext = createContext<QualificationContextType | undefined>(undefined);

export const useQualification = () => {
  const context = useContext(QualificationContext);
  if (!context) {
    throw new Error('useQualification must be used within a QualificationProvider');
  }
  return context;
};

interface QualificationProviderProps {
  children: ReactNode;
}

export const QualificationProvider = ({ children }: QualificationProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const qualificationData = useQualificationForm();

  const openModal = () => {
    setIsModalOpen(true);
    
    // Track modal open event
    if (typeof window !== 'undefined' && 'gtag' in window && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'qualification_modal_opened', {
        event_category: 'lead_generation',
        event_label: window.location.pathname,
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const contextValue: QualificationContextType = {
    isModalOpen,
    openModal,
    closeModal,
    ...qualificationData
  };

  return (
    <QualificationContext.Provider value={contextValue}>
      {children}
    </QualificationContext.Provider>
  );
};