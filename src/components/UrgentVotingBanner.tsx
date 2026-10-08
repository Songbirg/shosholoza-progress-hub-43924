import { useState } from "react";

const UrgentVotingBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-red-600 text-white py-4 px-4 text-center font-bold shadow-2xl banner-flash">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 text-sm md:text-base lg:text-lg">
            🚨 <span className="font-extrabold">URGENT:</span> Apply for a special vote to avoid the long queues on 4th November. Send your ID number to IEC at <span className="underline font-extrabold text-yellow-300">32249</span> and you will be approved immediately. Vote Shosholoza Progressive Party (SHOSH). 🚨
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
            background-color: #dc2626;
            transform: scale(1);
          }
          50% { 
            background-color: #b91c1c;
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
