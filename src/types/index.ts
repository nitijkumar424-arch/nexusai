export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
  model?: string;
  isStreaming?: boolean;
  sources?: WebSource[];
  artifacts?: Artifact[];
}

export interface WebSource {
  title: string;
  url: string;
  snippet: string;
  favicon?: string;
}

export interface Artifact {
  id: string;
  type: 'code' | 'markdown' | 'html' | 'mermaid' | 'svg';
  title: string;
  content: string;
  language?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  persona?: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  branchPoint?: number;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'fireworks' | 'groq' | 'google' | 'openrouter';
  description: string;
  contextLength: number;
  isAvailable: boolean;
  icon?: string;
  speed?: 'fast' | 'medium' | 'slow';
  capabilities?: string[];
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  avatar: string;
  color: string;
  isDefault?: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  defaultModel: string;
  defaultPersona: string;
  streamResponses: boolean;
  enableVoice: boolean;
  enableWebSearch: boolean;
  enableArtifacts: boolean;
  fontSize: 'small' | 'medium' | 'large';
  sendWithEnter: boolean;
}

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    filename: string;
    pageNumber?: number;
    chunkIndex: number;
  };
  embedding?: number[];
}

export interface UploadedDocument {
  id: string;
  filename: string;
  type: string;
  size: number;
  chunks: DocumentChunk[];
  uploadedAt: Date;
}
