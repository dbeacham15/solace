import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { QueryProvider } from "@/components/QueryProvider";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Solace - Healthcare Advocates",
  description: "Find experienced healthcare advocates to support your journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <QueryProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
