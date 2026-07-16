import re

with open('src/app-main.tsx', 'r') as f:
    content = f.read()

# Replace function FlowContainer with function MultiFlowContainer
old_flow = re.search(r'function FlowContainer\(.*?\{.*?(return\s+\(\s+<div.*?);\s+\}\s+// Global Main Page Component', content, re.DOTALL)

if old_flow:
    # Build MultiFlowContainer
    new_code = """function MultiFlowContainer({ 
  routesData, 
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
  routesData: Step[][];
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

  useEffect(() => {
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 0 });
    }, 50);
  }, [isFullscreen, fitView]);

  const handleFitView = () => {
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 0 });
    }, 100);
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
      const isHorizontal = orientation === "horizontal";
      
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));
      
      const direction = isHorizontal ? 'LR' : 'TB';
      dagreGraph.setGraph({ rankdir: direction, marginx: 40, marginy: 40, nodesep: 100, edgesep: 40, ranksep: 100 });

      const nodeWidth = 260;
      const nodeHeight = 80;

      const uniqueNodesMap = new Map<string, any>();
      const edgesList: any[] = [];
      const edgesMap = new Map<string, boolean>();

      // Extract unique nodes and edges
      routesData.forEach((route) => {
        route.forEach((step) => {
          if (!uniqueNodesMap.has(step.from_institution)) {
            uniqueNodesMap.set(step.from_institution, { id: step.from_institution, name: step.from_institution });
          }
          if (!uniqueNodesMap.has(step.to_institution)) {
            uniqueNodesMap.set(step.to_institution, { id: step.to_institution, name: step.to_institution });
          }

          const edgeId = `edge-${step.from_institution}-${step.to_institution}-${step.fee_cost}`;
          if (!edgesMap.has(edgeId)) {
            edgesMap.set(edgeId, true);
            edgesList.push({
              id: edgeId,
              source: step.from_institution,
              target: step.to_institution,
              type: "customEdge",
              animated: selectedEdgeId !== null, // Animate if any is selected
              data: {
                feeCost: step.fee_cost,
                deductionType: step.deduction_type,
                stepNotes: step.step_notes,
                isSelected: selectedEdgeId === edgeId,
              },
            });
          }
        });
      });

      const nodesList: any[] = Array.from(uniqueNodesMap.values()).map(n => ({
        id: n.id,
        type: "institutionNode",
        data: {
          label: n.name,
          isFirst: n.id === sourceId,
          isLast: n.id === destId,
          orientation,
          accentColor,
          isAnySelected: selectedEdgeId !== null,
          isNodeSelected: false,
        }
      }));

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
        fitView({ padding: 0.2, duration: 0 });
      }, 100);
    }
  }, [routesData, orientation, accentColor, selectedEdgeId, fitView, sourceId, destId]);\n\n"""

    with open('flow_jsx.txt', 'r') as f_jsx:
        jsx_str = f_jsx.read()
    
    # replace routeData.length with routesData.length
    jsx_str = jsx_str.replace('routeData.length', 'routesData.length')
    
    new_code += jsx_str + "\n}\n"

    content = content.replace(old_flow.group(0), new_code)
    
    with open('src/app-main.tsx', 'w') as f:
        f.write(content)

    print("Success replacing FlowContainer with MultiFlowContainer")
