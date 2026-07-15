/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { FlipWords } from "@/src/components/ui/flip-words";
import { FeatureCard } from "@/src/components/ui/grid-feature-cards";
import { motion, useReducedMotion } from "motion/react";
import { 
  ArrowRightLeft, 
  Receipt, 
  Banknote, 
  Sparkles, 
  ShoppingBag, 
  Globe,
  Users
} from "lucide-react";

const features = [
  {
    title: 'Optimizer Transfer',
    icon: ArrowRightLeft,
    description: 'Bandingkan rute transfer antar bank dan e-wallet. Temukan jalur dengan biaya admin Rp0.',
    active: true,
  },
  {
    title: 'Optimizer Tagihan',
    icon: Receipt,
    description: 'Analisis platform pembayaran tagihan (PLN, PDAM) untuk memetakan rute biaya admin termurah.',
    active: false,
  },
  {
    title: 'Optimizer Tarik Tunai',
    icon: Banknote,
    description: 'Cari metode penarikan uang tunai di ATM atau merchant dengan biaya layanan paling minimal.',
    active: false,
  },
  {
    title: 'Split-Bill Router',
    icon: Users,
    description: 'Patungan bebas admin. Cari tujuan rekening penagih terbaik agar semua teman bisa transfer patungan dari bank/e-wallet mana pun dengan biaya Rp0.',
    active: false,
  },
  {
    title: 'E-Commerce Route',
    icon: ShoppingBag,
    description: 'Optimalkan jalur pembayaran checkout belanja online Anda untuk menghindari biaya tambahan.',
    active: false,
  },
  {
    title: 'Global Flow',
    icon: Globe,
    description: 'Solusi rute pengiriman uang ke luar negeri dengan kurs terbaik dan biaya pengiriman terendah.',
    active: false,
  },
];

const testimonials = [
  {
    text: "Sangat membantu buat saya yang sering transfer antar bank. Hemat biaya admin sampai ratusan ribu sebulan!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    name: "Siska Amelia",
    role: "Online Shop Owner",
  },
  {
    text: "UI-nya sangat modern dan cepat. Dity Flow jadi aplikasi wajib sebelum saya melakukan transaksi apa pun.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    name: "Budi Santoso",
    role: "Freelance Designer",
  },
  {
    text: "Akhirnya ada solusi buat cari rute transfer paling murah. Algoritmanya bener-bener akurat dan update.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    name: "Diana Putri",
    role: "Mahasiswa",
  },
  {
    text: "Bener-bener game changer! Sekarang nggak pusing lagi kalau mau top-up e-wallet beda-beda platform.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    name: "Rendy Wijaya",
    role: "Software Engineer",
  },
  {
    text: "Asisten finansial masa depan. Fitur Roadmap-nya bikin saya nggak sabar nunggu fitur Optimizer Tagihan rilis.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    name: "Maya Sari",
    role: "Accountant",
  },
  {
    text: "Paling suka sama transparansi biayanya. Semua rute dihitung detail sampai ke admin paling kecil.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    name: "Andi Pratama",
    role: "Content Creator",
  },
  {
    text: "Simpel, fungsional, dan cantik. Dity Flow bener-bener ngerti kebutuhan anak muda yang mau hemat.",
    image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop",
    name: "Lia Rahma",
    role: "Marketing Specialist",
  },
  {
    text: "Dity Flow bikin pengelolaan arus kas jadi lebih efisien. Rekomendasi jalurnya selalu yang paling logis.",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
    name: "Fajar Ramadhan",
    role: "Small Business Owner",
  },
  {
    text: "Nggak nyangka bisa nemu rute transfer Rp0 antar bank yang biasanya kena admin 6.500. Amazing!",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    name: "Anita Wijaya",
    role: "Ibu Rumah Tangga",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

import { TestimonialsColumn } from "@/src/components/ui/testimonials-columns-1";
import { CallToAction } from "@/src/components/ui/cta-3";
import { Footer } from "@/src/components/ui/footer";
import { Instagram, Mail, MessageCircle } from "lucide-react";

type ViewAnimationProps = {
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: 20, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  React.useEffect(() => {
    document.title = "Dity Flow";
  }, []);

  const words = ["Terhemat", "Tercepat", "Termudah"];
  const [showAllFeatures, setShowAllFeatures] = React.useState(false);

  return (
    <div className="w-full relative">
      {/* Hero Section */}
      <section id="hero" className="min-h-screen pt-24 pb-24 md:pt-36 md:pb-36 flex flex-col justify-center max-w-7xl mx-auto px-6 text-center relative">
        <AnimatedContainer>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05] text-theme-main">
            Temukan Rute <br className="hidden sm:block" />
            Transfer <FlipWords words={words} className="text-theme-accent" />
          </h1>
          <p className="text-lg md:text-2xl text-theme-textDim max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Kendali penuh atas pengeluaran Anda. Bandingkan biaya admin dan pilih rute transaksi paling efisien secara instan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#features" 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("features");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="w-full sm:w-auto bg-theme-accent text-theme-inverted px-10 py-5 rounded-2xl text-lg font-bold hover:bg-[#00e685] transition-all hover:scale-105 shadow-xl shadow-theme-accent/20 flex items-center justify-center gap-2 shimmer-btn"
            >
              Coba Sekarang
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </a>
          </div>
        </AnimatedContainer>
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen flex flex-col justify-center pt-24 pb-12 bg-theme-bg border-t border-theme-border overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6">
          <AnimatedContainer className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-theme-main mb-6">
              Fitur Unggulan Dity Flow
            </h2>
            <p className="text-theme-textDim text-lg max-w-2xl mx-auto">
              Temukan rute transaksi paling efisien dengan asisten pemetaan cerdas yang memotong biaya admin hingga Rp0.
            </p>
          </AnimatedContainer>

          <AnimatedContainer
            delay={0.3}
            className={cn(
              "border-t border-x border-theme-border rounded-t-3xl overflow-hidden relative transition-all duration-500",
              showAllFeatures ? "border-b rounded-b-3xl" : "border-b-0 sm:border-b sm:rounded-b-3xl"
            )}
          >
            <div className="grid grid-cols-1 divide-y divide-theme-borderDim sm:grid-cols-2 lg:grid-cols-3 sm:divide-x sm:divide-theme-borderDim">
              {features.map((feature, i) => {
                const isHiddenOnMobile = i >= 3 && !showAllFeatures;
                const visibilityClass = isHiddenOnMobile ? "hidden sm:block" : "block";

                return feature.active ? (
                  <Link key={i} to="/optimizer-transfer" className={cn("h-full", visibilityClass)}>
                    <FeatureCard 
                      feature={feature} 
                      className="h-full border-none"
                    />
                  </Link>
                ) : (
                  <div key={i} className={cn("relative group h-full", visibilityClass)}>
                    <FeatureCard 
                      feature={feature} 
                      className="h-full opacity-50 border-none"
                    />
                  </div>
                );
              })}
            </div>

            {/* Smooth Gradient overlay only on mobile when features are collapsed */}
            {!showAllFeatures && (
              <div 
                className="sm:hidden absolute bottom-0 left-0 right-0 h-64 flex flex-col items-center justify-end pb-6 pointer-events-none" 
                style={{
                  background: 'linear-gradient(to top, var(--color-bg) 0%, rgba(var(--color-bg-rgb), 0.9) 30%, rgba(var(--color-bg-rgb), 0.5) 60%, rgba(var(--color-bg-rgb), 0) 100%)'
                }}
                data-html2canvas-ignore
              >
                <button 
                  type="button"
                  onClick={() => setShowAllFeatures(true)}
                  className="pointer-events-auto bg-theme-card border border-theme-border hover:border-theme-accent text-theme-main px-6 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                  style={{ boxShadow: "0 25px 50px -12px var(--color-shadow)" }}
                >
                  <span>Lihat semua fitur</span>
                  <svg className="w-4 h-4 text-theme-accent animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </AnimatedContainer>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="min-h-screen flex flex-col justify-center pt-12 pb-24 bg-theme-bg border-t border-theme-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <AnimatedContainer className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-theme-main mb-6">
              Apa Kata Mereka?
            </h2>
            <p className="text-theme-textDim text-lg max-w-2xl mx-auto">
              Ribuan pengguna telah mengoptimalkan arus kas mereka dengan Dity Flow.
            </p>
          </AnimatedContainer>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[640px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={25} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={35} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={30} />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="min-h-screen flex flex-col justify-center py-24 bg-gradient-to-b from-theme-bg to-theme-card border-t border-theme-border">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedContainer className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-theme-main mb-6">
              Pertanyaan Umum
            </h2>
            <p className="text-theme-textDim text-lg">
              Semua yang perlu Anda ketahui tentang Dity Flow.
            </p>
          </AnimatedContainer>

          <FAQAccordion />
        </div>
      </section>

      {/* CTA Section */}
      <section id="contribute" className="min-h-screen flex flex-col justify-center py-24 bg-theme-bg border-t border-theme-border">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedContainer>
            <CallToAction />
          </AnimatedContainer>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "Apa itu Dity Flow?",
      answer: "Dity Flow adalah asisten keuangan cerdas yang membantu Anda menemukan rute transaksi (transfer, pembayaran tagihan, dll) paling efisien dan murah melalui algoritma pemetaan jalur yang canggih."
    },
    {
      question: "Apakah aplikasi ini bisa terhubung langsung dengan rekening saya?",
      answer: "Tidak. Dity Flow menjunjung tinggi privasi dan keamanan Anda (Zero Financial Access). Kami murni bertindak sebagai penyedia informasi rute. Segala transaksi tetap Anda lakukan sendiri secara aman melalui aplikasi m-banking atau e-wallet resmi milik Anda."
    },
    {
      question: "Apakah Dity Flow aman digunakan?",
      answer: "Sangat aman. Kami tidak menyimpan data sensitif perbankan Anda. Dity Flow hanya berfungsi sebagai navigator yang memberikan rekomendasi langkah-langkah transaksi."
    },
    {
      question: "Apakah ada biaya untuk menggunakan Dity Flow?",
      answer: "Saat ini fitur utama Dity Flow dapat digunakan secara gratis. Misi kami adalah membantu masyarakat menghemat biaya admin transaksi yang tidak perlu."
    },
    {
      question: "Fitur apa yang akan hadir selanjutnya?",
      answer: "Kami sedang mengembangkan Optimizer Tagihan, Navigator Tarik Tunai, dan asisten pelacak otomatis kuota bebas biaya admin untuk transaksi Anda."
    }
  ];

  return (
    <AnimatedContainer delay={0.3} className="space-y-4">
      {faqs.map((faq, index) => (
        <FAQItem 
          key={index}
          question={faq.question} 
          answer={faq.answer}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </AnimatedContainer>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  key?: React.Key;
}

function FAQItem({ 
  question, 
  answer, 
  isOpen, 
  onToggle 
}: FAQItemProps) {
  return (
    <div className={cn("border rounded-2xl transition-all duration-300", isOpen ? "border-theme-accent bg-theme-accent/[0.02]" : "border-theme-border bg-theme-bg")}>
      <button 
        onClick={onToggle}
        className="w-full p-6 text-left flex items-start sm:items-center justify-between transition-colors"
      >
        <span className={cn("font-bold text-lg pr-4 sm:pr-8 transition-colors", isOpen ? "text-theme-accent" : "text-theme-main")}>{question}</span>
        <svg 
          className={cn("w-5 h-5 shrink-0 mt-1 sm:mt-0 text-theme-accent transition-transform duration-300", isOpen && "rotate-180")} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={cn(
          "px-6 overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p className="text-theme-textDim leading-relaxed font-medium">
          {answer}
        </p>
      </div>
    </div>
  );
}


