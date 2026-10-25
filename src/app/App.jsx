import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EnquiryCartProvider } from '../context/EnquiryCartContext';
import { FavouritesProvider } from '../context/FavouritesContext';
import { AppRoutes } from './routes';

export function App() {
  return (
    <BrowserRouter>
      <EnquiryCartProvider>
        <FavouritesProvider>
          <AppRoutes />
        </FavouritesProvider>
      </EnquiryCartProvider>
    </BrowserRouter>
  );
}

export default App;
