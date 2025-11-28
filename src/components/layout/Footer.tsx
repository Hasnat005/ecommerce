import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Shop: [
      { name: "All Products", href: "/shop" },
      { name: "New Arrivals", href: "/shop?category=new" },
      { name: "Featured", href: "/shop?category=featured" },
    ],
    Support: [
      { name: "FAQ", href: "/faq" },
      { name: "Shipping & Returns", href: "/shipping" },
      { name: "Contact Us", href: "/contact" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">SQL-Shop</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium digital commerce experience powered by modern technology.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialIcon icon={<Facebook className="w-5 h-5" />} href="#" />
              <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
              <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
              <SocialIcon icon={<Github className="w-5 h-5" />} href="#" />
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-lg mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} SQL-Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({
  icon,
  href,
}: {
  icon: React.ReactNode;
  href: string;
}) => (
  <a
    href={href}
    className="text-gray-400 hover:text-white transition-colors duration-200"
  >
    {icon}
  </a>
);

export default Footer;
