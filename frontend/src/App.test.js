import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { HIDE_WELCOME_KEY } from './components/InfoModal';

// The figures need WebGL and Plotly, which jsdom lacks; the tests cover the page around them.
jest.mock('./components/DataPanel', () => () => <div data-testid="data-panel" />);
jest.mock('./components/CombinedLinePlot', () => () => null);

beforeEach(() => localStorage.clear());

test('renders the header, both data panels and the control panels', () => {
  localStorage.setItem(HIDE_WELCOME_KEY, 'true');
  render(<App />);

  expect(screen.getByRole('heading', { name: 'MAPMAKER' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
  expect(screen.getAllByTestId('data-panel')).toHaveLength(2);
  expect(screen.getByText('Control Panels')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Unlock scenario' })).toBeInTheDocument();
});

test('the welcome opt-out is saved however the dialog is closed', async () => {
  render(<App />);

  const dialog = screen.getByRole('dialog', { name: 'Welcome to MAPMAKER!' });
  fireEvent.click(screen.getByLabelText('Don’t show this again'));
  fireEvent.keyDown(dialog, { key: 'Escape' });

  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(localStorage.getItem(HIDE_WELCOME_KEY)).toBe('true');
});

test('a lock toggles between linked and unlinked', () => {
  localStorage.setItem(HIDE_WELCOME_KEY, 'true');
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Unlock model' }));
  expect(screen.getByRole('button', { name: 'Lock model' })).toBeInTheDocument();
});
