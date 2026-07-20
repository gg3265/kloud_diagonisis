import React, { createContext, useContext, useState } from 'react';

export interface PackageInfo {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  parameterCount: number;
  includes?: string[];
  fastingRequired?: boolean;
}

interface BookingModalContextType {
  // Individual test modal
  isOpen: boolean;
  openModal: (preSearch?: string) => void;
  closeModal: () => void;
  preSearch: string;

  // Package booking modal
  isPackageModalOpen: boolean;
  openPackageModal: (pkg: PackageInfo) => void;
  closePackageModal: () => void;
  selectedPackage: PackageInfo | null;

  // Global success popup
  isSuccessPopupOpen: boolean;
  successPopupMessage: string;
  showSuccessPopup: (message?: string) => void;
  hideSuccessPopup: () => void;
}

const BookingModalContext = createContext<BookingModalContextType | undefined>(undefined);

export const BookingModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preSearch, setPreSearch] = useState('');
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(null);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState('');

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

  const openPackageModal = (pkg: PackageInfo) => {
    setSelectedPackage(pkg);
    setIsPackageModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closePackageModal = () => {
    setIsPackageModalOpen(false);
    setSelectedPackage(null);
    document.body.style.overflow = '';
  };

  const showSuccessPopup = (message = 'Our team will contact you shortly to confirm your slot.') => {
    setSuccessPopupMessage(message);
    setIsSuccessPopupOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const hideSuccessPopup = () => {
    setIsSuccessPopupOpen(false);
    setSuccessPopupMessage('');
    document.body.style.overflow = '';
  };

  return (
    <BookingModalContext.Provider value={{
      isOpen, openModal, closeModal, preSearch,
      isPackageModalOpen, openPackageModal, closePackageModal, selectedPackage,
      isSuccessPopupOpen, successPopupMessage, showSuccessPopup, hideSuccessPopup,
    }}>
      {children}
    </BookingModalContext.Provider>
  );
};

export const useBookingModal = () => {
  const ctx = useContext(BookingModalContext);
  if (!ctx) throw new Error('useBookingModal must be used within BookingModalProvider');
  return ctx;
};
