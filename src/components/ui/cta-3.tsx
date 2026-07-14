import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export function CallToAction() {
  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col justify-between gap-y-10 border-y border-theme-border bg-[radial-gradient(35%_80%_at_25%_0%,rgba(0,255,148,0.05),transparent)] px-6 py-16 md:py-24 rounded-3xl overflow-hidden">
      <div className="space-y-4 relative z-10">
        <h2 className="text-center font-black text-3xl md:text-5xl tracking-tighter text-theme-main">
          Siap Menghemat Biaya Admin?
        </h2>
        <p className="text-center text-theme-textDim text-lg max-w-2xl mx-auto font-medium">
          Mulai optimalkan rute transaksi Anda hari ini. Bergabunglah dengan ribuan pengguna yang telah cerdas finansial.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
        <Button size="lg" className="w-full sm:w-auto px-12 h-16 rounded-2xl shadow-2xl shadow-theme-accent/30" onClick={scrollToFeatures}>
          Mulai Sekarang <ArrowRightIcon className="size-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
