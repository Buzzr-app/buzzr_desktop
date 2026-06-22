/** @jest-environment jsdom */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LaunchBanner } from '@/components/LaunchBanner';

describe('LaunchBanner', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the Buzzr 2.0 actions and can dismiss', async () => {
    render(<LaunchBanner />);

    expect(await screen.findByText('Buzzr 2.0 is live.')).toBeInTheDocument();
    expect(screen.getByText('Scroll, dashboards, leagues, and Bets in one app.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Review on PH' })).toHaveAttribute(
      'href',
      'https://www.producthunt.com/products/buzzr-sports/reviews/new'
    );
    expect(screen.getByRole('link', { name: 'What changed' })).toHaveAttribute('href', '/changelog');

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss launch notification' }));

    await waitFor(() => {
      expect(screen.queryByText('Buzzr 2.0 is live.')).not.toBeInTheDocument();
    });
    expect(window.localStorage.getItem('buzzr-2-launch-dismissed')).toBe('1');
  });
});
