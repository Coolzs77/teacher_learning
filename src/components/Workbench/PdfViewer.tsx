import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  FileText, 
  AlertCircle, 
  Upload, 
  Maximize2,
  PenTool,
  Highlighter,
  Eraser,
  Trash2,
  Check,
  MousePointer
} from 'lucide-react';

// Setup worker
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch (e) {
    console.warn('PDF.js worker initialization error:', e);
  }
}

interface PdfViewerProps {
  fileName: string;
  initialPage: number;
  lessonTitle: string;
}

type DrawingTool = 'select' | 'pen' | 'highlighter' | 'eraser';

export const PdfViewer: React.FC<PdfViewerProps> = ({ fileName, initialPage, lessonTitle }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState<number>(initialPage);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);

  // Drawing Tools State
  const [activeTool, setActiveTool] = useState<DrawingTool>('pen');
  const [penColor, setPenColor] = useState<string>('#C24836'); // Default vermilion/cinnabar
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [saveStatus, setSaveStatus] = useState<boolean>(false);

  // Storage key for annotations
  const getStorageKey = (p: number) => `tl_draw_${encodeURIComponent(fileName)}_p${p}`;

  // Sync initialPage when lesson changes
  useEffect(() => {
    setPageNum(initialPage);
  }, [initialPage, fileName]);

  // Load PDF Document
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);

    // In GitHub Pages subpath /teacher_learning/, resolve path safely
    const basePath = window.location.pathname.startsWith('/teacher_learning') ? '/teacher_learning' : '.';
    const candidateUrls = localFileUrl ? [localFileUrl] : [
      `${basePath}/textbooks/${encodeURIComponent(fileName)}`,
      `${basePath}/public/textbooks/${encodeURIComponent(fileName)}`,
      `./textbooks/${encodeURIComponent(fileName)}`,
      `./public/textbooks/${encodeURIComponent(fileName)}`,
      `../public/textbooks/${encodeURIComponent(fileName)}`
    ];

    const loadPdf = async () => {
      let loadedDoc: pdfjsLib.PDFDocumentProxy | null = null;
      for (const url of candidateUrls) {
        if (!isMounted) return;
        try {
          const task = pdfjsLib.getDocument({
            url,
            rangeChunkSize: 65536, // 64KB on-demand chunk streaming
            disableAutoFetch: true, // Do not download the entire 15MB file upfront
            disableStream: true
          });
          loadedDoc = await task.promise;
          if (loadedDoc) break;
        } catch {
          // try next candidate
        }
      }

      if (isMounted) {
        if (loadedDoc) {
          setPdfDoc(loadedDoc);
          setNumPages(loadedDoc.numPages);
          setLoading(false);
        } else {
          setErrorMsg('未能在默认路径加载教材 PDF，您可直接点击上方按钮从本地导入该册 PDF 文件进行备课。');
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [fileName, localFileUrl]);

  // Render current page to canvas & restore drawings
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || !drawCanvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const drawCanvas = drawCanvasRef.current;
      const drawContext = drawCanvas.getContext('2d');

      if (!context || !drawContext) return;

      const outputScale = window.devicePixelRatio || 1;
      
      // Setup PDF Canvas
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + 'px';
      canvas.style.height = Math.floor(viewport.height) + 'px';

      // Setup Drawing Canvas overlay
      drawCanvas.width = Math.floor(viewport.width * outputScale);
      drawCanvas.height = Math.floor(viewport.height * outputScale);
      drawCanvas.style.width = Math.floor(viewport.width) + 'px';
      drawCanvas.style.height = Math.floor(viewport.height) + 'px';

      const transform = outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : undefined;

      const renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport
      };

      await page.render(renderContext).promise;

      // Restore saved drawings for this page
      const savedDataUrl = localStorage.getItem(getStorageKey(pageNum));
      if (savedDataUrl) {
        const img = new Image();
        img.onload = () => {
          drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
          drawContext.drawImage(img, 0, 0);
        };
        img.src = savedDataUrl;
      } else {
        drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
      }
    } catch (err) {
      console.warn('Error rendering page:', err);
    }
  }, [pdfDoc, pageNum, scale, fileName]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  // Save drawing canvas to localStorage
  const saveDrawings = useCallback(() => {
    if (!drawCanvasRef.current) return;
    try {
      const dataUrl = drawCanvasRef.current.toDataURL('image/png');
      localStorage.setItem(getStorageKey(pageNum), dataUrl);
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 1500);
    } catch (e) {
      console.warn('Failed to save drawing to localStorage:', e);
    }
  }, [pageNum, fileName]);

  // Clear current page drawing
  const handleClearDrawings = () => {
    if (!drawCanvasRef.current) return;
    const ctx = drawCanvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);
      localStorage.removeItem(getStorageKey(pageNum));
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 1200);
    }
  };

  // Drawing event handlers
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawCanvasRef.current) return { x: 0, y: 0 };
    const rect = drawCanvasRef.current.getBoundingClientRect();
    const scaleX = drawCanvasRef.current.width / rect.width;
    const scaleY = drawCanvasRef.current.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'select') return;
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    setLastPos(coords);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos || !drawCanvasRef.current) return;
    const ctx = drawCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoordinates(e);
    const pixelRatio = window.devicePixelRatio || 1;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = 3 * pixelRatio;
      ctx.stroke();
    } else if (activeTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      // Semi-transparent highlight
      ctx.strokeStyle = penColor === '#C24836' ? 'rgba(255, 99, 72, 0.35)' : 'rgba(255, 230, 0, 0.4)';
      ctx.lineWidth = 18 * pixelRatio;
      ctx.stroke();
    } else if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 24 * pixelRatio;
      ctx.stroke();
    }

    setLastPos(coords);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPos(null);
      saveDrawings();
    }
  };

  // Handle local file upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalFileUrl(url);
    }
  };

  const handlePrevPage = () => {
    if (pageNum > 1) setPageNum(pageNum - 1);
  };

  const handleNextPage = () => {
    if (pageNum < numPages) setPageNum(pageNum + 1);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.6));
  };

  const handleFitWidth = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 48;
      const newScale = containerWidth / 620;
      setScale(Math.max(0.7, Math.min(newScale, 1.8)));
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-100 rounded-xl border border-paper-border overflow-hidden shadow-inner font-serif">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-paper-card border-b border-paper-border gap-2">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-bamboo-700" />
          <span className="text-sm md:text-base font-bold text-wood-900 truncate max-w-[200px] md:max-w-xs">
            {lessonTitle} · 教材原版
          </span>
          <span className="text-xs text-wood-500 hidden sm:inline">
            (第 {pageNum} 页 / {numPages || '--'})
          </span>
        </div>

        {/* Middle Drawing Tools Palette */}
        <div className="flex items-center bg-paper-100 border border-paper-border rounded-xl p-1 space-x-1 shadow-sm">
          <button
            onClick={() => setActiveTool('select')}
            className={`p-1.5 rounded-lg text-xs flex items-center space-x-1 cursor-pointer transition ${
              activeTool === 'select' ? 'bg-wood-800 text-white shadow-sm' : 'text-wood-700 hover:bg-paper-200'
            }`}
            title="纯浏览模式"
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">浏览</span>
          </button>

          <button
            onClick={() => setActiveTool('pen')}
            className={`p-1.5 rounded-lg text-xs flex items-center space-x-1 cursor-pointer transition ${
              activeTool === 'pen' ? 'bg-cinnabar-700 text-white shadow-sm' : 'text-wood-700 hover:bg-paper-200'
            }`}
            title="画笔批注"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden md:inline">画笔</span>
          </button>

          <button
            onClick={() => setActiveTool('highlighter')}
            className={`p-1.5 rounded-lg text-xs flex items-center space-x-1 cursor-pointer transition ${
              activeTool === 'highlighter' ? 'bg-amber-500 text-white shadow-sm' : 'text-wood-700 hover:bg-paper-200'
            }`}
            title="荧光高亮笔"
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span className="hidden md:inline">高亮笔</span>
          </button>

          <button
            onClick={() => setActiveTool('eraser')}
            className={`p-1.5 rounded-lg text-xs flex items-center space-x-1 cursor-pointer transition ${
              activeTool === 'eraser' ? 'bg-stone-600 text-white shadow-sm' : 'text-wood-700 hover:bg-paper-200'
            }`}
            title="橡皮擦"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span className="hidden md:inline">橡皮</span>
          </button>

          {/* Color Selector */}
          {(activeTool === 'pen' || activeTool === 'highlighter') && (
            <div className="flex items-center space-x-1 pl-1 border-l border-paper-border">
              {[
                { label: '朱砂红', color: '#C24836' },
                { label: '竹青绿', color: '#2F855A' },
                { label: '墨黑', color: '#2D241E' },
                { label: '亮黄', color: '#D97706' },
              ].map(c => (
                <button
                  key={c.color}
                  onClick={() => setPenColor(c.color)}
                  className={`w-4 h-4 rounded-full border transition cursor-pointer ${
                    penColor === c.color ? 'ring-2 ring-bamboo-600 scale-110' : 'opacity-70'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>
          )}

          <div className="border-l border-paper-border pl-1 flex items-center space-x-1">
            <button
              onClick={handleClearDrawings}
              className="p-1.5 text-stone-500 hover:text-cinnabar-700 hover:bg-paper-200 rounded-lg transition cursor-pointer"
              title="清除本页笔迹"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {saveStatus && (
              <span className="text-[11px] text-bamboo-700 flex items-center font-medium pr-1">
                <Check className="w-3 h-3 mr-0.5" />已保存
              </span>
            )}
          </div>
        </div>

        {/* Page navigation & Zoom controls */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center bg-paper-100 border border-paper-border rounded-xl px-1 py-0.5 shadow-sm">
            <button
              onClick={handlePrevPage}
              disabled={pageNum <= 1 || loading}
              className="p-1 hover:bg-paper-200 rounded disabled:opacity-40 transition cursor-pointer"
              title="上一页"
            >
              <ChevronLeft className="w-4 h-4 text-wood-700" />
            </button>
            <span className="px-2 font-medium text-wood-900 font-mono text-xs">
              {pageNum} / {numPages || '--'}
            </span>
            <button
              onClick={handleNextPage}
              disabled={pageNum >= numPages || loading}
              className="p-1 hover:bg-paper-200 rounded disabled:opacity-40 transition cursor-pointer"
              title="下一页"
            >
              <ChevronRight className="w-4 h-4 text-wood-700" />
            </button>
          </div>

          <div className="flex items-center bg-paper-100 border border-paper-border rounded-xl px-1 py-0.5 space-x-0.5 shadow-sm">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-paper-200 rounded transition cursor-pointer"
              title="缩小"
            >
              <ZoomOut className="w-3.5 h-3.5 text-wood-700" />
            </button>
            <span className="text-[11px] px-1 text-wood-600 w-10 text-center font-mono">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-paper-200 rounded transition cursor-pointer"
              title="放大"
            >
              <ZoomIn className="w-3.5 h-3.5 text-wood-700" />
            </button>
            <button
              onClick={handleFitWidth}
              className="p-1 hover:bg-paper-200 rounded transition cursor-pointer"
              title="适应宽度"
            >
              <Maximize2 className="w-3.5 h-3.5 text-wood-700" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF View Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 flex items-center justify-center min-h-[540px] bg-stone-200/70"
      >
        {loading && (
          <div className="flex flex-col items-center justify-center space-y-3 p-8 text-center max-w-md">
            <div className="w-10 h-10 border-4 border-bamboo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-serif text-sm font-bold text-wood-800">正在流式加载教材原貌第 {pageNum} 页...</p>
            <p className="font-serif text-xs text-wood-500 leading-relaxed">
              系统采用按需切片加载技术。若遇网络延迟，您亦可直接秒开本地教材：
            </p>
            <label className="btn-tactile inline-flex items-center space-x-2 px-4 py-2 bg-bamboo-700 text-white rounded-xl text-xs font-serif font-bold cursor-pointer shadow hover:bg-bamboo-800 transition">
              <Upload className="w-4 h-4" />
              <span>⚡ 本地教材秒开（{fileName}）</span>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        )}

        {errorMsg && !loading && (
          <div className="max-w-md bg-paper-card p-6 rounded-xl border border-cinnabar-600/30 text-center shadow-lg space-y-4">
            <AlertCircle className="w-12 h-12 text-cinnabar-600 mx-auto" />
            <div>
              <h4 className="font-serif font-bold text-wood-900 text-base">教材原貌加载提示</h4>
              <p className="text-xs text-wood-600 mt-1 leading-relaxed">
                未能从默认路径加载教材文件。您可直接切换至【课文全文与批注】阅读，或点击下方选择本地教材 PDF：
              </p>
            </div>

            <label className="btn-tactile inline-flex items-center space-x-2 px-4 py-2 bg-bamboo-700 text-white rounded-lg text-xs font-medium cursor-pointer shadow">
              <Upload className="w-4 h-4" />
              <span>选择本地教材 PDF（{fileName}）</span>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        )}

        <div className={`${loading || errorMsg ? 'hidden' : 'block'} relative shadow-2xl rounded-sm border border-stone-400 bg-white`}>
          {/* Underlying PDF Page Canvas */}
          <canvas ref={canvasRef} />

          {/* Interactive Annotation Canvas Overlay */}
          <canvas
            ref={drawCanvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className={`absolute inset-0 z-10 ${
              activeTool === 'select'
                ? 'pointer-events-none'
                : activeTool === 'eraser'
                ? 'cursor-cell'
                : 'cursor-crosshair'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
