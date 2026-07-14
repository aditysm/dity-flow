import { ArrowRightIcon, PlusIcon, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { createPortal } from "react-dom";

export function CallToAction() {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleProceed = () => {
    setShowModal(false);
    window.open("https://forms.gle/JcnkEX3ice6qoHnZA", "_blank");
  };

  return (
    <>
      <div className="relative mx-auto flex w-full max-w-4xl flex-col justify-between gap-y-10 border-y border-theme-border bg-[radial-gradient(35%_80%_at_25%_0%,rgba(0,255,148,0.05),transparent)] px-6 py-16 md:py-24 rounded-3xl overflow-hidden">
        <div className="space-y-4 relative z-10">
          <h2 className="text-center font-black text-3xl md:text-5xl tracking-tighter text-theme-main">
            Bantu Kami Membangun Dity Flow
          </h2>
          <p className="text-center text-theme-textDim text-lg max-w-2xl mx-auto font-medium">
            Bantu kembangkan asisten anti-admin Dity Flow dengan isi kuesioner singkat
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Button size="lg" className="w-full sm:w-auto px-12 h-16 rounded-2xl shadow-2xl shadow-theme-accent/30 text-theme-inverted" onClick={handleOpenModal}>
            Ikut Berkontribusi <ArrowRightIcon className="size-5 ml-2" />
          </Button>
        </div>
      </div>

      {showModal && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-theme-bg border border-theme-border rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-theme-textDim hover:text-theme-main transition-colors"
            >
              <X className="size-5" />
            </button>
            <h3 className="text-xl font-bold text-theme-main mb-3">Meninggalkan Dity Flow</h3>
            <p className="text-theme-textDim mb-6">
              Anda akan diarahkan ke halaman Survei Dity Flow (Google Forms). Lanjutkan keluar dari halaman ini?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseModal}>
                Batal
              </Button>
              <Button onClick={handleProceed} className="bg-theme-accent text-theme-inverted hover:bg-theme-accent/90">
                Lanjutkan
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

