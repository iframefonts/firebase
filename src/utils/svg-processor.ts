
export const processSVGWidth = async (file: File, targetWidth: number = 2000): Promise<File> => {
  try {
    // Read the SVG content as text
    const svgContent = await file.text();
    
    // Parse the SVG to modify its dimensions
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (!svgElement) {
      console.warn('No SVG element found, returning original file');
      return file;
    }
    
    // Get current dimensions
    const currentWidth = svgElement.getAttribute('width');
    const currentHeight = svgElement.getAttribute('height');
    const viewBox = svgElement.getAttribute('viewBox');
    
    // Calculate aspect ratio
    let aspectRatio = 1;
    
    if (viewBox) {
      // If viewBox exists, use it to calculate aspect ratio
      const viewBoxValues = viewBox.split(/\s+|,/).map(v => parseFloat(v));
      if (viewBoxValues.length >= 4) {
        const vbWidth = viewBoxValues[2];
        const vbHeight = viewBoxValues[3];
        aspectRatio = vbHeight / vbWidth;
      }
    } else if (currentWidth && currentHeight) {
      // If no viewBox, use width/height attributes
      const numWidth = parseFloat(currentWidth);
      const numHeight = parseFloat(currentHeight);
      if (!isNaN(numWidth) && !isNaN(numHeight) && numWidth > 0) {
        aspectRatio = numHeight / numWidth;
      }
    }
    
    // Set new dimensions
    const newHeight = Math.round(targetWidth * aspectRatio);
    
    svgElement.setAttribute('width', `${targetWidth}px`);
    svgElement.setAttribute('height', `${newHeight}px`);
    
    // Ensure viewBox is set for proper scaling
    if (!viewBox) {
      svgElement.setAttribute('viewBox', `0 0 ${targetWidth} ${newHeight}`);
    }
    
    // Convert back to string
    const serializer = new XMLSerializer();
    const modifiedSVGContent = serializer.serializeToString(svgDoc);
    
    // Create new file with modified content
    const modifiedBlob = new Blob([modifiedSVGContent], { type: 'image/svg+xml' });
    const modifiedFile = new File([modifiedBlob], file.name, {
      type: file.type,
      lastModified: file.lastModified
    });
    
    console.log(`SVG processed: ${file.name} resized to ${targetWidth}x${newHeight}px`);
    return modifiedFile;
    
  } catch (error) {
    console.error('Error processing SVG:', error);
    // Return original file if processing fails
    return file;
  }
};
