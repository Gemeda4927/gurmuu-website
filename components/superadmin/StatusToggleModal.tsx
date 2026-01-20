'use client';

import { CheckCircle, AlertTriangle, X } from 'lucide-react';

interface StatusToggleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user?: any;
}

export default function StatusToggleModal({
  isOpen,
  onClose,
  onConfirm,
  user
}: StatusToggleModalProps) {
  if (!isOpen) return null;

  const isActivating = !user?.isActive;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl p-6 max-w-md w-full">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isActivating ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isActivating ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-600" />
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isActivating ? 'Activate User' : 'Deactivate User'}
            </h3>
            
            <p className="text-gray-600 mb-6">
              {isActivating ? (
                <>
                  Are you sure you want to activate <span className="font-semibold">{user?.name}</span>? 
                  The user will be able to access the system immediately.
                </>
              ) : (
                <>
                  Are you sure you want to deactivate <span className="font-semibold">{user?.name}</span>? 
                  The user will lose access to the system immediately.
                </>
              )}
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-3 rounded-xl font-medium ${
                  isActivating
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isActivating ? 'Activate User' : 'Deactivate User'}
              </button>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}