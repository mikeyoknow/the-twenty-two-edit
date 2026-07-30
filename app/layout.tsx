import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://mikeyoknow.github.io/the-twenty-two-edit/",
  ),
  title: "The Twenty-Two Edit — Hannah’s Birthday",
  description:
    "A private, editable birthday agenda for Monday, August 10 in Toronto.",
  openGraph: {
    title: "The Twenty-Two Edit — Hannah’s Birthday",
    description:
      "Your day. Your say. Build Hannah’s 22nd-birthday itinerary, one chapter at a time.",
    url: "https://mikeyoknow.github.io/the-twenty-two-edit/",
    siteName: "The Twenty-Two Edit",
    type: "website",
    images: [
      {
        url: "https://mikeyoknow.github.io/the-twenty-two-edit/og.png",
        width: 1730,
        height: 909,
        alt: "The Twenty-Two Edit — Hannah, 22. Your day. Your say.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Twenty-Two Edit — Hannah’s Birthday",
    description:
      "Your day. Your say. Build Hannah’s 22nd-birthday itinerary.",
    images: ["https://mikeyoknow.github.io/the-twenty-two-edit/og.png"],
  },
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
