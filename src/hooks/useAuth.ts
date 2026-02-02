import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiClient.login(email, password);
      
      if (!response.success) {
        const errorMsg = response.error?.message || 'Login failed';
        console.error('❌ Login error:', errorMsg, response.error);
        // เก็บ error ไว้ใน localStorage เพื่อดูได้ทีหลัง
        localStorage.setItem('lastError', JSON.stringify({
          message: errorMsg,
          timestamp: new Date().toISOString(),
          response: response.error
        }));
        throw new Error(errorMsg);
      }
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      // ลบ error ที่เก็บไว้ถ้า login สำเร็จ
      localStorage.removeItem('lastError');
      setTimeout(() => {
        router.push('/products');
      }, 1000);
    },
    onError: (error: any) => {
      console.error('💥 Login mutation error:', error.message);
      // Alert error ให้เห็นชัดก่อน redirect/refresh
      alert(`❌ Login Error:\n\n${error.message}`);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      fullName,
      email,
      password,
    }: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      const response = await apiClient.register(fullName, email, password);
      if (!response.success) {
        throw new Error(response.error?.message || 'Registration failed');
      }
      return response.data;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await apiClient.logout();
    },
    onSuccess: () => {
      logout();
      router.push('/login');
    },
  });
}
