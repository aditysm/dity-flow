import re

with open('src/app-main.tsx', 'r') as f:
    content = f.read()

start_str = """            {/* Results Block */}
            {displayedRoutes.length > 0 && (
              <div className="flex flex-col gap-6 w-full animate-fade-in">
                
                {/* Route Summary Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-html2canvas-ignore>"""

end_str = """                    bypassQuota={bypassQuota}
                  />
                </ReactFlowProvider>
              </div>
            )}"""


new_block = """            {/* Results Block */}
            {displayedRoutes.length > 0 && (
              <div className="flex flex-col gap-10 w-full animate-fade-in">
                
                {/* Theme control bar (Global) */}
                <div className="flex items-center justify-between gap-4 border-b border-theme-border pb-6" data-html2canvas-ignore>
                  <div className="text-xs font-bold text-theme-textDim bg-theme-bg/50 px-3 py-1.5 rounded-xl border border-theme-borderDim select-none">
                    Tata Letak: <span className="text-theme-main font-extrabold">Vertikal</span>
                  </div>

                  {/* Flow Themes swipe bar */}
                  <div className="flex items-center gap-3 bg-theme-card border border-theme-border rounded-xl px-3 py-1.5 select-none">
                    <button 
                      type="button" 
                      onClick={() => swipeTheme(-1)} 
                      className="text-theme-textDim hover:text-theme-main transition-colors p-1.5 bg-theme-bg border border-theme-border rounded-lg shadow-sm cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center gap-2 select-none text-xs font-extrabold text-theme-main tracking-wider">
                      Tema: <span className="text-theme-accent">{flowTheme === "default" ? "Default" : flowTheme === "ocean" ? "Ocean" : "Vibrant"}</span>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => swipeTheme(1)} 
                      className="text-theme-textDim hover:text-theme-main transition-colors p-1.5 bg-theme-bg border border-theme-border rounded-lg shadow-sm cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {displayedRoutes.map((routeList, routeIdx) => {
                  let localFee = 0;
                  routeList.forEach(step => {
                    localFee += parseFloat(step.fee_cost as string) || 0;
                  });
                  const localSavings = Math.max(0, 6500 - localFee);

                  return (
                    <div key={routeIdx} className="flex flex-col gap-6 w-full pb-10 border-b-2 border-dashed border-theme-border/50 last:border-b-0">
                      
                      {displayedRoutes.length > 1 && (
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-theme-accent text-theme-inverted text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-theme-accent/20">
                            Opsi Rute {routeIdx + 1}
                          </span>
                          <span className="text-sm font-semibold text-theme-textDim">
                            Estimasi Biaya: Rp{new Intl.NumberFormat("id-ID").format(localFee)}
                          </span>
                        </div>
                      )}

                      {/* Route Summary Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-html2canvas-ignore>
                        
                        {/* Total Biaya Admin Card with toggle */}
                        <div className="bg-theme-card border border-theme-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-theme-textDim font-bold uppercase tracking-widest">Total Biaya Admin</span>
                            
                            {/* Bandingkan Biaya Admin Toggle nested here */}
                            <div className="flex items-center gap-2 select-none">
                              <div 
                                id={`compare-fees-checkbox-${routeIdx}`}
                                onClick={() => setCompareFees(!compareFees)}
                                className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-all ${
                                  compareFees 
                                    ? "bg-theme-accent border-theme-accent text-theme-inverted" 
                                    : "border-theme-border bg-theme-bg text-transparent"
                                }`}
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                              <div className="relative group flex items-center gap-1">
                                <label onClick={() => setCompareFees(!compareFees)} className="text-[10px] text-theme-textDim cursor-pointer select-none font-extrabold uppercase tracking-wider hover:text-theme-main transition-colors">
                                  Bandingkan
                                </label>
                                <div className="relative inline-block cursor-help text-theme-textDim hover:text-theme-main">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-900 text-white text-[10px] p-2.5 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none font-bold leading-normal text-center border border-slate-800">
                                    Bandingkan penghematan rute transfer Dity Flow dengan biaya transfer langsung biasa (Rp6.500)
                                    <div className="absolute top-full right-2 w-2 h-2 bg-slate-900 border-r border-b border-slate-800 rotate-45"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            {compareFees ? (
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-2xl font-black text-theme-main">
                                  {localFee === 0 ? "Rp0" : `Rp${new Intl.NumberFormat("id-ID").format(localFee)}`}
                                </span>
                                <span className="text-xs font-bold text-theme-textDim">vs</span>
                                <span className="text-lg font-bold text-theme-textDim/50 line-through decoration-rose-500">
                                  Rp6.500
                                </span>
                                <span className="text-[10px] text-theme-textDim font-medium block w-full mt-1">
                                  (Biaya Transfer Langsung)
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-theme-main">
                                  {localFee === 0 ? "Rp0" : `Rp${new Intl.NumberFormat("id-ID").format(localFee)}`}
                                </span>
                                {localFee === 0 && (
                                  <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase">
                                    Gratis
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Total Penghematan Card */}
                        <div className="bg-theme-card border border-theme-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                          <span className="text-xs text-theme-textDim font-bold uppercase tracking-widest">Total Penghematan</span>
                          <div>
                            <span className="text-2xl font-black text-emerald-500">
                              Rp{new Intl.NumberFormat("id-ID").format(localSavings)}
                            </span>
                            <span className="text-[10px] text-theme-textDim block mt-1.5 font-medium">
                              Dibanding biaya transfer langsung (Rp6.500)
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* The Reactive Canvas Area */}
                      <ReactFlowProvider>
                        <FlowContainer 
                          routeData={routeList} 
                          orientation={orientation} 
                          flowTheme={flowTheme} 
                          accentColor={accentColor} 
                          badgeBgColor={badgeBgColor}
                          isDark={isDark}
                          showLoading={(show, msg = "Memproses...") => {
                            setLoading(show);
                            setLoadingMsg(msg);
                          }}
                          savings={localSavings}
                          totalFee={localFee}
                          sourceId={sourceId}
                          destId={destId}
                          institutions={institutions}
                          amountVal={amountVal}
                          bypassQuota={bypassQuota}
                        />
                      </ReactFlowProvider>
                    </div>
                  );
                })}
              </div>
            )}"""

start_idx = content.find(start_str)
end_idx = content.find(end_str, start_idx) + len(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_block + content[end_idx:]
    with open('src/app-main.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find start or end str")

