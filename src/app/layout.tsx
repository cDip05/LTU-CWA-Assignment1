import Header from "./components/header";
import Footer from "./components/footer";

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
        <p style = {{maxWidth: "1200px", margin: "0 auto", padding: "8px"}}>Student Number: 22563887</p>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
