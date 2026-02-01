import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auth - OrderApp',
  description: 'Authentication pages',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
