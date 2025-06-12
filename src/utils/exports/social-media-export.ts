
/**
 * Social media export options
 */

import { ExportFile, ExportOption } from './types';
import { createSvgToCanvas, createPngFromCanvas } from './canvas-utils';
import { convertPdfToPng } from './pdf-utils';

export const socialMediaExportOption: ExportOption = {
  name: "Social Media",
  description: "PNG and JPG files optimized for social media",
  formats: "1080x1080 profile - PNG & JPG",
  folderName: "social-media",
  generateFiles: async (logo: File): Promise<ExportFile[]> => {
    const files: ExportFile[] = [];
    
    try {
      console.log('Generating high-quality social media files for:', logo.name, 'type:', logo.type);
      const dimension = { width: 1080, height: 1080 };

      if (logo.type === 'image/svg+xml') {
        try {
          const canvas = await createSvgToCanvas(logo);
          console.log('Canvas created from SVG for social media');
          
          // PNG version
          try {
            const pngBlob = await createPngFromCanvasWithPadding(canvas, dimension.width, dimension.height);
            if (pngBlob.size > 0) {
              files.push({ 
                filename: `png/profile-${dimension.width}x${dimension.height}.png`, 
                blob: pngBlob 
              });
            }
          } catch (error) {
            console.error('Error creating social media PNG:', error);
          }

          // JPG version at 100% quality
          try {
            const jpgBlob = await createJpgFromCanvasWithPadding(canvas, dimension.width, dimension.height);
            if (jpgBlob.size > 0) {
              files.push({ 
                filename: `jpg/profile-${dimension.width}x${dimension.height}.jpg`, 
                blob: jpgBlob 
              });
            }
          } catch (error) {
            console.error('Error creating social media JPG:', error);
          }
        } catch (canvasError) {
          console.error('Error creating canvas for social media:', canvasError);
        }
      } else if (logo.type === 'application/pdf') {
        // PNG version
        try {
          const pngBlob = await convertPdfToPngWithPadding(logo, dimension.width, dimension.height);
          if (pngBlob.size > 0) {
            files.push({ 
              filename: `png/profile-${dimension.width}x${dimension.height}.png`, 
              blob: pngBlob 
            });
          }
        } catch (error) {
          console.error('Error creating PDF to social media PNG:', error);
        }

        // JPG version at 100% quality
        try {
          const jpgBlob = await convertPdfToJpgWithPadding(logo, dimension.width, dimension.height);
          if (jpgBlob.size > 0) {
            files.push({ 
              filename: `jpg/profile-${dimension.width}x${dimension.height}.jpg`, 
              blob: jpgBlob 
            });
          }
        } catch (error) {
          console.error('Error creating PDF to social media JPG:', error);
        }
      }
      
      console.log(`Social media export generated ${files.length} files`);
      return files;
    } catch (error) {
      console.error('Error generating social media files:', error);
      return files;
    }
  }
};

// Helper function to create PNG with 20% padding and centered logo
const createPngFromCanvasWithPadding = (sourceCanvas: HTMLCanvasElement, width: number, height: number): Promise<Blob> => {
  return new Promise((resolve) => {
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
      
      // Calculate dimensions with 20% padding
      const paddingX = width * 0.2;
      const paddingY = height * 0.2;
      const availableWidth = width - (paddingX * 2);
      const availableHeight = height - (paddingY * 2);
      
      // Calculate scale to fit within available space while maintaining aspect ratio
      const scaleX = availableWidth / sourceCanvas.width;
      const scaleY = availableHeight / sourceCanvas.height;
      const scale = Math.min(scaleX, scaleY);
      
      // Calculate final dimensions
      const finalWidth = sourceCanvas.width * scale;
      const finalHeight = sourceCanvas.height * scale;
      
      // Calculate position to center the logo
      const x = (width - finalWidth) / 2;
      const y = (height - finalHeight) / 2;
      
      // Draw the logo centered with padding
      ctx.drawImage(sourceCanvas, x, y, finalWidth, finalHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          resolve(new Blob([]));
        }
      }, 'image/png');
    } else {
      resolve(new Blob([]));
    }
  });
};

// Helper function to create JPG with 20% padding and centered logo at 100% quality
const createJpgFromCanvasWithPadding = (sourceCanvas: HTMLCanvasElement, width: number, height: number): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Enable high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Fill with white background for JPG (no transparency support)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      
      // Calculate dimensions with 20% padding
      const paddingX = width * 0.2;
      const paddingY = height * 0.2;
      const availableWidth = width - (paddingX * 2);
      const availableHeight = height - (paddingY * 2);
      
      // Calculate scale to fit within available space while maintaining aspect ratio
      const scaleX = availableWidth / sourceCanvas.width;
      const scaleY = availableHeight / sourceCanvas.height;
      const scale = Math.min(scaleX, scaleY);
      
      // Calculate final dimensions
      const finalWidth = sourceCanvas.width * scale;
      const finalHeight = sourceCanvas.height * scale;
      
      // Calculate position to center the logo
      const x = (width - finalWidth) / 2;
      const y = (height - finalHeight) / 2;
      
      // Draw the logo centered with padding
      ctx.drawImage(sourceCanvas, x, y, finalWidth, finalHeight);
      
      // Convert to JPG with 100% quality (1.0)
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          resolve(new Blob([]));
        }
      }, 'image/jpeg', 1.0);
    } else {
      resolve(new Blob([]));
    }
  });
};

// Helper function for PDF conversion with padding to PNG
const convertPdfToPngWithPadding = async (pdfFile: File, width: number, height: number): Promise<Blob> => {
  try {
    // First convert PDF to PNG at a high resolution for better quality
    const tempBlob = await convertPdfToPng(pdfFile, width * 2, height * 2);
    
    // Create an image from the blob
    const img = new Image();
    const url = URL.createObjectURL(tempBlob);
    
    return new Promise((resolve) => {
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        // Create canvas for the final output
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Enable high-quality rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Clear canvas
          ctx.clearRect(0, 0, width, height);
          
          // Calculate dimensions with 20% padding
          const paddingX = width * 0.2;
          const paddingY = height * 0.2;
          const availableWidth = width - (paddingX * 2);
          const availableHeight = height - (paddingY * 2);
          
          // Calculate scale to fit within available space while maintaining aspect ratio
          const scaleX = availableWidth / img.width;
          const scaleY = availableHeight / img.height;
          const scale = Math.min(scaleX, scaleY);
          
          // Calculate final dimensions
          const finalWidth = img.width * scale;
          const finalHeight = img.height * scale;
          
          // Calculate position to center the logo
          const x = (width - finalWidth) / 2;
          const y = (height - finalHeight) / 2;
          
          // Draw the logo centered with padding
          ctx.drawImage(img, x, y, finalWidth, finalHeight);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(new Blob([]));
            }
          }, 'image/png');
        } else {
          resolve(new Blob([]));
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(new Blob([]));
      };
      
      img.src = url;
    });
  } catch (error) {
    console.error('Error converting PDF with padding:', error);
    return new Blob([]);
  }
};

// Helper function for PDF conversion with padding to JPG at 100% quality
const convertPdfToJpgWithPadding = async (pdfFile: File, width: number, height: number): Promise<Blob> => {
  try {
    // First convert PDF to PNG at a high resolution for better quality
    const tempBlob = await convertPdfToPng(pdfFile, width * 2, height * 2);
    
    // Create an image from the blob
    const img = new Image();
    const url = URL.createObjectURL(tempBlob);
    
    return new Promise((resolve) => {
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        // Create canvas for the final output
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Enable high-quality rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Fill with white background for JPG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          
          // Calculate dimensions with 20% padding
          const paddingX = width * 0.2;
          const paddingY = height * 0.2;
          const availableWidth = width - (paddingX * 2);
          const availableHeight = height - (paddingY * 2);
          
          // Calculate scale to fit within available space while maintaining aspect ratio
          const scaleX = availableWidth / img.width;
          const scaleY = availableHeight / img.height;
          const scale = Math.min(scaleX, scaleY);
          
          // Calculate final dimensions
          const finalWidth = img.width * scale;
          const finalHeight = img.height * scale;
          
          // Calculate position to center the logo
          const x = (width - finalWidth) / 2;
          const y = (height - finalHeight) / 2;
          
          // Draw the logo centered with padding
          ctx.drawImage(img, x, y, finalWidth, finalHeight);
          
          // Convert to JPG with 100% quality (1.0)
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(new Blob([]));
            }
          }, 'image/jpeg', 1.0);
        } else {
          resolve(new Blob([]));
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(new Blob([]));
      };
      
      img.src = url;
    });
  } catch (error) {
    console.error('Error converting PDF to JPG with padding:', error);
    return new Blob([]);
  }
};
