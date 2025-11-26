import { useCallback, useState } from 'react';

type UploadProgress = {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
};

interface UploadState extends UploadProgress {
  path?: string;
}

export const useUpload = () => {
  const [state, setState] = useState<UploadState | null>(null);

  const upload = useCallback(
    async (file: File, path: string, _metadata?: unknown): Promise<void> => {
      console.warn('[useUpload] upload called but no storage backend is configured.', {
        fileName: file.name,
        path,
      });
      setState({
        path,
        bytesTransferred: 0,
        totalBytes: file.size,
        progress: 0,
      });
    },
    [],
  );

  return {
    upload,
    state,
    reset: () => setState(null),
  };
};














