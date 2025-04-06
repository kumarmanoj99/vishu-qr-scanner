// app/layout.jsx
export const metadata = {
  title: "Vishu QR Scanner",
  description: "Mobile QR Scanner for Vishu Sadhya Event",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
