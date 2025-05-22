// components/PaystackLegacyButton.tsx
import React from 'react';
import usePaystackLegacy from '../app/hooks/usePaystackLegacy';


interface PaystackResponse {
  message: string;
  reference: string;
  status: 'success' | 'failed';
  trans: string;
  transaction: string;
  trxref: string;
}

interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  firstname?: string;
  lastname?: string;
  ref: string;
  metadata?: Record<string, unknown>;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup(options: PaystackOptions): {
        openIframe: () => void;
      };
    };
  }
}

interface PaystackLegacyButtonProps {
  amount: number;
  email: string;
  publicKey: string;
  reference: string;
  firstname?: string;
  lastname?: string;
  metadata?: Record<string, unknown>;
  onSuccess: (response:PaystackResponse) => void;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const PaystackLegacyButton: React.FC<PaystackLegacyButtonProps> = ({
  amount,
  email,
  publicKey,
  reference,
  firstname = '',
  lastname = '',
  metadata = {},
  onSuccess,
  onClose,
  children,
  className = '',
}) => {
  const { isReady } = usePaystackLegacy();

  const initializePayment = () => {
    if (!isReady || !window.PaystackPop) {
      console.error('Paystack script not loaded');
      return;
    }

    const handler =window.PaystackPop.setup({
      key: publicKey,
      email,
      amount: amount * 100, // Convert to kobo
      firstname,
      lastname,
      ref: reference,
      metadata,
      callback: (response) => {
        onSuccess(response);
      },
      onClose: () => {
        onClose?.();
      },
    });

    handler.openIframe();
  };

  return (
    <button
      onClick={initializePayment}
      disabled={!isReady}
      className={`${className} ${!isReady ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children || 'Pay with Paystack'}
    </button>
  );
};

export default PaystackLegacyButton;