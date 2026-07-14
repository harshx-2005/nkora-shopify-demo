"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  loginCustomer, 
  registerCustomer, 
  logoutCustomer, 
  getCustomerProfile 
} from "@/lib/shopify/client";

interface CustomerContextType {
  isLoggedIn: boolean;
  customer: any | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customer, setCustomer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (token: string) => {
    try {
      const profile = await getCustomerProfile(token);
      if (profile) {
        setCustomer(profile);
        setIsLoggedIn(true);
      } else {
        // Token invalid or expired
        localStorage.removeItem("nkora_customer_token");
        setIsLoggedIn(false);
        setCustomer(null);
      }
    } catch (err) {
      console.error("Failed to load customer profile:", err);
      setIsLoggedIn(false);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("nkora_customer_token");
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const result = await loginCustomer({ email, password });
      
      if (result?.customerAccessToken) {
        const token = result.customerAccessToken.accessToken;
        localStorage.setItem("nkora_customer_token", token);
        await fetchProfile(token);
        return { success: true };
      } else {
        const errMsg = result?.customerUserErrors?.[0]?.message || "Invalid credentials. Please check your email and password.";
        setError(errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err) {
      const errMsg = "Login failed. Please try again.";
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setError(null);
    try {
      const result = await registerCustomer({ email, password, firstName, lastName });
      
      if (result?.customer) {
        // Registration success. Automatically log the user in!
        return await login(email, password);
      } else {
        const errMsg = result?.customerUserErrors?.[0]?.message || "Registration failed. Try using another email address.";
        setError(errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err) {
      const errMsg = "Registration failed. Please try again.";
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("nkora_customer_token");
    if (token) {
      try {
        await logoutCustomer(token);
      } catch (err) {
        console.error("Failed to call logout mutation on Shopify:", err);
      }
    }
    localStorage.removeItem("nkora_customer_token");
    setIsLoggedIn(false);
    setCustomer(null);
  };

  const refreshProfile = async () => {
    const token = localStorage.getItem("nkora_customer_token");
    if (token) {
      setLoading(true);
      await fetchProfile(token);
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        isLoggedIn,
        customer,
        loading,
        error,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
}
