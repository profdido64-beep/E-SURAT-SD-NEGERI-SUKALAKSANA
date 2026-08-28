import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export interface ExportPdfOptions {
  filename?: string;
  format?: 'f4' | 'a4';
  orientation?: 'portrait' | 'landscape';
  marginMm?: number;
  scale?: number;
}

/**
 * Print a specific DOM element cleanly using a hidden iframe.
 * This guarantees proper isolation without printing background modals, menus, or scrollbars.
 */
export function printElement(
  element: HTMLElement | null,
  documentTitle = 'Dokumen Kedinasan SDN Sukalaksana'
): Promise<boolean> {
  return new Promise((resolve) => {
    if (!element) {
      // Fallback
      window.print();
      resolve(true);
      return;
    }

    // Create an invisible iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      document.body.removeChild(iframe);
      resolve(true);
      return;
    }

    // Collect all head stylesheets and styles from main document
    const headNodes = document.querySelectorAll('style, link[rel="stylesheet"]');
    let stylesHtml = '';
    headNodes.forEach((node) => {
      stylesHtml += node.outerHTML;
    });

    const elementHtml = element.outerHTML;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="utf-8" />
          <title>${documentTitle}</title>
          ${stylesHtml}
          <style>
            @page {
              size: 215mm 330mm; /* F4 / Folio Standar Kedinasan */
              margin: 12mm 15mm 12mm 15mm;
            }
            html, body {
              background-color: #ffffff !important;
              color: #000000 !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              height: auto !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .f4-paper-sheet, .f4-paper-preview {
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              margin: 0 auto !important;
              padding: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
            }
            .no-print, button, .modal-backdrop {
              display: none !important;
            }
          </style>
        </head>
        <body class="bg-white text-black p-4">
          ${elementHtml}
        </body>
      </html>
    `);
    doc.close();

    // Give time for fonts and SVGs/images inside iframe to render
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error('Print iframe error, fallback to window.print', err);
        window.print();
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          resolve(true);
        }, 1500);
      }
    }, 450);
  });
}

/**
 * Generate and download an authentic high-resolution PDF file from a DOM element.
 * Dimensions: F4 (215mm x 330mm) / Folio
 */
export async function exportElementToPdf(
  element: HTMLElement | null,
  options: ExportPdfOptions = {}
): Promise<boolean> {
  if (!element) return false;

  const {
    filename = 'Dokumen_Surat_SDN_Sukalaksana.pdf',
    format = 'f4',
    orientation = 'portrait',
    scale = 2, // 2x for crisp high-DPI text and vectors
  } = options;

  try {
    // Dimensions in mm
    // F4 / Folio = 215mm x 330mm
    const pdfWidth = format === 'f4' ? 215 : 210;
    const pdfHeight = format === 'f4' ? 330 : 297;

    // Use html-to-image which properly supports modern CSS like oklch
    const imgData = await toPng(element, {
      pixelRatio: scale,
      backgroundColor: '#ffffff',
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    });

    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format === 'f4' ? [215, 330] : 'a4',
      compress: true,
    });

    const imgWidth = pdfWidth;
    // Calculate proportional height based on the element's actual dimensions
    const imgHeight = (element.scrollHeight * pdfWidth) / element.scrollWidth;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Additional pages if content overflows F4 height
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage([pdfWidth, pdfHeight], orientation);
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback: trigger print dialog which lets user "Save as PDF"
    window.print();
    return false;
  }
}
