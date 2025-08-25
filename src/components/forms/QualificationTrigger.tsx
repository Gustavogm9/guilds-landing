import { useQualification } from './QualificationProvider';
import { QualificationModal } from './QualificationModal';
import { useLocation } from 'react-router-dom';

export const QualificationTrigger = () => {
  const { isModalOpen, closeModal } = useQualification();
  const location = useLocation();

  return (
    <QualificationModal 
      isOpen={isModalOpen} 
      onClose={closeModal}
      sourcePage={location.pathname}
    />
  );
};