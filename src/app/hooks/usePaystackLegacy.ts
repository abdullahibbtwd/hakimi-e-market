// hooks/usePaystackLegacy.ts
import { useEffect, useState } from 'react';

const usePaystackLegacy = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')) {
      setIsReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      setIsReady(true);
      console.log('Paystack script loaded');
    };
    
    script.onerror = () => {
      console.error('Failed to load Paystack script');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return { isReady };
};

export default usePaystackLegacy;