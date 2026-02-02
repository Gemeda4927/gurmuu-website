import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Add Toaster component with custom styling */}
        <Toaster
          position="top-right"
          toastOptions={{
            // Global default styles
            style: {
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
              border: '1px solid #E2E8F0',
              color: '#1E293B',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            },
            // Duration for different toast types
            duration: 4000,
            // Success toast styling
            success: {
              style: {
                background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                border: '1px solid #A7F3D0',
                color: '#065F46',
              },
              iconTheme: {
                primary: '#10B981',
                secondary: '#ECFDF5',
              },
              duration: 5000,
            },
            // Error toast styling
            error: {
              style: {
                background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
                border: '1px solid #FECACA',
                color: '#991B1B',
              },
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FEF2F2',
              },
              duration: 6000,
            },
            // Loading toast styling
            loading: {
              style: {
                background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                border: '1px solid #BAE6FD',
                color: '#0369A1',
                minWidth: '300px',
              },
            },
          }}
        />
      </body>
    </html>
  );
}