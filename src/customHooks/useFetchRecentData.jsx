import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../api/firebase-config"; // Ensure to import your Firebase config

const useFetchRecentData = ({ collectionName, orderByField, orderDirection = "asc", limitCount = 10 }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const collectionRef = collection(db, collectionName);
                const orderedQuery = query(
                    collectionRef,
                    orderBy(orderByField, orderDirection),
                    limit(limitCount)
                );
                const querySnapshot = await getDocs(orderedQuery);
                const fetchedData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setData(fetchedData);
            } catch (error) {
                console.error(`Error fetching data from ${collectionName}:`, error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData().then();
    }, [collectionName, orderByField, orderDirection, limitCount]);

    return { data, loading, error };
};

export default useFetchRecentData;
