import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, FileText, AlertCircle, Upload, Maximize2 } from 'lucide-react';

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

export const PdfViewer: React.FC<PdfViewerProps> = ({ fileName, initialPage, lessonTitle }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState<number>(initialPage);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);

  // Sync initialPage when lesson changes
  useEffect(() => {
    setPageNum(initialPage);
  }, [initialPage, fileName]);

  // Load PDF Document
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);

    const targetUrl = localFileUrl || `./textbooks/${encodeURIComponent(fileName)}`;

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(targetUrl);
        const doc = await loadingTask.promise;
        if (isMounted) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setLoading(false);
        }
      } catch (err: unknown) {
        console.warn('Failed to load PDF from primary path:', err);
        // Try fallback directly at root
        if (!localFileUrl) {
          try {
            const fallbackTask = pdfjsLib.getDocument(`./${encodeURIComponent(fileName)}`);
            const doc = await fallbackTask.promise;
            if (isMounted) {
              setPdfDoc(doc);
              setNumPages(doc.numPages);
              setLoading(false);
              return;
            }
          } catch (e2) {
            console.error('Fallback PDF load failed:', e2);
          }
        }
        if (isMounted) {
          setErrorMsg('未能在默认路径加载教材 PDF，您可直接从本地导入该册 PDF 文件进行浏览。');
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [fileName, localFileUrl]);

  // Render current page to canvas
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      // HiDPI rendering
      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + "px";
      canvas.style.height = Math.floor(viewport.height) + "px";

      const transform = outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : undefined;

      const renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.warn('Error rendering page:', err);
    }
  }, [pdfDoc, pageNum, scale]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

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
      // Default page width is ~595pt
      const newScale = containerWidth / 620;
      setScale(Math.max(0.7, Math.min(newScale, 1.8)));
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-100 rounded-xl border border-paper-border overflow-hidden shadow-inner">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-paper-card border-b border-paper-border gap-2">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-bamboo-700" />
          <span className="font-serif text-sm font-semibold text-wood-900 truncate max-w-[200px] md:max-w-xs">
            {lessonTitle} · 教材原版
          </span>
          <span className="text-xs text-wood-500 hidden sm:inline">
            ({fileName})
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 text-xs">
          {/* Page nav */}
          <div className="flex items-center bg-paper-100 border border-paper-border rounded-lg px-1 py-0.5">
            <button
              onClick={handlePrevPage}
              disabled={pageNum <= 1 || loading}
              className="p-1 hover:bg-paper-200 rounded disabled:opacity-40 transition cursor-pointer"
              title="上一页"
            >
              <ChevronLeft className="w-4 h-4 text-wood-700" />
            </button>
            <span className="px-2 font-medium text-wood-800">
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

          {/* Zoom buttons */}
          <div className="flex items-center bg-paper-100 border border-paper-border rounded-lg px-1 py-0.5 space-x-0.5">
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
        className="flex-1 overflow-auto p-4 flex items-center justify-center min-h-[520px] bg-stone-200/70"
      >
        {loading && (
          <div className="flex flex-col items-center justify-center space-y-3 p-8">
            <div className="w-10 h-10 border-4 border-bamboo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-serif text-sm text-wood-700">正在翻阅教材原貌第 {pageNum} 页...</p>
          </div>
        )}

        {errorMsg && !loading && (
          <div className="max-w-md bg-paper-card p-6 rounded-xl border border-cinnabar-600/30 text-center shadow-lg space-y-4">
            <AlertCircle className="w-12 h-12 text-cinnabar-600 mx-auto" />
            <div>
              <h4 className="font-serif font-bold text-wood-900 text-base">教材原貌加载提示</h4>
              <p className="text-xs text-wood-600 mt-1 leading-relaxed">
                当前浏览器未能直接读取默认静态教材目录（通常为本地静态服务器跨源策略限制）。
                系统已备好双重模式，您可直接切换至【文字纯享版】阅读，或点击下方直接选择本机的教材 PDF：
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

        <div className={`${loading || errorMsg ? 'hidden' : 'block'} shadow-2xl rounded-sm border border-stone-400 bg-white`}>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
};
