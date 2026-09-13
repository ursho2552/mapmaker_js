import { act, renderHook, waitFor } from '@testing-library/react';
import { useAsyncData } from './useAsyncData';

// A promise that is resolved or rejected from the outside.
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};

beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
afterEach(() => console.error.mockRestore());

test('loads data and clears the loading flag', async () => {
  const { result } = renderHook(() => useAsyncData(() => Promise.resolve('grid'), []));
  expect(result.current.loading).toBe(true);
  await waitFor(() => expect(result.current.data).toBe('grid'));
  expect(result.current.loading).toBe(false);
});

test('a slow earlier response never overwrites a newer one', async () => {
  const runs = { 2030: deferred(), 2040: deferred() };
  const signals = {};
  const { result, rerender } = renderHook(
    ({ year }) => useAsyncData((signal) => { signals[year] = signal; return runs[year].promise; }, [year]),
    { initialProps: { year: 2030 } }
  );

  rerender({ year: 2040 });
  expect(signals[2030].aborted).toBe(true);

  await act(async () => runs[2040].resolve('2040 data'));
  await act(async () => runs[2030].resolve('2030 data'));

  expect(result.current.data).toBe('2040 data');
  expect(result.current.loading).toBe(false);
});

test('reports errors but keeps the previous data', async () => {
  const runs = { a: deferred(), b: deferred() };
  const { result, rerender } = renderHook(
    ({ key }) => useAsyncData(() => runs[key].promise, [key]),
    { initialProps: { key: 'a' } }
  );
  await act(async () => runs.a.resolve('first'));

  rerender({ key: 'b' });
  await act(async () => runs.b.reject(new Error('Backend error 500')));

  expect(result.current.error).toBe('Backend error 500');
  expect(result.current.data).toBe('first');
});

test('does not run while disabled', () => {
  const task = jest.fn(() => Promise.resolve());
  const { result } = renderHook(() => useAsyncData(task, [], { enabled: false }));
  expect(task).not.toHaveBeenCalled();
  expect(result.current.loading).toBe(false);
});

test('does not re-run when only the task closure changes', async () => {
  const task = jest.fn(() => Promise.resolve('x'));
  const { rerender } = renderHook(() => useAsyncData(() => task(), ['same']));
  rerender();
  rerender();
  await waitFor(() => expect(task).toHaveBeenCalledTimes(1));
});
