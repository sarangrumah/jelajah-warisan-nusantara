import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type SubmissionFileButtonProps = {
  url?: string | null;
  label: string;
  text?: string;
  className?: string;
};

const makeDownloadName = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

const SubmissionFileButton = ({ url, label, text, className }: SubmissionFileButtonProps) => {
  const { toast } = useToast();
  const buttonText = text ?? `Download ${label}`;
  const downloadName = makeDownloadName(label) || 'submission-file';

  if (!url) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={className}
        onClick={() =>
          toast({
            title: 'Submission Missing',
            description: `submission didn't send ${label}`,
            variant: 'destructive',
          })
        }
      >
        {buttonText}
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" asChild className={className}>
      <a href={url} download={downloadName} target="_blank" rel="noopener noreferrer">
        {buttonText}
      </a>
    </Button>
  );
};

export default SubmissionFileButton;
