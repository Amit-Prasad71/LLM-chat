import { useEffect } from "react";
import {CircleAlert} from 'lucide-react'

export default function ErrorToast({ isOpen, onClose, message, duration = 4000 }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  return (
  <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
    <div className="bg-black border border-red-500/40 text-white rounded-xl shadow-lg p-4 w-80">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-medium text-white/90">Request failed</h2>
        </div>
      </div>
      <p className="text-sm text-white/70 mt-1">{message}</p>
    </div>
  </div>
);


}
