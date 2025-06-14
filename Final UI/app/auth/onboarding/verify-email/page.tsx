"use client"

import { OnboardingStepper } from "@/components/onboarding-stepper"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MailCheck, Smartphone } from "lucide-react"
import { useState, useEffect } from "react" // Added useEffect
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useSearchParams, useRouter } from "next/navigation" // Added useRouter
import { auth as firebaseAuth } from "@/lib/firebase"; // Firebase auth instance
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { markUserAsVerified } from "@/lib/api"; // API function

// Extend window type for recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult; // Though we store it in state
  }
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token, refetchUser, isLoading: isAuthLoading } = useAuth(); // Added isLoading
  const queryUserType = searchParams.get('type');

  // State for the component
  const [method, setMethod] = useState<'email' | 'phone'>('phone'); // Default to phone
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // E.g., "+11234567890"
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [confirmationResultState, setConfirmationResultState] = useState<ConfirmationResult | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(() => {
    if (method === 'phone' && typeof window !== 'undefined' && !window.recaptchaVerifier) {
      // Ensure the container exists before rendering
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer) {
        window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response: any) => {
            console.log("Recaptcha verified (invisible)", response);
            // If you need to trigger something after invisible reCAPTCHA solves itself.
          },
          'expired-callback': () => {
            toast.error("Recaptcha expired. Please try sending OTP again.");
            if (window.recaptchaVerifier) {
              window.recaptchaVerifier.clear();
              // Re-initialize or prompt user to retry
              // For simplicity, we might just let the user click "Send OTP" again which would re-trigger.
            }
          }
        });
        window.recaptchaVerifier.render().catch(err => {
          console.error("Recaptcha render error:", err);
          toast.error("Could not render reCAPTCHA. Please ensure you're online and refresh.");
        });
      }
    }
    // Cleanup on unmount or method change (basic attempt)
    return () => {
      if (window.recaptchaVerifier && method === 'phone') {
        // Firebase often manages its lifecycle. Attempting to clear.
        // window.recaptchaVerifier.clear(); // Might cause issues if component unmounts and re-mounts quickly.
      }
    };
  }, [method]);

  const handleSendOtp = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (method === 'email') {
      toast.info("Email OTP verification is not implemented in this step.");
      // setOtpSent(true); // Mock for email
      return;
    }

    if (!phone) {
      toast.error("Please enter your phone number.");
      return;
    }
    if (!window.recaptchaVerifier) {
      toast.error("Recaptcha not initialized. Please wait or refresh.");
      return;
    }

    setIsSendingOtp(true);
    try {
      // For testing, ensure phone number is in E.164 format e.g. +11234567890
      // You might need a phone input library for better UX and formatting
      const formattedPhoneNumber = phone.startsWith('+') ? phone : `+${phone}`; // Basic formatting

      const confirmation = await signInWithPhoneNumber(firebaseAuth, formattedPhoneNumber, window.recaptchaVerifier);
      setConfirmationResultState(confirmation);
      setOtpSent(true);
      toast.success("OTP sent successfully to your phone!");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast.error(`Failed to send OTP: ${error.message}`);
      // Reset reCAPTCHA for user to try again.
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().catch(err => console.error("Recaptcha re-render error:", err));
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    if (!confirmationResultState) {
      toast.error("OTP not sent yet or confirmation result is missing.");
      return;
    }
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await confirmationResultState.confirm(otp);
      // User successfully verified OTP with Firebase. Now mark as verified in backend.
      await markUserAsVerified(token); // Call your backend API

      setVerified(true);
      toast.success("Phone number verified successfully!");

      if (refetchUser) await refetchUser(); // Update user context

      // Use criticalUserType for navigation
      router.push(`/auth/onboarding/profile?type=${user?.user_type || queryUserType || 'individual'}`);

    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast.error(`Failed to verify OTP: ${error.message}`);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Loading and guard states
  if (isAuthLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading user data...</div>;
  }

  // Determine userType for page logic, defaulting if user context isn't fully ready or param is missing
  // Prefer user.user_type from context once loaded.
  const pageUserType = user?.user_type || queryUserType || 'individual';

  if (!user && !queryUserType) {
    // This condition means auth has loaded (isAuthLoading is false), user is null, and no query param as fallback.
    // This is an unlikely state if auth is required for this page, but as a safeguard:
    toast.error("User information not available. Redirecting to login.");
    if (typeof window !== 'undefined') { // Ensure router.push is only called client-side
        router.push('/auth/login');
    }
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
  }
  // For critical logic, always prefer user.user_type if available after loading
  const criticalUserType = user?.user_type || pageUserType;


  return (
    <div className="min-h-screen bg-brand-bg-light-gray py-8">
      <OnboardingStepper />
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-6">
          <button
            className={`flex items-center px-4 py-2 rounded-l-lg border border-gray-200 font-medium text-base ${method === 'email' ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => { setMethod('email'); setOtpSent(false); setVerified(false); setOtp(''); }}
          >
            <MailCheck className="w-5 h-5 mr-2" /> Email
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-r-lg border-t border-b border-r border-gray-200 font-medium text-base ${method === 'phone' ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => { setMethod('phone'); setOtpSent(false); setVerified(false); setOtp(''); }}
          >
            <Smartphone className="w-5 h-5 mr-2" /> Phone
          </button>
        </div>
        <h1 className="text-2xl font-bold text-brand-text-dark mb-4">Verify Your {method === 'email' ? 'Email' : 'Phone Number'}</h1>
      <p className="text-brand-text-medium mb-6">
          Enter your {method === 'email' ? 'email address' : 'phone number'} to receive a one-time password (OTP).
      </p>
        <form className="space-y-6" onSubmit={handleSendOtp}>
          {method === 'email' ? (
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mb-2"
              required
              disabled={otpSent || isSendingOtp}
            />
          ) : (
            <Input
              type="tel"
              placeholder="Enter your phone number (e.g., +14155552671)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="mb-2"
              required
              disabled={otpSent || isSendingOtp}
            />
          )}
          <div id="recaptcha-container" className="my-4 flex justify-center"></div>
          <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white font-medium" disabled={isSendingOtp || (otpSent && method === 'phone') }>
            {isSendingOtp ? 'Sending OTP...' : (otpSent ? 'Resend OTP' : 'Send OTP')}
          </Button>
        </form>

        {otpSent && !verified && method === 'phone' && (
          <div className="mt-8">
            <p className="mb-4 text-brand-text-medium">Enter the 6-digit OTP sent to your phone.</p>
            <InputOTP maxLength={6} value={otp} onChange={setOtp} className="mx-auto" containerClassName="justify-center mb-4" >
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <Button
              className="w-full bg-black hover:bg-gray-900 text-white font-medium mt-4"
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || isVerifyingOtp}
            >
              {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </div>
        )}

        {/* This part is for generic verified message, might need adjustment based on email/phone flow */}
        {verified && (
          <div className="mt-8">
            <p className="mb-4 text-green-700 font-medium">Your {method === 'email' ? 'email' : 'phone number'} has been verified!</p>
            <Button asChild className="w-full bg-black hover:bg-gray-900 text-white font-medium">
              <Link href={`/auth/onboarding/profile?type=${criticalUserType}`}>Continue</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
