import ChangePasswordForm from '@/components/admin/ChangePasswordForm';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/api-services';

const ChangePasswordPage = () => {
  const { toast } = useToast();

  const handleSubmit = async (payload: { current_password: string; new_password: string; confirm_password: string }) => {
    const response = await authService.changePassword(payload);

    if (response.error) {
      throw new Error(response.error);
    }

    toast({
      title: 'Berhasil',
      description: response.data?.message ?? 'Password berhasil diperbarui.',
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <ChangePasswordForm onSubmit={handleSubmit} />
    </div>
  );
};

export default ChangePasswordPage;
