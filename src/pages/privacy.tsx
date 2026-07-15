import React, { useEffect } from "react";
import { Footer } from "../components/ui/footer";
import "../index.css";

export function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Kebijakan Privasi - Dity Flow";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 max-w-4xl mx-auto px-6 pt-6 pb-12 md:pt-10 md:pb-24 w-full relative z-10">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-theme-main mb-4">
            Kebijakan Privasi Dity Flow
          </h1>
          <p className="text-theme-textDim font-medium">Terakhir Diperbarui: 14 Juli 2026</p>
        </div>

        <div className="space-y-12 text-theme-main leading-relaxed">
          <section>
            <p className="mb-4">
              Selamat datang di Dity Flow. Kami berkomitmen untuk melindungi dan menghormati privasi Anda. Kebijakan Privasi ini dirancang untuk membantu Anda memahami bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi yang Anda berikan kepada kami melalui aplikasi atau situs web Dity Flow.
            </p>
            <p>
              Dengan menggunakan layanan kami, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-theme-accent">1. Prinsip Utama Privasi Dity Flow</h2>
            <p className="mb-4">
              Dity Flow adalah aplikasi asisten navigasi rute biaya admin. Kami memegang teguh prinsip Zero Financial Access:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-theme-textDim font-medium">
              <li>
                Kami <strong className="text-theme-main">tidak pernah</strong> meminta, menyimpan, atau mengakses kredensial keuangan Anda (seperti PIN ATM, password m-banking, kode OTP, nomor kartu kredit/debit, atau token keamanan lainnya).
              </li>
              <li>
                Kami <strong className="text-theme-main">tidak pernah</strong> menahan, memproses, atau memindahkan dana Anda secara langsung. Seluruh transaksi pengiriman uang tetap Anda lakukan secara mandiri melalui aplikasi perbankan atau e-wallet resmi pilihan Anda.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-theme-accent">2. Informasi yang Kami Kumpulkan</h2>
            
            <h3 className="text-xl font-bold mb-3 mt-6">A. Informasi yang Anda Berikan Secara Sukarela</h3>
            <ul className="list-disc pl-6 space-y-3 text-theme-textDim font-medium mb-6">
              <li>
                <strong className="text-theme-main">Data Pendaftaran Beta Tester / Langganan:</strong> Apabila Anda tertarik untuk menjadi penguji awal (beta tester) atau mendapatkan pembaruan seputar rilis aplikasi Dity Flow, kami akan mengumpulkan alamat email atau nomor WhatsApp yang Anda masukkan secara sukarela pada formulir yang kami sediakan.
              </li>
              <li>
                <strong className="text-theme-main">Saran & Masukan Pengguna:</strong> Kami mengumpulkan teks masukan, kritik, saran, serta rujukan "jalan tikus" atau trik gratisan transfer yang Anda kirimkan untuk menyempurnakan basis data kami.
              </li>
            </ul>

            <h3 className="text-xl font-bold mb-3">B. Informasi Penggunaan Layanan (Log & Analitik)</h3>
            <ul className="list-disc pl-6 space-y-3 text-theme-textDim font-medium">
              <li>
                <strong className="text-theme-main">Kueri Pencarian Rute:</strong> Untuk menyajikan rute transfer terbaik, sistem kami memproses data input berupa: institusi sumber (bank asal), institusi tujuan (penerima), dan nominal transaksi yang Anda masukkan.
              </li>
              <li>
                <strong className="text-theme-main">Preferensi Fitur (Bypass Limit):</strong> Kami merekam pilihan pengaturan Anda pada aplikasi, termasuk status checkbox "Saya telah melewati batas gratis biaya admin" untuk mempersonalisasi hasil pencarian rute rujukan secara real-time.
              </li>
              <li>
                <strong className="text-theme-main">Data Teknis Perangkat:</strong> Kami dapat mengumpulkan informasi non-identifikasi pribadi seperti tipe perangkat (iOS/Android/Browser), sistem operasi, resolusi layar, dan data analitik performa aplikasi untuk memastikan kestabilan aplikasi.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-theme-accent">3. Bagaimana Kami Menggunakan Informasi Anda</h2>
            <p className="mb-4">Kami menggunakan data yang dikumpulkan untuk tujuan-tujuan berikut:</p>
            <ul className="list-disc pl-6 space-y-3 text-theme-textDim font-medium">
              <li><strong className="text-theme-main">Optimalisasi Rute:</strong> Memproses algoritma graph traversal guna memberikan alternatif rute transfer termurah atau Rp0 secara instan.</li>
              <li><strong className="text-theme-main">Pengembangan Fitur:</strong> Menganalisis perilaku pencarian pengguna untuk memetakan fitur prioritas baru (seperti Optimizer Tagihan, Split-Bill Router, dll.).</li>
              <li><strong className="text-theme-main">Komunikasi & Pembaruan:</strong> Menghubungi Anda terkait status uji coba aplikasi, panduan penggunaan, serta pengumuman rilis penting (khusus bagi pengguna yang mendaftarkan kontak secara sukarela).</li>
              <li><strong className="text-theme-main">Keamanan Sistem:</strong> Mencegah penyalahgunaan API, serangan siber (seperti percobaan spamming fetch atau DDoS), dan menjaga performa server Supabase kami tetap stabil.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-theme-accent">4. Keamanan dan Penyimpanan Data</h2>
            <ul className="list-disc pl-6 space-y-3 text-theme-textDim font-medium">
              <li><strong className="text-theme-main">Keamanan Transmisi:</strong> Seluruh data kueri yang dikirimkan ke server kami dienkripsi menggunakan protokol aman HTTPS/SSL.</li>
              <li><strong className="text-theme-main">Penyimpanan:</strong> Kami menggunakan infrastruktur cloud terpercaya (Supabase) dengan perlindungan berlapis di sisi database.</li>
              <li><strong className="text-theme-main">Retensi Data Kontak:</strong> Alamat email atau nomor WhatsApp Anda akan kami simpan secara aman dan hanya digunakan untuk keperluan komunikasi internal Dity Flow. Anda dapat meminta penghapusan data kontak Anda kapan saja dengan menghubungi dukungan kami.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-theme-accent">5. Pengungkapan Informasi kepada Pihak Ketiga</h2>
            <p className="text-theme-textDim font-medium">
              Kami tidak akan pernah menjual, menyewakan, atau memperdagangkan data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran atau periklanan. Kami hanya membagikan data kepada penyedia layanan infrastruktur teknologi pihak ketiga (seperti Supabase) semata-mata untuk mengoperasikan fungsi dasar aplikasi Dity Flow secara teknis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-theme-accent">6. Perubahan Kebijakan Privasi</h2>
            <p className="text-theme-textDim font-medium">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu guna menyesuaikan dengan perkembangan hukum, regulasi, dan fitur baru pada aplikasi. Perubahan akan diumumkan di halaman ini dengan memperbarui tanggal "Terakhir Diperbarui" di bagian atas dokumen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-theme-accent">7. Hubungi Kami</h2>
            <p className="text-theme-textDim font-medium">
              Jika Anda memiliki pertanyaan, kekhawatiran, atau ingin mengajukan penghapusan data pribadi Anda dari sistem kami, silakan hubungi tim pengembang kami melalui email resmi di: <a href="mailto:dity.store31@gmail.com" className="text-theme-accent hover:underline">dity.store31@gmail.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
