import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../api/firebase-config';  // Make sure to point to your Firebase config

const useFetchDriversOnce = (tableName) => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [skeletonState, setSkeletonState] = useState(false)
    const [error, setError] = useState(null);
    const [refresh,setrefresh]=useState(false)
    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            try {
                const collectionRef = collection(db, tableName);
                const querySnapshot = await getDocs(collectionRef);
                const Data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setData(Data);
                console.log("refresh")
            } catch (error) {
                console.error("Error fetching data: ", error);
                setError(error);

            }finally {
                setLoading(false);
            }
        };

        fetchData().then();
    }, [refresh]);

    return { data, loading, error ,setrefresh,refresh};
};

export default useFetchDriversOnce;
