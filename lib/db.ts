import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "lib", "db.json");

export interface OrderItem {
  title: string;
  quantity: number;
  price: number;
  image: string;
  variantTitle: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 
    | "Pending Payment"
    | "Payment Under Verification"
    | "Payment Verified"
    | "Preparing Order"
    | "Packed"
    | "Picked Up"
    | "In Transit"
    | "Out For Delivery"
    | "Delivered"
    | "Payment Failed"
    | "Cancelled"
    | "Returned";
  customerName: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  createdAt: string;
  // Payment Details
  paymentDetails?: {
    utr: string;
    transactionId: string;
    method: string;
    senderName: string;
    date: string;
    time: string;
    screenshotUrl?: string;
    notes?: string;
    submittedAt: string;
  };
  // Internal Notes
  internalNotes?: string;
  // Shipping details
  courierPartner?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  statusHistory?: { status: string; timestamp: string }[];
  shopifyDraftOrderId?: string;
  shopifyDraftOrderName?: string;
}

export interface AdminSettings {
  qrCodeUrl: string;
  upiId: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branch: string;
  supportNumber: string;
  whatsappNumber: string;
  couriers: string[];
  shippingFee: number;
  freeShippingThreshold: number;
}

const DEFAULT_SETTINGS: AdminSettings = {
  qrCodeUrl: "/uploads/harsh-qr.jpg",
  upiId: "theharshkshirsagar-1@oksbi",
  accountName: "Harsh Kshirsagar",
  accountNumber: "923020054321098",
  ifscCode: "UTIB0000005",
  bankName: "Axis Bank",
  branch: "Kolkata Main Branch",
  supportNumber: "+91 9876543210",
  whatsappNumber: "+91 9876543210",
  couriers: ["Blue Dart", "Delhivery", "DTDC", "Xpressbees", "Shadowfax"],
  shippingFee: 99,
  freeShippingThreshold: 1999
};

// Initial mock orders to pre-populate the dashboard beautifully
const INITIAL_ORDERS: Order[] = [
  {
    id: "ord_1",
    orderNumber: "NK-1051",
    status: "Payment Verified",
    customerName: "Priya Sharma",
    email: "priya.sharma@example.com",
    mobile: "9876543210",
    address: "Flat 4A, Orchid Towers, EM Bypass",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700105",
    items: [
      {
        title: "Organic Cotton Bodysuit",
        quantity: 2,
        price: 899,
        image: "https://cdn.shopify.com/s/files/1/1010/6388/5166/files/OrganicBambooSummerPajamaSet-Clementine-2-3T_1.jpg?v=1784068556",
        variantTitle: "3Y / Peach"
      }
    ],
    subtotal: 1798,
    shipping: 150,
    discount: 90,
    total: 1858,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    paymentDetails: {
      utr: "938201948201",
      transactionId: "TXN8492048204",
      method: "UPI",
      senderName: "Priya Sharma",
      date: "2026-07-14",
      time: "14:35",
      screenshotUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400",
      notes: "Please pack it carefully as a gift.",
      submittedAt: new Date(Date.now() - 23.5 * 60 * 60 * 1000).toISOString()
    },
    internalNotes: "Verified amount matching exactly. Packed as gift.",
    statusHistory: [
      { status: "Pending Payment", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { status: "Payment Under Verification", timestamp: new Date(Date.now() - 23.5 * 60 * 60 * 1000).toISOString() },
      { status: "Payment Verified", timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: "ord_2",
    orderNumber: "NK-1052",
    status: "In Transit",
    customerName: "Rahul Mehta",
    email: "rahul.mehta@example.com",
    mobile: "9830098300",
    address: "12/1, Park Street, Near Flurys",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700016",
    items: [
      {
        title: "Sleep Romper",
        quantity: 1,
        price: 1299,
        image: "https://cdn.shopify.com/s/files/1/1010/6388/5166/files/Carter_sOshKoshBabyGirlOnesies_Pyjamas_Sleepwear.jpg?v=1784068493",
        variantTitle: "6M"
      },
      {
        title: "Knit Cardigan",
        quantity: 1,
        price: 1899,
        image: "https://cdn.shopify.com/s/files/1/1010/6388/5166/files/Children_sCardiganKnittingPatternPDF_ColorBlockKidsSweaterTutorial_BeginnerFriendly.jpg?v=1784068351",
        variantTitle: "2Y"
      }
    ],
    subtotal: 3198,
    shipping: 0,
    discount: 160,
    total: 3038,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    paymentDetails: {
      utr: "123049284019",
      transactionId: "TXN102948201",
      method: "Bank Transfer",
      senderName: "Rahul Mehta",
      date: "2026-07-13",
      time: "10:15",
      screenshotUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400",
      notes: "",
      submittedAt: new Date(Date.now() - 47.5 * 60 * 60 * 1000).toISOString()
    },
    courierPartner: "Delhivery",
    trackingNumber: "DEL1029384810",
    estimatedDelivery: "2026-07-17",
    statusHistory: [
      { status: "Pending Payment", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
      { status: "Payment Under Verification", timestamp: new Date(Date.now() - 47.5 * 60 * 60 * 1000).toISOString() },
      { status: "Payment Verified", timestamp: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString() },
      { status: "Preparing Order", timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString() },
      { status: "Packed", timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString() },
      { status: "Picked Up", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { status: "In Transit", timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() }
    ]
  }
];

interface DBData {
  orders: Order[];
  settings: AdminSettings;
}

export function initDB(): DBData {
  if (!fs.existsSync(DB_PATH)) {
    const data: DBData = {
      orders: INITIAL_ORDERS,
      settings: DEFAULT_SETTINGS
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
  
  try {
    const fileContent = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(fileContent) as DBData;
  } catch (e) {
    console.error("Failed to parse DB file, resetting:", e);
    const data: DBData = {
      orders: INITIAL_ORDERS,
      settings: DEFAULT_SETTINGS
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
}

export function getDB(): DBData {
  return initDB();
}

export function saveDB(data: DBData): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
