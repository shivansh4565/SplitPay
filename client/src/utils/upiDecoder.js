import jsQR from 'jsqr';

/**
 * Parses a raw decoded string into structured UPI payment details.
 * Expected format: upi://pay?pa=merchant@upi&pn=Merchant%20Name&...
 * 
 * @param {string} rawText 
 * @returns {{ pa: string, pn: string, rawParams: Record<string, string>, fullUrl: string }}
 */
export function parseUpiString(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error("This doesn't appear to be a valid UPI QR code.");
  }

  const trimmed = rawText.trim();
  
  // Check if it looks like a UPI link or contains UPI query parameters
  if (!trimmed.toLowerCase().startsWith('upi://pay') && !trimmed.includes('pa=')) {
    throw new Error("This doesn't appear to be a valid UPI QR code.");
  }

  let queryString = '';
  if (trimmed.includes('?')) {
    queryString = trimmed.substring(trimmed.indexOf('?') + 1);
  } else if (trimmed.includes('pa=')) {
    queryString = trimmed;
  } else {
    throw new Error("No valid merchant UPI ID was found in this QR.");
  }

  const params = new URLSearchParams(queryString);
  const pa = params.get('pa');
  let pn = params.get('pn');

  if (!pa) {
    throw new Error("No valid merchant UPI ID was found in this QR.");
  }

  // Format and clean merchant name
  if (pn) {
    try {
      pn = decodeURIComponent(pn.replace(/\+/g, ' '));
    } catch {
      pn = pn.replace(/\+/g, ' ');
    }
  } else {
    // If merchant name not in QR, fallback to UPI handle or user-friendly name
    const handleName = pa.split('@')[0];
    pn = handleName ? handleName.toUpperCase() : 'Merchant';
  }

  const rawParams = {};
  for (const [key, value] of params.entries()) {
    rawParams[key] = value;
  }

  return {
    pa: pa.trim(),
    pn: pn.trim(),
    rawParams,
    fullUrl: trimmed
  };
}

/**
 * Decodes a QR code from an HTML Image or Canvas using jsQR.
 * 
 * @param {HTMLImageElement|HTMLCanvasElement|ImageData} source 
 * @returns {string} Decoded string content
 */
export function decodeQRFromImageSource(source) {
  let imageData;

  if (source instanceof ImageData) {
    imageData = source;
  } else {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    const width = source.naturalWidth || source.videoWidth || source.width || 400;
    const height = source.naturalHeight || source.videoHeight || source.height || 400;
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(source, 0, 0, width, height);
    imageData = ctx.getImageData(0, 0, width, height);
  }

  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'attemptBoth',
  });

  if (!code || !code.data) {
    throw new Error('Unable to read this QR code. Please upload a clearer merchant QR image.');
  }

  return code.data;
}

/**
 * Loads an image file into an HTMLImageElement and decodes the QR.
 * 
 * @param {File|Blob} file 
 * @returns {Promise<{ upiData: ReturnType<typeof parseUpiString>, previewUrl: string }>}
 */
export async function decodeQrFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please upload a valid image file (PNG, JPG, WebP, etc.).'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        try {
          const rawData = decodeQRFromImageSource(img);
          const upiData = parseUpiString(rawData);
          resolve({ upiData, previewUrl });
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => {
        reject(new Error('Failed to load image for scanning.'));
      };
      img.src = previewUrl;
    };
    reader.onerror = () => reject(new Error('Error reading file.'));
    reader.readAsDataURL(file);
  });
}
