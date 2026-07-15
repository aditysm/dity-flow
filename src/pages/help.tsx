import React from "react";
import { useState, useMemo } from "react";
import { Footer } from "../components/ui/footer";
import { ChevronDownIcon, MailIcon, Search, X, Send, CheckCircle2 } from "lucide-react";
import "../index.css";

interface AccordionItemProps {
  key?: React.Key | string;
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ question, answer, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className={`border transition-all duration-300 rounded-2xl ${isOpen ? 'border-theme-accent bg-theme-accent/[0.02]' : 'border-theme-border bg-theme-card shadow-sm hover:border-theme-border/80'}`}>
      <button 
        type="button"
        onClick={onToggle} 
        className="w-full text-left p-6 flex justify-between items-start sm:items-center gap-4 transition-colors cursor-pointer"
      >
        <h3 className={`text-base sm:text-lg font-bold pr-4 sm:pr-8 transition-colors ${isOpen ? 'text-theme-accent' : 'text-theme-main'}`}>{question}</h3>
        <ChevronDownIcon className={`shrink-0 w-5 h-5 mt-1 sm:mt-0 text-theme-accent transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div 
        className={`px-6 text-theme-textDim text-sm sm:text-base font-medium overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {answer}
      </div>
    </div>
  );
}

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    category: "Keamanan & Privasi (Security First)",
    items: [
      {
        id: "sec-1",
        question: "Q: Apakah Dity Flow aman digunakan? Apakah saldo saya bisa hilang?",
        answer: (
          <div className="space-y-3">
            <p><strong className="text-theme-accent">A: Sangat aman!</strong> Dity Flow menerapkan prinsip Zero Financial Access. Kami tidak pernah meminta, menyimpan, atau mengakses akun perbankan maupun e-wallet Anda.</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Di aplikasi Dity Flow, Anda hanya memasukkan nama bank/institusi asal dan tujuan serta nominal secara manual.</li>
              <li>Kami tidak meminta nomor kartu, kata sandi, PIN, atau kode OTP.</li>
              <li>Saldo Anda tidak akan pernah hilang karena Dity Flow murni merupakan aplikasi navigator rute informasi. Seluruh aktivitas transfer uang yang sebenarnya tetap Anda lakukan sendiri di dalam aplikasi perbankan resmi Anda masing-masing.</li>
            </ul>
          </div>
        )
      },
      {
        id: "sec-2",
        question: "Q: Mengapa saya tidak perlu melakukan login m-banking di Dity Flow?",
        answer: (
          <p>
            <strong className="text-theme-accent">A: </strong>Karena Dity Flow bertindak layaknya "Google Maps" khusus untuk biaya admin. Google Maps memandu Anda menuju jalan tercepat tanpa perlu mengemudikan mobil Anda; begitu pula Dity Flow, kami memandu Anda menunjukkan "jalan tikus" transfer gratisan tanpa perlu menyentuh atau mengendalikan akun keuangan Anda secara langsung.
          </p>
        )
      }
    ]
  },
  {
    category: "Cara Kerja Navigasi (How It Works)",
    items: [
      {
        id: "work-1",
        question: "Q: Bagaimana cara Dity Flow mencarikan rute transfer gratis (Rp0)?",
        answer: (
          <div className="space-y-3">
            <p><strong className="text-theme-accent">A: </strong>Kami menggunakan algoritma pemetaan grafis (graph pathfinding) rekursif canggih di database kami. Sistem kami secara otomatis mencari hubungan "jembatan" atau jalur afiliasi gratis antar-bank digital dan e-wallet di Indonesia.</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Contoh: Jika transfer langsung dari Bank A ke E-Wallet B dikenakan biaya Rp1.500, Dity Flow mungkin menemukan bahwa Bank A memiliki opsi transfer Rp0 ke Bank Digital C, dan Bank Digital C memiliki fitur top-up gratis ke E-Wallet B.</li>
              <li>Dity Flow akan menyajikan skema langkah demi langkah ini di layar Anda agar Anda bisa berhemat secara instan!</li>
            </ul>
          </div>
        )
      },
      {
        id: "work-2",
        question: "Q: Apa fungsi tombol 'Saya telah melewati batas gratis biaya admin'?",
        answer: (
          <div className="space-y-3">
            <p><strong className="text-theme-accent">A: </strong>Beberapa bank digital (seperti Bank Jago atau Allo Bank) dan aplikasi perantara (seperti Flip) memberikan kuota gratis bulanan dalam jumlah tertentu (misalnya gratis 10x atau 20x transfer per bulan).</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Jika jatah kuota gratis bulanan Anda di aplikasi-aplikasi tersebut sudah habis, Anda cukup mencentang tombol tersebut di aplikasi Dity Flow.</li>
              <li>Sistem kami secara otomatis akan menaikkan bobot tarif bank berkuota tersebut ke tarif normal (BI-FAST Rp2.500) dalam perhitungan algoritma, lalu mencarikan rute rujukan alternatif lain yang benar-benar masih gratis tanpa batasan kuota (seperti SeaBank) untuk Anda gunakan.</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    category: "Masalah Teknis & Akurasi Data",
    items: [
      {
        id: "tech-1",
        question: "Q: Mengapa rute yang disarankan tidak sesuai atau biaya adminnya berbeda saat saya praktekkan di m-banking?",
        answer: (
          <div className="space-y-3">
            <p><strong className="text-theme-accent">A: </strong>Hal ini biasanya disebabkan oleh dua kondisi utama:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Kebijakan Pihak Ketiga Berubah:</strong> Bank atau e-wallet terkait telah mengubah skema tarif administrasi atau membatasi kebijakan promo gratisan mereka secara mendadak sebelum tim kami sempat melakukan pembaruan di database.</li>
              <li><strong>Kuota Habis Belum Dicentang:</strong> Anda mungkin telah kehabisan kuota gratis di bank digital perantara Anda namun lupa mengaktifkan tombol "Saya telah melewati batas gratis" di aplikasi Dity Flow, sehingga sistem masih mengasumsikan rute tersebut bernilai Rp0.</li>
            </ul>
            <p>Jika Anda menemukan perbedaan data tarif, Anda sangat dapat membantu komunitas dengan melaporkannya melalui email dukungan kami agar bisa kami perbaiki secepat mungkin!</p>
          </div>
        )
      },
      {
        id: "tech-2",
        question: "Q: Mengapa muncul pesan 'Belum ada rute terpilih' atau 'Rute tidak ditemukan'?",
        answer: (
          <p>
            <strong className="text-theme-accent">A: </strong>Pesan ini muncul jika Anda mengaktifkan tombol batasan kuota (bypass limit) dan sistem kami tidak menemukan alternatif jalur jembatan lain yang valid atau bebas biaya untuk sepasang institusi yang Anda pilih pada nominal tersebut. Kami sedang terus melengkapi jalur darurat untuk setiap kombinasi bank di Indonesia agar masalah jalan buntu ini tidak terjadi lagi di masa depan.
          </p>
        )
      }
    ]
  },
  {
    category: "Fitur-fitur Baru Dity Flow",
    items: [
      {
        id: "feat-1",
        question: "Q: Selain transfer, apakah Dity Flow bisa membantu menghemat transaksi lainnya?",
        answer: (
          <div className="space-y-3">
            <p><strong className="text-theme-accent">A: </strong>Tentu saja! Kami sedang mengembangkan 5 fitur ekspansi baru yang sangat dinanti-nantikan oleh pengguna kami:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Optimizer Tagihan:</strong> Memandu Anda mencari platform/e-wallet mana yang mengenakan biaya admin paling murah (atau gratis) untuk membayar tagihan bulanan seperti Listrik PLN, Air PDAM, dan WiFi.</li>
              <li><strong>Optimizer Tarik Tunai:</strong> Mencarikan jalan paling hemat bagi Anda yang ingin mencairkan saldo digital menjadi uang tunai di ATM terdekat atau kasir minimarket (Indomaret/Alfamart).</li>
              <li><strong>Split-Bill Router:</strong> Menghitung rute patungan makan bareng teman agar pengiriman dana patungan tidak boncos terkena biaya admin transfer beda bank.</li>
              <li><strong>E-Commerce Route:</strong> Strategi checkout bebas dari biaya penanganan atau biaya jasa aplikasi e-commerce yang mengganggu saat belanja online.</li>
              <li><strong>Global Flow:</strong> Navigasi rute pengiriman uang ke luar negeri dengan kurs terbaik dan biaya flat terendah.</li>
            </ul>
          </div>
        )
      }
    ]
  }
];

export function HelpCenter() {
  React.useEffect(() => {
    document.title = "Pusat Bantuan - Dity Flow";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  // Contact Form States
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter FAQ items dynamically
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_DATA;
    const query = searchQuery.toLowerCase();
    
    return FAQ_DATA.map(category => {
      const isCategoryMatch = category.category.toLowerCase().includes(query);
      const filteredItems = category.items.filter(item => {
        return item.question.toLowerCase().includes(query);
      });

      if (isCategoryMatch) {
        return category;
      }
      
      return {
        ...category,
        items: filteredItems
      };
    }).filter(category => category.items.length > 0);
  }, [searchQuery]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactSubject || !contactMessage) return;

    // Create the mailto link parameters
    const emailTo = "dity.store31@gmail.com";
    const subject = `[Dity Flow Inquiry] ${contactSubject}`;
    const body = `Halo Tim Dity Flow,

Saya ingin menanyakan perihal berikut:

Nama: ${contactName}
Email: ${contactEmail}
Subjek: ${contactSubject}

Pesan:
${contactMessage}

---
Inquiry dikirim melalui formulir bantuan Dity Flow.`;

    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open default email app
    window.location.href = mailtoUrl;
    setIsFormSubmitted(true);
  };

  const handleResetForm = () => {
    setContactName("");
    setContactEmail("");
    setContactSubject("");
    setContactMessage("");
    setIsFormSubmitted(false);
  };

  const handleToggleAccordion = (id: string) => {
    setActiveFaqId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 max-w-4xl mx-auto px-6 pt-6 pb-12 md:pt-10 md:pb-24 w-full relative z-10">
        <div className="mb-12 text-left">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-theme-main mb-4">
            Pusat Bantuan & FAQ Dity Flow
          </h1>
          <p className="text-theme-textDim font-medium max-w-2xl text-sm sm:text-base">
            Selamat datang di Pusat Bantuan Dity Flow! Temukan jawaban, tips hemat biaya admin, penjelasan algoritma navigasi, serta panduan keamanan transaksi Anda di sini.
          </p>
        </div>

        {/* Dynamic Search Bar */}
        <div className="mb-12 relative">
          <div className="relative flex items-center bg-theme-card border border-theme-border rounded-2xl shadow-sm focus-within:border-theme-accent focus-within:ring-2 focus-within:ring-theme-accent/10 transition-all z-20">
            <Search className="w-5 h-5 text-theme-textDim ml-4 shrink-0" />
            <input 
              type="text"
              placeholder="Cari pertanyaan bantuan (contoh: aman, kuota, rute)..."
              value={searchQuery}
              onFocus={() => setIsSearchDropdownOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchDropdownOpen(true);
                // Reset open accordion when search query changes to keep page focused
                setActiveFaqId(null);
              }}
              className="w-full bg-transparent border-none text-theme-main px-4 py-4 focus:outline-none text-sm sm:text-base font-medium placeholder:text-theme-textDim/60 placeholder:truncate"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFaqId(null);
                  setIsSearchDropdownOpen(false);
                }}
                className="p-2 mr-2 text-theme-textDim hover:text-theme-main transition-colors"
                title="Hapus Pencarian"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            {/* Search Suggestions Dropdown */}
            {isSearchDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsSearchDropdownOpen(false)}
                />
                <div className="absolute left-0 right-0 top-full mt-2 bg-theme-card border border-theme-border rounded-xl shadow-xl overflow-hidden z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 text-[10px] font-bold text-theme-textDim uppercase tracking-widest border-b border-theme-borderDim mb-1">
                    Kategori Bantuan
                  </div>
                  {[
                    { label: "Keamanan & Privasi (Security First)", value: "Keamanan & Privasi (Security First)" },
                    { label: "Cara Kerja Navigasi (How It Works)", value: "Cara Kerja Navigasi (How It Works)" },
                    { label: "Masalah Teknis & Akurasi Data", value: "Masalah Teknis & Akurasi Data" },
                    { label: "Fitur-fitur Baru Dity Flow", value: "Fitur-fitur Baru Dity Flow" }
                  ].filter(item => 
                    item.label.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === ""
                  ).map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item.label);
                        setIsSearchDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-theme-main hover:bg-theme-accent/5 hover:text-theme-accent transition-colors flex items-center justify-between group"
                    >
                      <span>{item.label}</span>
                      <Search className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                    </button>
                  ))}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setIsSearchDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-theme-accent hover:bg-theme-accent/5 transition-colors mt-1"
                    >
                      Cari: "{searchQuery}"
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-theme-textDim font-bold mt-2 ml-1">
              Menampilkan hasil untuk: <span className="text-theme-accent">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Accordion list */}
        <div className="space-y-12 text-theme-main leading-relaxed">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category, catIdx) => (
              <section key={catIdx} className="space-y-6">
                <h2 className="text-xl md:text-2xl font-black text-theme-accent uppercase tracking-wider">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <AccordionItem 
                      key={item.id}
                      question={item.question}
                      answer={item.answer}
                      isOpen={activeFaqId === item.id}
                      onToggle={() => handleToggleAccordion(item.id)}
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="text-center py-12 bg-theme-card border border-theme-border rounded-3xl shadow-sm p-8">
              <Search className="w-12 h-12 text-theme-textDim/50 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-theme-main mb-2">Pencarian Tidak Ditemukan</h3>
              <p className="text-theme-textDim font-medium text-sm sm:text-base max-w-md mx-auto">
                Kami tidak menemukan hasil untuk "<span className="text-rose-500 font-bold">{searchQuery}</span>". Silakan coba kata kunci lain atau gunakan formulir kontak di bawah untuk bertanya langsung kepada kami.
              </p>
            </div>
          )}

          {/* Contact Form Section */}
          <section className="bg-theme-card border border-theme-border rounded-3xl p-6 sm:p-10 mt-16 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-theme-accent/10 border border-theme-accent/20 mb-4">
                  <MailIcon className="w-6 h-6 text-theme-accent" />
                </div>
                <h2 className="text-2xl font-bold text-theme-main">Hubungi Dity Flow</h2>
                <p className="text-theme-textDim text-sm sm:text-base font-medium mt-2">
                  Punya pertanyaan teknis, menemukan bug, atau ingin berkolaborasi? Isi formulir di bawah ini untuk mengirim pesan langsung ke pengembang kami.
                </p>
              </div>

              {isFormSubmitted ? (
                <div className="bg-theme-accent/[0.03] border border-theme-accent/20 rounded-2xl p-6 text-center space-y-4 animate-fade-in">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-theme-accent/20 text-theme-accent mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-theme-main">Pesan Siap Dikirim!</h3>
                  <p className="text-theme-textDim text-sm font-medium leading-relaxed max-w-sm mx-auto">
                    Aplikasi email default Anda telah terbuka dengan data yang sudah diisi. Pastikan Anda menekan tombol "Kirim/Send" di aplikasi email Anda untuk mengirimkannya ke <span className="text-theme-accent font-semibold">dity.store31@gmail.com</span>.
                  </p>
                  <button 
                    type="button" 
                    onClick={handleResetForm}
                    className="bg-theme-card border border-theme-border hover:border-theme-accent text-theme-main px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer inline-block"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="text-xs font-bold text-theme-textDim uppercase tracking-wider block">Nama Lengkap</label>
                      <input 
                        id="contact-name"
                        type="text"
                        placeholder="Nama Anda"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm font-medium text-theme-main placeholder:text-theme-textDim/40 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="text-xs font-bold text-theme-textDim uppercase tracking-wider block">Alamat Email</label>
                      <input 
                        id="contact-email"
                        type="email"
                        placeholder="email@example.com"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm font-medium text-theme-main placeholder:text-theme-textDim/40 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 relative">
                    <label htmlFor="contact-subject" className="text-xs font-bold text-theme-textDim uppercase tracking-wider block">Subjek / Topik</label>
                    <div className="relative group">
                      <input 
                        id="contact-subject"
                        type="text"
                        placeholder="Pilih atau ketik topik pertanyaan..."
                        required
                        value={contactSubject}
                        onChange={(e) => {
                          setContactSubject(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm font-medium text-theme-main placeholder:text-theme-textDim/40 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent pr-10"
                      />
                      <button 
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-textDim hover:text-theme-accent transition-colors"
                      >
                        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setIsDropdownOpen(false)}
                          />
                          <div className="absolute left-0 right-0 top-full mt-2 bg-theme-card border border-theme-border rounded-xl shadow-xl overflow-hidden z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                            {[
                              "Pertanyaan tentang rute",
                              "Masalah teknis aplikasi",
                              "Saran & Masukan",
                              "Laporan Bug",
                              "Kerjasama Strategis",
                              "Lainnya"
                            ].filter(topic => 
                              topic.toLowerCase().includes(contactSubject.toLowerCase()) || contactSubject === ""
                            ).map((topic) => (
                              <button
                                key={topic}
                                type="button"
                                onClick={() => {
                                  setContactSubject(topic);
                                  setIsDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-theme-main hover:bg-theme-accent/5 hover:text-theme-accent transition-colors"
                              >
                                {topic}
                              </button>
                            ))}
                            {[
                              "Pertanyaan tentang rute",
                              "Masalah teknis aplikasi",
                              "Saran & Masukan",
                              "Laporan Bug",
                              "Kerjasama Strategis",
                              "Lainnya"
                            ].filter(topic => 
                              topic.toLowerCase().includes(contactSubject.toLowerCase()) || contactSubject === ""
                            ).length === 0 && (
                              <div className="px-4 py-2.5 text-xs text-theme-textDim font-medium italic">
                                Tekan enter untuk menggunakan topik ini
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-xs font-bold text-theme-textDim uppercase tracking-wider block">Pesan Detail</label>
                    <textarea 
                      id="contact-message"
                      rows={4}
                      placeholder="Tuliskan detail pertanyaan atau masukan Anda di sini secara lengkap..."
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm font-medium text-theme-main placeholder:text-theme-textDim/40 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={!contactName || !contactEmail || !contactSubject || !contactMessage}
                    className="w-full bg-theme-accent text-theme-inverted font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-theme-accent/10 shimmer-btn disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                  >
                    <Send className="w-4 h-4" />
                    Kirim Pesan Melalui Email
                  </button>
                </form>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 pt-8 border-t border-theme-borderDim text-xs text-theme-textDim font-bold tracking-wider">
                <span className="uppercase">Atau kontak langsung:</span>
                <div className="flex gap-4">
                  <a href="mailto:dity.store31@gmail.com" className="text-theme-accent hover:underline flex items-center gap-1 normal-case">
                    <MailIcon className="w-3.5 h-3.5" /> dity.store31@gmail.com
                  </a>
                  <a href="https://wa.me/62895634048237?text=Halo%20Dity%20Flow%2C%20saya%20ingin%20bertanya%20seputar%20layanan%20pusat%20bantuan..." target="_blank" rel="noopener noreferrer" className="text-theme-accent hover:underline flex items-center gap-1 normal-case">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
