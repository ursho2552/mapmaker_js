import { useEffect, useRef, useState } from 'react';

/**
 * Runs an async task whenever `deps` change and tracks its loading/error state.
 * The previous run is aborted, and results of superseded or unmounted runs are
 * discarded, so a slow response can never overwrite a newer one. The previous
 * data stays available while the next run loads.
 *
 * @param task     (signal) => Promise<data>
 * @param deps     primitive values that should trigger a re-run
 * @param enabled  skip running while false (e.g. missing arguments)
 */
export const useAsyncData = (task, deps, { enabled = true } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  // Kept in a ref so a new task closure on every render does not re-run the effect.
  const taskRef = useRef(task);
  taskRef.current = task;

  useEffect(() => {
    if (!enabled) return undefined;

    const controller = new AbortController();
    const { signal } = controller;

    setError(null);
    setLoading(true);

    taskRef
      .current(signal)
      .then((result) => { if (!signal.aborted) setData(result); })
      .catch((err) => {
        if (signal.aborted || err.name === 'AbortError') return;
        console.error(err);
        setError(err.message);
      })
      .finally(() => { if (!signal.aborted) setLoading(false); });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return { data, loading, error };
};
