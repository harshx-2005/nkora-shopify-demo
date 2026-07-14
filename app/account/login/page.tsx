"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useCustomer } from "@/context/CustomerContext";

// Form Validation Schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFields = z.infer<typeof loginSchema>;
type RegisterFields = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  
  const { isLoggedIn, login, register } = useCustomer();
  const router = useRouter();

  // Redirect to account if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/account");
    }
  }, [isLoggedIn, router]);

  // Forms Setup
  const {
    register: loginReg,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm,
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerReg,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegisterForm,
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = async (data: LoginFields) => {
    setActionLoading(true);
    setFormError(null);
    setSuccessMsg(null);
    
    const result = await login(data.email, data.password);
    
    if (result.success) {
      setSuccessMsg("Success! Accessing your account...");
      setTimeout(() => {
        router.push("/account");
      }, 1000);
    } else {
      setFormError(result.error || "Login failed. Please check your credentials.");
      setActionLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFields) => {
    setActionLoading(true);
    setFormError(null);
    setSuccessMsg(null);
    
    const result = await register(data.email, data.password, data.firstName, data.lastName);
    
    if (result.success) {
      setSuccessMsg("Account created! Logging you in...");
      setTimeout(() => {
        router.push("/account");
      }, 1200);
    } else {
      setFormError(result.error || "Registration failed. Email might already exist.");
      setActionLoading(false);
    }
  };

  const toggleTab = (tab: "login" | "register") => {
    setActiveTab(tab);
    setFormError(null);
    setSuccessMsg(null);
    resetLoginForm();
    resetRegisterForm();
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
            Kidswear Elite
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border border-borderCustom rounded-2xl p-1 mb-8 bg-lightGray/40 relative">
          <button
            onClick={() => toggleTab("login")}
            className="flex-1 text-center py-3 text-xs tracking-wider font-bold uppercase rounded-xl transition-all duration-300 relative z-10"
            style={{ color: activeTab === "login" ? "#FFFFFF" : "#333333" }}
          >
            Sign In
          </button>
          <button
            onClick={() => toggleTab("register")}
            className="flex-1 text-center py-3 text-xs tracking-wider font-bold uppercase rounded-xl transition-all duration-300 relative z-10"
            style={{ color: activeTab === "register" ? "#FFFFFF" : "#333333" }}
          >
            Create Account
          </button>

          {/* Sliding active tab indicator */}
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute top-1 bottom-1 left-1 bg-primary rounded-xl -z-0"
            style={{
              width: "calc(50% - 4px)",
              left: activeTab === "login" ? "4px" : "calc(50%)",
            }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        </div>

        {/* Alert Messages */}
        <AnimatePresence mode="wait">
          {formError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-xs"
            >
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{formError}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl mb-6 text-xs"
            >
              <CheckCircle2 size={15} className="flex-shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Forms */}
        <AnimatePresence mode="wait">
          {activeTab === "login" ? (
            <motion.form
              key="login-form"
              onSubmit={handleLoginSubmit(onLoginSubmit)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-textDark uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textDark/30" size={16} />
                  <input
                    type="email"
                    disabled={actionLoading}
                    placeholder="Enter your email"
                    className="w-full bg-lightGray/30 border border-borderCustom focus:border-primary rounded-2xl py-3.5 pl-12 pr-4 text-xs text-textDark focus:outline-none transition-all"
                    {...loginReg("email")}
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-[10px] text-red-600 font-sans mt-0.5">{loginErrors.email.message}</p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-textDark uppercase tracking-wider block">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textDark/30" size={16} />
                  <input
                    type="password"
                    disabled={actionLoading}
                    placeholder="Enter your password"
                    className="w-full bg-lightGray/30 border border-borderCustom focus:border-primary rounded-2xl py-3.5 pl-12 pr-4 text-xs text-textDark focus:outline-none transition-all"
                    {...loginReg("password")}
                  />
                </div>
                {loginErrors.password && (
                  <p className="text-[10px] text-red-600 font-sans mt-0.5">{loginErrors.password.message}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 mt-2"
              >
                {actionLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="register-form"
              onSubmit={handleRegisterSubmit(onRegisterSubmit)}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Names row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-textDark uppercase tracking-wider block">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-textDark/30" size={14} />
                    <input
                      type="text"
                      disabled={actionLoading}
                      placeholder="First name"
                      className="w-full bg-lightGray/30 border border-borderCustom focus:border-primary rounded-2xl py-3.5 pl-11 pr-4 text-xs text-textDark focus:outline-none transition-all"
                      {...registerReg("firstName")}
                    />
                  </div>
                  {registerErrors.firstName && (
                    <p className="text-[10px] text-red-600 font-sans mt-0.5">{registerErrors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-textDark uppercase tracking-wider block">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-textDark/30" size={14} />
                    <input
                      type="text"
                      disabled={actionLoading}
                      placeholder="Last name"
                      className="w-full bg-lightGray/30 border border-borderCustom focus:border-primary rounded-2xl py-3.5 pl-11 pr-4 text-xs text-textDark focus:outline-none transition-all"
                      {...registerReg("lastName")}
                    />
                  </div>
                  {registerErrors.lastName && (
                    <p className="text-[10px] text-red-600 font-sans mt-0.5">{registerErrors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-textDark uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textDark/30" size={16} />
                  <input
                    type="email"
                    disabled={actionLoading}
                    placeholder="Enter email address"
                    className="w-full bg-lightGray/30 border border-borderCustom focus:border-primary rounded-2xl py-3.5 pl-12 pr-4 text-xs text-textDark focus:outline-none transition-all"
                    {...registerReg("email")}
                  />
                </div>
                {registerErrors.email && (
                  <p className="text-[10px] text-red-600 font-sans mt-0.5">{registerErrors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-textDark uppercase tracking-wider block">
                  Password (6+ chars)
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textDark/30" size={16} />
                  <input
                    type="password"
                    disabled={actionLoading}
                    placeholder="Create a password"
                    className="w-full bg-lightGray/30 border border-borderCustom focus:border-primary rounded-2xl py-3.5 pl-12 pr-4 text-xs text-textDark focus:outline-none transition-all"
                    {...registerReg("password")}
                  />
                </div>
                {registerErrors.password && (
                  <p className="text-[10px] text-red-600 font-sans mt-0.5">{registerErrors.password.message}</p>
                )}
              </div>

              {/* Terms and Submit */}
              <p className="text-[10px] text-textDark/40 font-sans leading-relaxed text-center py-2 px-1">
                By creating an account, you agree to our Terms of Use and Customer Data Privacy Policy.
              </p>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {actionLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
