import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Twenty-Two Edit — Hannah’s Birthday",
  description:
    "A private, editable birthday agenda for Monday, August 10 in Toronto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
