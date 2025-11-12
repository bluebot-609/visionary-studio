# Firebase Setup for Shot Library

## Issue: "No shots saved yet" after page reload

If your shots are not persisting after page reload, it's likely a Firebase permissions issue. Follow these steps to fix it:

## 1. Check Firebase Console Logs

Open your browser's Developer Console (F12) and check for errors when:
- Generating an image (should see logs like "Starting to save shot...")
- Viewing Shot Library (should see logs like "getUserShots called...")

## 2. Configure Firestore Security Rules

Go to Firebase Console → Firestore Database → Rules and set up proper rules:

### For Development (Allow all authenticated users):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own shots
    match /shots/{shotId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Allow other collections as needed
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### For Production (More strict):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /shots/{shotId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                      request.resource.data.userId == request.auth.uid &&
                      request.resource.data.keys().hasAll(['userId', 'imageId', 'imageUrl', 'timestamp', 'fileName', 'hue', 'saturation']);
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## 3. Configure Storage Security Rules

Go to Firebase Console → Storage → Rules:

### For Development:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /shots/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### For Production:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /shots/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.auth.uid == userId &&
                     request.resource.size < 10 * 1024 * 1024 && // Max 10MB
                     request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 4. Create Firestore Index

If you see an error about "requires an index", go to the link in the error message or:

1. Go to Firebase Console → Firestore Database → Indexes
2. Create a composite index for:
   - Collection: `shots`
   - Fields to index:
     - `userId` (Ascending)
     - `timestamp` (Descending)

## 5. Verify Firebase Configuration

Check your `.env` file has all required Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## 6. Test the Setup

1. Open browser DevTools Console
2. Generate a new image
3. Look for these console logs:
   - "Starting to save shot to library..."
   - "saveShot called with: {userId: '...', imageId: '...'}"
   - "Converting base64 to blob..."
   - "Uploading to Firebase Storage..."
   - "Download URL obtained: ..."
   - "Firestore document created: ..."
   - "Shot saved successfully"

4. Navigate to Shot Library
5. Look for:
   - "getUserShots called with userId: ..."
   - "Query returned X documents"
   - "Returning X shots"

## Common Issues

### Permission Denied Error
**Error**: `Missing or insufficient permissions`
**Fix**: Update Firestore and Storage rules as shown above

### Index Required Error
**Error**: `The query requires an index`
**Fix**: Click the link in the error or manually create the index (see step 4)

### Network Error
**Error**: `Failed to fetch` or `Network request failed`
**Fix**: 
- Check internet connection
- Verify Firebase project is active
- Check if Firebase quota is exceeded

### Storage Quota Exceeded
**Error**: `Quota exceeded`
**Fix**: 
- Upgrade Firebase plan
- Delete old shots to free up space
- Compress images before saving

## Need More Help?

Check the browser console for detailed error logs. All operations now include extensive logging to help identify issues.


