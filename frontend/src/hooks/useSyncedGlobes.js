import { useCallback, useRef } from 'react';

/**
 * Keeps globe cameras in step, following the globe last interacted with.
 * Returns `register(globe)`, which returns an unregister function; call it with
 * the react-globe.gl instance from an effect.
 */
export const useSyncedGlobes = () => {
  const globesRef = useRef(new Set());
  const leaderRef = useRef(null);

  return useCallback((globe) => {
    if (!globe) return undefined;

    const globes = globesRef.current;
    const controls = globe.controls();

    // A globe that appears later starts from the view the others already share.
    const [current] = globes;
    if (current) globe.camera().position.copy(current.camera().position);
    globes.add(globe);

    const onStart = () => {
      leaderRef.current = globe;
    };
    const onChange = () => {
      if (leaderRef.current !== globe) return;
      const { position } = globe.camera();
      globes.forEach((other) => {
        if (other !== globe) other.camera().position.copy(position);
      });
    };

    controls.addEventListener('start', onStart);
    controls.addEventListener('change', onChange);

    return () => {
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('change', onChange);
      globes.delete(globe);
      if (leaderRef.current === globe) leaderRef.current = null;
    };
  }, []);
};
