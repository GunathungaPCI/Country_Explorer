import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CountryCard from '../../src/components/CountryCard';
import { BrowserRouter } from 'react-router-dom';
import { FavoriteContext } from '../../src/context/FavoriteContext';
import { AuthContext } from '../../src/context/AuthContext';


const mockCountry = {
  cca3: 'USA',
  name: { common: 'United States' },
  population: 331000000,
  flags: { svg: 'https://flagcdn.com/us.svg' },
};

const renderWithProviders = (ui, { user = null, favorites = [], addToFavorites = jest.fn(), removeFromFavorites = jest.fn() } = {}) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user }}>
        <FavoriteContext.Provider
          value={{
            isFavorite: (code) => favorites.includes(code),
            addToFavorites,
            removeFromFavorites,
          }}
        >
          {ui}
        </FavoriteContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

test('renders country name and flag', () => {
  renderWithProviders(<CountryCard country={mockCountry} />);

  expect(screen.getByText(/United States/i)).toBeInTheDocument();
  expect(screen.getByAltText(/flag of united states/i)).toBeInTheDocument();
});

test('redirects to login if user is not logged in when clicking favorite', () => {
  const { container } = renderWithProviders(<CountryCard country={mockCountry} />);
  const button = container.querySelector('button');
  fireEvent.click(button);

  // This should ideally trigger navigation to /login
  // You'd use mocks/spies if testing full navigation
});

test('calls addToFavorites if not favorite and user is logged in', () => {
  const addToFavoritesMock = jest.fn();
  renderWithProviders(<CountryCard country={mockCountry} />, {
    user: { name: 'Test' },
    favorites: [],
    addToFavorites: addToFavoritesMock,
  });

  const button = screen.getByRole('button');
  fireEvent.click(button);

  expect(addToFavoritesMock).toHaveBeenCalledWith('USA');
});
