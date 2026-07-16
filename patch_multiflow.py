import re

with open('src/app-main.tsx', 'r') as f:
    content = f.read()

# Add dagre import
if "import dagre" not in content:
    content = content.replace('import { toPng }', "import dagre from 'dagre';\nimport { toPng }")

# Update AppMain's displayedRoutes logic
old_displayed_routes = """  const displayedRoutes = useMemo(() => {
    if (!allRouteData || allRouteData.length === 0) return [];
    
    const groups: { [key: number]: Step[] } = {};
    allRouteData.forEach(step => {
      const rid = step.route_id || 1;
      if (!groups[rid]) groups[rid] = [];
      groups[rid].push(step);
    });

    const routesArray = Object.keys(groups).map(k => Number(k)).sort((a,b) => a - b).map(k => groups[k]);
    
    if (showAllRoutes) {
      return routesArray;
    } else {
      return routesArray.length > 0 ? [routesArray[0]] : [];
    }
  }, [allRouteData, showAllRoutes]);"""

new_displayed_routes = """  const displayedRoutes = useMemo(() => {
    if (!allRouteData || allRouteData.length === 0) return [];
    
    const groups: { [key: number]: Step[] } = {};
    allRouteData.forEach(step => {
      const rid = step.route_id || 1;
      if (!groups[rid]) groups[rid] = [];
      groups[rid].push(step);
    });

    const routesArray = Object.keys(groups).map(k => Number(k)).sort((a,b) => a - b).map(k => groups[k]);
    
    const maxFee = 6500;
    const filteredArray = routesArray.filter(route => {
      let localFee = 0;
      route.forEach(step => {
        localFee += parseFloat(step.fee_cost as string) || 0;
      });
      return localFee <= maxFee; // Only show routes with fee <= 6500
    });

    if (showAllRoutes) {
      return filteredArray;
    } else {
      return filteredArray.length > 0 ? [filteredArray[0]] : [];
    }
  }, [allRouteData, showAllRoutes]);"""

content = content.replace(old_displayed_routes, new_displayed_routes)

# Replace FlowContainer map rendering with a single FlowContainer
old_render_flow = """                {displayedRoutes.map((routeList, routeIdx) => {
                  let localFee = 0;
                  routeList.forEach(step => {
                    localFee += parseFloat(step.fee_cost as string) || 0;
                  });
                  const localSavings = Math.max(0, 6500 - localFee);

                  return (
                    <div key={routeIdx} className="flex flex-col gap-6 w-full pb-10 border-b-2 border-dashed border-theme-border/50 last:border-b-0">
                      
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        {displayedRoutes.length > 1 && (
                          <span className="bg-theme-accent text-theme-inverted text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-theme-accent/20">
                            Opsi Rute {routeIdx + 1}
                          </span>
                        )}
                        <span className="bg-theme-badge border border-theme-border text-theme-main text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                          💡 {routeList.length} Langkah - Total Admin Rp{new Intl.NumberFormat("id-ID").format(localFee)}
                        </span>
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
                })}"""

new_render_flow = """                {displayedRoutes.length > 0 && (
                  <div className="flex flex-col gap-6 w-full pb-10">
                    <ReactFlowProvider>
                      <MultiFlowContainer 
                        routesData={displayedRoutes} 
                        orientation={orientation} 
                        flowTheme={flowTheme} 
                        accentColor={accentColor} 
                        badgeBgColor={badgeBgColor}
                        isDark={isDark}
                        showLoading={(show, msg = "Memproses...") => {
                          setLoading(show);
                          setLoadingMsg(msg);
                        }}
                        savings={savings}
                        totalFee={totalFee}
                        sourceId={sourceId}
                        destId={destId}
                        institutions={institutions}
                        amountVal={amountVal}
                        bypassQuota={bypassQuota}
                      />
                    </ReactFlowProvider>
                  </div>
                )}"""

content = content.replace(old_render_flow, new_render_flow)

with open('src/app-main.tsx', 'w') as f:
    f.write(content)

print("Patched AppMain rendering logic!")
