import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  MarkerType, 
  Handle, 
  Position, 
  EdgeLabelRenderer, 
  getSmoothStepPath, 
  BaseEdge,
  type EdgeProps,
  ReactFlowProvider,
  useReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./index.css";
import dagre from 'dagre';
import { toPng } from "html-to-image";
import { 
  ArrowLeftRight, 
  Search, 
  Share2, 
  Download, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  AlertCircle, 
  Check, 
  X, 
  Loader2, 
  Printer, 
  FileText, 
  Image, 
  Clock, 
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  Maximize,
  Minimize2,
  AlertTriangle,
  Scan,
  Zap,
  ZoomIn,
  ZoomOut,
  Landmark,
  Wallet
} from "lucide-react";
import { Footer } from "@/src/components/ui/footer";
import { Instagram, Mail, MessageCircle } from "lucide-react";

// Supabase Configuration
const SUPABASE_URL = "https://msvsqebpidhftdqplclx.supabase.co/rest/v1";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdnNxZWJwaWRoZnRkcXBsY2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MzI5MjIsImV4cCI6MjA5OTQwODkyMn0.YXz9tWpObvZxsS0ys5jJ7w5Uu5pI00j5vbYWk3IS_CE";

const headers = {
  "Content-Type": "application/json",
  "apikey": ANON_KEY,
  "Authorization": `Bearer ${ANON_KEY}`
};

interface Institution {
  id: string;
  name: string;
  type: string;
  logo_url?: string;
}

interface Step {
  route_id: number;
  total_route_fee: number | string;
  from_institution: string;
  to_institution: string;
  fee_cost: number | string;
  deduction_type: string;
  step_notes: string;
}

// Custom Node Component
function InstitutionNode({ data }: any) {
  const { label, isFirst, isLast, logo_url, isAnySelected, isNodeSelected, orientation, type, belongsToRoutes, highlightedRouteId, id } = data;
  const isHorizontal = orientation === "horizontal";

  const routeColors = ['#00C853', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4'];
  const getRouteColor = (rid: number) => routeColors[(rid - 1) % routeColors.length];

  const isHighlighted = highlightedRouteId !== null && belongsToRoutes?.includes(highlightedRouteId);
  const activeColor = highlightedRouteId !== null ? getRouteColor(highlightedRouteId) : "#00C853";
  const isDimmed = highlightedRouteId !== null && !isHighlighted;

  // Compute colors based on theme and selection
  const accentColor = activeColor;
  const borderColor = isHighlighted ? accentColor : (isNodeSelected ? "#00C853" : (isAnySelected ? "var(--color-app-border-dim)" : "var(--color-app-border)"));
  const textColor = (isHighlighted || isNodeSelected) ? accentColor : "var(--color-text-main)";
  const shadow = (isHighlighted || isNodeSelected) ? `0 0 0 2px var(--color-bg), 0 0 0 4px ${accentColor}, 0 0 20px ${accentColor}44` : "0 4px 6px var(--color-shadow)";
  const opacity = isHighlighted ? 1 : (isDimmed ? 0.3 : (isAnySelected ? (isNodeSelected ? 1 : 0.5) : 1));

  const isBank = type?.toLowerCase().includes('bank');
  const isWallet = type?.toLowerCase().includes('wallet') || type?.toLowerCase().includes('digital') || type?.toLowerCase().includes('gopay') || type?.toLowerCase().includes('dana') || type?.toLowerCase().includes('ovo') || type?.toLowerCase().includes('shopee') || type?.toLowerCase().includes('kantong');

  return (
    <div 
      className={`px-4 py-2.5 rounded-2xl font-bold text-sm min-w-[150px] max-w-[200px] flex items-center justify-center border-2 transition-all relative select-none ${(isHighlighted || isNodeSelected) ? 'scale-105 z-10' : ''}`}
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: borderColor,
        color: textColor,
        boxShadow: shadow,
        height: 60,
        gap: '10px',
        opacity: opacity
      } as any}
    >
      {!isFirst && (
        <Handle
          type="target"
          position={isHorizontal ? Position.Left : Position.Top}
          className="!w-2 !h-2 !border-none"
          style={{ background: (isHighlighted || isNodeSelected) ? accentColor : "var(--color-app-border)" }}
        />
      )}
      
      {logo_url ? (
        <div className="w-6 h-6 rounded-lg bg-theme-bg p-1 flex items-center justify-center border border-theme-border/50 overflow-hidden shadow-sm shrink-0">
          <img 
            src={logo_url} 
            alt={label} 
            className="w-full h-full object-contain" 
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-lg bg-theme-bg flex items-center justify-center shrink-0">
          {isBank ? (
            <Landmark className="w-3 h-3 text-theme-textDim" />
          ) : isWallet ? (
            <Wallet className="w-3 h-3 text-theme-textDim" />
          ) : (
            <Zap className="w-3 h-3 text-theme-textDim" />
          )}
        </div>
      )}

      <div className="flex flex-col items-start justify-center flex-1 min-w-0">
        <div className="leading-tight tracking-tight font-black uppercase text-[10px] sm:text-[11px] truncate w-full">
          {id}
        </div>
      </div>

      {!isLast && (
        <Handle
          type="source"
          position={isHorizontal ? Position.Right : Position.Bottom}
          className="!w-2 !h-2 !border-none"
          style={{ background: (isHighlighted || isNodeSelected) ? accentColor : "var(--color-app-border)" }}
        />
      )}
    </div>
  );
}

// Custom Edge Component
function StepEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const { fee_cost, step_notes, routeColor, isSelected, isAnySelected, onSelect, orientation, belongsToRoutes, highlightedRouteId } = (data || {}) as any;
  const isHorizontal = orientation === "horizontal";
  
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
  });

  const isFree = parseFloat(fee_cost) === 0;
  const isHighlighted = highlightedRouteId !== null && belongsToRoutes?.includes(highlightedRouteId);
  
  const routeColors = ['#00C853', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4'];
  const getRouteColor = (rid: number) => routeColors[(rid - 1) % routeColors.length];
  
  const activeColor = highlightedRouteId !== null ? getRouteColor(highlightedRouteId) : (routeColor || "#00C853");
  // If a route is highlighted, non-highlighted edges should be dimmed
  const isDimmed = highlightedRouteId !== null && !isHighlighted;
  const strokeColor = isHighlighted ? activeColor : (isDimmed ? "var(--color-app-border-dim)" : (isAnySelected ? (isSelected ? activeColor : "var(--color-app-border-dim)") : activeColor));
  const strokeWidth = isHighlighted ? 5 : (isSelected ? 4 : 2.5);
  const opacity = isHighlighted ? 1 : (isDimmed ? 0.15 : (isAnySelected ? (isSelected ? 1 : 0.2) : 0.8));

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ 
          stroke: strokeColor, 
          strokeWidth: strokeWidth,
          opacity: opacity,
          transition: "all 0.3s ease",
          ...style
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px) translate(${isHorizontal ? '0px' : '0px'}, ${isHorizontal ? '-45px' : '0px'})`,
            pointerEvents: "all",
            opacity: opacity,
            transition: "all 0.3s ease",
            zIndex: isHighlighted ? 100 : 10
          }}
          className="nodrag nopan"
        >
          <div 
            onClick={onSelect}
            className={`bg-theme-card border rounded-xl p-2 sm:p-2.5 shadow-xl text-center max-w-[200px] min-w-[100px] cursor-pointer transition-all hover:scale-110 active:scale-95 select-none ${
              isHighlighted || isSelected 
                ? "ring-4 scale-105 z-50" 
                : "border-theme-border opacity-90"
            }`}
            style={{ 
              borderColor: (isHighlighted || isSelected) ? activeColor : "var(--color-app-border)",
              boxShadow: (isHighlighted || isSelected) ? `0 10px 15px -3px ${activeColor}44, 0 4px 6px -4px ${activeColor}44` : undefined,
              ringColor: (isHighlighted || isSelected) ? `${activeColor}33` : undefined
            }}
          >
            {isFree ? (
              <div 
                className="font-mono px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black tracking-wider inline-block mb-1 select-none transition-all text-white" 
                style={{ backgroundColor: activeColor }}
              >
                GRATIS
              </div>
            ) : (
              <div 
                className={`font-mono px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black border tracking-wider inline-block mb-1 select-none transition-all ${
                  isHighlighted || isSelected 
                    ? "text-theme-inverted border-transparent" 
                    : "bg-theme-badge text-theme-textDim border-theme-border"
                }`}
                style={{ backgroundColor: (isHighlighted || isSelected) ? activeColor : undefined }}
              >
                Rp{new Intl.NumberFormat("id-ID").format(parseFloat(fee_cost))}
              </div>
            )}
            <div className={`text-[9px] sm:text-[10px] leading-tight font-bold select-none whitespace-normal break-words transition-all ${(isHighlighted || isSelected) ? "text-theme-main" : "text-theme-textDim"}`}>
              {step_notes}
            </div>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes = {
  institutionNode: InstitutionNode,
};

const edgeTypes = {
  stepEdge: StepEdge,
};

// Custom Select Component
function CustomSelect({ 
  label, 
  placeholder, 
  options, 
  value, 
  onChange, 
  excludeId, 
  defaultText 
}: { 
  label: string; 
  placeholder: string; 
  options: Institution[]; 
  value: string; 
  onChange: (id: string) => void; 
  excludeId?: string; 
  defaultText: string; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedItem = useMemo(() => {
    return options.find(o => o.id === value);
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearch("");
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  };

  const filteredOptions = useMemo(() => {
    return options.filter(opt => {
      if (excludeId && opt.id === excludeId) return false;
      return opt.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [options, search, excludeId]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.1em] text-theme-textDim mb-2 block font-medium">
        {label}
      </label>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-3 text-base sm:text-[0.9375rem] text-theme-main text-left focus:outline-none focus:border-theme-accent transition-colors flex items-center justify-between min-h-[56px]"
      >
        <div className="flex items-center gap-3 truncate">
          {selectedItem?.logo_url ? (
            <div className="w-7 h-7 rounded-lg bg-theme-badge p-1 flex items-center justify-center border border-theme-border/50 shrink-0 overflow-hidden">
              <img src={selectedItem.logo_url} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          ) : value ? (
            <div className="w-7 h-7 rounded-lg bg-theme-badge flex items-center justify-center shrink-0">
              <Landmark className="w-4 h-4 text-theme-textDim" />
            </div>
          ) : null}
          <span className={`truncate ${value ? "text-theme-main font-bold" : "text-theme-textDim font-medium"}`}>
            {selectedItem ? selectedItem.name : defaultText}
          </span>
        </div>
        <svg 
          className={`h-4 w-4 text-theme-main transition-transform dropdown-icon flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-theme-card border border-theme-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="p-2 border-b border-theme-border bg-theme-card sticky top-0">
            <input
              type="text"
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-theme-accent text-theme-main"
              placeholder="Cari bank/e-wallet..."
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-xs sm:text-sm text-theme-main hover:bg-theme-border transition-colors truncate font-medium"
            >
              {defaultText}
            </button>
            {filteredOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-3 ${
                  value === opt.id 
                    ? "bg-theme-accent/10 text-theme-accent font-bold" 
                    : "text-theme-main hover:bg-theme-border font-medium"
                }`}
              >
                {opt.logo_url ? (
                  <div className="w-6 h-6 rounded-lg bg-theme-badge p-1 flex items-center justify-center border border-theme-border/50 shrink-0 overflow-hidden shadow-sm">
                    <img src={opt.logo_url} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-theme-bg flex items-center justify-center shrink-0">
                    <Landmark className="w-3 h-3 text-theme-textDim" />
                  </div>
                )}
                <span className="truncate">{opt.name}</span>
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div className="p-3 text-center text-xs text-theme-textDim">Tidak ditemukan</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function oklabToRgb(l: number, a_: number, b_: number, a: number = 1): string {
  const l_ = l + 0.3963377774 * a_ + 0.2158037573 * b_;
  const m_ = l - 0.1055613458 * a_ - 0.0638541728 * b_;
  const s_ = l - 0.0894841775 * a_ - 1.291485548 * b_;
  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;
  const r_lin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g_lin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const b_lin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707612701 * s3;
  const gamma = (v: number) => v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  const r = Math.max(0, Math.min(255, Math.round(gamma(r_lin) * 255)));
  const g = Math.max(0, Math.min(255, Math.round(gamma(g_lin) * 255)));
  const b = Math.max(0, Math.min(255, Math.round(gamma(b_lin) * 255)));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function oklchToRgb(l: number, c: number, h: number, a: number = 1): string {
  if (c === 0) {
    const v = Math.round(l * 255);
    return `rgba(${v}, ${v}, ${v}, ${a})`;
  }
  const hRad = (h * Math.PI) / 180;
  const a_ = c * Math.cos(hRad);
  const b_ = c * Math.sin(hRad);
  return oklabToRgb(l, a_, b_, a);
}

function replaceModernColors(str: string): string {
  if (typeof str !== "string") return str;
  if (!str.includes("oklch") && !str.includes("oklab")) return str;
  let res = str.replace(/oklch\s*\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.%]+))?\s*\)/gi, (match, lStr, cStr, hStr, aStr) => {
    const l = parseFloat(lStr);
    const c = parseFloat(cStr);
    const h = parseFloat(hStr);
    let a = 1;
    if (aStr) {
      const trimmed = aStr.trim();
      if (trimmed.endsWith('%')) {
        a = parseFloat(trimmed) / 100;
      } else {
        a = parseFloat(trimmed);
      }
    }
    return oklchToRgb(l, c, h, a);
  });
  res = res.replace(/oklab\s*\(\s*([\d.]+)\s+([-+\d.]+)\s+([-+\d.]+)(?:\s*\/\s*([\d.%]+))?\s*\)/gi, (match, lStr, a_Str, b_Str, aStr) => {
    const l = parseFloat(lStr);
    const a_ = parseFloat(a_Str);
    const b_ = parseFloat(b_Str);
    let a = 1;
    if (aStr) {
      const trimmed = aStr.trim();
      if (trimmed.endsWith('%')) {
        a = parseFloat(trimmed) / 100;
      } else {
        a = parseFloat(trimmed);
      }
    }
    return oklabToRgb(l, a_, b_, a);
  });
  return res;
}

// Inside the Flow Component to have access to useReactFlow
function MultiFlowContainer({ 
  routesData, 
  allRouteData,
  orientation, 
  flowTheme, 
  accentColor, 
  badgeBgColor,
  isDark,
  showLoading,
  savings,
  totalFee,
  sourceId,
  destId,
  institutions,
  bypassQuota,
  showAllRoutes,
  highlightedRouteId,
  setHighlightedRouteId,
  selectedEdgeId,
  setSelectedEdgeId
}: {
  routesData: Step[][];
  allRouteData: Step[][];
  orientation: "horizontal" | "vertical";
  flowTheme: "default" | "ocean" | "vibrant";
  accentColor: string;
  badgeBgColor: string;
  isDark: boolean;
  showLoading: (show: boolean, msg?: string) => void;
  savings: number;
  totalFee: number;
  sourceId: string;
  destId: string;
  institutions: Institution[];
  bypassQuota: boolean;
  showAllRoutes: boolean;
  highlightedRouteId: number | null;
  setHighlightedRouteId: (id: number | null) => void;
  selectedEdgeId: string | null;
  setSelectedEdgeId: (id: string | null) => void;
}) {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const lastRoutesDataHash = useRef<string>("");
  const initialLayoutDone = useRef<boolean>(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState<string>("");
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const flowContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        if (flowContainerRef.current?.requestFullscreen) {
          await flowContainerRef.current.requestFullscreen();
        } else if ((flowContainerRef.current as any).webkitRequestFullscreen) {
          await (flowContainerRef.current as any).webkitRequestFullscreen();
        } else if ((flowContainerRef.current as any).msRequestFullscreen) {
          await (flowContainerRef.current as any).msRequestFullscreen();
        }
      } catch (err) {
        console.error("Failed to enter fullscreen", err);
        setIsFullscreen(true);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch (err) {
        console.error("Failed to exit fullscreen", err);
        setIsFullscreen(false);
      }
    }
  };

  const { zoomIn, zoomOut } = useReactFlow();

  const isExpensive = useMemo(() => {
    return totalFee >= 6500;
  }, [totalFee]);

  // Auto-fit when fullscreen or highlighted route changes
  useEffect(() => {
    setTimeout(() => {
      if (highlightedRouteId !== null) {
        const routeNodes = nodes.filter(n => n.data.belongsToRoutes?.includes(highlightedRouteId));
        if (routeNodes.length > 0) {
          fitView({ nodes: routeNodes, padding: 0.35, duration: 800 });
          return;
        }
      }
      fitView({ padding: 0.25, duration: 600 });
    }, isFullscreen ? 400 : 100);
  }, [isFullscreen, fitView, highlightedRouteId, nodes]);

  const handleFitView = () => {
    if (highlightedRouteId !== null) {
      const routeNodes = nodes.filter(n => n.data.belongsToRoutes?.includes(highlightedRouteId));
      if (routeNodes.length > 0) {
        fitView({ 
          nodes: routeNodes, 
          padding: 0.3, 
          duration: 600 
        });
        return;
      }
    }
    fitView({ padding: 0.25, duration: 400 });
  };

  const handleShare = async () => {
    const totalFeeFormatted = totalFee === 0 ? "Gratis" : `Rp${new Intl.NumberFormat("id-ID").format(totalFee)}`;
    const savingsFormatted = `Rp${new Intl.NumberFormat("id-ID").format(savings)}`;
    
    // Find institution names
    const sourceName = institutions.find(i => i.id === sourceId)?.name || "Sumber";
    const destName = institutions.find(i => i.id === destId)?.name || "Tujuan";
    
    let routeInfo = "";
    if (routesData && routesData.length > 0) {
      if (showAllRoutes) {
        routeInfo = routesData.map((route, rIdx) => {
          const rTotalFee = route.reduce((sum, s) => sum + (parseFloat(s.fee_cost as string) || 0), 0);
          const rFeeFormatted = rTotalFee === 0 ? "Gratis" : `Rp${new Intl.NumberFormat("id-ID").format(rTotalFee)}`;
          const flow = route.map((s, idx) => {
            if (idx === 0) return `${s.from_institution} ➔ ${s.to_institution}`;
            return ` ➔ ${s.to_institution}`;
          }).join("");
          
          const steps = route.map((step, idx) => {
            const fee = parseFloat(step.fee_cost as string) === 0 ? "Gratis" : `Rp${new Intl.NumberFormat("id-ID").format(Number(step.fee_cost))}`;
            return `   ${idx + 1}. ${step.from_institution} ➔ ${step.to_institution} (Biaya: ${fee})`;
          }).join("\n");
          
          return `Opsi Rute ${rIdx + 1}: ${flow}\n${steps}\n`;
        }).join("\n");
      } else {
        const bestRoute = routesData[0];
        const flow = bestRoute.map((s, idx) => {
          if (idx === 0) return `${s.from_institution} ➔ ${s.to_institution}`;
          return ` ➔ ${s.to_institution}`;
        }).join("");
        
        const steps = bestRoute.map((step, idx) => {
          const fee = parseFloat(step.fee_cost as string) === 0 ? "Gratis" : `Rp${new Intl.NumberFormat("id-ID").format(Number(step.fee_cost))}`;
          return `${idx + 1}. ${step.from_institution} ➔ ${step.to_institution} (Biaya: ${fee})`;
        }).join("\n");
        
        routeInfo = `Rute Terbaik: ${flow}\n${steps}`;
      }
    }

    const shareText = `Dity Flow - Optimasi Rute Transfer Kas Hemat 🚀\n\n` +
      `• Sumber Dana: ${sourceName}\n` +
      `• Tujuan Transfer: ${destName}\n` +
      `• Total Biaya Admin Terbaik: ${totalFeeFormatted}\n` +
      `• Total Penghematan: ${savingsFormatted}\n\n` +
      `${routeInfo}\n\n` +
      `Optimalkan transfer kas Anda dengan Dity Flow!\n` +
      `Cek rute lengkapnya di sini: ${window.location.origin}${window.location.pathname}?source=${sourceId}&dest=${destId}${bypassQuota ? "&bypass=true" : ""}\n\n` +
      `Generated by Dity Flow`;

    const copyToClipboardFallback = (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setToastMsg("Detail rute berhasil disalin!");
        setTimeout(() => setToastMsg(null), 3000);
      }).catch(err => {
        setToastMsg("Gagal menyalin rute: " + err.message);
        setTimeout(() => setToastMsg(null), 3000);
      });
    };

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Rute Transfer Hemat Dity Flow",
          text: shareText
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          copyToClipboardFallback(shareText);
        }
      }
    } else {
      copyToClipboardFallback(shareText);
    }
  };

  const handleOpenPreview = async () => {
    if (document.fullscreenElement) {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        console.error("Failed to exit fullscreen", err);
      }
    }

    setIsGeneratingPreview(true);
    setIsPreviewModalOpen(true);
    setPreviewImageSrc("");
    
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function(el: Element, pseudoElt?: string) {
      const style = originalGetComputedStyle.call(window, el, pseudoElt);
      return new Proxy(style, {
        get(target, prop) {
          const value = Reflect.get(target, prop);
          if (typeof value === "function") {
            return value.bind(target);
          }
          return value;
        }
      });
    };

    try {
      const isMobile = window.innerWidth < 768;
      const fitPadding = isMobile ? 0.35 : 0.25;
      fitView({ padding: fitPadding });
      await new Promise(r => setTimeout(r, 900));

      const container = flowContainerRef.current;
      if (!container) throw new Error("Sandbox container not found");
      
      const watermark = container.querySelector(".export-watermark");
      if (watermark) watermark.classList.remove("hidden");
      
      const originalOverflow = container.style.overflow;
      container.style.overflow = "visible";

      const dataUrl = await toPng(container, {
        backgroundColor: isDark ? "#050505" : "#f8fafc",
        pixelRatio: 3,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        },
        skipFonts: true,
        filter: (element) => {
          if (!element || !(element instanceof Element)) return true;
          return !(element.hasAttribute("data-html2canvas-ignore") || 
                   element.classList?.contains("react-flow__controls") ||
                   element.classList?.contains("react-flow__attribution") ||
                   element.closest("[data-html2canvas-ignore]") !== null);
        }
      });

      container.style.overflow = originalOverflow;
      if (watermark) watermark.classList.add("hidden");

      fitView({ padding: 0.2, duration: 0 });
      setPreviewImageSrc(dataUrl);

    } catch (err) {
      console.error(err);
      setToastMsg("Gagal memuat pratinjau gambar.");
      setTimeout(() => setToastMsg(null), 3000);
      setIsPreviewModalOpen(false);
    } finally {
      window.getComputedStyle = originalGetComputedStyle;
      setIsGeneratingPreview(false);
    }
  };

  const handleSavePNGFromPreview = () => {
    if (!previewImageSrc) return;
    const link = document.createElement("a");
    link.download = `dity-flow-route-${Date.now()}.png`;
    link.href = previewImageSrc;
    link.click();
    setIsPreviewModalOpen(false);
  };

  useEffect(() => {
    if (routesData && routesData.length > 0) {
      const routesHash = JSON.stringify(routesData.map(r => r.map(s => `${s.route_id}-${s.from_institution}-${s.to_institution}`).join('-')).join('|'));
      const isNewData = routesHash !== lastRoutesDataHash.current;
      
      const isHorizontal = orientation === "horizontal";
      const routeColors = ['#00C853', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4'];
      
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));
      
      const direction = isHorizontal ? 'LR' : 'TB';
      // Increased separation for branches to prevent clumping
      const ranksep = isHorizontal ? 350 : 300;
      const nodesep = isHorizontal ? 300 : 700; 
      const edgesep = 200;
      dagreGraph.setGraph({ 
        rankdir: direction, 
        marginx: 150, 
        marginy: 150, 
        nodesep, 
        edgesep, 
        ranksep, 
        ranker: 'network-simplex'
      });

      const nodeWidth = 200;
      const nodeHeight = 100;

      const uniqueNodesMap = new Map<string, any>();
      const edgesList: any[] = [];
      const edgesMap = new Map<string, boolean>();

      // Extract unique nodes and build edge list with route-specific data
      routesData.forEach((route, routeIndex) => {
        const routeColor = routeColors[routeIndex % routeColors.length];
        const routeIdValue = route[0]?.route_id || (routeIndex + 1);
        
        route.forEach((step) => {
          // Track unique institutions
          [step.from_institution, step.to_institution].forEach(instId => {
            if (!uniqueNodesMap.has(instId)) {
              const instInfo = institutions.find(i => i.id === instId);
              uniqueNodesMap.set(instId, { 
                id: instId, 
                name: instInfo?.name || instId,
                logo_url: instInfo?.logo_url,
                type: instInfo?.type 
              });
            }
          });

          // Unique edge per route path segment
          const edgeId = `edge-${step.from_institution}-${step.to_institution}`;
          const existingEdge = edgesList.find(e => e.id === edgeId);

          if (existingEdge) {
            // Add route ID to the list of routes this edge belongs to
            if (!existingEdge.data.belongsToRoutes.includes(routeIdValue)) {
              existingEdge.data.belongsToRoutes.push(routeIdValue);
            }
          } else {
            edgesList.push({
              id: edgeId,
              source: step.from_institution,
              target: step.to_institution,
              type: "stepEdge",
              animated: (selectedEdgeId === null && highlightedRouteId === null) || selectedEdgeId === edgeId || (highlightedRouteId !== null && [routeIdValue].includes(highlightedRouteId)),
              data: {
                fee_cost: step.fee_cost,
                deduction_type: step.deduction_type,
                step_notes: step.step_notes,
                routeColor: routeColor,
                orientation,
                isSelected: selectedEdgeId === edgeId,
                isAnySelected: selectedEdgeId !== null,
                onSelect: () => setSelectedEdgeId(edgeId),
                belongsToRoutes: [routeIdValue],
                highlightedRouteId
              },
            });
          }
        });
      });

      const nodesList: any[] = Array.from(uniqueNodesMap.values()).map(n => {
        let isNodeSelected = false;
        if (selectedEdgeId) {
          const selectedEdge = edgesList.find(e => e.id === selectedEdgeId);
          if (selectedEdge && (selectedEdge.source === n.id || selectedEdge.target === n.id)) {
            isNodeSelected = true;
          }
        }

        // Check if node belongs to highlighted route
        const nodeBelongsToRoutes = edgesList
            .filter(e => e.source === n.id || e.target === n.id)
            .flatMap(e => e.data.belongsToRoutes);
        const uniqueBelongsTo = Array.from(new Set(nodeBelongsToRoutes));

        return {
          id: n.id,
          type: "institutionNode",
          data: {
            id: n.id,
            label: n.name,
            logo_url: n.logo_url,
            type: n.type,
            isFirst: n.id === sourceId,
            isLast: n.id === destId,
            orientation,
            isAnySelected: selectedEdgeId !== null || highlightedRouteId !== null,
            isNodeSelected: isNodeSelected || (highlightedRouteId !== null && uniqueBelongsTo.includes(highlightedRouteId)),
            belongsToRoutes: uniqueBelongsTo,
            highlightedRouteId
          }
        };
      });

      // Finalize animation and metadata for edges
      edgesList.forEach(edge => {
        const isHighlighted = highlightedRouteId !== null && edge.data.belongsToRoutes.includes(highlightedRouteId);
        edge.animated = (selectedEdgeId === null && highlightedRouteId === null) || selectedEdgeId === edge.id || isHighlighted;
        edge.data.highlightedRouteId = highlightedRouteId;
      });

      if (isNewData) {
        lastRoutesDataHash.current = routesHash;
        nodesList.forEach((node) => {
          dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
        });

        edgesList.forEach((edge) => {
          dagreGraph.setEdge(edge.source, edge.target);
        });

        dagre.layout(dagreGraph);

        const layoutedNodes = nodesList.map((node) => {
          const nodeWithPosition = dagreGraph.node(node.id);
          return {
            ...node,
            position: {
              x: nodeWithPosition.x - nodeWidth / 2,
              y: nodeWithPosition.y - nodeHeight / 2,
            }
          };
        });

        setNodes(layoutedNodes);
        setEdges(edgesList);
        
        setTimeout(() => {
          fitView({ padding: 0.25, duration: 400 });
        }, 100);
      } else {
        // Just update metadata without overriding positions
        setNodes(nds => nds.map(node => {
          const newNodeData = nodesList.find(n => n.id === node.id);
          if (newNodeData) {
            return { ...node, data: { ...node.data, ...newNodeData.data } };
          }
          return node;
        }));
        setEdges(edgesList);
      }
    }
  }, [routesData, orientation, accentColor, selectedEdgeId, fitView, sourceId, destId, institutions, highlightedRouteId]);

return (
    <div id="optimizer-workspace" className="bg-theme-card border border-theme-border rounded-[24px] p-5 sm:p-6 md:p-8 lg:p-10 relative flex flex-col overflow-hidden min-h-[480px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4" data-html2canvas-ignore>
        <div>
          <h2 className="text-lg sm:text-xl font-bold">Optimasi Rute Kas</h2>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="bg-theme-badge text-theme-main px-2.5 py-1 rounded-md text-[0.625rem] uppercase tracking-wider font-extrabold border border-theme-border">
              {(() => {
                if (highlightedRouteId !== null) {
                  const activeRoute = routesData.find(r => (r[0]?.route_id || 0) === highlightedRouteId || r[0]?.route_id === highlightedRouteId);
                  if (activeRoute) {
                    const calculateDepth = (steps: Step[]) => {
                      if (!steps || steps.length === 0) return 0;
                      const graph: Record<string, string[]> = {};
                      steps.forEach(s => {
                        if (!graph[s.from_institution]) graph[s.from_institution] = [];
                        graph[s.from_institution].push(s.to_institution);
                      });
                      let depth = 0;
                      let currentNodes = [sourceId];
                      const visited = new Set<string>();
                      while (currentNodes.length > 0) {
                        let nextNodes: string[] = [];
                        for (const node of currentNodes) {
                          if (visited.has(node)) continue;
                          visited.add(node);
                          if (node === destId) return depth;
                          const neighbors = graph[node] || [];
                          nextNodes.push(...neighbors);
                        }
                        currentNodes = nextNodes;
                        depth++;
                        if (depth > 12) break;
                      }
                      return depth || steps.length;
                    };
                    return `${calculateDepth(activeRoute)} Langkah Terpilih`;
                  }
                }
                return `${routesData.length} Rute`;
              })()}
            </span>
            {isExpensive && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                Rute Mahal (&ge; Rp6.500)
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[11px] text-theme-textDim bg-theme-bg/50 px-2.5 py-1 rounded-full border border-theme-borderDim select-none transition-all duration-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-theme-accent"></span>
              </span>
              <span>Tip: Klik langkah transfer untuk menerangi rute</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={handleShare} 
            className="bg-theme-bg border border-theme-border hover:border-theme-accent text-theme-main px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Share2 className="w-4 h-4 text-theme-accent" />
            Bagikan
          </button>
          
          <button 
            type="button"
            onClick={handleOpenPreview} 
            className="bg-theme-bg border border-theme-border hover:border-theme-accent text-theme-main px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4 text-theme-accent" />
            Unduh
          </button>

          <button 
            type="button"
            onClick={toggleFullscreen} 
            className="bg-theme-bg border border-theme-border hover:border-theme-accent text-theme-main px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Maximize2 className="w-4 h-4 text-theme-accent" />
            Layar Penuh
          </button>
        </div>
      </div>

      <div 
        ref={flowContainerRef}
        data-theme={isDark ? "dark" : "light"}
        className={`w-full relative border border-theme-border rounded-2xl bg-theme-bg transition-all flex flex-col overflow-hidden ${
          isFullscreen 
            ? "fixed inset-0 z-[120]" 
            : "h-[450px] sm:h-[500px] md:h-[550px]"
        }`}
        style={{ boxShadow: "0 10px 30px -10px var(--color-shadow)" }}
      >
        {isFullscreen && (
          <div className="flex items-center justify-between border-b border-theme-border bg-theme-bg px-4 py-3 sm:px-6 z-20" data-html2canvas-ignore>
            <div className="flex items-center gap-3">
              <div 
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-lg overflow-hidden p-1.5 ${isDark ? 'bg-[#121214] border border-[#242426]' : 'bg-[#00ba68]'}`}
              >
                <img 
                  src={isDark ? "/assets/logo-green.svg" : "/assets/logo-white.svg"} 
                  alt="Dity Flow" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm sm:text-base font-black text-theme-main tracking-tight leading-none">
                  Dity Flow
                </h3>
                <span className="text-[10px] font-bold text-theme-textDim uppercase tracking-widest mt-0.5">Workspace</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-2.5 rounded-xl bg-theme-card border border-theme-border hover:border-theme-accent transition-all flex items-center gap-2 group cursor-pointer"
              >
                <X className="w-4 h-4 text-theme-main group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline text-xs font-bold text-theme-main">Keluar</span>
              </button>
            </div>
          </div>
        )}

        <div className={`flex-1 w-full relative ${isFullscreen ? "p-4 sm:p-6 md:p-8" : ""}`}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            defaultEdgeOptions={{ markerEnd: { type: MarkerType.ArrowClosed } }}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeClick={(_event, edge) => {
              setSelectedEdgeId(edge.id);
              setHighlightedRouteId(null);
            }}
            onPaneClick={() => {
              setSelectedEdgeId(null);
              setHighlightedRouteId(null);
            }}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            minZoom={0.2}
            maxZoom={1.5}
            nodesConnectable={false}
            nodesDraggable={true}
            panOnDrag={true}
            proOptions={{ hideAttribution: true }}
            className="react-flow-custom-workspace"
          >
            <div 
              className="absolute bottom-4 right-4 flex flex-col gap-2 z-10"
              data-html2canvas-ignore
            >
              <button
                type="button"
                onClick={() => zoomIn()}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-theme-card border border-theme-border rounded-xl shadow-md flex items-center justify-center text-theme-textDim hover:text-theme-main hover:border-theme-accent transition-all group relative cursor-pointer"
              >
                <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
                <div className="absolute right-full mr-2 px-2 py-1 bg-theme-main text-theme-bg text-[10px] sm:text-xs font-bold rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl">
                  Zoom In
                  <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-theme-main"></div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => zoomOut()}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-theme-card border border-theme-border rounded-xl shadow-md flex items-center justify-center text-theme-textDim hover:text-theme-main hover:border-theme-accent transition-all group relative cursor-pointer"
              >
                <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <div className="absolute right-full mr-2 px-2 py-1 bg-theme-main text-theme-bg text-[10px] sm:text-xs font-bold rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl">
                  Zoom Out
                  <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-theme-main"></div>
                </div>
              </button>
              <button
                type="button"
                onClick={handleFitView}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-theme-card border border-theme-border rounded-xl shadow-md flex items-center justify-center text-theme-textDim hover:text-theme-main hover:border-theme-accent transition-all group relative cursor-pointer"
              >
                <Scan className="w-4 h-4 sm:w-5 sm:h-5" />
                <div className="absolute right-full mr-2 px-2 py-1 bg-theme-main text-theme-bg text-[10px] sm:text-xs font-bold rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl">
                  Pusatkan
                  <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-theme-main"></div>
                </div>
              </button>
            </div>
            <Background 
              variant="dots" 
              gap={16} 
              size={1.5} 
              color={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"} 
            />
          </ReactFlow>

          {/* Watermark inside the sandbox, visible on export PNG only */}
          <div 
            className="export-watermark absolute top-2 right-2 text-theme-textDim/30 text-[9px] font-bold tracking-widest font-mono uppercase select-none pointer-events-none hidden"
            style={{ zIndex: 10, maxWidth: '150px', textAlign: 'right' }}
          >
            Generated by Dity Flow - {window.location.host}
          </div>

          {/* Unified Floating Action Dock - ONLY shown when in fullscreen */}
          {isFullscreen && (
            <div 
            className="absolute bottom-4 left-4 flex items-center gap-1 bg-theme-card/95 backdrop-blur-md border border-theme-border p-1.5 rounded-2xl z-10 select-none animate-in fade-in slide-in-from-bottom-4" 
            style={{ boxShadow: "0 10px 40px var(--color-shadow)" }}
            data-html2canvas-ignore
          >
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 hover:bg-theme-bg rounded-xl text-theme-main hover:text-theme-accent transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="Bagikan Tautan Rute"
              >
                <Share2 className="w-4 h-4 text-theme-accent" />
                <span className="text-xs font-bold sm:inline hidden">Bagikan</span>
              </button>

              <button
                type="button"
                onClick={handleOpenPreview}
                className="p-2.5 hover:bg-theme-bg rounded-xl text-theme-main hover:text-theme-accent transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="Ekspor Gambar PNG"
              >
                <Download className="w-4 h-4 text-theme-accent" />
                <span className="text-xs font-bold sm:inline hidden">Unduh</span>
              </button>

              <div className="w-px h-6 bg-theme-border self-center mx-1"></div>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl text-rose-500 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="Keluar Layar Penuh"
              >
                <Minimize2 className="w-4 h-4" />
                <span className="text-xs font-bold sm:inline hidden">Keluar</span>
              </button>
            </div>
          )}

          {/* Toast Notification Container inside FlowContainer */}
          {toastMsg && (
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[130] animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-none" data-html2canvas-ignore>
              <div className="bg-slate-950/95 border border-theme-accent/30 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-theme-accent animate-pulse" />
                <span>{toastMsg}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Export Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4" data-html2canvas-ignore>
          <div className="bg-theme-card border border-theme-border rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-250">
            <div className="p-6 border-b border-theme-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-theme-main">Pratinjau Hasil Ekspor</h3>
                <p className="text-xs text-theme-textDim font-medium mt-1">Verifikasi tata letak dan skema warna sebelum menyimpan gambar</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsPreviewModalOpen(false)} 
                className="p-2 hover:bg-theme-border rounded-lg text-theme-textDim hover:text-theme-main transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-theme-bg/30 min-h-[300px]">
              {isGeneratingPreview ? (
                <div className="flex flex-col items-center gap-3 text-center">
                  <Loader2 className="w-10 h-10 text-theme-accent animate-spin" />
                  <p className="text-sm font-bold text-theme-main">Sedang merender gambar beresolusi tinggi...</p>
                  <p className="text-xs text-theme-textDim">Harap tunggu beberapa saat.</p>
                </div>
              ) : previewImageSrc ? (
                <div className="w-full flex flex-col items-center gap-4">
                  <div 
                    className="border border-theme-border rounded-xl overflow-hidden max-w-full p-3 bg-black/40 shadow-2xl"
                  >
                    <img 
                      src={previewImageSrc} 
                      alt="Flowchart Export Preview" 
                      className="max-h-[50vh] w-auto object-contain rounded-lg"
                    />
                  </div>
                  <p className="text-xs text-theme-textDim text-center font-medium">
                    Resolusi: <span className="font-bold text-theme-main">2.0x Ultra-HD</span> • Format: <span className="font-bold text-theme-main">PNG</span>
                  </p>
                </div>
              ) : (
                <div className="text-sm text-theme-textDim">Gagal memuat gambar pratinjau.</div>
              )}
            </div>

            <div className="p-6 border-t border-theme-border bg-theme-bg/10 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="w-full sm:w-auto px-5 py-3 border border-theme-border text-theme-main rounded-xl text-sm font-bold hover:bg-theme-border transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isGeneratingPreview || !previewImageSrc}
                onClick={handleSavePNGFromPreview}
                className="w-full sm:w-auto px-6 py-3 bg-theme-accent text-theme-inverted rounded-xl text-sm font-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Unduh PNG Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function AppMain() {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.title = "Optimasi Rute - Dity Flow";
  }, []);
  
  // Theme Synchronization
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (typeof (window as any).toggleTheme === 'function') {
        (window as any).toggleTheme();
        setIsDark(document.documentElement.classList.contains("dark"));
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [sourceId, setSourceId] = useState("");
  const [destId, setDestId] = useState("");
  const [bypassQuota, setBypassQuota] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [allRouteData, setAllRouteData] = useState<Step[][]>([]);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [highlightedRouteId, setHighlightedRouteId] = useState<number | null>(null);
  const [isRoutesExpanded, setIsRoutesExpanded] = useState(false);
  const [lastSearchParams, setLastSearchParams] = useState<{src: string, dst: string, bypass: boolean} | null>(null);

  // Config options matching original
  const [flowTheme, setFlowTheme] = useState<"default" | "ocean" | "vibrant">("default");
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("vertical");
  const [compareFees, setCompareFees] = useState(true);
  const [showAllRoutes, setShowAllRoutes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Track global theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Compute CSS colors based on flowTheme preset and dark/light modes
  const { accentColor, badgeBgColor } = useMemo(() => {
    if (flowTheme === "ocean") {
      return {
        accentColor: "#3b82f6",
        badgeBgColor: "rgba(59, 130, 246, 0.12)",
      };
    }
    if (flowTheme === "vibrant") {
      return {
        accentColor: "#a855f7",
        badgeBgColor: "rgba(168, 85, 247, 0.12)",
      };
    }
    // Default
    return {
      accentColor: isDark ? "#00FF94" : "#00ba68",
      badgeBgColor: isDark ? "rgba(0, 255, 148, 0.12)" : "rgba(0, 186, 104, 0.12)",
    };
  }, [flowTheme, isDark]);

  // Synchronize CSS custom vars (only for non-theme-breaking colors)
  useEffect(() => {
    document.documentElement.style.setProperty("--color-badge", isDark ? "#242426" : "#f1f5f9");
    document.documentElement.style.setProperty("--color-bg-accent-alpha", badgeBgColor);
  }, [isDark, badgeBgColor]);

  // Fetch institutions on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setLoadingMsg("Sinkronisasi data...");
      console.log("Fetching institutions from Supabase...");
      try {
        const response = await fetch(`${SUPABASE_URL}/institutions?select=id,name,type,logo_url&is_active=eq.true`, { 
          headers: {
            ...headers,
            "Cache-Control": "no-cache"
          } 
        });
        if (!response.ok) {
          const errBody = await response.text();
          console.error("Institution fetch failed:", response.status, errBody);
          throw new Error(`Gagal mengambil data lembaga keuangan (Status: ${response.status}).`);
        }
        const data = await response.json();
        console.log("Institutions loaded:", data.length);
        setInstitutions(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setErrorMsg(err.message || "Gagal terhubung ke database rute.");
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Load recent searches
    const stored = localStorage.getItem("dityFlowRecentSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        setRecentSearches([]);
      }
    }

    // Parse URL params for pre-filled searches (sharing support)
    const params = new URLSearchParams(window.location.search);
    const src = params.get("source");
    const dst = params.get("dest");
    const bypass = params.get("bypass");

    if (src && dst) {
      setSourceId(src);
      setDestId(dst);
      if (bypass === "true") {
        setBypassQuota(true);
      }
      // Submit will be triggered automatically in another useEffect once institutions load
    }
  }, []);

  // Trigger auto-submit when URL search query matches fully loaded institutions
  useEffect(() => {
    if (institutions.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const src = params.get("source");
      const dst = params.get("dest");
      if (src && dst) {
        handleSearch(src, dst, params.get("bypass") === "true");
      }
    }
  }, [institutions]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  // Perform search route querying
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !destId) {
      setErrorMsg("Harap pilih sumber dana dan tujuan transfer.");
      return;
    }
    handleSearch(sourceId, destId, bypassQuota);
  };

  const saveSearchToCache = (src: string, dst: string, bypass: boolean, data: any) => {
    try {
      const cachedStr = localStorage.getItem("dityFlowCachedSearchResults");
      let cache: any[] = [];
      if (cachedStr) {
        cache = JSON.parse(cachedStr);
      }
      
      const newItem = {
        src,
        dst,
        bypass,
        data,
        timestamp: Date.now()
      };
      
      let updated = [newItem, ...cache.filter((item: any) => !(item.src === src && item.dst === dst && item.bypass === bypass))];
      if (updated.length > 5) {
        updated = updated.slice(0, 5);
      }
      localStorage.setItem("dityFlowCachedSearchResults", JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving search to cache", e);
    }
  };

  const handleSearch = async (src: string, dst: string, bypass: boolean) => {
    setErrorMsg("");
    setLoading(true);
    setLoadingMsg("Menganalisis rute terhemat...");

    try {
      const response = await fetch(`${SUPABASE_URL}/rpc/find_all_routes`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          p_source: src,
          p_destination: dst,
          p_amount: 100000, // Default amount since it's removed from UI
          p_bypass_quota: bypass ? 1 : 0
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Supabase error response:", response.status, errText);
        throw new Error(`Gagal (Status: ${response.status}). ${errText}`);
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        setErrorMsg("Maaf, tidak ada rute transfer yang sesuai untuk kriteria ini.");
      } else {
        // Group by route_id and filter cycles
        const grouped: { [key: string]: Step[] } = {};
        data.forEach((step: Step) => {
          const rid = step.route_id?.toString() || "default";
          if (!grouped[rid]) grouped[rid] = [];
          
          // Simple cycle prevention: if from and to are same, or if to already exists in path, skip or handle
          const currentPath = grouped[rid];
          const nodesInPath = new Set(currentPath.flatMap(s => [s.from_institution, s.to_institution]));
          
          // Only add if it doesn't create a trivial loop or if it's the first step
          if (step.from_institution !== step.to_institution) {
             grouped[rid].push(step);
          }
        });

        // Refined Cycle Detection: Keep only the path from source to dest
        const cleanedRouteLists = Object.values(grouped).map(route => {
          const graph: Record<string, Step[]> = {};
          route.forEach(s => {
            if (!graph[s.from_institution]) graph[s.from_institution] = [];
            graph[s.from_institution].push(s);
          });
          
          // BFS to find shortest path in this specific route bucket
          const queue: {node: string, path: Step[]}[] = [{node: src, path: []}];
          const visited = new Set<string>();
          while (queue.length > 0) {
            const {node, path} = queue.shift()!;
            if (node === dst) return path;
            if (visited.has(node)) continue;
            visited.add(node);
            
            const nextSteps = graph[node] || [];
            nextSteps.forEach(s => {
              queue.push({node: s.to_institution, path: [...path, s]});
            });
          }
          return route; // fallback
        }).filter(r => r.length > 0);

        const routeLists = cleanedRouteLists.sort((a, b) => {
          const feeA = parseFloat(a[0]?.total_route_fee as string) || 0;
          const feeB = parseFloat(b[0]?.total_route_fee as string) || 0;
          return feeA - feeB;
        });

        setAllRouteData(routeLists);
        saveSearch(src, dst, bypass);
        saveSearchToCache(src, dst, bypass, data);
        setLastSearchParams({ src, dst, bypass });
        
        // Auto highlight first route and scroll to workspace
        if (routeLists.length > 0) {
          const firstRid = routeLists[0][0].route_id || 1;
          setHighlightedRouteId(firstRid);
          setTimeout(() => {
            const el = document.getElementById('optimizer-workspace');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }

        // Update URL query params cleanly for sharing
        const url = new URL(window.location.href);
        url.searchParams.set("source", src);
        url.searchParams.set("dest", dst);
        if (bypass) {
          url.searchParams.set("bypass", "true");
        } else {
          url.searchParams.delete("bypass");
        }
        window.history.pushState({}, "", url.toString());
      }
    } catch (err: any) {
      console.error(err);
      
      // Try to load from localStorage cache
      const cachedStr = localStorage.getItem("dityFlowCachedSearchResults");
      if (cachedStr) {
        try {
          const cache = JSON.parse(cachedStr);
          const cachedItem = cache.find((item: any) => 
            item.src === src && 
            item.dst === dst && 
            item.bypass === bypass
          );
          if (cachedItem) {
            setAllRouteData(cachedItem.data);
            setLastSearchParams({ src, dst, bypass });
            
            if (cachedItem.data.length > 0) {
              const firstRid = cachedItem.data[0][0]?.route_id || 1;
              setHighlightedRouteId(firstRid);
            }

            const url = new URL(window.location.href);
            url.searchParams.set("source", src);
            url.searchParams.set("dest", dst);
            if (bypass) {
              url.searchParams.set("bypass", "true");
            } else {
              url.searchParams.delete("bypass");
            }
            window.history.pushState({}, "", url.toString());
            return;
          }
        } catch (e) {
          console.error("Error reading cache", e);
        }
      }
      setErrorMsg(`Terjadi kegagalan komunikasi dengan basis data rute. ${err?.message || "Silakan coba sesaat lagi."}`);
    } finally {
      setLoading(false);
    }
  };

  // Save searches to local storage
  const saveSearch = (src: string, dst: string, bypass: boolean) => {
    const srcObj = institutions.find(i => i.id === src);
    const dstObj = institutions.find(i => i.id === dst);

    const newItem = {
      source: src,
      dest: dst,
      sourceName: srcObj?.name || "Sumber",
      destName: dstObj?.name || "Tujuan",
      sourceLogo: srcObj?.logo_url,
      destLogo: dstObj?.logo_url,
      bypassQuota: bypass,
      timestamp: Date.now()
    };

    let updated = [newItem, ...recentSearches.filter(item => !(item.source === src && item.dest === dst))];
    if (updated.length > 5) {
      updated = updated.slice(0, 5);
    }
    setRecentSearches(updated);
    localStorage.setItem("dityFlowRecentSearches", JSON.stringify(updated));
  };

  const handleRecentClick = (item: any) => {
    setSourceId(item.source);
    setDestId(item.dest);
    setBypassQuota(item.bypassQuota || false);
    handleSearch(item.source, item.dest, item.bypassQuota || false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("dityFlowRecentSearches");
  };

  const handleReset = () => {
    setSourceId("");
    setDestId("");
    setBypassQuota(false);
    setAllRouteData([]);
    setLastSearchParams(null);
    setErrorMsg("");
    
    // Clear URL search params
    const url = new URL(window.location.href);
    url.searchParams.delete("source");
    url.searchParams.delete("dest");
    url.searchParams.delete("amount");
    url.searchParams.delete("bypass");
    window.history.pushState({}, "", url.toString());
  };

  const maxFee = 6500;

  const filteredRoutes = useMemo(() => {
    if (!allRouteData || allRouteData.length === 0) return [];
    return allRouteData.filter(route => {
      const routeFee = parseFloat(route[0]?.total_route_fee as string) || 0;
      return routeFee <= maxFee;
    });
  }, [allRouteData]);

  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);

  const displayedRoutes = useMemo(() => {
    if (filteredRoutes.length === 0) return [];
    
    if (showAllRoutes) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filteredRoutes.slice(startIndex, startIndex + itemsPerPage);
    } else {
      return [filteredRoutes[0]];
    }
  }, [filteredRoutes, showAllRoutes, currentPage]);

  // Sync page when highlightedRouteId changes
  useEffect(() => {
    if (highlightedRouteId !== null && showAllRoutes) {
      const routeIndex = filteredRoutes.findIndex(r => (r[0]?.route_id || 0) === highlightedRouteId);
      if (routeIndex !== -1) {
        const targetPage = Math.ceil((routeIndex + 1) / itemsPerPage);
        if (targetPage !== currentPage) {
          setCurrentPage(targetPage);
        }
      }
    }
  }, [highlightedRouteId, showAllRoutes, filteredRoutes]);

  // Auto-highlight logic
  useEffect(() => {
    if (displayedRoutes.length > 0) {
      // If we are showing only one route, or if filteredRoutes has only one route, highlight it
      if (!showAllRoutes || filteredRoutes.length === 1) {
        const firstRouteId = displayedRoutes[0][0]?.route_id || 1;
        if (highlightedRouteId !== firstRouteId) {
          setHighlightedRouteId(firstRouteId);
        }
      }
    } else if (filteredRoutes.length === 0) {
      if (highlightedRouteId !== null) {
        setHighlightedRouteId(null);
      }
    }
  }, [displayedRoutes, showAllRoutes, filteredRoutes.length, highlightedRouteId]);

  // Provide stats for the *first* (best) route for global usage if needed
  const { totalFee, savings } = useMemo(() => {
    const firstRoute = displayedRoutes[0] || [];
    const fee = parseFloat(firstRoute[0]?.total_route_fee as string) || 0;
    
    // Standard direct transfer cost usually Rp 6.500
    const standardDirectCost = 6500;
    const computedSavings = Math.max(0, standardDirectCost - fee);
    return {
      totalFee: fee,
      savings: computedSavings
    };
  }, [displayedRoutes]);

  const swipeTheme = (direction: number) => {
    const themes: Array<"default" | "ocean" | "vibrant"> = ["default", "ocean", "vibrant"];
    const currentIdx = themes.indexOf(flowTheme);
    let nextIdx = currentIdx + direction;
    if (nextIdx < 0) nextIdx = themes.length - 1;
    if (nextIdx >= themes.length) nextIdx = 0;
    setFlowTheme(themes[nextIdx]);
  };

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen relative">
      {errorMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 transition-all duration-300 animate-bounce">
          <div className="bg-theme-card border border-rose-500/50 text-rose-200 p-4 rounded-2xl shadow-2xl flex items-start gap-3 backdrop-blur-md">
            <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-rose-400">Notifikasi</h4>
              <p className="text-sm mt-0.5 opacity-90 leading-relaxed">{errorMsg}</p>
            </div>
            <button onClick={() => setErrorMsg("")} className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Loading Screen Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-theme-bg/80 backdrop-blur-sm z-[90] flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-theme-accent animate-spin" />
          </div>
          <p className="text-theme-accent font-extrabold tracking-widest text-xs uppercase animate-pulse">
            {loadingMsg}
          </p>
        </div>
      )}

      <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Filter & Recent Searches */}
          <div className="md:col-span-4 flex flex-col gap-6" data-html2canvas-ignore>
            {/* Filter Form Card */}
            <div className="bg-theme-card border border-theme-border rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm">
              <form onSubmit={handleSearchSubmit} className="flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black tracking-tight text-theme-main">Optimizer Transfer</h2>
                  {(sourceId || destId) && (
                    <button 
                      type="button" 
                      onClick={handleReset} 
                      className="text-xs font-bold text-rose-500 hover:opacity-80 transition-opacity flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                </div>

                {/* Source Institution select */}
                <div className="mb-6">
                  <CustomSelect
                    label="Sumber Dana"
                    placeholder="Pilih Sumber Dana"
                    options={institutions}
                    value={sourceId}
                    onChange={setSourceId}
                    excludeId={destId}
                    defaultText="Pilih Sumber Dana"
                  />
                </div>

                {/* Destination Institution select */}
                <div className="mb-8">
                  <CustomSelect
                    label="Tujuan Transfer"
                    placeholder="Pilih Tujuan Dana"
                    options={institutions}
                    value={destId}
                    onChange={setDestId}
                    excludeId={sourceId}
                    defaultText="Pilih Tujuan Dana"
                  />
                </div>

                {/* Limit Quota bypass setting with Tooltip */}
                <div className="mb-4 flex items-start gap-3 select-none">
                  <div className="flex items-center h-5">
                    <div 
                      id="bypass-quota-checkbox"
                      onClick={() => setBypassQuota(!bypassQuota)}
                      className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center cursor-pointer transition-all ${
                        bypassQuota 
                          ? "bg-theme-accent border-theme-accent text-theme-inverted" 
                          : "border-theme-border bg-theme-card text-transparent"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                  <div className="relative group flex items-center gap-1.5 pt-0.5">
                    <label onClick={() => setBypassQuota(!bypassQuota)} className="text-xs sm:text-[0.8125rem] text-theme-textDim cursor-pointer select-none leading-tight hover:text-theme-main transition-colors font-medium">
                      Saya Sudah Limit Bebas Admin
                    </label>
                    <div className="relative inline-block cursor-help text-theme-textDim hover:text-theme-main">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white text-[10px] p-2.5 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none font-bold leading-normal text-center border border-slate-800">
                        Aktifkan jika Anda sudah melebihi batas bebas biaya admin bulanan di bank asal Anda
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-slate-800 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Show All Routes Setting */}
                <div className="mb-4 flex items-start gap-3 select-none">
                  <div className="flex items-center h-5">
                    <div 
                      id="show-all-routes-checkbox"
                      onClick={() => setShowAllRoutes(!showAllRoutes)}
                      className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center cursor-pointer transition-all ${
                        showAllRoutes 
                          ? "bg-theme-accent border-theme-accent text-theme-inverted" 
                          : "border-theme-border bg-theme-card text-transparent"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                  <div className="relative group flex items-center gap-1.5 pt-0.5">
                    <label onClick={() => setShowAllRoutes(!showAllRoutes)} className="text-xs sm:text-[0.8125rem] text-theme-textDim cursor-pointer select-none leading-tight hover:text-theme-main transition-colors font-medium">
                      Tampilkan Semua Kemungkinan Rute
                    </label>
                  </div>
                </div>

                {/* Search Submit button */}
                <div className="pt-4 lg:pt-6">
                  <button 
                    type="submit" 
                    disabled={
                      !sourceId || 
                      !destId || 
                      (lastSearchParams && 
                        sourceId === lastSearchParams.src && 
                        destId === lastSearchParams.dst && 
                        bypassQuota === lastSearchParams.bypass)
                    }
                    className="w-full py-4 px-4 bg-theme-accent text-theme-inverted font-extrabold rounded-xl text-base hover:opacity-90 transition-opacity flex justify-center items-center gap-2 shimmer-btn cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                  >
                    Cari Rute Hemat
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Recent Searches Card (md and up only) */}
            {recentSearches.length > 0 && (
              <div className="hidden md:block bg-theme-card border border-theme-border rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.1em] text-theme-textDim font-bold flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Pencarian Terakhir
                  </h4>
                  <button 
                    type="button" 
                    onClick={clearRecentSearches} 
                    className="text-[0.625rem] text-rose-500 hover:underline uppercase font-extrabold cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleRecentClick(item)}
                      className="w-full bg-theme-bg border border-theme-border hover:border-theme-accent hover:bg-theme-accent/5 p-3 rounded-xl flex items-center justify-between group transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1 truncate mr-2">
                        <div className="flex -space-x-2 shrink-0">
                          {item.sourceLogo ? (
                            <div className="w-8 h-8 rounded-lg bg-theme-bg p-1 border border-theme-border shadow-sm overflow-hidden z-10">
                              <img src={item.sourceLogo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-theme-badge border border-theme-border flex items-center justify-center z-10">
                              <Landmark className="w-3.5 h-3.5 text-theme-textDim" />
                            </div>
                          )}
                          {item.destLogo ? (
                            <div className="w-8 h-8 rounded-lg bg-theme-bg p-1 border border-theme-border shadow-sm overflow-hidden">
                              <img src={item.destLogo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-theme-badge border border-theme-border flex items-center justify-center">
                              <Landmark className="w-3.5 h-3.5 text-theme-textDim" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col truncate">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs sm:text-[0.8125rem] font-bold text-theme-main group-hover:text-theme-accent transition-colors truncate">
                              {item.sourceName} &rarr; {item.destName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[0.625rem] sm:text-[0.6875rem] text-theme-textDim font-mono font-bold">
                              Rp{new Intl.NumberFormat("id-ID").format(item.amount)}
                            </span>
                            {item.bypassQuota ? (
                              <span className="text-[0.5rem] bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded uppercase font-extrabold shrink-0">
                                Limit Admin
                              </span>
                            ) : (
                              <span className="text-[0.5rem] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded uppercase font-extrabold shrink-0">
                                Bebas Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-theme-accent shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Main results & flow workspace */}
          <main className="md:col-span-8 flex flex-col gap-6 w-full">
            {/* Empty State visual */}
            {displayedRoutes.length === 0 && (
              <div className="flex-1 flex border-2 border-dashed border-theme-border rounded-[24px] flex-col items-center justify-center p-8 text-center bg-theme-card min-h-[400px]">
                <div className="w-16 h-16 bg-theme-badge border border-theme-border rounded-full flex items-center justify-center mb-5 text-theme-accent shadow-sm">
                  <ArrowLeftRight className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-extrabold text-theme-main">Belum ada rute terpilih</h3>
                <p className="text-theme-textDim mt-2 text-sm max-w-sm font-medium">
                  Silakan isi formulir <span className="md:hidden">di atas</span><span className="hidden md:inline">di samping</span> untuk menemukan rute transfer terbaik.
                </p>
              </div>
            )}

            {/* Results Block */}
            {displayedRoutes.length > 0 && (
              <div className="flex flex-col gap-10 w-full animate-fade-in pt-4">

                {/* Alert Badges */}
                <div className="flex flex-col gap-3">
                  {displayedRoutes.some(route => route.some(s => s.deduction_type === 'DEDUCTED_FROM_TARGET')) && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-xl p-3.5 text-sm font-semibold flex items-start gap-3 shadow-sm animate-fade-in">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">PENTING: Terdapat rute dengan biaya admin dipotong dari saldo tujuan. Pastikan nominal transfer dilebihkan!</p>
                    </div>
                  )}
                  {displayedRoutes.some(route => route.some(s => s.to_institution === 'FLIP' || s.from_institution === 'FLIP')) && (
                    <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl p-3.5 text-sm font-semibold flex items-start gap-3 shadow-sm animate-fade-in">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">Transfer via FLIP wajib menggunakan 3 digit kode unik (misal: Rp50.123). Kode unik akan dikembalikan berupa koin.</p>
                    </div>
                  )}
                </div>

                {/* Route Alternatives Stats Card List */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-theme-textDim">Pilihan Rute yang Tersedia</h3>
                    <span className="text-[10px] text-theme-textDim/70 font-medium transition-all duration-500">{filteredRoutes.length} Rute Aktif</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-html2canvas-ignore>
                    {displayedRoutes.map((routeList, routeIdx) => {
                      const localFee = parseFloat(routeList[0]?.total_route_fee as string) || 0;
                      const localSavings = Math.max(0, 6500 - localFee);
                      
                      // Calculate path depth (real steps count from start to end)
                      const calculateDepth = (steps: Step[]) => {
                        if (!steps || steps.length === 0) return 0;
                        const graph: Record<string, string[]> = {};
                        steps.forEach(s => {
                          if (!graph[s.from_institution]) graph[s.from_institution] = [];
                          graph[s.from_institution].push(s.to_institution);
                        });
                        let depth = 0;
                        let currentNodes = [sourceId];
                        const visited = new Set<string>();
                        while (currentNodes.length > 0) {
                          let nextNodes: string[] = [];
                          for (const node of currentNodes) {
                            if (visited.has(node)) continue;
                            visited.add(node);
                            if (node === destId) return depth;
                            const neighbors = graph[node] || [];
                            nextNodes.push(...neighbors);
                          }
                          currentNodes = nextNodes;
                          depth++;
                          if (depth > 12) break;
                        }
                        return depth || steps.length;
                      };
                      
                      const localSteps = calculateDepth(routeList);
                      const routeId = routeList[0]?.route_id || (routeIdx + 1);
                      const isHighlighted = highlightedRouteId === routeId;
                      const globalRouteIdx = filteredRoutes.findIndex(r => (r[0]?.route_id || 0) === routeId);
                      
                      // Get route flow string
                      const flowString = routeList.map((s, idx) => {
                        if (idx === 0) return `${s.from_institution} ➔ ${s.to_institution}`;
                        return ` ➔ ${s.to_institution}`;
                      }).join("");

                      const routeColors = ['#00C853', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4'];
                      const getRouteColor = (rid: number) => routeColors[(rid - 1) % routeColors.length];
                      const activeColor = getRouteColor(routeId);

                      return (
                        <div 
                          key={routeId} 
                          className={`bg-theme-card border-2 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4 transition-all relative group overflow-hidden ${
                            isHighlighted ? 'ring-4 ring-offset-0 scale-[1.02] z-10' : 'border-theme-border/60 hover:border-theme-accent/50 hover:shadow-lg'
                          }`}
                          style={{
                            borderColor: isHighlighted ? activeColor : undefined,
                            boxShadow: isHighlighted ? `0 12px 24px -8px ${activeColor}44` : undefined
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span 
                              className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${isHighlighted ? 'text-theme-inverted' : 'border border-theme-border text-theme-textDim bg-theme-badge'}`}
                              style={{ backgroundColor: isHighlighted ? activeColor : undefined }}
                            >
                              Rute {globalRouteIdx + 1}
                            </span>
                            <span className="bg-theme-badge border border-theme-border text-theme-main text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                              {localSteps} Langkah
                            </span>
                          </div>

                          <div className="flex flex-col gap-1">
                            <div className="text-[10px] font-bold text-theme-textDim uppercase tracking-widest leading-normal">
                              {flowString}
                            </div>
                            <div className="text-xl font-black text-theme-main mt-1">
                              Rp{new Intl.NumberFormat("id-ID").format(localFee)}
                            </div>
                            <div className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1">
                              <Zap className="w-3 h-3 fill-current" />
                              Hemat Rp{new Intl.NumberFormat("id-ID").format(localSavings)}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              // If there's only one route, don't allow un-highlighting
                              if (filteredRoutes.length === 1) {
                                setHighlightedRouteId(routeId);
                              } else {
                                setHighlightedRouteId(isHighlighted ? null : routeId);
                              }
                              setSelectedEdgeId(null);
                              document.getElementById('optimizer-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                            className={`w-full py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all relative overflow-hidden group shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                              isHighlighted 
                                ? 'text-theme-inverted' 
                                : 'bg-theme-badge border border-theme-border text-theme-main hover:border-theme-accent'
                            }`}
                            style={{ backgroundColor: isHighlighted ? activeColor : undefined }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            {isHighlighted ? 'Rute Aktif' : 'Lihat Rute'}
                            <Scan className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {showAllRoutes && filteredRoutes.length > 4 && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-10 pb-6">
                      <button
                        type="button"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-3 rounded-xl border-2 border-theme-border text-theme-main disabled:opacity-20 disabled:cursor-not-allowed hover:border-theme-accent hover:bg-theme-badge transition-all active:scale-90"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      <div className="flex items-center gap-2">
                        {(() => {
                          const currentGroupIndex = Math.floor((currentPage - 1) / 3);
                          const groupStartPage = currentGroupIndex * 3 + 1;
                          const visiblePages = Array.from({ length: 3 }, (_, i) => groupStartPage + i).filter(p => p <= totalPages);
                          return visiblePages.map((page) => (
                            <button
                              key={page}
                              type="button"
                              onClick={() => setCurrentPage(page)}
                              className={`w-11 h-11 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
                                currentPage === page
                                  ? 'bg-theme-accent text-theme-inverted shadow-xl shadow-theme-accent/20 scale-110 z-10'
                                  : 'border-2 border-theme-border text-theme-textDim hover:border-theme-accent hover:text-theme-main hover:bg-theme-badge'
                              }`}
                            >
                              {page}
                            </button>
                          ));
                        })()}
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-3 rounded-xl border-2 border-theme-border text-theme-main disabled:opacity-20 disabled:cursor-not-allowed hover:border-theme-accent hover:bg-theme-badge transition-all active:scale-90"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>

                {/* The Combined Reactive Canvas Area */}
                <ReactFlowProvider>
                  <MultiFlowContainer 
                    routesData={displayedRoutes} 
                    allRouteData={allRouteData}
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
                    bypassQuota={bypassQuota}
                    showAllRoutes={showAllRoutes}
                    highlightedRouteId={highlightedRouteId}
                    setHighlightedRouteId={setHighlightedRouteId}
                    selectedEdgeId={selectedEdgeId}
                    setSelectedEdgeId={setSelectedEdgeId}
                  />
                </ReactFlowProvider>
              </div>
            )}
          </main>
        </div>

        {/* Recent Searches Card (Mobile Only, rendered above Footer) */}
        {recentSearches.length > 0 && (
          <div className="block md:hidden mt-8" data-html2canvas-ignore>
            <div className="bg-theme-card border border-theme-border rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.1em] text-theme-textDim font-bold flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 animate-pulse text-theme-accent" />
                  Pencarian Terakhir
                </h4>
                <button 
                  type="button" 
                  onClick={clearRecentSearches} 
                  className="text-[0.625rem] text-rose-500 hover:underline uppercase font-extrabold cursor-pointer"
                >
                  Hapus
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleRecentClick(item)}
                    className="w-full bg-theme-bg border border-theme-border hover:border-theme-accent hover:bg-theme-accent/5 p-3 rounded-xl flex items-center justify-between group transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 truncate mr-2">
                      <div className="flex -space-x-2 shrink-0">
                        {item.sourceLogo ? (
                          <div className="w-8 h-8 rounded-lg bg-theme-bg p-1 border border-theme-border shadow-sm overflow-hidden z-10">
                            <img src={item.sourceLogo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-theme-badge border border-theme-border flex items-center justify-center z-10">
                            <Landmark className="w-3.5 h-3.5 text-theme-textDim" />
                          </div>
                        )}
                        {item.destLogo ? (
                          <div className="w-8 h-8 rounded-lg bg-theme-bg p-1 border border-theme-border shadow-sm overflow-hidden">
                            <img src={item.destLogo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-theme-badge border border-theme-border flex items-center justify-center">
                            <Landmark className="w-3.5 h-3.5 text-theme-textDim" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col truncate">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs sm:text-[0.8125rem] font-bold text-theme-main group-hover:text-theme-accent transition-colors truncate">
                            {item.sourceName} &rarr; {item.destName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.bypassQuota ? (
                            <span className="text-[0.5rem] bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded uppercase font-extrabold shrink-0">
                              Limit Admin
                            </span>
                          ) : (
                            <span className="text-[0.5rem] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded uppercase font-extrabold shrink-0">
                              Bebas Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-theme-accent shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
