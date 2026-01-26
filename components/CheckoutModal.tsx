
import React, { useState } from 'react';
import { X, CreditCard, Smartphone, CheckCircle, Apple, ShieldCheck } from 'lucide-react';
import { Resource } from '../types';

interface CheckoutModalProps {
  resource: Resource | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ resource, onClose, onSuccess }) => {
  const [step, setStep] = useState<'SELECT' | 'PROCESSING' | 'SUCCESS'>('SELECT');
  const [method, setMethod] = useState<'MPESA' | 'CARD' | 'APPLE'>('MPESA');

  if (!resource) return null;

  const handlePay = () => {
    setStep('PROCESSING');
    setTimeout(() => {
      setStep('SUCCESS');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden transition-all transform animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400">
          <X className="h-6 w-6" />
        </button>

        {step === 'SELECT' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Secure Checkout</h2>
            <p className="text-slate-500 mb-6">Complete your purchase for "{resource.title}"</p>

            <div className="bg-slate-50 p-4 rounded-2xl mb-8 flex justify-between items-center border border-slate-100">
               <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Subtotal</span>
                  <div className="text-xl font-bold text-slate-900">Ksh {resource.price}</div>
               </div>
               <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-bold">Includes 16% VAT</div>
            </div>

            <div className="space-y-3 mb-8">
              <button 
                onClick={() => setMethod('MPESA')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${method === 'MPESA' ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-teal-600 text-white p-2 rounded-lg">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900">M-Pesa Express</div>
                    <div className="text-xs text-slate-500">Pay via STK Push to your phone</div>
                  </div>
                </div>
                {method === 'MPESA' && <CheckCircle className="text-teal-500 h-6 w-6" />}
              </button>

              <button 
                onClick={() => setMethod('CARD')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${method === 'CARD' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900">Credit / Debit Card</div>
                    <div className="text-xs text-slate-500">Secure 256-bit encryption</div>
                  </div>
                </div>
                {method === 'CARD' && <CheckCircle className="text-blue-500 h-6 w-6" />}
              </button>

              <button 
                onClick={() => setMethod('APPLE')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${method === 'APPLE' ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-black text-white p-2 rounded-lg">
                    <Apple className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900">Apple Pay</div>
                    <div className="text-xs text-slate-500">One-touch biometric payment</div>
                  </div>
                </div>
                {method === 'APPLE' && <CheckCircle className="text-slate-900 h-6 w-6" />}
              </button>
            </div>

            <button 
              onClick={handlePay}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="h-5 w-5 text-teal-400" />
              <span>Pay Ksh {resource.price}</span>
            </button>
          </div>
        )}

        {step === 'PROCESSING' && (
          <div className="p-12 text-center">
            <div className="inline-block h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing Payment</h2>
            <p className="text-slate-500">Please check your phone for the M-Pesa prompt...</p>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="p-12 text-center">
            <div className="bg-teal-100 text-teal-600 p-4 rounded-full inline-block mb-6">
              <CheckCircle className="h-16 w-16" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
            <p className="text-slate-500 mb-8">Your resource is ready for download. We've also sent a receipt to your email.</p>
            <button 
              onClick={onSuccess}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all"
            >
              Access Resource
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
