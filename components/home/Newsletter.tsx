"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Check } from "lucide-react";

// Setup validation schema
const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type FormData = z.infer<typeof schema>;

export default function Newsletter() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log("Subscribing newsletter email:", data.email);
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSuccess(true);
    reset();
  };


  return (
    <section className="bg-white py-16 px-4 md:px-10 font-poppins">
      <div className="max-w-site mx-auto">
        <motion.div
          className="bg-lightGray rounded-[40px] border border-borderCustom p-8 md:p-12 xl:p-16 text-center max-w-4xl mx-auto relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="max-w-xl mx-auto space-y-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] text-textDark uppercase">
              Join the NKORA Family
            </h2>
            <p className="text-xs md:text-sm text-textDark/60 leading-relaxed font-sans">
              Subscribe to receive updates on new collections, exclusive parent discounts, and early access to sales.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-md mx-auto space-y-3"
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col sm:flex-row gap-3 relative">
                  <div className="relative flex-grow">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-textDark/30" />
                    <input
                      type="text"
                      placeholder="Your email address"
                      {...register("email")}
                      disabled={isSubmitting}
                      className="w-full bg-white border border-borderCustom focus:border-primary rounded-2xl pl-12 pr-4 py-3.5 text-xs font-poppins outline-none transition-colors disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-3.5 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 btn-glow-hover hover:scale-[1.02] disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "SUBSCRIBING..." : "SUBSCRIBE"}</span>
                    {!isSubmitting && <ArrowRight size={14} />}
                  </button>
                </div>

                {errors.email && (
                  <motion.p
                    className="text-left pl-4 text-[10px] text-red-500 font-semibold"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.form>
            ) : (
              <motion.div
                key="success"
                className="max-w-md mx-auto p-4 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center space-x-3 text-green-700"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shadow-sm">
                  <Check size={16} />
                </div>
                <div className="text-left font-sans text-xs">
                  <p className="font-bold">Subscription Successful!</p>
                  <p className="text-[10px] opacity-80">Welcome to the family. Check your inbox for updates.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Background designs */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-softPink/40 rounded-br-[60px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-blueAccent/10 rounded-tl-[60px] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
