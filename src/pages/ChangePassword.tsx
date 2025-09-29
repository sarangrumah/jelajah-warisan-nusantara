import ChangePasswordForm from '@/components/admin/ChangePasswordForm';
import { useToast } from '@/hooks/use-toast';

const ChangePasswordPage = () => {
  const { toast } = useToast();

  const handleSubmit = async (payload: { current_password: string; new_password: string; confirm_password: string }) => {
    // TODO: Integrate with real API once available
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast({
      title: 'Berhasil',
      description: 'Password berhasil diperbarui.',
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <ChangePasswordForm onSubmit={handleSubmit} />
    </div>
  );
};

export default ChangePasswordPage;
