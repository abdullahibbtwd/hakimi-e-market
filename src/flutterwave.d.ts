declare module 'flutterwave-node-v3' {
  interface FlutterwaveConfig {
    public_key: string;
    tx_ref: string;
    amount: number;
    currency: string;
    payment_options?: string;
    customer: {
      email: string;
      phone_number?: string;
      name?: string;
    };
    // Add other needed properties
  }

  const useFlutterwave: (config: FlutterwaveConfig) => void;
  export = useFlutterwave;
}