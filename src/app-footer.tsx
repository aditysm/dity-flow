import { createRoot } from "react-dom/client";
import { Footer } from "@/src/components/ui/footer";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import React from "react";

const rootElement = document.getElementById("footer-root");
if (rootElement) {
  createRoot(rootElement).render(
    <Footer />
  );
}
