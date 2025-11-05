import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mediaService } from '@/lib/api-services';

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  fileType?: string;
}

export const FileUpload = ({
  value,
  onChange,
  label = 'Upload a file',
  fileType = '*/*',
}: FileUploadProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const response = await mediaService.upload(file);
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.data) {
        onChange(response.data.url);
        toast({ title: 'Success', description: 'File uploaded successfully' });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center space-x-2">
        {value ? (
          <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted">
            <File className="h-6 w-6" />
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm truncate max-w-xs">{value.split('/').pop()}</a>
            <Button variant="ghost" size="icon" onClick={() => onChange('')}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="w-full">
            <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload-input')?.click()} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {loading ? 'Uploading...' : 'Select File'}
            </Button>
            <input
              id="file-upload-input"
              type="file"
              accept={fileType}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};