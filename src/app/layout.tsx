import "./globals.css";

export const metadata = {
  title: "Survey MVP",
  description: "Earn points by completing surveys",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
