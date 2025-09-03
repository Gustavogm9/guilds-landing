import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functionality: boolean;
}

interface ConsentContextType {
  preferences: ConsentPreferences;
  hasConsented: boolean;
  showBanner: boolean;
  updatePreferences: (preferences: Partial<ConsentPreferences>) => void;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  openPreferences: () => void;
  closeBanner: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

const defaultPreferences: ConsentPreferences = {
  necessary: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
  functionality: false,
};

export const ConsentProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<ConsentPreferences>(defaultPreferences);
  const [hasConsented, setHasConsented] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Load consent preferences from localStorage
    const savedConsent = localStorage.getItem('gdpr-consent');
    const savedPreferences = localStorage.getItem('gdpr-preferences');

    if (savedConsent === 'true' && savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({ ...defaultPreferences, ...parsed });
        setHasConsented(true);
        setShowBanner(false);
        
        // Update GTM consent mode
        updateGTMConsent({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.error('Error parsing consent preferences:', error);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const updateGTMConsent = (prefs: ConsentPreferences) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: prefs.analytics ? 'granted' : 'denied',
        ad_storage: prefs.marketing ? 'granted' : 'denied',
        functionality_storage: prefs.functionality ? 'granted' : 'denied',
        personalization_storage: prefs.marketing ? 'granted' : 'denied',
      });
    }
  };

  const savePreferences = (newPreferences: ConsentPreferences) => {
    setPreferences(newPreferences);
    setHasConsented(true);
    setShowBanner(false);
    
    localStorage.setItem('gdpr-consent', 'true');
    localStorage.setItem('gdpr-preferences', JSON.stringify(newPreferences));
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());
    
    updateGTMConsent(newPreferences);
  };

  const updatePreferences = (newPreferences: Partial<ConsentPreferences>) => {
    const updated = { ...preferences, ...newPreferences, necessary: true };
    savePreferences(updated);
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      functionality: true,
    });
  };

  const acceptNecessaryOnly = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functionality: false,
    });
  };

  const openPreferences = () => {
    setShowBanner(true);
  };

  const closeBanner = () => {
    if (hasConsented) {
      setShowBanner(false);
    }
  };

  return (
    <ConsentContext.Provider
      value={{
        preferences,
        hasConsented,
        showBanner,
        updatePreferences,
        acceptAll,
        acceptNecessaryOnly,
        openPreferences,
        closeBanner,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
};