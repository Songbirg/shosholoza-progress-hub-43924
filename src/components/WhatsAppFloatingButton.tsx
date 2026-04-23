import { MessageCircle } from "lucide-react";

const WhatsAppFloatingButton = () => {
  const phone = "27713427864";
  const text = encodeURIComponent("Hi! I’d like to get in touch.");
  const href = `https://wa.me/${phone}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
};

export default WhatsAppFloatingButton;
