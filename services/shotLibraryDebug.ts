import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Test Firestore connection and permissions
 * Open browser console and call: testFirestoreAccess('your-user-id')
 */
export const testFirestoreAccess = async (userId: string) => {
  console.group('🔍 Firestore Access Test');
  console.log('Testing with userId:', userId);
  
  try {
    // Test 1: Can we access the collection at all?
    console.log('\n📋 Test 1: Accessing shots collection...');
    const shotsRef = collection(db, 'shots');
    console.log('✅ Collection reference created:', shotsRef.path);
    
    // Test 2: Can we query all documents (no filters)?
    console.log('\n📋 Test 2: Fetching ALL documents (no filters)...');
    try {
      const allDocsSnapshot = await getDocs(shotsRef);
      console.log('✅ Query successful! Found', allDocsSnapshot.size, 'total documents');
      
      if (allDocsSnapshot.size > 0) {
        console.log('\n📄 Sample document:');
        const firstDoc = allDocsSnapshot.docs[0];
        console.log('Document ID:', firstDoc.id);
        console.log('Document data:', firstDoc.data());
      }
    } catch (error) {
      console.error('❌ Failed to fetch all documents:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
    }
    
    // Test 3: Can we query with userId filter?
    console.log('\n📋 Test 3: Querying with userId filter...');
    try {
      const q = query(shotsRef, where('userId', '==', userId));
      const filteredSnapshot = await getDocs(q);
      console.log('✅ Filtered query successful! Found', filteredSnapshot.size, 'documents for this user');
      
      filteredSnapshot.forEach((doc) => {
        console.log('\n📄 Document:', doc.id);
        console.log('Data:', doc.data());
      });
    } catch (error) {
      console.error('❌ Failed to fetch with userId filter:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        
        // Check for index error
        if (error.message.includes('index')) {
          console.warn('⚠️ INDEX REQUIRED ERROR DETECTED!');
          console.log('This usually means you need to create a Firestore index.');
          console.log('The error message should contain a link to create it automatically.');
        }
        
        // Check for permission error
        if (error.message.includes('permission') || error.message.includes('PERMISSION_DENIED')) {
          console.warn('⚠️ PERMISSION DENIED ERROR DETECTED!');
          console.log('Your Firestore security rules are blocking this query.');
          console.log('See FIREBASE_SETUP.md for correct security rules.');
        }
      }
    }
    
    // Test 4: Can we query with userId and orderBy?
    console.log('\n📋 Test 4: Querying with userId + orderBy timestamp...');
    try {
      const { orderBy: orderByFunc } = await import('firebase/firestore');
      const q = query(
        shotsRef,
        where('userId', '==', userId),
        orderByFunc('timestamp', 'desc')
      );
      const orderedSnapshot = await getDocs(q);
      console.log('✅ Ordered query successful! Found', orderedSnapshot.size, 'documents');
      
      if (orderedSnapshot.size > 0) {
        console.log('\n📄 Documents in order:');
        orderedSnapshot.forEach((doc, index) => {
          const data = doc.data();
          console.log(`${index + 1}.`, doc.id, '-', data.fileName);
        });
      }
    } catch (error) {
      console.error('❌ Failed to fetch with orderBy:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        
        if (error.message.includes('index')) {
          console.warn('\n⚠️ INDEX REQUIRED!');
          console.log('You need to create a composite index in Firestore:');
          console.log('Collection: shots');
          console.log('Fields: userId (Ascending), timestamp (Descending)');
          
          // Try to extract the link from error
          const match = error.message.match(/(https:\/\/console\.firebase\.google\.com[^\s]+)/);
          if (match) {
            console.log('\n🔗 Click this link to create the index automatically:');
            console.log(match[1]);
          }
        }
      }
    }
    
    console.log('\n✅ Test completed!');
    console.groupEnd();
    
  } catch (error) {
    console.error('❌ Test failed with unexpected error:', error);
    console.groupEnd();
  }
};

// Make it available globally for easy testing
if (typeof window !== 'undefined') {
  (window as any).testFirestoreAccess = testFirestoreAccess;
  console.log('🔧 Debug tool loaded! Run: testFirestoreAccess("your-user-id")');
}


