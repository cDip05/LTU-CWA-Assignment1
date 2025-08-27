// components/HamburgerMenu.tsx
'use client'
import { useState } from 'react';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
        <style>
            {`
            .container {
                position: relative;
                z-index: 100;
            }
            
            .hamburger {
                cursor: pointer;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                width: 30px;
                height: 30px;
            }
            
            .bar, .barOpen {
                width: 100%;
                height: 4px;
                background-color: #333;
                transition: all 0.3s ease;
            }
            
            .barOpen:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .barOpen:nth-child(2) {
                opacity: 0;
            }
            
            .barOpen:nth-child(3) {
                transform: rotate(-45deg) translate(5px, -5px);
            }
            
            .menu {
                display: none;
            }
            
            .menuOpen {
                display: block;
                position: absolute;
                top: 40px;
                left: 0;
                background-color: white;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                width: 200px;
            }
            
            .menuOpen ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .menuOpen li {
                padding: 10px;
                border-bottom: 1px solid #ddd;
            }
            
            .menuOpen li a {
                text-decoration: none;
                color: #333;
            }
            `}
        </style>

        <div className='container'>
        <div className='hamburger' onClick={toggleMenu}>
            <div className={isOpen ? "barOpen" : "bar"}></div>
            <div className={isOpen ? "barOpen" : "bar"}></div>
            <div className={isOpen ? "barOpen" : "bar"}></div>
        </div>
        <nav className={isOpen ? "menuOpen" : "menu"}>
            <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/codingrace">Coding Race</a></li>
            <li><a href="/courtroom">Court Room</a></li>
            <li><a href="/escaperoom">Escape Room</a></li>
            </ul>
        </nav>
        </div>
    </>
  );
};

export default HamburgerMenu;