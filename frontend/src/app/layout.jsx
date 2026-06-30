import "@/app/globals.css";

import Providers from "@/app/providers";

export const metadata = {
  title: "Canaria",
  description: "Laravel + Next.js platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
