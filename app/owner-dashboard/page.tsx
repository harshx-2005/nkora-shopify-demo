"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, Search, CheckCircle, XCircle, FileText, Send, 
  Settings, Bell, Layers, ChevronRight, Eye, Clipboard, ArrowUpRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";

export default function OwnerDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [settings, setSettings] = useState<any>(null);
  
  // Dashboard fields editable inside detail view
  const [internalNotes, setInternalNotes] = useState("");
  const [courier, setCourier] = useState("");
  const [trackingNo, setTrackingNo] = useState("");
  const [estDelivery, setEstDelivery] = useState("");
  const [customStatus, setCustomStatus] = useState("");

  const [notificationTemplate, setNotificationTemplate] = useState<{ type: string; channel: string; content: string } | null>(null);
  const [invoicePlaceholder, setInvoicePlaceholder] = useState<any | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        if (data.orders) setOrders(data.orders);
      })
      .catch(err => console.error("Failed to load orders:", err));

    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(err => console.error("Failed to load settings:", err));
  };

  const handleSelectOrder = (order: any) => {
    setSelectedOrder(order);
    setInternalNotes(order.internalNotes || "");
    setCourier(order.courierPartner || "");
    setTrackingNo(order.trackingNumber || "");
    setEstDelivery(order.estimatedDelivery || "");
    setCustomStatus(order.status || "");
  };

  const handleUpdateNotes = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          internalNotes,
          courierPartner: courier,
          trackingNumber: trackingNo,
          estimatedDelivery: estDelivery,
          status: customStatus !== selectedOrder.status ? customStatus : undefined
        })
      });
      if (res.ok) {
        alert("Order details updated successfully!");
        fetchDashboardData();
        setSelectedOrder({
          ...selectedOrder,
          internalNotes,
          courierPartner: courier,
          trackingNumber: trackingNo,
          estimatedDelivery: estDelivery,
          status: customStatus
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyPayment = async (approve: boolean) => {
    if (!selectedOrder) return;
    const nextStatus = approve ? "Payment Verified" : "Payment Failed";
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: nextStatus,
          internalNotes: approve ? "Payment verified from bank statement." : "Payment verification failed."
        })
      });
      if (res.ok) {
        alert(`Payment verification updated: ${nextStatus}`);
        fetchDashboardData();
        setSelectedOrder(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Notification Generator
  const generateNotification = (channel: 'whatsapp' | 'email', type: string) => {
    if (!selectedOrder) return;
    let content = "";
    
    if (channel === 'whatsapp') {
      if (type === 'placed') {
        content = `Hi ${selectedOrder.customerName},\nYour NKORA order ${selectedOrder.orderNumber} of ${formatPrice(selectedOrder.total)} has been booked. Pay via manual bank transfer and upload screenshot here: https://nkora-kidswear.com/payment?orderNumber=${selectedOrder.orderNumber}`;
      } else if (type === 'verified') {
        content = `Hi ${selectedOrder.customerName},\nWe have successfully verified your payment of ${formatPrice(selectedOrder.total)} for order ${selectedOrder.orderNumber}. Your order is currently being prepared for dispatch!`;
      } else if (type === 'shipped') {
        content = `Hi ${selectedOrder.customerName},\nYour NKORA order ${selectedOrder.orderNumber} has been shipped via ${selectedOrder.courierPartner || 'Courier'}! Tracking Number: ${selectedOrder.trackingNumber || 'N/A'}. Track live: https://nkora-kidswear.com/track?orderNumber=${selectedOrder.orderNumber}`;
      }
    } else {
      if (type === 'placed') {
        content = `To: ${selectedOrder.email}\nSubject: Order Booked - NKORA KidsWear\n\nDear ${selectedOrder.customerName},\n\nWe have booked order ${selectedOrder.orderNumber}. Please make a transfer of ${formatPrice(selectedOrder.total)} to our bank details and upload receipt here: https://nkora-kidswear.com/payment`;
      } else if (type === 'verified') {
        content = `To: ${selectedOrder.email}\nSubject: Payment Verified - NKORA KidsWear\n\nDear ${selectedOrder.customerName},\n\nYour payment for order ${selectedOrder.orderNumber} has been verified. We are preparing your order for shipment.`;
      }
    }
    
    setNotificationTemplate({ type, channel, content });
  };

  // Invoice generator
  const triggerInvoice = () => {
    if (!selectedOrder) return;
    setInvoicePlaceholder({
      company: "NKORA KidsWear Pvt Ltd",
      address: "Park Street, Kolkata, West Bengal - 700016",
      gst: "19AAACN8491K1ZP",
      invoiceNo: `INV-${selectedOrder.orderNumber.substring(3)}-2026`,
      order: selectedOrder
    });
  };

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.customerName.toLowerCase().includes(search.toLowerCase()) || 
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (o.paymentDetails?.utr && o.paymentDetails.utr.includes(search));
      
    if (statusFilter === "all") return matchesSearch;
    return o.status === statusFilter && matchesSearch;
  });

  return (
    <div className="bg-[#FAF8F5] min-h-screen font-poppins text-textDark">
      {/* Dashboard Top bar */}
      <div className="bg-white border-b border-borderCustom px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-base font-bold uppercase tracking-widest text-textDark flex items-center gap-2">
            <Layers size={18} className="text-primary" />
            <span>Store Manager Console</span>
          </h1>
          <p className="text-[10px] text-textDark/50">
            Headless Shopify Manual Payment & Fulfillment Desk
          </p>
        </div>
        
        <div className="flex items-center space-x-3 text-xs">
          <Link href="/owner-dashboard/settings" className="border border-borderCustom rounded-xl p-2.5 hover:bg-lightGray/40 transition-all flex items-center space-x-1">
            <Settings size={14} />
            <span className="hidden sm:inline">Settings</span>
          </Link>
          <Link href="/owner-dashboard/notifications" className="border border-borderCustom rounded-xl p-2.5 hover:bg-lightGray/40 transition-all flex items-center space-x-1">
            <Bell size={14} />
            <span className="hidden sm:inline">Templates</span>
          </Link>
        </div>
      </div>

      {/* Grid Dashboard Body */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Orders List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-borderCustom rounded-[32px] p-6 shadow-xs space-y-6">
            
            {/* Filters panel */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-3.5 text-textDark/30" size={14} />
                <input
                  type="text"
                  placeholder="Search customer, order, UTR..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-lightGray/40 border border-borderCustom rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto py-1">
                <span className="text-[10px] uppercase font-bold text-textDark/40 tracking-wider">Filter:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-lightGray/40 border border-borderCustom rounded-xl px-3 py-2 text-xs outline-none font-sans"
                >
                  <option value="all">All Orders</option>
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Payment Under Verification">Under Verification</option>
                  <option value="Payment Verified">Payment Verified</option>
                  <option value="Preparing Order">Preparing Order</option>
                  <option value="Packed">Packed</option>
                  <option value="Picked Up">Picked Up</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="border-b border-borderCustom text-[10px] uppercase text-textDark/40 tracking-wider font-bold">
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderCustom/50">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-textDark/40">
                        No orders match the current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className={`hover:bg-lightGray/20 transition-colors ${selectedOrder?.id === order.id ? 'bg-lightGray/35' : ''}`}>
                        <td className="px-6 py-4.5 font-bold font-poppins">{order.orderNumber}</td>
                        <td className="px-6 py-4.5 text-textDark/70">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4.5">
                          <p className="font-bold text-textDark">{order.customerName}</p>
                          <p className="text-[10px] text-textDark/50">{order.mobile}</p>
                        </td>
                        <td className="px-6 py-4.5 font-mono font-bold text-primary">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            order.status === 'Pending Payment' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            order.status === 'Payment Under Verification' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            order.status === 'Payment Verified' ? 'bg-green-50 text-green-600 border border-green-100' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {order.status === 'Payment Under Verification' ? 'Verification' : order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          <button
                            onClick={() => handleSelectOrder(order)}
                            className="bg-primary hover:bg-primary-hover text-white text-[10px] font-bold uppercase px-3 py-2 rounded-lg transition-all inline-flex items-center space-x-1"
                          >
                            <span>Manage</span>
                            <Eye size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* Right Side: Order details manager */}
        <div className="lg:col-span-4">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="bg-white border border-borderCustom rounded-[32px] p-6 shadow-xs space-y-6"
              >
                <div className="flex justify-between items-center border-b border-borderCustom pb-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-primary tracking-widest">Fulfillment Desk</span>
                    <h3 className="text-sm font-bold uppercase tracking-wider font-poppins">{selectedOrder.orderNumber}</h3>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-xs text-textDark/40 hover:text-red-500 transition-colors">
                    Close
                  </button>
                </div>

                {/* Verification Action Box (if awaiting validation) */}
                {selectedOrder.status === "Payment Under Verification" && (
                  <div className="bg-[#FAF5F0] border border-primary/20 rounded-2xl p-4 space-y-4">
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-textDark uppercase tracking-wider text-[10px]">Payment Verification Checklist</h4>
                      <p className="text-textDark/60 leading-relaxed font-sans">
                        Check UTR against bank entries:
                      </p>
                      <div className="bg-white p-3 rounded-xl border border-borderCustom text-[11px] space-y-2 mt-2 font-mono">
                        <p><strong>Holder:</strong> {selectedOrder.paymentDetails?.senderName}</p>
                        <p><strong>UTR:</strong> {selectedOrder.paymentDetails?.utr || "N/A"}</p>
                        <p><strong>Txn ID:</strong> {selectedOrder.paymentDetails?.transactionId || "N/A"}</p>
                        <p><strong>Amount:</strong> {formatPrice(selectedOrder.total)}</p>
                      </div>
                    </div>

                    {/* Screenshot view */}
                    {selectedOrder.paymentDetails?.screenshotUrl && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">Receipt Screenshot</span>
                        <a 
                          href={selectedOrder.paymentDetails.screenshotUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="relative block h-40 border border-borderCustom rounded-xl overflow-hidden group cursor-pointer"
                        >
                          <img 
                            src={selectedOrder.paymentDetails.screenshotUrl} 
                            alt="Screenshot receipt"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                            View Fullscreen <ArrowUpRight size={14} className="ml-1" />
                          </div>
                        </a>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleVerifyPayment(true)}
                        className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold uppercase py-2.5 rounded-xl transition-all inline-flex items-center justify-center space-x-1"
                      >
                        <CheckCircle size={13} />
                        <span>Approve</span>
                      </button>
                      
                      <button
                        onClick={() => handleVerifyPayment(false)}
                        className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase py-2.5 rounded-xl transition-all inline-flex items-center justify-center space-x-1"
                      >
                        <XCircle size={13} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit Form */}
                <div className="space-y-4 font-sans text-xs">
                  {/* Status update */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider font-poppins">Order Status</label>
                    <select
                      value={customStatus}
                      onChange={(e) => setCustomStatus(e.target.value)}
                      className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-3 py-2.5 text-xs outline-none"
                    >
                      <option value="Pending Payment">Pending Payment</option>
                      <option value="Payment Under Verification">Payment Under Verification</option>
                      <option value="Payment Verified">Payment Verified</option>
                      <option value="Preparing Order">Preparing Order</option>
                      <option value="Packed">Packed</option>
                      <option value="Picked Up">Picked Up</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Payment Failed">Payment Failed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Courier Partner */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider font-poppins">Courier Partner</label>
                    <select
                      value={courier}
                      onChange={(e) => setCourier(e.target.value)}
                      className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-3 py-2.5 text-xs outline-none"
                    >
                      <option value="">Select Courier</option>
                      {settings?.couriers?.map((c: string) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tracking Number */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider font-poppins">Tracking Number</label>
                    <input
                      type="text"
                      placeholder="Enter AWID / Airway tracking code"
                      value={trackingNo}
                      onChange={(e) => setTrackingNo(e.target.value)}
                      className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2.5 text-xs outline-none"
                    />
                  </div>

                  {/* Est Delivery */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider font-poppins">Estimated Delivery Date</label>
                    <input
                      type="date"
                      value={estDelivery}
                      onChange={(e) => setEstDelivery(e.target.value)}
                      className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2.5 text-xs outline-none"
                    />
                  </div>

                  {/* Internal notes */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider font-poppins">Internal Notes</label>
                    <textarea
                      rows={2}
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      placeholder="Add administrative notes regarding verification or issues..."
                      className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2 text-xs outline-none resize-none"
                    />
                  </div>

                  <button
                    onClick={handleUpdateNotes}
                    className="w-full bg-primary hover:bg-primary-hover text-white text-[10px] tracking-widest font-bold uppercase py-3.5 rounded-xl transition-all"
                  >
                    Save Dashboard Settings
                  </button>
                </div>

                {/* Invoicing and update buttons */}
                <div className="border-t border-borderCustom/60 pt-4 space-y-3 font-sans text-xs">
                  <span className="text-[9px] uppercase font-bold text-textDark/40 tracking-wider font-poppins">Actions Panel</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={triggerInvoice}
                      className="border border-borderCustom hover:bg-lightGray/45 text-textDark font-bold uppercase py-2 px-3 rounded-xl transition-all inline-flex items-center justify-center space-x-1.5"
                    >
                      <FileText size={12} />
                      <span>Invoice</span>
                    </button>
                    
                    <button
                      onClick={() => generateNotification('whatsapp', 'shipped')}
                      className="border border-borderCustom hover:bg-lightGray/45 text-textDark font-bold uppercase py-2 px-3 rounded-xl transition-all inline-flex items-center justify-center space-x-1.5"
                    >
                      <Send size={12} className="text-green-500" />
                      <span>WhatsApp</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => generateNotification('email', 'placed')}
                      className="border border-borderCustom hover:bg-lightGray/45 text-textDark font-bold uppercase py-2 px-3 rounded-xl transition-all inline-flex items-center justify-center space-x-1.5 text-[10px]"
                    >
                      <span>Email Pay Alert</span>
                    </button>
                    
                    <button
                      onClick={() => generateNotification('email', 'verified')}
                      className="border border-borderCustom hover:bg-lightGray/45 text-textDark font-bold uppercase py-2 px-3 rounded-xl transition-all inline-flex items-center justify-center space-x-1.5 text-[10px]"
                    >
                      <span>Email Clear Alert</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="bg-white border border-borderCustom rounded-[32px] p-8 shadow-xs text-center space-y-4 min-h-[300px] flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-lightGray rounded-full flex items-center justify-center text-textDark/30">
                  <Clipboard size={22} />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-widest uppercase">
                    Select an Order
                  </h3>
                  <p className="text-[10px] text-textDark/50 max-w-xs leading-relaxed font-sans mt-0.5">
                    Click the manage button next to any order to update verifications, courier details, and notes.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* MODAL: Notification Preview */}
      <AnimatePresence>
        {notificationTemplate && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white border border-borderCustom rounded-[28px] max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-borderCustom pb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-textDark font-poppins">
                  Mock Notification Output
                </h4>
                <button 
                  onClick={() => setNotificationTemplate(null)} 
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Close
                </button>
              </div>

              <div className="space-y-1 bg-[#FAF5F0] p-4 rounded-xl text-xs font-mono break-words leading-relaxed whitespace-pre-wrap">
                {notificationTemplate.content}
              </div>

              <p className="text-[10px] text-textDark/50">
                💡 In a live production configuration, this event automatically triggers the WhatsApp Business API or SendGrid to dispatch custom notifications.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Invoice Preview */}
      <AnimatePresence>
        {invoicePlaceholder && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white border border-borderCustom rounded-[32px] max-w-lg w-full p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-borderCustom pb-4">
                <div>
                  <h3 className="text-base font-bold text-textDark uppercase tracking-wider font-poppins">{invoicePlaceholder.company}</h3>
                  <p className="text-[10px] text-textDark/60 leading-normal">{invoicePlaceholder.address}</p>
                  <p className="text-[10px] text-textDark/60">GST: {invoicePlaceholder.gst}</p>
                </div>
                <button 
                  onClick={() => setInvoicePlaceholder(null)} 
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-textDark/50 uppercase font-bold text-[9px] tracking-wider">Bill To:</p>
                  <p className="font-bold text-textDark mt-1">{invoicePlaceholder.order.customerName}</p>
                  <p className="text-textDark/70 mt-0.5 leading-normal">{invoicePlaceholder.order.address}</p>
                  <p className="text-textDark/70">{invoicePlaceholder.order.city}, {invoicePlaceholder.order.state} - {invoicePlaceholder.order.pincode}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-textDark/50 uppercase font-bold text-[9px] tracking-wider">Invoice Details:</p>
                  <p className="font-bold text-textDark mt-1">Invoice: {invoicePlaceholder.invoiceNo}</p>
                  <p className="text-textDark/70 mt-0.5">Date: {new Date(invoicePlaceholder.order.createdAt).toLocaleDateString()}</p>
                  <p className="text-textDark/70">Payment: Manual {invoicePlaceholder.order.paymentDetails?.method || "UPI"}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-borderCustom rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF5F0] border-b border-borderCustom font-bold text-[9px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Product Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borderCustom/50">
                    {invoicePlaceholder.order.items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="p-3 font-semibold text-textDark">{item.title} <span className="text-[10px] text-textDark/50 font-normal uppercase">({item.variantTitle})</span></td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right font-mono">{formatPrice(item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-xs space-y-2 border-t border-borderCustom pt-4 max-w-xs ml-auto">
                <div className="flex justify-between text-textDark/70">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPrice(invoicePlaceholder.order.subtotal)}</span>
                </div>
                {invoicePlaceholder.order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-mono">-{formatPrice(invoicePlaceholder.order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-textDark/70">
                  <span>Shipping</span>
                  <span className="font-mono">{invoicePlaceholder.order.shipping === 0 ? "FREE" : formatPrice(invoicePlaceholder.order.shipping)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-borderCustom pt-2 text-sm">
                  <span>Total invoice</span>
                  <span className="font-mono text-primary">{formatPrice(invoicePlaceholder.order.total)}</span>
                </div>
              </div>

              <div className="border-t border-borderCustom pt-4 text-center">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="bg-primary hover:bg-primary-hover text-white text-[10px] font-bold uppercase py-2.5 px-6 rounded-xl transition-all"
                >
                  Print PDF Invoice
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
