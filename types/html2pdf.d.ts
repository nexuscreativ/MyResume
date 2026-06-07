declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | [number, number] | [number, number, number, number];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      backgroundColor?: string | null;
      logging?: boolean;
      [key: string]: unknown;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: string;
      [key: string]: unknown;
    };
    pagebreak?: { mode?: string | string[]; avoid?: string };
  }

  interface Html2PdfInstance {
    set(options: Html2PdfOptions): Html2PdfInstance;
    from(element: HTMLElement): Html2PdfInstance;
    save(filename?: string): Promise<Html2PdfInstance>;
    output(type: string, options?: unknown): Promise<string | Blob>;
    toPdf(element?: HTMLElement): Html2PdfInstance;
    toContainer(): Html2PdfInstance;
  }

  function html2pdf(): Html2PdfInstance;

  export default html2pdf;
}
