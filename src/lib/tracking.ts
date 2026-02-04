// Tracking Service
export const initializeTracking = async () => {
  console.log('Tracking initialized');
};
export const getOrCreateSession = () => ({ sessionId: 'test' });
export const getReferralCount = async () => 0;
export const checkUnlockStatus = async () => false;
export const getWhatsAppShareLink = () => 'https://wa.me/';
export const trackShare = async () => {};
