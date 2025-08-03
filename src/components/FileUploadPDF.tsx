import { useState, useRef } from 'react';
import { uploadService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, Check, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  bucket: 'documents' | 'cv-uploads' | 'transcripts' | 'cover-letters';
  onUploadComplete?: (url: string, fileName: string) => void;
  onUploadError?: (error: string) => void;
  maxSizeMB?: number;
  className?: string;
  accept?: string;
  required?: boolean;
  label?: string;
  description?: string;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  uploadedFile?: {
    name: string;
    url: string;
  };
  error?: string;
}

const FileUploadPDF = ({
  bucket,
  onUploadComplete,
  onUploadError,
  maxSizeMB = bucket === 'documents' ? 10 : 5,
  className,
  accept = '.pdf',
  required = false,
  label = 'Upload PDF File',
  description = `Max size: ${bucket === 'documents' ? '10' : '5'}MB. Only PDF files allowed.`,
}: FileUploadProps) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Frontend validation
  const validateFile = (file: File): string | null => {
    // Check file type
    if (file.type !== 'application/pdf') {
      return `Invalid file type. Only PDF files are allowed. Got: ${file.type}`;
    }

    // Check file extension
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return 'Invalid file extension. Only .pdf files are allowed.';
    }

    // Check file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File too large. Maximum size is ${maxSizeMB}MB. Got: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }

    // Check if file is not empty
    if (file.size === 0) {
      return 'File is empty. Please select a valid PDF file.';
    }

    return null;
  };

  // Additional PDF header validation
  const validatePDFHeader = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer.slice(0, 5));
        const header = Array.from(bytes).map(b => String.fromCharCode(b)).join('');
        
        // PDF files should start with %PDF-
        resolve(header === '%PDF-');
      };
      reader.onerror = () => resolve(false);
      reader.readAsArrayBuffer(file.slice(0, 5));
    });
  };

  const uploadFile = async (file: File) => {
    setUploadState({ uploading: true, progress: 0 });

    try {
      // Frontend validation
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      // PDF header validation
      const isValidPDF = await validatePDFHeader(file);
      if (!isValidPDF) {
        throw new Error('Invalid PDF file. The file does not appear to be a valid PDF document.');
      }

      const response = await uploadService.uploadFile(file, bucket);

      if (response.error) {
        throw new Error(response.error);
      }

      setUploadState({
        uploading: false,
        progress: 100,
        uploadedFile: {
          name: file.name,
          url: response.data!.url,
        }
      });

      onUploadComplete?.(response.data!.url, file.name);
      
      toast({
        title: 'Success',
        description: `File "${file.name}" uploaded successfully`,
      });

    } catch (error: any) {
      const errorMessage = error.message || 'Upload failed';
      setUploadState({
        uploading: false,
        progress: 0,
        error: errorMessage,
      });

      onUploadError?.(errorMessage);
      
      toast({
        title: 'Upload Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadFile(file);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    await uploadFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const clearFile = () => {
    setUploadState({
      uploading: false,
      progress: 0,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
          uploadState.uploading
            ? 'border-primary bg-primary/5'
            : uploadState.uploadedFile
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : uploadState.error
            ? 'border-destructive bg-destructive/5'
            : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={!uploadState.uploading ? openFileDialog : undefined}
      >
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploadState.uploading}
        />

        {uploadState.uploading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-medium">Uploading...</p>
              <Progress value={uploadState.progress} className="mt-2" />
            </div>
          </div>
        ) : uploadState.uploadedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Upload Successful
              </p>
              <p className="text-sm text-muted-foreground">
                {uploadState.uploadedFile.name}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <File className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Drop your PDF file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {uploadState.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{uploadState.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FileUploadPDF;