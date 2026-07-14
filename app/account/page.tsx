import React from "react";
import { MapPin, Package, Star, Calendar } from "lucide-react";
import { formatPrice } from "@/lib/utils";


export default function AccountPage() {
  const mockOrders = [
    {
      id: "#NK-94821",
      date: "May 14, 2026",
      status: "Delivered",
      total: 3158,
      items: "Girls Floral Layered Tulle Dress (Pink / 4Y) x 1, Bow Tie Suspender Set x 1",
    },
    {
      id: "#NK-92144",
      date: "April 02, 2026",
      status: "Delivered",
      total: 1299,
      items: "Cotton Frock (One Size) x 1",
    },
  ];

  return (
    <div className="bg-white min-h-screen py-10 px-4 md:px-10 font-poppins">
      <div className="max-w-site mx-auto">
        <h1 className="text-2xl font-light tracking-[0.15em] text-textDark uppercase mb-8 pb-3 border-b border-borderCustom">
          My Account
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Card & Address */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Overview */}
            <div className="bg-lightGray/40 border border-borderCustom rounded-[32px] p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-softPink text-primary flex items-center justify-center font-bold text-lg shadow-sm">
                  MD
                </div>
                <div>
                  <h2 className="text-sm font-bold text-textDark">Mahesh Dutt</h2>
                  <p className="text-[10px] text-textDark/50 font-sans">mahesh.dutt@example.com</p>
                </div>
              </div>
              <div className="flex justify-between items-center bg-white border border-borderCustom/60 rounded-xl p-3.5 text-xs text-textDark/80">
                <span className="flex items-center space-x-1.5 font-medium">
                  <Star size={13} className="text-primary animate-pulse" />
                  <span>Star Parent Status</span>
                </span>
                <span className="font-bold text-primary font-mono">150 Pts</span>
              </div>
            </div>

            {/* Address */}
            <div className="bg-lightGray/40 border border-borderCustom rounded-[32px] p-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-borderCustom pb-3">
                <MapPin size={15} className="text-primary" />
                <h3 className="text-xs font-bold text-textDark uppercase tracking-wider">
                  Default Shipping Address
                </h3>
              </div>
              <div className="text-xs text-textDark/70 font-sans leading-relaxed space-y-1">
                <p className="font-bold text-textDark">Mahesh Dutt</p>
                <p>Flat 4B, Sunflower Apartments</p>
                <p>12/1 Gariahat Road, Ballygunge</p>
                <p className="font-bold text-textDark">Kolkata - 700019</p>
                <p>West Bengal, India</p>
                <p className="pt-2 text-[10px] text-textDark/40">Phone: +91 98765 43210</p>
              </div>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-8 bg-lightGray/40 border border-borderCustom rounded-[32px] p-6 md:p-8 space-y-6">
            <div className="flex items-center space-x-2 border-b border-borderCustom pb-3">
              <Package size={16} className="text-primary" />
              <h3 className="text-xs font-bold text-textDark uppercase tracking-wider">
                Order History
              </h3>
            </div>

            {mockOrders.length === 0 ? (
              <p className="text-xs text-textDark/50 font-sans">
                You haven&apos;t placed any orders yet.
              </p>
            ) : (
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-borderCustom rounded-2xl p-5 space-y-3 shadow-xs hover:border-primary transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-borderCustom/60 pb-3 gap-2">
                      <div>
                        <span className="text-xs font-bold text-textDark font-mono">
                          {order.id}
                        </span>
                        <div className="flex items-center space-x-1 text-[10px] text-textDark/40 font-sans mt-0.5">
                          <Calendar size={10} />
                          <span>Placed on {order.date}</span>
                        </div>
                      </div>
                      <span className="bg-green-50 border border-green-200 text-green-700 text-[9px] font-bold tracking-wider uppercase py-1 px-3 rounded-full">
                        {order.status}
                      </span>
                    </div>

                    <div className="text-xs text-textDark/70 font-sans leading-relaxed">
                      <span className="font-semibold text-textDark block mb-0.5">Items:</span>
                      {order.items}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-borderCustom/40 text-xs">
                      <span className="text-textDark/50">Total Paid</span>
                      <span className="font-bold text-primary font-mono text-sm">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
