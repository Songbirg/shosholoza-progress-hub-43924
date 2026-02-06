import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Share2, 
  Gift, 
  Users, 
  CheckCircle2, 
  Lock, 
  Unlock,
  TrendingUp,
  MessageCircle
} from "lucide-react";
import {
  getOrCreateSession,
  getReferralCount,
  checkUnlockStatus,
  getReferralCountForSession,
  checkUnlockStatusForSession,
  getWhatsAppShareLink,
  trackShare,
  initializeTracking,
} from "@/lib/tracking";

const ViralShare = () => {
  const { toast } = useToast();
  const [referralCount, setReferralCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const [lookupCode, setLookupCode] = useState("");
  const [lookupCount, setLookupCount] = useState<number | null>(null);
  const [lookupUnlocked, setLookupUnlocked] = useState<boolean | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  const REQUIRED_REFERRALS = 10;
  const PRIZE_AMOUNT = "R5,000";

  useEffect(() => {
    const init = async () => {
      // Initialize tracking
      await initializeTracking();
      
      // Get current session
      const session = getOrCreateSession();
      
      // Check unlock status
      const unlocked = await checkUnlockStatus();
      setIsUnlocked(unlocked);
      
      // Get referral count
      const count = await getReferralCount();
      setReferralCount(count);
      
      setIsLoading(false);
      
      // Show confetti if just unlocked
      if (unlocked && count >= REQUIRED_REFERRALS) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    };

    init();
    
    // Poll for updates every 10 seconds
    const interval = setInterval(async () => {
      const count = await getReferralCount();
      setReferralCount(count);
      
      const unlocked = await checkUnlockStatus();
      if (unlocked && !isUnlocked) {
        setIsUnlocked(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        
        toast({
          title: "🎉 Congratulations!",
          description: `You've reached ${REQUIRED_REFERRALS} referrals! Membership unlocked!`,
        });
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isUnlocked, toast]);

  const handleCopyCode = async () => {
    const { sessionId } = getOrCreateSession();
    try {
      await navigator.clipboard.writeText(sessionId);
      toast({
        title: "Code copied",
        description: "Your tracking code has been copied.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Please copy the code manually.",
        variant: "destructive",
      });
    }
  };

  const handleLookup = async () => {
    const code = lookupCode.trim();
    if (!code) {
      toast({
        title: "Enter a code",
        description: "Paste a tracking code to check progress.",
        variant: "destructive",
      });
      return;
    }

    setLookupLoading(true);
    try {
      const [count, unlocked] = await Promise.all([
        getReferralCountForSession(code),
        checkUnlockStatusForSession(code),
      ]);
      setLookupCount(count);
      setLookupUnlocked(unlocked);
    } catch {
      setLookupCount(null);
      setLookupUnlocked(null);
      toast({
        title: "Could not fetch progress",
        description: "Please check the code and try again.",
        variant: "destructive",
      });
    } finally {
      setLookupLoading(false);
    }
  };

  const handleShare = async () => {
    await trackShare();
    
    const whatsappLink = getWhatsAppShareLink();
    window.open(whatsappLink, '_blank');
    
    toast({
      title: "Share on WhatsApp",
      description: "Share with 10 friends to unlock membership!",
    });
  };

  const progress = Math.min((referralCount / REQUIRED_REFERRALS) * 100, 100);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navigation />
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-animation"></div>
        </div>
      )}
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4">
                <Gift className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                WIN <span className="text-green-600">{PRIZE_AMOUNT}</span> CASH
              </h1>
              
              <p className="text-xl text-muted-foreground mb-2">
                Every Month!
              </p>
              
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                <TrendingUp size={16} />
                Join SHOSH & Enter the Draw
              </div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              
              {/* Progress Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Your Progress
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {referralCount} / {REQUIRED_REFERRALS}
                  </span>
                </div>
                
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  {referralCount >= REQUIRED_REFERRALS 
                    ? "🎉 Goal reached! Membership unlocked!" 
                    : `${REQUIRED_REFERRALS - referralCount} more ${REQUIRED_REFERRALS - referralCount === 1 ? 'friend' : 'friends'} to go!`
                  }
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Your unique code</p>
                    <div className="flex gap-2">
                      <Input value={getOrCreateSession().sessionId} readOnly />
                      <Button type="button" variant="secondary" onClick={handleCopyCode}>
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Anyone can enter this code on the site to see your progress.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Check progress by code</p>
                    <div className="flex gap-2">
                      <Input
                        value={lookupCode}
                        onChange={(e) => setLookupCode(e.target.value)}
                        placeholder="Paste code (e.g. shosh_...)"
                      />
                      <Button type="button" onClick={handleLookup} disabled={lookupLoading}>
                        {lookupLoading ? "Checking..." : "Check"}
                      </Button>
                    </div>

                    {lookupCount !== null && (
                      <div className="mt-3 text-sm">
                        <span className="font-medium">Progress:</span> {lookupCount} / {REQUIRED_REFERRALS}
                        {lookupUnlocked ? (
                          <span className="ml-2 text-green-700 font-medium">Unlocked</span>
                        ) : (
                          <span className="ml-2 text-muted-foreground">Locked</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Users className="text-green-600" size={20} />
                  How It Works
                </h3>
                
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Share the link</p>
                      <p className="text-sm text-muted-foreground">
                        Send to 10 friends on WhatsApp
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">They open the link</p>
                      <p className="text-sm text-muted-foreground">
                        Each unique visitor counts toward your goal
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Unlock membership</p>
                      <p className="text-sm text-muted-foreground">
                        Join SHOSH & enter the {PRIZE_AMOUNT} monthly draw
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Share Button */}
              {!isUnlocked && (
                <Button
                  onClick={handleShare}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 gap-3"
                >
                  <MessageCircle size={24} />
                  Share on WhatsApp
                  <Share2 size={20} />
                </Button>
              )}

              {/* Unlock Status */}
              {isUnlocked ? (
                <div className="space-y-4">
                  <div className="bg-green-100 border-2 border-green-600 rounded-xl p-6 text-center">
                    <Unlock className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      🎉 Membership Unlocked!
                    </h3>
                    <p className="text-green-700 mb-4">
                      You've successfully invited {REQUIRED_REFERRALS} friends!
                    </p>
                  </div>
                  
                  <Link to="/membership">
                    <Button
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 gap-3"
                    >
                      <CheckCircle2 size={24} />
                      Join SHOSH & Enter {PRIZE_AMOUNT} Draw
                    </Button>
                  </Link>
                  
                  <p className="text-sm text-center text-muted-foreground">
                    Complete your membership to be entered into the monthly draw
                  </p>
                </div>
              ) : (
                <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-6 text-center mt-4">
                  <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    Membership Locked
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Share with {REQUIRED_REFERRALS - referralCount} more {REQUIRED_REFERRALS - referralCount === 1 ? 'friend' : 'friends'} to unlock
                  </p>
                </div>
              )}
            </div>

            {/* Prize Info */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white text-center animate-fade-in" style={{ animationDelay: "200ms" }}>
              <Gift className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">
                Monthly {PRIZE_AMOUNT} Cash Prize
              </h3>
              <p className="text-green-100">
                All SHOSH members are automatically entered into the monthly draw. 
                Winner announced on the 1st of every month!
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>✓ No personal information required to share</p>
              <p>✓ Progress tracked automatically</p>
              <p>✓ Fair & transparent system</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <style>{`
        .confetti-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle, #22c55e 2px, transparent 2px),
            radial-gradient(circle, #16a34a 2px, transparent 2px),
            radial-gradient(circle, #15803d 2px, transparent 2px);
          background-size: 50px 50px, 80px 80px, 100px 100px;
          background-position: 0 0, 40px 60px, 130px 270px;
          animation: confetti-fall 3s linear;
        }
        
        @keyframes confetti-fall {
          to {
            background-position: 0 100vh, 40px calc(100vh + 60px), 130px calc(100vh + 270px);
          }
        }
      `}</style>
    </div>
  );
};

export default ViralShare;
