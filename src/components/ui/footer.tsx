import { Button } from "@/src/components/ui/button"
import React from "react"

interface FooterProps {
  logo: React.ReactNode
  brandName: string
  socialLinks: Array<{
    icon: React.ReactNode
    href: string
    label: string
  }>
  mainLinks: Array<{
    href: string
    label: string
  }>
  legalLinks: Array<{
    href: string
    label: string
  }>
  copyright: {
    text: string
    license?: string
  }
}

export function Footer({
  logo,
  brandName,
  socialLinks,
  mainLinks,
  legalLinks,
  copyright,
}: FooterProps) {
  return (
    <footer className="pb-12 pt-24 border-t border-theme-border bg-theme-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="md:flex md:items-start md:justify-between">
          <a
            href="/"
            className="flex items-center gap-x-2 text-theme-main hover:opacity-90 transition-opacity"
            aria-label={brandName}
          >
            {logo}
            <span className="font-black text-2xl tracking-tighter">{brandName}</span>
          </a>
          <ul className="flex list-none mt-8 md:mt-0 gap-3">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full border border-theme-border flex items-center justify-center p-0 text-theme-textDim hover:text-theme-main hover:bg-theme-accent/[0.05] transition-all opacity-70 hover:opacity-100"
                  asChild
                >
                  <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border-t border-theme-border mt-12 pt-12 lg:grid lg:grid-cols-10 gap-8">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-2 -mx-4 lg:justify-end">
              {mainLinks.map((link, i) => (
                <li key={i} className="my-2 mx-4 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm font-medium text-theme-textDim hover:text-theme-main transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-8 lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-2 -mx-4 lg:justify-end">
              {legalLinks.map((link, i) => (
                <li key={i} className="my-2 mx-4 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-theme-textDim hover:text-theme-main transition-colors font-medium opacity-70"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-12 text-sm leading-6 text-theme-textDim lg:mt-0 lg:row-[1/3] lg:col-[1/4] font-medium">
            <div>{copyright.text}</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
