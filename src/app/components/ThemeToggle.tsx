"use client";
import { useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    function toggle() {
        setDark(!dark);
        document.body.classList.toggle("dark");
    }

    return (
      <button onClick={toggle} style = {{padding: "4px", border: "none", background: "none"}}>
        {dark ? <Moon size={20} color="white"/> : <Sun size={20} />}
      </button>
  );
}