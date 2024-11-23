import {collection, doc,getDocs, query, where} from "firebase/firestore";
import {db} from "../../api/firebase-config.js";

export async function getUserDocRefById(id, tableName) {
    const docRef = collection(db, tableName);
    const querySnapshot = await getDocs(query(docRef, where("id", "==", id)));
    if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        return doc(db, tableName, docId);
    } else {
        return  false
    }
}

export const formatFirestoreDate = (timestamp) => {
    if (!timestamp) return ''; // Handle cases where timestamp might be undefined or null
    const date = timestamp.toDate(); // Convert Firestore Timestamp to a JavaScript Date object
    return date.toLocaleDateString('en-US', {
        month: 'short', // Abbreviated month name (e.g., "Dec")
        day: 'numeric', // Numeric day of the month (e.g., "1")
        year: 'numeric', // Full numeric year (e.g., "2024")
    });
};