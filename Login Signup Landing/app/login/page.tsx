"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { ChromeIcon, EyeIcon, EyeOffIcon } from "lucide-react" // Using ChromeIcon for Google
import { useState } from "react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-full max-w-6xl mx-auto rounded-2xl shadow-xl overflow-hidden border">
        {/* Left Side - Image and Text */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-[#FFFCF6] p-12">
          <Image
            src="/imagex.png"
            alt="Decorative Abstract Pattern"
            width={400}
            height={400}
            className="mb-10"
            priority
          />
          <h2 className="text-3xl font-black text-brand-text-dark text-left w-full mb-2" style={{fontFamily: 'Inter, sans-serif'}}>
              Where Connections Spark Opportunities
            </h2>
          <p className="text-lg text-brand-text-medium text-left w-full" style={{fontFamily: 'Inter, sans-serif'}}>
            Real roles. Real startups.
          </p>
        </div>
        {/* Right Side - Card */}
        <div className="w-1/2 flex flex-col justify-center bg-white p-12 min-h-full">
          <div className="mb-8 text-center">
            <span className="text-2xl font-black text-brand-text-dark" style={{fontFamily: 'Inter, sans-serif'}}>100</span>
            <span className="text-2xl font-black text-brand-blue ml-1" style={{fontFamily: 'Inter, sans-serif'}}>Networks</span>
          </div>
          <h1 className="text-4xl font-black text-brand-text-dark mb-8 text-center" style={{fontFamily: 'Inter, sans-serif'}}>Login</h1>
          <Button
            variant="outline"
            className="w-full mb-6 border-brand-border text-brand-text-dark hover:bg-brand-bg-light-gray font-medium py-4 text-lg shadow-sm"
          >
            <ChromeIcon className="mr-2 h-6 w-6 text-brand-red" />
            Sign in with Google
          </Button>
          <div className="flex items-center my-6">
            <hr className="flex-grow border-brand-border" />
            <span className="mx-4 text-base text-brand-text-medium font-medium">or Sign in with Mail</span>
            <hr className="flex-grow border-brand-border" />
          </div>
          <form className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-base font-semibold text-brand-text-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                className="mt-2 bg-brand-bg-input border-brand-border placeholder-brand-text-light focus:border-brand-blue focus:ring-1 focus:ring-brand-blue py-4 px-4 text-lg font-bold"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-base font-semibold text-brand-text-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  className="mt-2 bg-brand-bg-input border-brand-border placeholder-brand-text-light focus:border-brand-blue focus:ring-1 focus:ring-brand-blue py-4 px-4 text-lg font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-4 flex items-center text-brand-text-medium hover:text-brand-blue"
                >
                  {showPassword ? <EyeOffIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-black hover:bg-brand-text-dark text-white py-4 font-bold text-lg rounded-lg mt-2 shadow-md">
              Sign In
            </Button>
          </form>
          <div className="mt-8 text-center">
            <span className="text-base font-bold text-brand-text-dark">Don&apos;t have an account? </span>
            <Link href="/signup" className="font-bold text-brand-blue underline ml-1">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
