
/**
 * Utility functions for extracting colors from SVG files
 */

export interface Color {
  id: string;
  value: string;
  rgbValue: string;
}

/**
 * Extract colors from SVG content
 */
export const extractColorsFromSVG = async (file: File): Promise<Color[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const svgContent = e.target?.result as string;
        
        // Create a temporary DOM element to parse the SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
        
        // Extract all elements with fill or stroke attributes
        const elements = svgDoc.querySelectorAll('[fill], [stroke]');
        
        // Set to store unique colors
        const uniqueColors = new Set<string>();
        
        // Process fill attributes
        elements.forEach(el => {
          const fill = el.getAttribute('fill');
          const stroke = el.getAttribute('stroke');
          
          if (fill && fill !== 'none' && fill !== 'transparent') {
            uniqueColors.add(fill);
          }
          
          if (stroke && stroke !== 'none' && stroke !== 'transparent') {
            uniqueColors.add(stroke);
          }
        });
        
        // Convert to Color objects
        const colorArray: Color[] = Array.from(uniqueColors).map((color, index) => {
          // Convert named colors to hex if possible
          let hexColor = color;
          
          // Create temporary element to convert named colors to hex
          if (!/^#|rgb|hsl/.test(color)) {
            const tempEl = document.createElement('div');
            tempEl.style.color = color;
            document.body.appendChild(tempEl);
            hexColor = getComputedStyle(tempEl).color;
            document.body.removeChild(tempEl);
          }
          
          // Convert RGB to hex if needed
          if (hexColor.startsWith('rgb')) {
            const rgbMatch = hexColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
              const [_, r, g, b] = rgbMatch;
              hexColor = `#${Number(r).toString(16).padStart(2, '0')}${Number(g).toString(16).padStart(2, '0')}${Number(b).toString(16).padStart(2, '0')}`;
            }
          }
          
          return {
            id: `svg-color-${index}`,
            value: hexColor,
            rgbValue: hexToRgb(hexColor)
          };
        });
        
        console.log('Extracted colors from SVG:', colorArray);
        resolve(colorArray);
      } catch (error) {
        console.error('Error extracting colors from SVG:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error('Error reading SVG file:', error);
      reject(error);
    };
    
    reader.readAsText(file);
  });
};

/**
 * Convert hex color to RGB format
 */
export const hexToRgb = (hex: string): string => {
  // Handle RGB format already
  if (hex.startsWith('rgb')) return hex;
  
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgb(${r}, ${g}, ${b})`;
};
