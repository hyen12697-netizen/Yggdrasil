import { createContext, useState, useContext } from 'react';
import GlobalNotificationModal from '../components/GlobalNotificationModal';
import { Toaster, toast } from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    onConfirm: null
  });

  const showNotification = ({ type, title, message, onConfirm }) => {
    if (type === 'confirm') {
      setModalState({
        isOpen: true,
        type,
        title: title || 'Xác nhận',
        message: message || '',
        onConfirm: onConfirm || null
      });
    } else {
      const msg = message || title;
      if (type === 'success') {
        toast.success(msg);
      } else if (type === 'error') {
        toast.error(msg);
      } else {
        toast(msg, { icon: type === 'warning' ? '⚠️' : undefined });
      }
    }
  };

  const hideNotification = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification, modalState }}>
      {children}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          className: 'dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700 shadow-lg'
        }} 
      />
      <GlobalNotificationModal />
    </NotificationContext.Provider>
  );
};
