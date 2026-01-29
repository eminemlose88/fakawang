import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { getSystemSettings } from "@/lib/settings";
import { getDictionary } from "@/lib/dictionary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  const settings = await getSystemSettings();
  const dict = await getDictionary(params.lang);
  
  return {
    title: {
      default: settings.title || "Fakawang 2.0 - Premium Digital Goods Store",
      template: `%s | ${settings.title || "Fakawang 2.0"}`
    },
    description: settings.description || "Buy premium digital goods, AWS accounts, Google Cloud, and more with instant delivery. Secure payment and 24/7 support.",
    keywords: ["digital goods", "AWS accounts", "Google Cloud", "buy accounts", "virtual credit cards", "automated delivery", "发卡网", "账号购买"],
    openGraph: {
      title: settings.title || "Fakawang 2.0",
      description: settings.description || "Premium Digital Goods Store with Instant Delivery",
      type: 'website',
      locale: params.lang === 'zh' ? 'zh_CN' : 'en_US',
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { children } = props;
  const params = await props.params;
  const settings = await getSystemSettings();
  const dict = await getDictionary(params.lang);

  return (
    <html lang={params.lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Header title={settings.title || "Fakawang 2.0"} dict={dict.nav} />
        
        <div className="flex pt-16 md:pt-20 min-h-screen">
          <Sidebar dict={dict.nav} />
          
          <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
            <main className="flex-grow">
              {children}
            </main>
            <Footer text={settings.footer || "© 2025 Fakawang 2.0"} />
          </div>
        </div>
      </body>
    </html>
  );
}
