import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Share_Tech } from "next/font/google";
import "@/styles/global.css";
import { StarknetProvider } from "../context/StarknetProvider";
import { Header } from "@/components/LayoutComponents";
import TransactionProvider from "@/context/TransactionProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const inter = Inter({ subsets: ["latin"] });
const shareTech = Share_Tech({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--mainFont",
});
export const metadata: Metadata = {
  title: "Pitchlake",
  description: "Gas Options Market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${shareTech.variable}`} lang="en">
      <body>
        <StarknetProvider>
          <TransactionProvider>
            <Header />
            <ToastContainer />
            {children}
          </TransactionProvider>
        </StarknetProvider>
      </body>
    </html>
  );
}
