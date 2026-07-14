"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Loader2, Star, ShoppingBag, Info } from "lucide-react";
import { useCustomer } from "@/context/CustomerContext";

// Inner login content that uses useSearchParams
function LoginContent() {
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { isLoggedIn, login } = useCustomer();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/account");
    }
  }, [isLoggedIn, router]);

  // Check for errors in the search params
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "localstorage_blocked") {
      setErrorMsg("Your browser blocked writing the authentication cookie. Please check cookie settings.");
    }
  }, [searchParams]);

  // Redirects to Next.js API OAuth endpoint
  const handleShopifyAuth = () => {
    setLoadingLocal(true);
    setErrorMsg(null);
    window.location.href = "/api/auth/login";
  };

  // Mock login bypass for client design previews
  const handleSandboxBypass = async () => {
    setLoadingLocal(true);
    setErrorMsg(null);
    const result = await login("client@nkorakids.com", "bypass");
    if (result.success) {
      router.push("/account");
    } else {
      setErrorMsg("Failed to open sandbox account.");
      setLoadingLocal(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-poppins">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-xs text-textDark/60 tracking-wider">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-softPink/20 via-white to-lightGray/30 flex items-center justify-center py-16 px-4 font-poppins relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-softPink/20 filter blur-3xl -z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/5 filter blur-3xl -z-10 animate-pulse duration-[8000ms]" />

      <div className="w-full max-w-md bg-white border border-borderCustom rounded-[36px] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.06)] relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light tracking-[0.25em] text-textDark uppercase">
            NKORA
          </h1>
          <p className="text-[10px] tracking-widest text-primary uppercase font-bold mt-1">
            Customer Portal
          </p>
        </div>

        {/* Error Callout */}
        {errorMsg && (
          <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-xs">
            <Info size={15} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Informational Cards on Accounts */}
        <div className="space-y-6">
          <div className="bg-lightGray/40 border border-borderCustom rounded-2xl p-5 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-softPink/60 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShoppingBag size={14} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-textDark uppercase tracking-wider">NKORA Elite Members</h3>
                <p className="text-[11px] text-textDark/60 leading-relaxed mt-1">
                  Authenticate securely to trace shipping packages, log past transactions, and manage default checkout locations.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 border-t border-borderCustom/60 pt-4">
              <div className="w-8 h-8 rounded-full bg-softPink/60 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Star size={14} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-textDark uppercase tracking-wider">Passwordless Sign In</h3>
                <p className="text-[11px] text-textDark/60 leading-relaxed mt-1">
                  No passwords to remember. Shopify sends a secure one-time passcode to your email instantly to grant access.
                </p>
              </div>
            </div>
          </div>

          {/* Core Action Button */}
          <button
            onClick={handleShopifyAuth}
            disabled={loadingLocal}
            className="w-full bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {loadingLocal ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <span>Sign In / Create Account</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>

          {/* Secure disclaimer */}
          <div className="flex items-center justify-center space-x-1.5 text-[9px] text-textDark/40">
            <ShieldCheck size={11} className="text-green-600" />
            <span>Authorized securely via Shopify Customer Accounts service.</span>
          </div>

          <div className="border-t border-borderCustom/60 pt-6 mt-4 text-center">
            <button
              onClick={handleSandboxBypass}
              disabled={loadingLocal}
              className="text-[10px] text-primary hover:text-primary-hover tracking-wider font-bold uppercase underline underline-offset-4 transition-colors"
            >
              Demoing? Sign in to Sandbox Mock Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default export wrapped in a Suspense boundary to satisfy Next.js static prerendering
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white font-poppins">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-xs text-textDark/60 tracking-wider">Loading login portal...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
