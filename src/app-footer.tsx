import { createRoot } from "react-dom/client";
import { Footer } from "@/src/components/ui/footer";
import { Github, Twitter, Instagram } from "lucide-react";
import React from "react";

const rootElement = document.getElementById("footer-root");
if (rootElement) {
  createRoot(rootElement).render(
    <Footer
      logo={
        <div className="w-8 h-8 bg-theme-accent rounded-lg flex items-center justify-center text-white dark:text-black shadow-lg shadow-theme-accent/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      }
      brandName="Dity Flow"
      socialLinks={[
        {
          icon: <Twitter className="h-5 w-5" />,
          href: "https://twitter.com",
          label: "Twitter",
        },
        {
          icon: <Instagram className="h-5 w-5" />,
          href: "https://instagram.com",
          label: "Instagram",
        },
        {
          icon: <Github className="h-5 w-5" />,
          href: "https://github.com",
          label: "GitHub",
        },
      ]}
      mainLinks={[
        { href: "/app/", label: "Optimizer Transfer" },
        { href: "/#features", label: "Optimizer Tagihan" },
        { href: "/#features", label: "Optimizer Tarik Tunai" },
        { href: "/#features", label: "Rute Multi-Tahap" },
        { href: "/#features", label: "E-Commerce Route" },
        { href: "/#features", label: "Global Flow" },
      ]}
      legalLinks={[
        { href: "#", label: "Kebijakan Privasi" },
        { href: "#", label: "Syarat & Ketentuan" },
        { href: "#", label: "Pusat Bantuan" },
      ]}
      copyright={{
        text: "© 2026 Dity Flow. Hak cipta dilindungi.",
      }}
    />
  );
}
