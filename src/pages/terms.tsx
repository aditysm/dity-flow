import React, { useEffect } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Footer } from "../components/ui/footer";
import "../index.css";

export function TermsOfService() {
  useEffect(() => {
    document.title = "Syarat & Ketentuan - Dity Flow";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="aurora-bg"></div>
      <main className="flex-1 max-w-4xl mx-auto px-6 pt-6 pb-12 md:pt-10 md:pb-24 w-full relative z-10">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-theme-main mb-4">
            Syarat dan Ketentuan Penggunaan Dity Flow
          </h1>
          <p className="text-theme-textDim font-medium">Terakhir Diperbarui: 14 Juli 2026</p>
        </div>

        <div className="space-y-12 text-theme-main leading-relaxed">
          <section>
            <p className="mb-4">
              Selamat datang di Dity Flow. Harap membaca Syarat dan Ketentuan Penggunaan ("Ketentuan") ini dengan saksama sebelum Anda mulai mengakses atau menggunakan aplikasi, situs web, database, dan layanan navigasi kami (secara kolektif disebut "Layanan").
            </p>
            <p>
              Dengan mengakses atau menggunakan Layanan kami, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh seluruh poin di bawah ini. Jika Anda tidak menyetujui sebagian atau seluruh isi Ketentuan ini, Anda tidak diperkenankan menggunakan Layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-theme-accent">1. Deskripsi Layanan & Batasan Hukum (Disclaimer)</h2>
            <ul className="list-disc pl-6 space-y-3 text-theme-textDim font-medium">
              <li>
                <strong className="text-theme-main">Murni Platform Informasi:</strong> Dity Flow adalah platform navigasi independen yang menyajikan kalkulasi rute serta simulasi perbandingan biaya administrasi transaksi digital.
              </li>
              <li>
                <strong className="text-theme-main">Bukan Penyedia Jasa Keuangan:</strong> Dity Flow bukanlah bank, dompet digital (e-wallet), lembaga keuangan mikro, ataupun penyedia jasa gerbang pembayaran (payment gateway). Kami tidak menyediakan jasa transfer dana secara hukum atau fisik.
              </li>
              <li>
                <strong className="text-theme-main">Bukan Eksekutor Transaksi:</strong> Dity Flow tidak menampung, memproses, memindahkan, atau menguasai dana Anda. Seluruh pemindahan dana yang dirujuk dalam rute Dity Flow harus Anda eksekusi secara sadar dan mandiri melalui aplikasi resmi milik bank atau e-wallet terkait.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-theme-accent">2. Keandalan Informasi Biaya dan Limitasi</h2>
            <ul className="list-disc pl-6 space-y-3 text-theme-textDim font-medium">
              <li>
                <strong className="text-theme-main">Upaya Akurasi:</strong> Kami berusaha semaksimal mungkin untuk terus memperbarui basis data tarif biaya admin (BI-FAST, kliring, transfer reguler, biaya top-up VA) dan ketentuan kuota gratis berdasarkan kondisi riil pasar perbankan di Indonesia.
              </li>
              <li>
                <strong className="text-theme-main">Risiko Perubahan Tarif:</strong> Tarif administrasi, promosi, dan kuota gratis antar-lembaga dapat berubah sewaktu-waktu secara mendadak oleh pihak bank atau penyedia e-wallet terkait tanpa pemberitahuan sebelumnya kepada kami.
              </li>
              <li>
                <strong className="text-theme-main">Penafian Tanggung Jawab:</strong> Dity Flow tidak memberikan jaminan mutlak atas keandalan 100% data rute yang disajikan. Dity Flow tidak bertanggung jawab atas segala bentuk kerugian finansial, selisih biaya potongan transaksi, atau kerugian tidak langsung lainnya yang dialami pengguna akibat mengikuti petunjuk rute dari Layanan kami.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-theme-accent">3. Akun Pengguna & Penggunaan yang Diperbolehkan</h2>
            <p className="mb-4">Sebagai pengguna Dity Flow, Anda wajib mematuhi ketentuan berikut:</p>
            <ul className="list-disc pl-6 space-y-3 text-theme-textDim font-medium">
              <li><strong className="text-theme-main">Penggunaan Pribadi:</strong> Layanan ini disediakan hanya untuk keperluan penggunaan personal, non-komersial, dan sah di bawah hukum Republik Indonesia.</li>
              <li><strong className="text-theme-main">Kepatuhan Transaksi:</strong> Anda bertanggung jawab penuh atas keabsahan dan kehalalan dana yang Anda transaksikan secara mandiri di luar platform kami.</li>
              <li>
                <strong className="text-theme-main">Larangan Aktivitas Berbahaya:</strong> Anda dilarang keras melakukan tindakan yang dapat merusak, mengganggu, atau membebani sistem infrastruktur kami secara tidak wajar, termasuk tetapi tidak terbatas pada:
                <ul className="list-circle pl-6 mt-2 space-y-2">
                  <li>Melakukan scraping data massal secara otomatis terhadap database rute kami tanpa izin tertulis.</li>
                  <li>Melakukan serangan siber berupa Distributed Denial of Service (DDoS), eksploitasi API endpoint, atau spamming fetch data kueri.</li>
                  <li>Mencoba melakukan rekayasa balik (reverse engineering) terhadap algoritma navigasi rute Dity Flow.</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-theme-accent">4. Hak Kekayaan Intelektual</h2>
            <p className="text-theme-textDim font-medium">
              Seluruh hak, kepemilikan, dan kepentingan atas Layanan Dity Flow, termasuk namun tidak terbatas pada kode sumber (source code), desain antarmuka (UI/UX), logo, nama merek "Dity Flow", algoritma navigasi rekursif, serta struktur database adalah kekayaan intelektual milik tim pengembang Dity Flow yang dilindungi oleh undang-undang hak cipta dan merek dagang yang berlaku di Indonesia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-theme-accent">5. Batasan Tanggung Jawab Hukum</h2>
            <p className="mb-4">Sejauh diizinkan oleh hukum yang berlaku, tim pengembang, afiliasi, dan mitra Dity Flow tidak dapat dituntut atau dimintai pertanggungjawaban hukum atas segala tuntutan ganti rugi, kehilangan data, kegagalan sistem pada m-banking/e-wallet pengguna, atau kerugian materiil maupun imateriil yang timbul dari:</p>
            <ul className="list-disc pl-6 space-y-3 text-theme-textDim font-medium">
              <li>Penggunaan atau ketidakmampuan pengguna dalam mengakses Layanan kami.</li>
              <li>Kesalahan teknis pihak ketiga (seperti gangguan jaringan telekomunikasi, pemeliharaan sistem bank, atau gangguan hosting database).</li>
              <li>Segala instruksi transfer yang tidak berhasil dikirim atau terpotong admin akibat kelalaian input nominal oleh pengguna.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-theme-accent">6. Hukum yang Mengatur</h2>
            <p className="text-theme-textDim font-medium">
              Syarat dan Ketentuan ini diatur, ditafsirkan, dan tunduk sepenuhnya di bawah hukum dan perundang-undangan yang berlaku di wilayah Republik Indonesia. Segala perselisihan yang timbul dari penggunaan Layanan ini akan diupayakan untuk diselesaikan secara musyawarah mufakat terlebih dahulu sebelum dibawa ke yurisdiksi pengadilan negeri yang berwenang.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-theme-accent">7. Perubahan Syarat & Ketentuan</h2>
            <p className="text-theme-textDim font-medium">
              Kami berhak memodifikasi ketentuan ini kapan saja. Setiap perubahan akan segera efektif setelah kami mengunggah versi Ketentuan yang baru di halaman ini. Ketekunan Anda untuk secara berkala memeriksa halaman ini adalah bentuk persetujuan berkelanjutan Anda terhadap perubahan tersebut.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <TermsOfService />
    </StrictMode>
  );
}
