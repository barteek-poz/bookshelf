import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useFetch = (url, reqMethod, reqBody, additionalDep) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [isPending, setIsPending] = useState(false);
	const { accessToken } = useContext(AuthContext);
	useEffect(() => {
		const fetchData = async () => {
			setIsPending(true);
			try {
				const response = await fetch(url, {
                    method: reqMethod,
					body: reqBody? JSON.stringify({reqBody}) : null,
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
				});
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				const jsonData = await response.json();
				setIsPending(false);
				setData(jsonData.data);
				setError(null);
			} catch (err) {
				setError(`Could not fetch data: ${err}`);
				setIsPending(false);
			}
		};
		fetchData();
	}, [url, additionalDep]);
	return { data, error, isPending };
};

export default useFetch;
