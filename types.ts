// ====== Tipi Generali dell'App ======
export type Page = 'Home' | 'Upload' | 'Chat' | 'Process';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

// ====== Tipi per l'Elaborazione dei Documenti ======
export interface ProcessedDocument {
    name: string;
    textContent: string;
}

export interface DocumentAnalysis {
    wordCount: number;
    uniqueWords: number;
    wordFreq: [string, number][];
}

// ====== Tipi per la Visualizzazione dei Grafi ======
export type NodeType = 'mainProcess' | 'decision' | 'beginEnd' | 'criticalNode';

export interface GraphNodeData {
  id: string;
  label: string;
  type: NodeType;
  description: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label?: string;
}

export interface GraphData {
  nodes: GraphNodeData[];
  edges: GraphEdge[];
}

// ====== Tipi per la Visualizzazione dei Grafici in Chat ======
export interface DonutChartData {
  slices: { label: string; value: number }[];
}

export interface BarChartData {
  labels: string[];
  values: number[];
}

export type ChartData = DonutChartData | BarChartData;

export interface ChartResponse {
  type: 'chart';
  chartType: 'donut' | 'bar';
  title: string;
  data: ChartData;
}
