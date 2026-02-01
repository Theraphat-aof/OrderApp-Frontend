import { RegisterForm } from '@/components/RegisterForm';

export const metadata = {
  title: 'Register - OrderApp',
  description: 'Create a new OrderApp account',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full">
        <RegisterForm />
      </div>
    </main>
  );
}
