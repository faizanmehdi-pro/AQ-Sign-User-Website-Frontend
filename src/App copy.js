import React, { useState, useEffect, useRef } from "react";

const PDFViewer = ({ pdfUrl }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const pdfContainerRef = useRef(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        // Load pdf.js script dynamically
        const script = document.createElement("script");
        script.src = "/pdfjs/pdf.js";
        script.async = true;
        script.onload = async () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.js";

          // Now pdf.js is available, fetch the document
          const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
          const doc = await loadingTask.promise;
          setPdfDoc(doc);
          setNumPages(doc.numPages);
        };
        document.body.appendChild(script);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  const renderPage = async (pageNum, canvasRef) => {
    if (!pdfDoc || !canvasRef.current) return;

    const page = await pdfDoc.getPage(pageNum);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = { canvasContext: context, viewport };
    page.render(renderContext);
  };

  return (
    <div style={{ width: "100%", height: "100vh", overflowY: "auto" }} ref={pdfContainerRef}>
      {Array.from({ length: numPages }, (_, i) => (
        <div key={i} style={{ position: "relative", marginBottom: "20px" }}>
          {/* Canvas for Rendering PDF Page */}
          <canvas ref={(canvasRef) => canvasRef && renderPage(i + 1, { current: canvasRef })}></canvas>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  return (
    <PDFViewer pdfUrl="http://98.81.159.86/media/documents/Weekly_Tasks_Report_60GqVLx.pdf" />
  );
}