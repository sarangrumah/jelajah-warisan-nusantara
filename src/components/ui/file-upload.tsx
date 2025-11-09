import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadService } from '@/lib/api-services';
import { Loader2, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onSuccess: (url: string, size: number) => void;
  onError: (error: string) => void;
  bucket: string;
  acceptedFileTypes?: { [key: string]: string[] };
}

export const FileUpload = ({ onSuccess, onError, bucket, acceptedFileTypes }: FileUploadProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a valid file.',
        variant: 'destructive',
      });
      return;
    }
    
    const file = acceptedFiles[0];

    // // Optional: Add client-side validation for file size
    // if (file.size > 10 * 1024 * 1024) { // 10 MB limit
    //   toast({
    //     title: 'File too large',
    //     description: 'Please upload a file smaller than 10 MB.',
    //     variant: 'destructive',
    //   });
    //   return;
    // }

    setLoading(true);
    try {
      const response = await uploadService.uploadFile(file, bucket);
      if (response.error) {
        throw new Error(response.error);
      }
      onSuccess(response.data.url, response.data.size);
      toast({
        title: 'Upload successful',
        description: 'File has been uploaded and linked.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      onError(errorMessage);
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-input hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <p>Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>Drag & drop a file here, or click to select a file</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {acceptedFileTypes ? Object.values(acceptedFileTypes).flat().join(', ') : ''}
          </p>
        </div>
      )}
    </div>
  );
};