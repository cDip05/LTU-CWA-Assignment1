
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
