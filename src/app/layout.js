import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "WS CubeTech Store",
    template: "%s | WS CubeTech Store",
  },
  description:
    "Official WS CubeTech merchandise — premium tech apparel and accessories engineered for innovation.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Material Symbols, SUBSET to only the icons we use (much smaller font).
            IMPORTANT: when you use a new <Icon name="…"/>, add it to icon_names below.
            display=block avoids a flash of raw ligature text before the font loads. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=account_circle,add,add_shopping_cart,all_inclusive,analytics,arrow_forward,arrow_outward,check,check_circle,chevron_left,chevron_right,close,delete,image,inventory_2,local_shipping,logout,mail,menu,payments,progress_activity,receipt_long,remove,school,settings,shopping_bag,shopping_cart,storefront,warning&display=block"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background font-body-md">
        {children}
      </body>
    </html>
  );
}
