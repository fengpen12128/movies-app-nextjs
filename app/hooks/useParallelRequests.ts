import { useState, useEffect } from 'react';

type UseParallelRequestsReturn = {
    data: any;
    loading: boolean;
    errors: Error[];
};

function useParallelRequests(requests: (() => Promise<any>)[]): UseParallelRequestsReturn {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<Error[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setErrors([]);

            const results = await Promise.allSettled(requests.map((req) => req()));

            const fulfilledData: any = results.map((result) =>
                result.status === 'fulfilled' ? result.value.data : null
            );
            const errorsData: Error[] = results
                .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
                .map((result) => result.reason);

            setData(fulfilledData);
            setErrors(errorsData);
            setLoading(false);
        };

        fetchData();
    }, []);

    return { data, loading, errors };
}

export default useParallelRequests;
