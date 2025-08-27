import HamburgerMenu from "./hamburger";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header style={{ padding: "12px", borderBottom: "1px solid #ddd", textAlign: "center", maxWidth: "1200px", margin: "0 auto"}}>
        <h1>LTU - Tab Generator</h1>
        <nav style={{display: "flex", alignItems: "center" ,justifyContent: "space-around", maxWidth: "50%", margin: "0 auto"}}>
            <div>
                <a href="/">Tabs</a> | <a href="/codingrace">Coding Race</a> | <a href="/courtroom">Court Room</a> | <a href="/escaperoom">Escape Room</a>
            </div>
            <div style = {{display: "flex", alignItems:"center"}}>
                <ThemeToggle/>
                <a href="/about" style={{marginRight: "8px", marginLeft: "8px"}}>About</a> 
                <HamburgerMenu/>
            </div>
        </nav>
    </header>
  );
}
