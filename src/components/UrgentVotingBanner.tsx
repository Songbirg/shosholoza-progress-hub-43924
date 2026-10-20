import { useState } from "react";

const UrgentVotingBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white py-4 px-4 text-center font-bold shadow-2xl banner-flash">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 text-sm md:text-base lg:text-lg">
            🏠 <span className="font-extrabold">HOUSING FOR ALL!</span> Register now for your future home. When Shosholoza wins, registered members will be <span className="underline font-extrabold text-yellow-300">PRIORITISED</span> for quality high-rise apartments. Vote SHOSH! 🏠
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-yellow-300 font-bold text-2xl leading-none ml-2 transition-colors"
            aria-label="Close banner"
          >
            ×
          </button>
        </div>
      </div>
      <style>{`
        @keyframes flash {
          0%, 100% { 
            background: linear-gradient(to right, rgb(21, 128, 61), rgb(22, 163, 74), rgb(5, 150, 105));
            transform: scale(1);
          }
          50% { 
            background: linear-gradient(to right, rgb(22, 163, 74), rgb(5, 150, 105), rgb(16, 185, 129));
            transform: scale(1.01);
          }
        }
        .banner-flash {
          animation: flash 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default UrgentVotingBanner;
