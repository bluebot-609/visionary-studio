import { useCallback, useState } from 'react';
import { uploadFileWithProgress, type UploadProgress } from '../services/storage';

interface UploadState extends UploadProgress {
  path?: string;
}

export const useUpload = () => {
  const [state, setState] = useState<UploadState | null>(null);

  const upload = useCallback(
    (file: File, path: string, metadata?: Parameters<typeof uploadFileWithProgress>[2]) =>
      uploadFileWithProgress(
        file,
        path,
        metadata,
        (snapshot) => setState({ ...snapshot, path }),
      ),
    [],
  );

  return {
    upload,
    state,
    reset: () => setState(null),
  };
};














