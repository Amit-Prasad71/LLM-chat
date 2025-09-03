import { useEffect } from "react";
import { CircleAlert } from 'lucide-react'
import { AnimatePresence, motion } from "framer-motion";

export default function ErrorToast({ showError, onClose, errMessage, duration = 4000 }) {
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [showError, onClose, duration]);

  return (
    <AnimatePresence>
      {showError && (
        <motion.div
          key="error-toast"
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="bg-black border-t-4 border-red-500 text-white rounded-xl shadow-lg p-4 w-80">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-medium text-white/90">Request failed</h2>
              </div>
            </div>
            <p className="text-sm text-white/70 mt-1">{errMessage}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
