import { LoginForm } from '@/components/LoginForm';

export const metadata = {
  title: 'Login - OrderApp',
  description: 'Sign in to your OrderApp account',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full">
        <LoginForm />
      </div>
    </main>
  );
}
