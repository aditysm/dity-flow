import { Button } from "@/src/components/ui/button"
import React from "react"
import { Instagram, Mail } from "lucide-react"
import { Link } from "react-router-dom"

interface FooterProps {
  logo?: React.ReactNode
  brandName?: string
  socialLinks?: Array<{
    icon: React.ReactNode
    href: string
    label: string
  }>
  mainLinks?: Array<{
    href: string
    label: string
    active?: boolean
  }>
  legalLinks?: Array<{
    href: string
    label: string
  }>
  copyright?: {
    text: string
    license?: string
  }
}

export function Footer({
  logo,
  brandName = "Dity Flow",
  socialLinks = [
    {
      icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>,
      href: "https://wa.me/62895634048237",
      label: "WhatsApp",
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      href: "https://www.instagram.com/dity.storee",
      label: "Instagram",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      href: "mailto:dity.store31@gmail.com",
      label: "Email",
    },
  ],
  mainLinks = [
    { href: "/optimizer-transfer", label: "Optimizer Transfer", active: true },
    { href: "/#features", label: "Optimizer Tagihan", active: false },
    { href: "/#features", label: "Optimizer Tarik Tunai", active: false },
    { href: "/#features", label: "Split-Bill Router", active: false },
    { href: "/#features", label: "E-Commerce Route", active: false },
    { href: "/#features", label: "Global Flow", active: false },
  ],
  legalLinks = [
    { href: "/privacy", label: "Kebijakan Privasi" },
    { href: "/terms", label: "Syarat & Ketentuan" },
    { href: "/help", label: "Pusat Bantuan" },
  ],
  copyright = {
    text: "© 2026 Dity Flow. Hak cipta dilindungi.",
  },
}: FooterProps = {}) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    
    // Create an observer to watch for class changes on html element
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const defaultLogo = (
    <div className={`flex items-center justify-center rounded-xl w-10 h-10 shadow-lg transition-all overflow-hidden p-2 ${isDark ? 'bg-[#121214] border border-[#242426] shadow-black/40' : 'bg-[#00ba68] shadow-[#00ba68]/20'}`}>
      <img 
        src={isDark ? "/assets/logo-green.svg" : "/assets/logo-white.svg"} 
        alt="Dity Flow Logo" 
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
      />
    </div>
  );
  return (
    <footer className="pb-12 pt-24 border-t border-theme-border bg-theme-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="md:flex md:items-start md:justify-between">
          <Link
            to="/"
            className="flex items-center gap-x-2 text-theme-main hover:opacity-90 transition-opacity"
            aria-label={brandName}
          >
            {logo || defaultLogo}
            <span className="font-black text-2xl tracking-tighter">{brandName}</span>
          </Link>
          <ul className="flex list-none mt-8 md:mt-0 gap-3">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full border border-theme-border flex items-center justify-center p-0 text-theme-main hover:text-theme-main hover:bg-theme-accent/[0.05] transition-all opacity-80 hover:opacity-100"
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
        
        <div className="border-t border-theme-border mt-12 pt-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
            {/* Main Links Section */}
            <div className="flex-1 max-w-3xl">
              <nav aria-label="Main navigation">
                <ul className="list-none grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
                  {mainLinks.map((link: any, i) => (
                    <li key={i} className="shrink-0">
                      {link.active === false ? (
                        <span className="text-sm font-medium text-theme-textDim cursor-default opacity-40 select-none">
                          {link.label}
                        </span>
                      ) : link.href.startsWith("http") ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-theme-textDim hover:text-theme-main transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-sm font-medium text-theme-textDim hover:text-theme-main transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Legal and Copyright Section */}
            <div className="flex flex-col gap-8 lg:items-end lg:text-right border-t lg:border-t-0 border-theme-border/30 pt-8 lg:pt-0">
              <nav aria-label="Legal navigation">
                <ul className="list-none flex flex-wrap gap-x-8 gap-y-4 lg:justify-end">
                  {legalLinks.map((link, i) => (
                    <li key={i}>
                      <Link
                        to={link.href}
                        className="text-sm font-medium text-theme-textDim hover:text-theme-main transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="text-sm text-theme-textDim opacity-50 font-medium">
                &copy; {new Date().getFullYear()} Dity Flow. Hak cipta dilindungi.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

