import { X } from 'lucide-react';
import { usePopup } from '../context/PopupContext';
import { motion, AnimatePresence } from 'framer-motion';

const Popup = () => {
  const { shouldShowPopup, popupSettings, closePopup } = usePopup();

  if (!shouldShowPopup) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative"
        >
          <button 
            onClick={closePopup}
            className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 transition-colors z-10"
          >
            <X size={20} />
          </button>
          
          {popupSettings.image && (
            <div className="h-48 w-full bg-gray-200">
              <img src={popupSettings.image} alt="Popup Banner" className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {popupSettings.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {popupSettings.content}
            </p>
            <button 
              onClick={closePopup}
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-8 rounded-full transition-colors"
            >
              Xem ngay
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Popup;
