// Footer.js
import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <p>&copy; {currentYear} Johnny13. Made by 💖.</p>
        </footer>
    );
};

export default Footer;
