import "./globals.css";
import { Head } from "next/document"; // Add this import

export const metadata = {
  title: "SurveyToCash",
  description: "Earn points by completing surveys",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        {/* Add the favicon link */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>{children}</body>
    </html>
  );
}
