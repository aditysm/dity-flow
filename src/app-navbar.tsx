import { createRoot } from "react-dom/client";
import { Navbar } from "@/src/components/ui/navbar";
import React from "react";

const rootElement = document.getElementById("navbar-root");
if (rootElement) {
  createRoot(rootElement).render(<Navbar />);
}
