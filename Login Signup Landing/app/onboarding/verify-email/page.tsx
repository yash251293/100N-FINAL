"use client"

import { OnboardingStepper } from "@/components/onboarding-stepper"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MailCheck, Smartphone } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useSearchParams } from "next/navigation"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') || 'individual'
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [verified, setVerified] = useState(false)

  return (
    <div className="min-h-screen bg-brand-bg-light-gray py-8">
      <OnboardingStepper />
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-6">
          <button
            className={`flex items-center px-4 py-2 rounded-l-lg border border-gray-200 font-medium text-base ${method === 'email' ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => setMethod('email')}
          >
            <MailCheck className="w-5 h-5 mr-2" /> Email
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-r-lg border-t border-b border-r border-gray-200 font-medium text-base ${method === 'phone' ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => setMethod('phone')}
          >
            <Smartphone className="w-5 h-5 mr-2" /> Phone
          </button>
        </div>
        <h1 className="text-2xl font-bold text-brand-text-dark mb-4">Verify Your {method === 'email' ? 'Email' : 'Phone Number'}</h1>
      <p className="text-brand-text-medium mb-6">
          Enter your {method === 'email' ? 'email address' : 'phone number'} to receive a one-time password (OTP).
      </p>
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); setOtpSent(true); }}>
          {method === 'email' ? (
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mb-2"
              required
            />
          ) : (
            <Input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="mb-2"
              required
            />
          )}
          <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white font-medium">
            {otpSent ? 'Resend OTP' : 'Send OTP'}
        </Button>
        </form>
        {otpSent && !verified && (
          <div className="mt-8">
            <p className="mb-4 text-brand-text-medium">Enter the 6-digit OTP sent to your {method === 'email' ? 'email' : 'phone'}.</p>
            <InputOTP maxLength={6} value={otp} onChange={setOtp} className="mx-auto" containerClassName="justify-center mb-4" >
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
        <Button
              className="w-full bg-black hover:bg-gray-900 text-white font-medium mt-4"
              onClick={() => setVerified(true)}
              disabled={otp.length !== 6}
            >
              Verify OTP
            </Button>
          </div>
        )}
        {verified && (
          <div className="mt-8">
            <p className="mb-4 text-green-700 font-medium">Your {method === 'email' ? 'email' : 'phone number'} has been verified!</p>
            <Button asChild className="w-full bg-black hover:bg-gray-900 text-white font-medium">
              <Link href={`/onboarding/profile?type=${userType}`}>Continue</Link>
        </Button>
          </div>
        )}
      </div>
    </div>
  )
}
