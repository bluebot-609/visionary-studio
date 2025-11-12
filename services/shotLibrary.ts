import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type { GeneratedImage } from '../types';

export interface SavedShot {
  id: string; // Firestore document ID
  userId: string;
  imageId: string;
  imageUrl: string;
  timestamp: Timestamp;
  fileName: string;
  hue: number;
  saturation: number;
}

/**
 * Save a generated image to Firebase Storage and Firestore
 */
export const saveShot = async (
  userId: string,
  generatedImage: GeneratedImage,
): Promise<SavedShot> => {
  console.log('saveShot called with:', { userId, imageId: generatedImage.id });
  
  try {
    // Convert base64 to blob
    console.log('Converting base64 to blob...');
    const base64Response = await fetch(
      `data:image/jpeg;base64,${generatedImage.base64}`,
    );
    const blob = await base64Response.blob();
    console.log('Blob created:', { size: blob.size, type: blob.type });

    // Create unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${generatedImage.id}.jpg`;
    const storagePath = `shots/${userId}/${fileName}`;
    console.log('Storage path:', storagePath);

    // Upload to Firebase Storage
    console.log('Uploading to Firebase Storage...');
    const storageRef = ref(storage, storagePath);
    const uploadResult = await uploadBytes(storageRef, blob);
    console.log('Upload successful:', uploadResult);

    // Get download URL
    console.log('Getting download URL...');
    const imageUrl = await getDownloadURL(storageRef);
    console.log('Download URL obtained:', imageUrl);

    // Save metadata to Firestore
    const shotData = {
      userId,
      imageId: generatedImage.id,
      imageUrl,
      timestamp: Timestamp.fromDate(new Date()),
      fileName,
      hue: generatedImage.hue,
      saturation: generatedImage.saturation,
    };

    console.log('Saving metadata to Firestore...', shotData);
    const docRef = await addDoc(collection(db, 'shots'), shotData);
    console.log('Firestore document created:', docRef.id);

    const savedShot = {
      id: docRef.id,
      ...shotData,
    };
    
    console.log('Shot saved successfully:', savedShot);
    return savedShot;
  } catch (error) {
    console.error('Error saving shot - Full error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error(`Failed to save shot to Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get all shots for a user, ordered by timestamp (newest first)
 */
export const getUserShots = async (userId: string): Promise<SavedShot[]> => {
  console.log('getUserShots called with userId:', userId);
  
  try {
    const shotsRef = collection(db, 'shots');
    const q = query(
      shotsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
    );

    console.log('Executing Firestore query...');
    const querySnapshot = await getDocs(q);
    console.log('Query returned', querySnapshot.size, 'documents');
    
    const shots: SavedShot[] = [];

    querySnapshot.forEach((doc) => {
      const shotData = {
        id: doc.id,
        ...doc.data(),
      } as SavedShot;
      console.log('Processing shot:', shotData.id, shotData.fileName);
      shots.push(shotData);
    });

    console.log('Returning', shots.length, 'shots');
    return shots;
  } catch (error) {
    console.error('Error fetching user shots - Full details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error(`Failed to fetch shots from Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete multiple shots from both Storage and Firestore
 */
export const deleteShots = async (
  userId: string,
  shotIds: string[],
  shots: SavedShot[],
): Promise<void> => {
  try {
    const deletePromises = shotIds.map(async (shotId) => {
      const shot = shots.find((s) => s.id === shotId);
      if (!shot) return;

      // Delete from Storage
      const storagePath = `shots/${userId}/${shot.fileName}`;
      const storageRef = ref(storage, storagePath);
      try {
        await deleteObject(storageRef);
      } catch (error) {
        console.warn(`Failed to delete storage file: ${storagePath}`, error);
      }

      // Delete from Firestore
      const docRef = doc(db, 'shots', shotId);
      await deleteDoc(docRef);
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting shots:', error);
    throw new Error('Failed to delete shots from Firebase');
  }
};

