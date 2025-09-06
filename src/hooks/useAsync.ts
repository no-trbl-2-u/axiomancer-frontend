import { useCallback, useRef, useState } from "react";

export type AsyncStatus = "idle" | "pending" | "success" | "error";

export interface UseAsyncState<T> {
    status: AsyncStatus;
    data: T | null;
    error: unknown;
}

export interface UseAsyncReturn<T, A extends any[]> extends UseAsyncState<T> {
    run: (...args: A) => Promise<T>;
    reset: () => void;
}

/**
 * Generic async hook to manage loading/data/error state for any async function.
 * Keeps latest call only; ignores results from stale calls.
 */
export function useAsync<T, A extends any[]>(asyncFn: (...args: A) => Promise<T>): UseAsyncReturn<T, A> {
    const [status, setStatus] = useState<AsyncStatus>("idle");
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<unknown>(null);
    const callIdRef = useRef(0);

    const run = useCallback(
        async (...args: A) => {
            const callId = ++callIdRef.current;
            setStatus("pending");
            setError(null);
            try {
                const result = await asyncFn(...args);
                if (callId === callIdRef.current) {
                    setData(result);
                    setStatus("success");
                }
                return result;
            } catch (err) {
                if (callId === callIdRef.current) {
                    setError(err);
                    setStatus("error");
                }
                throw err;
            }
        },
        [asyncFn]
    );

    const reset = useCallback(() => {
        callIdRef.current++;
        setStatus("idle");
        setData(null);
        setError(null);
    }, []);

    return { status, data, error, run, reset };
}


