import re

with open('src/app-main.tsx', 'r') as f:
    content = f.read()

start_str = """                      {displayedRoutes.length > 1 && (
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-theme-accent text-theme-inverted text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-theme-accent/20">
                            Opsi Rute {routeIdx + 1}
                          </span>
                          <span className="text-sm font-semibold text-theme-textDim">
                            Estimasi Biaya: Rp{new Intl.NumberFormat("id-ID").format(localFee)}
                          </span>
                        </div>
                      )}"""

new_block = """                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        {displayedRoutes.length > 1 && (
                          <span className="bg-theme-accent text-theme-inverted text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-theme-accent/20">
                            Opsi Rute {routeIdx + 1}
                          </span>
                        )}
                        <span className="bg-theme-badge border border-theme-border text-theme-main text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                          💡 {routeList.length} Langkah - Total Admin Rp{new Intl.NumberFormat("id-ID").format(localFee)}
                        </span>
                      </div>

                      {/* Alert Badges */}
                      <div className="flex flex-col gap-3">
                        {routeList.some(s => s.deduction_type === 'DEDUCTED_FROM_TARGET') && (
                          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-xl p-3.5 text-sm font-semibold flex items-start gap-3 shadow-sm animate-fade-in">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">PENTING: Biaya admin potong dari saldo masuk. Pastikan nominal transfer dilebihkan jika ingin jumlah pas!</p>
                          </div>
                        )}
                        {routeList.some(s => s.to_institution === 'FLIP' || s.from_institution === 'FLIP') && (
                          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl p-3.5 text-sm font-semibold flex items-start gap-3 shadow-sm animate-fade-in">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">Transfer via Flip wajib menggunakan 3 digit kode unik (misal: Rp50.123). Dana kode unik akan dikembalikan ke saldo Anda.</p>
                          </div>
                        )}
                      </div>"""

start_idx = content.find(start_str)

if start_idx != -1:
    content = content[:start_idx] + new_block + content[start_idx+len(start_str):]
    with open('src/app-main.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Failed")

