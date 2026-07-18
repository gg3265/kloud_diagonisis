import React, { createContext, useContext, useState } from 'react';

interface BookingModalContextType {
  isOpen: boolean;
  openModal: (preSearch?: string) => void;
  closeModal: () => void;
  preSearch: string;
}

const BookingModalContext = createContext<BookingModalContextType | undefined>(undefined);

export const BookingModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preSearch, setPreSearch] = useState('');

  const openModal = (search = '') => {
    setPreSearch(search);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    setPreSearch('');
    document.body.style.overflow = '';
  };

  return (
    <BookingModalContext.Provider value={{ isOpen, openModal, closeModal, preSearch }}>
      {children}
    </BookingModalContext.Provider>
  );
};

export const useBookingModal = () => {
  const ctx = useContext(BookingModalContext);
  if (!ctx) throw new Error('useBookingModal must be used within BookingModalProvider');
  return ctx;
};
