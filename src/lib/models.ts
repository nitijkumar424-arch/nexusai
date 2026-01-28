import { AIModel, Persona } from '@/types';

export const AI_MODELS: AIModel[] = [
  // Groq Models (WORKING - Ultra Fast)
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B (Groq)',
    provider: 'groq',
    description: 'Lightning fast inference with Groq LPU - Recommended',
    contextLength: 32768,
    isAvailable: true,
    speed: 'fast',
    capabilities: ['chat', 'code', 'analysis'],
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B Instant',
    provider: 'groq',
    description: 'Ultra-fast responses for simple tasks',
    contextLength: 8192,
    isAvailable: true,
    speed: 'fast',
    capabilities: ['chat'],
  },
  {
    id: 'llama3-70b-8192',
    name: 'Llama 3 70B',
    provider: 'groq',
    description: 'Powerful 70B model with fast inference',
    contextLength: 8192,
    isAvailable: true,
    speed: 'fast',
    capabilities: ['chat', 'code', 'analysis'],
  },
  {
    id: 'gemma2-9b-it',
    name: 'Gemma 2 9B',
    provider: 'groq',
    description: 'Google Gemma 2 with Groq speed',
    contextLength: 8192,
    isAvailable: true,
    speed: 'fast',
    capabilities: ['chat', 'code'],
  },
  // Google Models (Need API Key)
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'google',
    description: 'Google\'s latest multimodal AI with vision capabilities',
    contextLength: 1000000,
    isAvailable: true,
    speed: 'fast',
    capabilities: ['chat', 'code', 'analysis', 'vision'],
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    description: 'Advanced reasoning with massive context window',
    contextLength: 2000000,
    isAvailable: true,
    speed: 'medium',
    capabilities: ['chat', 'code', 'analysis', 'vision'],
  },
  // OpenRouter Models (Need API Key)
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B (OpenRouter)',
    provider: 'openrouter',
    description: 'Free access to Llama 3.3 via OpenRouter',
    contextLength: 8192,
    isAvailable: true,
    speed: 'medium',
    capabilities: ['chat', 'code', 'analysis'],
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Gemma 2 9B',
    provider: 'openrouter',
    description: 'Google\'s efficient open model',
    contextLength: 8192,
    isAvailable: true,
    speed: 'fast',
    capabilities: ['chat', 'code'],
  },
  // Fireworks Models (SUSPENDED)
  {
    id: 'accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new',
    name: 'Dobby Unhinged 70B',
    provider: 'fireworks',
    description: 'Powerful 70B parameter model (API suspended)',
    contextLength: 8192,
    isAvailable: false,
    speed: 'medium',
    capabilities: ['chat', 'code', 'analysis', 'creative'],
  },
];

export const DEFAULT_PERSONAS: Persona[] = [
  {
    id: 'default',
    name: 'Nexus',
    description: 'Helpful AI assistant with broad knowledge',
    systemPrompt: 'You are Nexus, a helpful, intelligent, and friendly AI assistant. You provide accurate, thoughtful responses while being conversational and engaging. You can help with coding, analysis, creative writing, research, and general questions.',
    avatar: 'N',
    color: '#6366f1',
    isDefault: true,
  },
  {
    id: 'coder',
    name: 'CodeMaster',
    description: 'Expert software engineer and architect',
    systemPrompt: 'You are CodeMaster, an expert software engineer with deep knowledge of multiple programming languages, frameworks, and best practices. You write clean, efficient, well-documented code. You explain complex technical concepts clearly and help debug issues methodically. Always provide complete, working code examples.',
    avatar: 'C',
    color: '#10b981',
  },
  {
    id: 'researcher',
    name: 'Scholar',
    description: 'Academic researcher and analyst',
    systemPrompt: 'You are Scholar, an academic researcher with expertise across multiple disciplines. You analyze information critically, cite sources when possible, present balanced perspectives, and help users understand complex topics. You are thorough and precise in your explanations.',
    avatar: 'S',
    color: '#f59e0b',
  },
  {
    id: 'creative',
    name: 'Muse',
    description: 'Creative writer and storyteller',
    systemPrompt: 'You are Muse, a creative writing assistant with a gift for storytelling, poetry, and imaginative content. You help users craft compelling narratives, develop characters, write engaging copy, and explore creative ideas. Your writing is vivid, evocative, and tailored to the user\'s style.',
    avatar: 'M',
    color: '#ec4899',
  },
  {
    id: 'tutor',
    name: 'Professor',
    description: 'Patient teacher and mentor',
    systemPrompt: 'You are Professor, a patient and encouraging educator. You explain concepts step-by-step, use helpful analogies, check for understanding, and adapt your teaching style to the learner. You make complex subjects accessible and foster curiosity.',
    avatar: 'P',
    color: '#8b5cf6',
  },
];

export const getModelsByProvider = (provider: string) => 
  AI_MODELS.filter(m => m.provider === provider);

export const getModelById = (id: string) => 
  AI_MODELS.find(m => m.id === id);

export const getAvailableModels = () => 
  AI_MODELS.filter(m => m.isAvailable);
