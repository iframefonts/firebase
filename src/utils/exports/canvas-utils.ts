
/**
 * Canvas utilities for image conversion
 */

export const createSvgToCanvas = async (svgFile: File): Promise<HTMLCanvasElement> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Starting high-quality SVG to canvas conversion for file:', svgFile.name);
      
      // Read SVG content to parse dimensions
      const svgText = await svgFile.text();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;
      
      // Extract dimensions from SVG
      let width = 300; // default fallback
      let height = 300; // default fallback
      
      // Try to get width and height from attributes
      const widthAttr = svgElement.getAttribute('width');
      const heightAttr = svgElement.getAttribute('height');
      
      if (widthAttr && heightAttr) {
        width = parseFloat(widthAttr.replace(/[^\d.]/g, '')) || 300;
        height = parseFloat(heightAttr.replace(/[^\d.]/g, '')) || 300;
        console.log('Using SVG width/height attributes:', width, 'x', height);
      } else {
        // Try to get dimensions from viewBox
        const viewBox = svgElement.getAttribute('viewBox');
        if (viewBox) {
          const viewBoxParts = viewBox.split(/\s+/);
          if (viewBoxParts.length >= 4) {
            width = parseFloat(viewBoxParts[2]) || 300;
            height = parseFloat(viewBoxParts[3]) || 300;
            console.log('Using SVG viewBox dimensions:', width, 'x', height);
          }
        }
      }
      
      // Ensure minimum dimensions and use higher resolution for better quality
      width = Math.max(width, 100);
      height = Math.max(height, 100);
      
      console.log('Final SVG dimensions:', width, 'x', height);
      
      const url = URL.createObjectURL(svgFile);
      const img = new Image();
      
      img.onload = () => {
        console.log('SVG image loaded, creating high-quality canvas');
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Enable high-quality rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Fill with transparent background
          ctx.clearRect(0, 0, width, height);
          
          // Draw the image at full resolution without scaling to maintain quality
          ctx.drawImage(img, 0, 0, width, height);
          URL.revokeObjectURL(url);
          console.log('SVG successfully converted to high-quality canvas');
          resolve(canvas);
        } else {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to get canvas context'));
        }
      };
      
      img.onerror = () => {
        console.error('Failed to load SVG as image');
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG'));
      };
      
      img.src = url;
    } catch (error) {
      console.error('Error in SVG to canvas conversion:', error);
      reject(error);
    }
  });
};

export const createPngFromCanvas = (canvas: HTMLCanvasElement, width: number, height: number): Promise<Blob> => {
  return new Promise((resolve) => {
    console.log('Creating high-quality PNG from canvas, target size:', width, 'x', height);
    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = width;
    resizedCanvas.height = height;
    const ctx = resizedCanvas.getContext('2d');
    
    if (ctx) {
      // Enable high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(canvas, 0, 0, width, height);
      
      // PNG is lossless, so no quality parameter needed
      resizedCanvas.toBlob((blob) => {
        if (blob) {
          console.log('High-quality PNG created successfully, size:', blob.size);
          resolve(blob);
        } else {
          console.error('Failed to create PNG blob');
          resolve(new Blob([]));
        }
      }, 'image/png');
    } else {
      console.error('Failed to get canvas context for PNG creation');
      resolve(new Blob([]));
    }
  });
};
