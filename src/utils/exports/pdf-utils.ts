
/**
 * PDF utilities for conversion
 */

import * as pdfjs from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import { svg2pdf } from 'svg2pdf.js';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  // Use CDN for worker to ensure it's always accessible
  const pdfjsWorkerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;
}

// Convert SVG to PDF
export const convertSvgToPdf = async (svgFile: File): Promise<Blob> => {
  try {
    const svgText = await svgFile.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;
    
    // Create a new PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [svgElement.clientWidth || 300, svgElement.clientHeight || 300]
    });
    
    // Convert SVG to PDF
    await svg2pdf(svgElement, pdf, {
      x: 0,
      y: 0,
      width: svgElement.clientWidth || 300,
      height: svgElement.clientHeight || 300
    });
    
    // Return as blob
    return pdf.output('blob');
  } catch (error) {
    console.error('Error converting SVG to PDF:', error);
    throw new Error('Failed to convert SVG to PDF');
  }
};

// Convert PDF to PNG with enhanced debugging and error handling
export const convertPdfToPng = async (pdfFile: File, width: number, height: number): Promise<Blob> => {
  console.log('Starting PDF to PNG conversion');
  console.log('PDF file type:', pdfFile.type);
  console.log('PDF file size:', pdfFile.size);
  
  try {
    // Read the PDF file as an array buffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    console.log('PDF loaded as ArrayBuffer, size:', arrayBuffer.byteLength);
    
    // Load the PDF document with additional options
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      // Adding CMap options to ensure proper rendering of fonts
      cMapUrl: 'https://unpkg.com/pdfjs-dist@' + pdfjs.version + '/cmaps/',
      cMapPacked: true,
      // Enable streaming for large documents
      disableStream: false,
      // Enable range requests for better performance
      disableRange: false
    });
    
    console.log('PDF loading task created');
    const pdf = await loadingTask.promise;
    console.log('PDF document loaded, page count:', pdf.numPages);
    
    // Get the first page
    const page = await pdf.getPage(1);
    console.log('First page retrieved');
    
    // Scale to fit desired dimensions while preserving aspect ratio
    const viewport = page.getViewport({ scale: 1.0 });
    console.log('Original viewport dimensions:', viewport.width, 'x', viewport.height);
    
    const scale = Math.min(width / viewport.width, height / viewport.height);
    console.log('Calculated scale factor:', scale);
    
    const scaledViewport = page.getViewport({ scale });
    console.log('Scaled viewport dimensions:', scaledViewport.width, 'x', scaledViewport.height);
    
    // Create a canvas to render on
    const canvas = document.createElement('canvas');
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;
    console.log('Canvas created with dimensions:', canvas.width, 'x', canvas.height);
    
    const context = canvas.getContext('2d', { alpha: false });
    
    if (!context) {
      throw new Error('Could not create canvas context');
    }
    
    // Fill with white background first to handle transparency
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create the rendering task
    console.log('Rendering PDF page to canvas...');
    const renderTask = page.render({
      canvasContext: context,
      viewport: scaledViewport,
      // Removed the invalid 'includeAnnotationStorage' property
      // Use approved properties from the RenderParameters interface
      // intent to ensure proper rendering quality
      intent: 'print'
    });
    
    // Wait for the rendering to complete
    await renderTask.promise;
    console.log('Rendering complete, converting to PNG');
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob((blob) => {
          if (blob) {
            console.log('PNG blob created successfully, size:', blob.size);
            resolve(blob);
          } else {
            console.error('Failed to create PNG from canvas');
            reject(new Error('Failed to create PNG from canvas'));
          }
        }, 'image/png', 1.0); // Use maximum quality
      } catch (blobError) {
        console.error('Error in canvas.toBlob:', blobError);
        reject(blobError);
      }
    });
  } catch (error) {
    console.error('Error in PDF to PNG conversion:', error);
    
    // Create a more informative error placeholder image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a visually distinct error message
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      
      // Error banner
      ctx.fillStyle = "#ffeeee";
      ctx.fillRect(0, height/3, width, height/3);
      
      // Error border
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, width-4, height-4);
      
      // Error text
      ctx.fillStyle = "#ff0000";
      ctx.font = "bold " + Math.round(width/20) + "px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Error Loading PDF", width/2, height/2 - 15);
      
      // Error details
      ctx.fillStyle = "#000000";
      ctx.font = Math.round(width/30) + "px Arial";
      ctx.fillText(error.message || "Please try a different file", width/2, height/2 + 20);
      ctx.fillText("Check console for details", width/2, height/2 + 45);
    }
    
    // Return the error image
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob || new Blob([], { type: 'image/png' }));
      }, 'image/png');
    });
  }
};
