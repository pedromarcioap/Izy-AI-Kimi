import * as pdfjsLib from 'pdfjs-dist';

export class PDFService {
  async loadPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    
    return text;
  }

  async searchInPDF(pdfText: string, query: string): Promise<string[]> {
    const sentences = pdfText.split(/[.!?]+/);
    const results = sentences.filter(s => 
      s.toLowerCase().includes(query.toLowerCase())
    );
    return results.slice(0, 5);
  }
}

export const pdfService = new PDFService();
