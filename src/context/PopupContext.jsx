import { createContext, useState, useContext, useEffect } from 'react';
import { initialPopupState } from '../data/mockData';
import toast from 'react-hot-toast';

const PopupContext = createContext();

export const usePopup = () => useContext(PopupContext);

export const PopupProvider = ({ children }) => {
  const [popupSettings, setPopupSettings] = useState(() => {
    const saved = localStorage.getItem('yggdrasil_popup');
    return saved ? JSON.parse(saved) : initialPopupState;
  });

  const [hasSeenPopup, setHasSeenPopup] = useState(false);

  useEffect(() => {
    localStorage.setItem('yggdrasil_popup', JSON.stringify(popupSettings));
  }, [popupSettings]);

  const updatePopup = (settings) => {
    setPopupSettings({ ...popupSettings, ...settings });
    toast.success('Đã cập nhật cài đặt Popup');
  };

  const closePopup = () => {
    setHasSeenPopup(true);
  };

  return (
    <PopupContext.Provider value={{ 
      popupSettings, 
      updatePopup, 
      shouldShowPopup: popupSettings.isActive && !hasSeenPopup,
      closePopup
    }}>
      {children}
    </PopupContext.Provider>
  );
};
