import { createClient } from '../lib/supabase';
import type { GeneratedImage } from '../types';

export interface SavedShot {
  id: string; // Supabase UUID
  userId: string;
  imageId: string;
  imageUrl: string;
  timestamp: Date;
  fileName: string;
  hue: number;
  saturation: number;
}

/**
 * Save a generated image to Supabase Storage and Postgres
 */
export const saveShot = async (
  userId: string,
  generatedImage: GeneratedImage,
): Promise<SavedShot> => {
  console.log('saveShot called with:', { userId, imageId: generatedImage.id });
  
  try {
    const supabase = createClient();

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
    const storagePath = `${userId}/${fileName}`;
    console.log('Storage path:', storagePath);

    // Upload to Supabase Storage
    console.log('Uploading to Supabase Storage...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('shots')
      .upload(storagePath, blob, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }
    console.log('Upload successful:', uploadData);

    // Get download URL
    console.log('Getting download URL...');
    const { data: urlData } = supabase.storage
      .from('shots')
      .getPublicUrl(storagePath);
    
    const imageUrl = urlData.publicUrl;
    console.log('Download URL obtained:', imageUrl);

    // Save metadata to Postgres
    const shotData = {
      user_id: userId,
      image_id: generatedImage.id,
      image_url: imageUrl,
      file_name: fileName,
      hue: generatedImage.hue,
      saturation: generatedImage.saturation,
    };

    console.log('Saving metadata to Postgres...', shotData);
    const { data: insertData, error: insertError } = await supabase
      .from('shots')
      .insert(shotData)
      .select()
      .single();

    if (insertError) {
      // If insert fails, try to clean up the uploaded file
      await supabase.storage.from('shots').remove([storagePath]);
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    console.log('Postgres record created:', insertData);

    const savedShot: SavedShot = {
      id: insertData.id,
      userId: insertData.user_id,
      imageId: insertData.image_id,
      imageUrl: insertData.image_url,
      timestamp: new Date(insertData.created_at),
      fileName: insertData.file_name,
      hue: insertData.hue,
      saturation: insertData.saturation,
    };
    
    console.log('Shot saved successfully:', savedShot);
    return savedShot;
  } catch (error) {
    console.error('Error saving shot - Full error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error(`Failed to save shot to Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get all shots for a user, ordered by timestamp (newest first)
 */
export const getUserShots = async (userId: string): Promise<SavedShot[]> => {
  console.log('getUserShots called with userId:', userId);
  
  try {
    const supabase = createClient();

    console.log('Executing Postgres query...');
    const { data, error } = await supabase
      .from('shots')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Query failed: ${error.message}`);
    }

    console.log('Query returned', data?.length || 0, 'records');
    
    const shots: SavedShot[] = (data || []).map((row) => {
      const shot: SavedShot = {
        id: row.id,
        userId: row.user_id,
        imageId: row.image_id,
        imageUrl: row.image_url,
        timestamp: new Date(row.created_at),
        fileName: row.file_name,
        hue: row.hue,
        saturation: row.saturation,
      };
      console.log('Processing shot:', shot.id, shot.fileName);
      return shot;
    });

    console.log('Returning', shots.length, 'shots');
    return shots;
  } catch (error) {
    console.error('Error fetching user shots - Full details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error(`Failed to fetch shots from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete multiple shots from both Storage and Postgres
 */
export const deleteShots = async (
  userId: string,
  shotIds: string[],
  shots: SavedShot[],
): Promise<void> => {
  try {
    const supabase = createClient();

    const deletePromises = shotIds.map(async (shotId) => {
      const shot = shots.find((s) => s.id === shotId);
      if (!shot) return;

      // Delete from Storage
      const storagePath = `${userId}/${shot.fileName}`;
      try {
        const { error: storageError } = await supabase.storage
          .from('shots')
          .remove([storagePath]);
        
        if (storageError) {
          console.warn(`Failed to delete storage file: ${storagePath}`, storageError);
        }
      } catch (error) {
        console.warn(`Failed to delete storage file: ${storagePath}`, error);
      }

      // Delete from Postgres
      const { error: dbError } = await supabase
        .from('shots')
        .delete()
        .eq('id', shotId)
        .eq('user_id', userId); // Extra safety check

      if (dbError) {
        throw new Error(`Failed to delete from database: ${dbError.message}`);
      }
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting shots:', error);
    throw new Error('Failed to delete shots from Supabase');
  }
};
