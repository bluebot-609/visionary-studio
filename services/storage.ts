import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadMetadata,
} from 'firebase/storage';
import { storage } from '../lib/firebase';

export interface UploadProgress {
  progress: number;
  status: 'running' | 'paused' | 'success' | 'error';
  downloadUrl?: string;
  error?: Error;
}

export const uploadFileWithProgress = (
  file: File,
  path: string,
  metadata?: UploadMetadata,
  onProgress?: (snapshot: UploadProgress) => void,
) => {
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file, metadata);

  task.on(
    'state_changed',
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
      );
      onProgress?.({
        progress,
        status: snapshot.state,
      });
    },
    (error) => {
      onProgress?.({
        progress: 0,
        status: 'error',
        error: error as Error,
      });
    },
    async () => {
      const downloadUrl = await getDownloadURL(task.snapshot.ref);
      onProgress?.({
        progress: 100,
        status: 'success',
        downloadUrl,
      });
    },
  );

  return task;
};









