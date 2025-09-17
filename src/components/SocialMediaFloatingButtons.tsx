import React from "react";
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

const socialLinks = [
  {
    icon: <FaInstagram />,
    label: "Instagram",
    url: "https://www.instagram.com/",
    color: "#E4405F"
  },
  {
    icon: <FaFacebook />,
    label: "Facebook",
    url: "https://www.facebook.com/",
    color: "#1877F3"
  },
  {
    icon: <FaTwitter />,
    label: "Twitter",
    url: "https://twitter.com/",
    color: "#000"
  },
  {
    icon: <FaYoutube />,
    label: "YouTube",
    url: "https://www.youtube.com/",
    color: "#FF0000"
  }
];

const SocialMediaFloatingButtons: React.FC = () => (
  <div
    style={{
      position: "fixed",
      bottom: 110, // above chat button (assume chat button is at 40px)
      right: 24,
      zIndex: 50,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }}
  >
    {socialLinks.map((link) => (
      <a
        key={link.label}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        title={link.label}
        style={{
          background: link.color,
          color: "#fff",
          borderRadius: "50%",
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px #0002",
          fontSize: 22,
          transition: "transform 0.2s",
        }}
        tabIndex={0}
        aria-label={link.label}
      >
        {link.icon}
      </a>
    ))}
  </div>
);

export default SocialMediaFloatingButtons;