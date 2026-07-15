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
import { toPng } from "html-to-image";
import { 
  ArrowLeftRight, 
  Search, 
  Share2, 
  Download, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Check, 
  WifiOff, 
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
  ZoomOut
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
}

interface Step {
  from_institution: string;
  to_institution: string;
  fee_cost: number | string;
  deduction_type: string;
  step_notes: string;
}

// Custom Node Component
function InstitutionNode({ data }: any) {
  const { label, isFirst, isLast, accentColor, orientation, isAnySelected, isNodeSelected } = data;
  const isHorizontal = orientation === "horizontal";

  // Compute borders and background based on selected state
  let borderColor = isLast ? "var(--color-accent)" : "rgba(var(--color-accent-rgb, 0, 186, 104), 0.25)";
  let shadow = isLast ? `0 4px 14px -3px rgba(var(--color-accent-rgb, 0, 186, 104), 0.25)` : "none";
  let textColor = isLast ? "var(--color-accent)" : "var(--color-text-main)";

  if (isAnySelected) {
    if (isNodeSelected) {
      borderColor = "var(--color-accent)";
      shadow = `0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-accent), 0 0 18px rgba(var(--color-accent-rgb, 0, 186, 104), 0.5)`;
      textColor = "var(--color-accent)";
    } else {
      borderColor = "rgba(var(--color-accent-rgb, 0, 186, 104), 0.15)";
      shadow = "none";
      textColor = "var(--color-text-main)";
    }
  }

  return (
    <div 
      className={`px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl font-bold text-sm sm:text-base min-w-[150px] max-w-[240px] text-center border-2 transition-all relative select-none ${isAnySelected && isNodeSelected ? 'scale-105' : ''}`}
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: borderColor,
        color: textColor,
        boxShadow: shadow !== "none" ? shadow : "0 4px 6px var(--color-shadow)",
      } as any}
    >
      {!isFirst && (
        <Handle
          type="target"
          position={isHorizontal ? Position.Left : Position.Top}
          style={{ 
            background: isAnySelected ? (isNodeSelected ? "var(--color-accent)" : "var(--color-app-border)") : "var(--color-app-border)", 
            width: 8, 
            height: 8, 
            border: "none",
            transition: "all 0.3s ease",
          }}
        />
      )}
      <div className="whitespace-normal break-words leading-tight">{label}</div>
      {!isLast && (
        <Handle
          type="source"
          position={isHorizontal ? Position.Right : Position.Bottom}
          style={{ 
            background: isAnySelected ? (isNodeSelected ? "var(--color-accent)" : "var(--color-app-border)") : "var(--color-app-border)", 
            width: 8, 
            height: 8, 
            border: "none",
            transition: "all 0.3s ease",
          }}
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
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const { fee_cost, step_notes, accentColor, badgeBgColor, isSelected, isAnySelected, onSelect } = (data || {}) as any;
  const isFree = parseFloat(fee_cost) === 0;
  const isDeducted = data?.deduction_type === "DEDUCTED_FROM_TARGET";

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ 
          stroke: isAnySelected && isSelected ? "var(--color-accent)" : "var(--color-app-border)", 
          strokeWidth: isAnySelected && isSelected ? 3 : 2,
          opacity: isAnySelected ? (isSelected ? 1 : 0.4) : 1,
          ...style
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <div 
            onClick={onSelect}
            className={`bg-theme-card border rounded-xl p-2.5 shadow-md text-center max-w-[220px] min-w-[120px] cursor-pointer transition-all hover:scale-105 active:scale-95 select-none ${
              isSelected 
                ? "border-theme-accent ring-2 ring-theme-accent/30 scale-105" 
                : "border-theme-border hover:border-theme-accent/50"
            }`}
          >
            {isFree ? (
              <div 
                className="font-mono px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide inline-block mb-1 select-none transition-all" 
                style={{ 
                  color: isSelected ? "var(--color-bg)" : accentColor, 
                  backgroundColor: isSelected ? accentColor : badgeBgColor 
                }}
              >
                GRATIS
              </div>
            ) : (
              <div 
                className={`font-mono px-2.5 py-0.5 rounded-full text-[9px] font-bold border tracking-wide inline-block mb-1 select-none transition-all ${
                  isSelected 
                    ? "bg-theme-accent text-theme-inverted border-theme-accent" 
                    : "bg-theme-badge text-theme-textDim border-theme-border"
                }`}
              >
                Rp{new Intl.NumberFormat("id-ID").format(parseFloat(fee_cost))}
                {isDeducted && <span className="text-[8px] opacity-75"> (Dipotong)</span>}
              </div>
            )}
            <div className={`text-[10px] leading-tight font-medium select-none whitespace-normal break-words transition-all ${isSelected ? "text-theme-main font-semibold" : "text-theme-textDim"}`}>
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

  const selectedName = useMemo(() => {
    const found = options.find(o => o.id === value);
    return found ? found.name : defaultText;
  }, [value, options, defaultText]);

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
        className="w-full bg-theme-card border border-theme-border rounded-xl pl-4 pr-10 py-3.5 text-base sm:text-[0.9375rem] text-theme-main text-left focus:outline-none focus:border-theme-accent transition-colors flex items-center justify-between"
      >
        <span className={`truncate ${value ? "text-theme-main" : "text-theme-textDim"}`}>
          {selectedName}
        </span>
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
          <div className="max-h-48 overflow-y-auto p-1 custom-scrollbar">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-xs sm:text-sm text-theme-main hover:bg-theme-border transition-colors truncate"
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
                className={`w-full text-left px-4 py-3 rounded-lg text-xs sm:text-sm transition-colors truncate ${
                  value === opt.id 
                    ? "bg-theme-accent/10 text-theme-accent font-semibold" 
                    : "text-theme-main hover:bg-theme-border"
                }`}
              >
                {opt.name}
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
function FlowContainer({ 
  routeData, 
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
  amountVal,
  bypassQuota
}: {
  routeData: Step[];
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
  amountVal: number;
  bypassQuota: boolean;
}) {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Custom Toast State
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Export Preview Modal States
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState<string>("");
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  // Fullscreen and Expensive checking states
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

  const handleFitView = () => {
    if (routeData && routeData.length > 0) {
      const institutionsList = [routeData[0].from_institution];
      routeData.forEach((step) => {
        institutionsList.push(step.to_institution);
      });

      const resetNodes = nodes.map((node, idx) => {
        const isHorizontal = orientation === "horizontal";
        const position = isHorizontal 
          ? { x: idx * 280 + 40, y: 140 } 
          : { x: 140, y: idx * 180 + 40 };
        return { ...node, position };
      });
      setNodes(resetNodes);
    }
    
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 0 });
    }, 100);
  };

  const { zoomIn, zoomOut } = useReactFlow();

  const isExpensive = useMemo(() => {
    return totalFee >= 6500;
  }, [totalFee]);

  // Re-fit view when fullscreen mode is toggled
  useEffect(() => {
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 0 });
    }, 50);
  }, [isFullscreen, fitView]);

  const handleOpenPreview = async () => {
    // Exit fullscreen if active so layout renders cleanly
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
          if (typeof value === "string" && (value.includes("oklch") || value.includes("oklab"))) {
            return replaceModernColors(value);
          }
          return value;
        }
      });
    };

    try {
      // Fit all elements in viewport cleanly with balanced padding
      // to avoid nodes going too close to edge or being cut off on smaller viewports.
      const isMobile = window.innerWidth < 768;
      const fitPadding = isMobile ? 0.35 : 0.25;
      fitView({ padding: fitPadding });
      await new Promise(r => setTimeout(r, 900));

      const container = flowContainerRef.current;
      if (!container) throw new Error("Sandbox container not found");

      // Temporarily reveal watermark inside sandbox
      const watermark = container.querySelector(".export-watermark");
      if (watermark) watermark.classList.remove("hidden");
      
      const originalOverflow = container.style.overflow;
      container.style.overflow = "visible";

      const dataUrl = await toPng(container, {
        backgroundColor: isDark ? "#050505" : "#f8fafc",
        pixelRatio: 2.5,
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

      // Restore clean view layout after screenshot is captured
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

  // Auto fit view only when route data or layout orientation changes
  useEffect(() => {
    if (routeData && routeData.length > 0) {
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 0 });
      }, 100);
    }
  }, [routeData, orientation, fitView]);

  // Node & Edge Generation
  useEffect(() => {
    if (routeData && routeData.length > 0) {
      const institutionsList: string[] = [routeData[0].from_institution];
      routeData.forEach(step => {
        institutionsList.push(step.to_institution);
      });

      const isAnySelected = selectedEdgeId !== null;

      const newNodes = institutionsList.map((name, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === institutionsList.length - 1;
        const isHorizontal = orientation === "horizontal";

        // Let's determine if this node is connected to the selected edge
        // If selectedEdgeId is `edge-K`, it connects `node-K` and `node-K+1`
        let isNodeSelected = false;
        if (selectedEdgeId) {
          const selectedIdx = parseInt(selectedEdgeId.replace("edge-", ""), 10);
          if (idx === selectedIdx || idx === selectedIdx + 1) {
            isNodeSelected = true;
          }
        }

        // Layout node positions dynamically
        const position = isHorizontal 
          ? { x: idx * 280 + 40, y: 140 } 
          : { x: 140, y: idx * 180 + 40 };

        return {
          id: `node-${idx}`,
          type: "institutionNode",
          position,
          data: {
            label: name,
            isFirst,
            isLast,
            orientation,
            accentColor,
            isAnySelected,
            isNodeSelected,
          },
        };
      });

      const newEdges = routeData.map((step, idx) => {
        const edgeId = `edge-${idx}`;
        const isSelected = selectedEdgeId === edgeId;
        const isEdgeAnimated = isAnySelected; // If any is selected, animate the entire path!

        return {
          id: edgeId,
          source: `node-${idx}`,
          target: `node-${idx + 1}`,
          type: "stepEdge",
          animated: isEdgeAnimated,
          data: {
            fee_cost: step.fee_cost,
            step_notes: step.step_notes,
            deduction_type: step.deduction_type,
            accentColor,
            badgeBgColor,
            isSelected,
            isAnySelected,
            onSelect: () => setSelectedEdgeId(edgeId),
          },
          style: {
            stroke: isAnySelected 
              ? (isSelected ? "var(--color-accent)" : "var(--color-app-border)") 
              : "var(--color-app-border)",
            strokeWidth: isAnySelected ? (isSelected ? 5 : 2) : 2,
            filter: isAnySelected && isSelected 
              ? `drop-shadow(0px 0px 6px var(--color-accent))` 
              : "none",
            transition: "all 0.3s ease",
            opacity: isAnySelected ? (isSelected ? 1 : 0.4) : 1,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 16,
            height: 16,
            color: isAnySelected 
              ? (isSelected ? "var(--color-accent)" : "var(--color-app-border)") 
              : "var(--color-app-border)",
          },
        };
      });

      setNodes(newNodes);
      setEdges(newEdges);

    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [routeData, orientation, flowTheme, accentColor, badgeBgColor, selectedEdgeId]);

  // Rich Text & Web Share function
  const handleShare = async () => {
    const totalFeeFormatted = totalFee === 0 ? "Gratis" : `Rp${new Intl.NumberFormat("id-ID").format(totalFee)}`;
    const savingsFormatted = `Rp${new Intl.NumberFormat("id-ID").format(savings)}`;
    
    // Find institution names
    const sourceName = institutions.find(i => i.id === sourceId)?.name || "Sumber";
    const destName = institutions.find(i => i.id === destId)?.name || "Tujuan";
    const amountFormatted = `Rp${new Intl.NumberFormat("id-ID").format(amountVal)}`;
    
    let routeSteps = "";
    if (routeData && routeData.length > 0) {
      routeSteps = routeData.map((step, idx) => {
        const fee = step.fee_cost === 0 ? "Gratis" : `Rp${new Intl.NumberFormat("id-ID").format(Number(step.fee_cost))}`;
        return `${idx + 1}. ${step.from_institution} ➔ ${step.to_institution} (Biaya: ${fee})`;
      }).join("\n");
    }

    const shareText = `Dity Flow - Optimasi Rute Transfer Kas Hemat 🚀\n\n` +
      `• Sumber Dana: ${sourceName}\n` +
      `• Tujuan Transfer: ${destName}\n` +
      `• Nominal: ${amountFormatted}\n` +
      `• Total Biaya Admin: ${totalFeeFormatted}\n` +
      `• Total Penghematan: ${savingsFormatted}\n\n` +
      `Rute Pengiriman:\n${routeSteps}\n\n` +
      `Optimalkan transfer kas Anda dengan Dity Flow!\n` +
      `Cek rute lengkapnya di sini: ${window.location.origin}${window.location.pathname}?source=${sourceId}&dest=${destId}&amount=${amountVal}${bypassQuota ? "&bypass=true" : ""}\n\n` +
      `Generated by Dity Flow - ${window.location.host}`;

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

  return (
    <div id="flowchart-export-area" className="bg-theme-card border border-theme-border rounded-[24px] p-5 sm:p-6 md:p-8 lg:p-10 relative flex flex-col overflow-hidden min-h-[480px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4" data-html2canvas-ignore>
        <div>
          <h2 className="text-lg sm:text-xl font-bold">Optimasi Rute Kas</h2>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="bg-theme-badge text-theme-main px-2.5 py-1 rounded-md text-[0.625rem] uppercase tracking-wider font-extrabold border border-theme-border">
              {routeData.length} Langkah
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
              <div className="w-8 h-8 rounded-lg bg-theme-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-theme-inverted" />
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
                onClick={toggleFullscreen}
                className="p-2 sm:px-4 sm:py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <X className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline text-xs font-bold text-rose-500">Keluar dari Layar Penuh</span>
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
            onEdgeClick={(_event, edge) => setSelectedEdgeId(edge.id)}
            onPaneClick={() => setSelectedEdgeId(null)}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
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
  );
}

// Global Main Page Component
export default function AppMain() {
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
  const [amountVal, setAmountVal] = useState<number>(0);
  const [amountStr, setAmountStr] = useState("");
  const [bypassQuota, setBypassQuota] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [cacheNotice, setCacheNotice] = useState("");
  const [routeData, setRouteData] = useState<Step[]>([]);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [lastSearchParams, setLastSearchParams] = useState<{src: string, dst: string, amount: number, bypass: boolean} | null>(null);

  // Config options matching original
  const [flowTheme, setFlowTheme] = useState<"default" | "ocean" | "vibrant">("default");
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("vertical");
  const [compareFees, setCompareFees] = useState(true);

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
      try {
        const response = await fetch(`${SUPABASE_URL}/institutions?select=id,name,type&is_active=eq.true`, { headers });
        if (!response.ok) {
          throw new Error("Gagal mengambil data lembaga keuangan.");
        }
        const data = await response.json();
        setInstitutions(data);
      } catch (err: any) {
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
    const amt = params.get("amount");
    const bypass = params.get("bypass");

    if (src && dst && amt) {
      setSourceId(src);
      setDestId(dst);
      const numericAmt = parseFloat(amt) || 0;
      setAmountVal(numericAmt);
      setAmountStr(new Intl.NumberFormat("id-ID").format(numericAmt));
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
      const amt = params.get("amount");
      if (src && dst && amt) {
        handleSearch(src, dst, parseFloat(amt), params.get("bypass") === "true");
      }
    }
  }, [institutions]);

  // Form amount masking logic
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw) {
      const num = parseInt(raw, 10);
      setAmountVal(num);
      setAmountStr(new Intl.NumberFormat("id-ID").format(num));
    } else {
      setAmountVal(0);
      setAmountStr("");
    }
  };

  // Perform search route querying
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !destId) {
      setErrorMsg("Harap pilih sumber dana dan tujuan transfer.");
      return;
    }
    if (amountVal <= 0) {
      setErrorMsg("Harap masukkan nominal transaksi lebih dari Rp0.");
      return;
    }
    handleSearch(sourceId, destId, amountVal, bypassQuota);
  };

  const saveSearchToCache = (src: string, dst: string, amount: number, bypass: boolean, data: any) => {
    try {
      const cachedStr = localStorage.getItem("dityFlowCachedSearchResults");
      let cache: any[] = [];
      if (cachedStr) {
        cache = JSON.parse(cachedStr);
      }
      
      const newItem = {
        src,
        dst,
        amount,
        bypass,
        data,
        timestamp: Date.now()
      };
      
      let updated = [newItem, ...cache.filter((item: any) => !(item.src === src && item.dst === dst && item.amount === amount && item.bypass === bypass))];
      if (updated.length > 5) {
        updated = updated.slice(0, 5);
      }
      localStorage.setItem("dityFlowCachedSearchResults", JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving search to cache", e);
    }
  };

  const handleSearch = async (src: string, dst: string, amount: number, bypass: boolean) => {
    setErrorMsg("");
    setCacheNotice("");
    setLoading(true);
    setLoadingMsg("Menganalisis rute terhemat...");
    setRouteData([]);

    try {
      const response = await fetch(`${SUPABASE_URL}/rpc/find_cheapest_route`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          p_source: src,
          p_destination: dst,
          p_amount: amount,
          p_bypass_quota: bypass ? 1 : 0
        })
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data rute dari server.");
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        setErrorMsg("Maaf, tidak ada rute transfer yang sesuai untuk kriteria ini.");
      } else {
        setRouteData(data);
        saveSearch(src, dst, amount, bypass);
        saveSearchToCache(src, dst, amount, bypass, data);
        setLastSearchParams({ src, dst, amount, bypass });

        // Update URL query params cleanly for sharing
        const url = new URL(window.location.href);
        url.searchParams.set("source", src);
        url.searchParams.set("dest", dst);
        url.searchParams.set("amount", amount.toString());
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
            item.amount === amount && 
            item.bypass === bypass
          );
          if (cachedItem) {
            setRouteData(cachedItem.data);
            setLastSearchParams({ src, dst, amount, bypass });
            setCacheNotice("Koneksi bermasalah atau offline. Menampilkan rute hasil pencarian teroptimasi dari cache lokal.");
            
            const url = new URL(window.location.href);
            url.searchParams.set("source", src);
            url.searchParams.set("dest", dst);
            url.searchParams.set("amount", amount.toString());
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
      setErrorMsg("Terjadi kegagalan komunikasi dengan basis data rute. Silakan coba sesaat lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Save searches to local storage
  const saveSearch = (src: string, dst: string, amount: number, bypass: boolean) => {
    const srcName = institutions.find(i => i.id === src)?.name || "Sumber";
    const dstName = institutions.find(i => i.id === dst)?.name || "Tujuan";

    const newItem = {
      source: src,
      dest: dst,
      sourceName: srcName,
      destName: dstName,
      amount,
      bypassQuota: bypass,
      timestamp: Date.now()
    };

    let updated = [newItem, ...recentSearches.filter(item => !(item.source === src && item.dest === dst && item.amount === amount))];
    if (updated.length > 5) {
      updated = updated.slice(0, 5);
    }
    setRecentSearches(updated);
    localStorage.setItem("dityFlowRecentSearches", JSON.stringify(updated));
  };

  const handleRecentClick = (item: any) => {
    setSourceId(item.source);
    setDestId(item.dest);
    setAmountVal(item.amount);
    setAmountStr(new Intl.NumberFormat("id-ID").format(item.amount));
    setBypassQuota(item.bypassQuota || false);
    handleSearch(item.source, item.dest, item.amount, item.bypassQuota || false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("dityFlowRecentSearches");
  };

  const handleReset = () => {
    setSourceId("");
    setDestId("");
    setAmountVal(0);
    setAmountStr("");
    setBypassQuota(false);
    setRouteData([]);
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

  // Calculate stats
  const { totalFee, savings } = useMemo(() => {
    let fee = 0;
    routeData.forEach(step => {
      fee += parseFloat(step.fee_cost as string) || 0;
    });
    // Standard direct transfer cost usually Rp 6.500 or Rp 2.500
    const standardDirectCost = 6500;
    const computedSavings = Math.max(0, standardDirectCost - fee);
    return {
      totalFee: fee,
      savings: computedSavings
    };
  }, [routeData]);

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
      {/* Alert Notification */}
      {cacheNotice && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 transition-all duration-300 animate-bounce">
          <div className="bg-theme-card border border-emerald-500/50 text-emerald-200 p-4 rounded-2xl shadow-2xl flex items-start gap-3 backdrop-blur-md">
            <WifiOff className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-emerald-400">Mode Cache Offline</h4>
              <p className="text-sm mt-0.5 opacity-90 leading-relaxed">{cacheNotice}</p>
            </div>
            <button onClick={() => setCacheNotice("")} className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 transition-all duration-300 animate-bounce">
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
                  {(sourceId || destId || amountVal > 0) && (
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
                <div className="mb-6">
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

                {/* Amount input block with formatted rupiah input and Tooltip */}
                <div className="mb-8">
                  <div className="flex items-center gap-1.5 mb-2">
                    <label className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.1em] text-theme-textDim font-semibold">
                      Nominal Transaksi
                    </label>
                    <div className="relative inline-block cursor-help text-theme-textDim hover:text-theme-main group">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white text-[10px] p-2.5 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none font-bold leading-normal text-center border border-slate-800">
                        Masukkan nominal transaksi untuk menghitung rute biaya transfer terhemat
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-slate-800 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex items-center bg-theme-card border border-theme-border rounded-xl focus-within:border-theme-accent transition-colors pl-4">
                    <span className="text-theme-main opacity-40 text-base sm:text-[0.9375rem] font-bold">Rp</span>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={amountStr}
                      onChange={handleAmountChange}
                      required 
                      placeholder="0" 
                      className="w-full bg-transparent border-none outline-none py-3.5 pl-2 pr-4 text-base sm:text-[0.9375rem] text-theme-main font-semibold"
                      autoComplete="off"
                    />
                  </div>
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

                {/* Search Submit button */}
                <div className="pt-4 lg:pt-6">
                  <button 
                    type="submit" 
                    disabled={
                      !sourceId || 
                      !destId || 
                      amountVal <= 0 || 
                      (lastSearchParams && 
                        sourceId === lastSearchParams.src && 
                        destId === lastSearchParams.dst && 
                        amountVal === lastSearchParams.amount && 
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
                      <div className="flex flex-col flex-1 truncate mr-2">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs sm:text-[0.8125rem] font-bold text-theme-main group-hover:text-theme-accent transition-colors truncate">
                            {item.sourceName} &rarr; {item.destName}
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
                        <span className="text-[0.625rem] sm:text-[0.6875rem] text-theme-textDim font-mono">
                          Rp{new Intl.NumberFormat("id-ID").format(item.amount)}
                        </span>
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
            {routeData.length === 0 && (
              <div className="flex-1 flex border-2 border-dashed border-theme-border rounded-[24px] flex-col items-center justify-center p-8 text-center bg-theme-card min-h-[400px]">
                <div className="w-16 h-16 bg-theme-badge border border-theme-border rounded-full flex items-center justify-center mb-5 text-theme-accent shadow-sm">
                  <ArrowLeftRight className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-extrabold text-theme-main">Belum ada rute terpilih</h3>
                <p className="text-theme-textDim mt-2 text-sm max-w-sm font-medium">
                  Silakan isi formulir di samping untuk menemukan rute transfer terbaik.
                </p>
              </div>
            )}

            {/* Results Block */}
            {routeData.length > 0 && (
              <div className="flex flex-col gap-6 w-full animate-fade-in">
                
                {/* Route Summary Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-html2canvas-ignore>
                  
                  {/* Total Biaya Admin Card with toggle */}
                  <div className="bg-theme-card border border-theme-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-theme-textDim font-bold uppercase tracking-widest">Total Biaya Admin</span>
                      
                      {/* Bandingkan Biaya Admin Toggle nested here */}
                      <div className="flex items-center gap-2 select-none">
                        <div 
                          id="compare-fees-checkbox-main"
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
                            {totalFee === 0 ? "Rp0" : `Rp${new Intl.NumberFormat("id-ID").format(totalFee)}`}
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
                            {totalFee === 0 ? "Rp0" : `Rp${new Intl.NumberFormat("id-ID").format(totalFee)}`}
                          </span>
                          {totalFee === 0 && (
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
                        Rp{new Intl.NumberFormat("id-ID").format(savings)}
                      </span>
                      <span className="text-[10px] text-theme-textDim block mt-1.5 font-medium">
                        Dibanding biaya transfer langsung (Rp6.500)
                      </span>
                    </div>
                  </div>

                </div>

                {/* Theme control bar */}
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

                {/* The Reactive Canvas Area */}
                <ReactFlowProvider>
                  <FlowContainer 
                    routeData={routeData} 
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
                    <div className="flex flex-col flex-1 truncate mr-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs sm:text-[0.8125rem] font-bold text-theme-main group-hover:text-theme-accent transition-colors truncate">
                          {item.sourceName} &rarr; {item.destName}
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
                      <span className="text-[0.625rem] sm:text-[0.6875rem] text-theme-textDim font-mono">
                        Rp{new Intl.NumberFormat("id-ID").format(item.amount)}
                      </span>
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
