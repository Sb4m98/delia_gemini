import type * as PdfJs from 'pdfjs-dist';

let pdfjsLibPromise: Promise<typeof PdfJs> | null = null;

const getPdfjsLib = (): Promise<typeof PdfJs> => {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = import('pdfjs-dist').then(pdfjs => {
      // Set worker path once the module is loaded
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://aistudiocdn.com/pdfjs-dist@^4.4.168/build/pdf.worker.mjs';
      return pdfjs;
    });
  }
  return pdfjsLibPromise;
};

export const extractTextFromPdf = async (file: File): Promise<string> => {
  const pdfjsLib = await getPdfjsLib();
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText;
};
