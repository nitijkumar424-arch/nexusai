import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message, AppSettings, Persona, UploadedDocument } from '@/types';
import { DEFAULT_PERSONAS, AI_MODELS } from '@/lib/models';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  settings: AppSettings;
  personas: Persona[];
  documents: UploadedDocument[];
  isLoading: boolean;
  isSidebarOpen: boolean;

  // Conversation actions
  createConversation: (model?: string, persona?: string) => string;
  deleteConversation: (id: string) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  setCurrentConversation: (id: string | null) => void;
  getCurrentConversation: () => Conversation | undefined;
  branchConversation: (conversationId: string, messageIndex: number) => string;

  // Message actions
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => string;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;

  // Settings actions
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Persona actions
  addPersona: (persona: Omit<Persona, 'id'>) => void;
  updatePersona: (id: string, updates: Partial<Persona>) => void;
  deletePersona: (id: string) => void;

  // Document actions
  addDocument: (doc: UploadedDocument) => void;
  removeDocument: (id: string) => void;

  // UI actions
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Reset
  clearAllData: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  defaultModel: AI_MODELS[0].id,
  defaultPersona: 'default',
  streamResponses: true,
  enableVoice: true,
  enableWebSearch: true,
  enableArtifacts: true,
  fontSize: 'medium',
  sendWithEnter: true,
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      settings: defaultSettings,
      personas: DEFAULT_PERSONAS,
      documents: [],
      isLoading: false,
      isSidebarOpen: true,

      createConversation: (model?: string, persona?: string) => {
        const id = uuidv4();
        const newConversation: Conversation = {
          id,
          title: 'New Chat',
          messages: [],
          model: model || get().settings.defaultModel,
          persona: persona || get().settings.defaultPersona,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set(state => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
        }));
        return id;
      },

      deleteConversation: (id: string) => {
        set(state => {
          const newConversations = state.conversations.filter(c => c.id !== id);
          const newCurrentId = state.currentConversationId === id
            ? newConversations[0]?.id || null
            : state.currentConversationId;
          return {
            conversations: newConversations,
            currentConversationId: newCurrentId,
          };
        });
      },

      updateConversation: (id: string, updates: Partial<Conversation>) => {
        set(state => ({
          conversations: state.conversations.map(c =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
          ),
        }));
      },

      setCurrentConversation: (id: string | null) => {
        set({ currentConversationId: id });
      },

      getCurrentConversation: () => {
        const state = get();
        return state.conversations.find(c => c.id === state.currentConversationId);
      },

      branchConversation: (conversationId: string, messageIndex: number) => {
        const state = get();
        const original = state.conversations.find(c => c.id === conversationId);
        if (!original) return conversationId;

        const id = uuidv4();
        const branchedMessages = original.messages.slice(0, messageIndex + 1);
        const newConversation: Conversation = {
          id,
          title: `Branch: ${original.title}`,
          messages: branchedMessages.map(m => ({ ...m, id: uuidv4() })),
          model: original.model,
          persona: original.persona,
          createdAt: new Date(),
          updatedAt: new Date(),
          parentId: conversationId,
          branchPoint: messageIndex,
        };
        set(state => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
        }));
        return id;
      },

      addMessage: (conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => {
        const messageId = uuidv4();
        const newMessage: Message = {
          ...message,
          id: messageId,
          createdAt: new Date(),
        };
        set(state => ({
          conversations: state.conversations.map(c => {
            if (c.id !== conversationId) return c;
            const updatedMessages = [...c.messages, newMessage];
            const title = c.messages.length === 0 && message.role === 'user'
              ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
              : c.title;
            return { ...c, messages: updatedMessages, title, updatedAt: new Date() };
          }),
        }));
        return messageId;
      },

      updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => {
        set(state => ({
          conversations: state.conversations.map(c => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              messages: c.messages.map(m =>
                m.id === messageId ? { ...m, ...updates } : m
              ),
              updatedAt: new Date(),
            };
          }),
        }));
      },

      deleteMessage: (conversationId: string, messageId: string) => {
        set(state => ({
          conversations: state.conversations.map(c => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              messages: c.messages.filter(m => m.id !== messageId),
              updatedAt: new Date(),
            };
          }),
        }));
      },

      updateSettings: (updates: Partial<AppSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      addPersona: (persona: Omit<Persona, 'id'>) => {
        const newPersona: Persona = { ...persona, id: uuidv4() };
        set(state => ({
          personas: [...state.personas, newPersona],
        }));
      },

      updatePersona: (id: string, updates: Partial<Persona>) => {
        set(state => ({
          personas: state.personas.map(p =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deletePersona: (id: string) => {
        set(state => ({
          personas: state.personas.filter(p => p.id !== id || p.isDefault),
        }));
      },

      addDocument: (doc: UploadedDocument) => {
        set(state => ({
          documents: [...state.documents, doc],
        }));
      },

      removeDocument: (id: string) => {
        set(state => ({
          documents: state.documents.filter(d => d.id !== id),
        }));
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      toggleSidebar: () => {
        set(state => ({ isSidebarOpen: !state.isSidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ isSidebarOpen: open });
      },

      clearAllData: () => {
        set({
          conversations: [],
          currentConversationId: null,
          settings: defaultSettings,
          personas: DEFAULT_PERSONAS,
          documents: [],
        });
      },
    }),
    {
      name: 'nexus-ai-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        settings: state.settings,
        personas: state.personas,
        documents: state.documents,
      }),
    }
  )
);
