import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQualificationForm } from '@/hooks/useQualificationForm';
import { useAnalytics } from '@/hooks/useAnalytics';

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
  const { trackCTAClick } = useAnalytics();

  const openModal = () => {
    setIsModalOpen(true);
    
    // Enhanced analytics tracking
    trackCTAClick('Open Qualification Modal', {
      cta_type: 'primary',
      section: 'qualification_system',
    });
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