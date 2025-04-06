export const metadata = {
  title: "Vishu QR Scanner",
  description: "Realtime ticket scanner for Vishu Sadhya",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}