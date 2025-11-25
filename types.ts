export enum Sender {
  User = 'user',
  Bot = 'bot'
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface VisualizationData {
  type: 'bar' | 'line' | 'pie' | 'none';
  title: string;
  data: ChartDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export interface SourceLink {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
  isLoading?: boolean;
  groundingSources?: SourceLink[];
  visualization?: VisualizationData;
  debugLog?: string[]; // To show the "Debug thinking" steps
}

export interface ApiError {
  message: string;
  code?: string;
}
