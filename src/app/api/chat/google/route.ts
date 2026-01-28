import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, model, systemPrompt } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response('Google AI API key not configured', { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    
    const modelName = model === 'gemini-2.0-flash' 
      ? 'gemini-2.0-flash-exp' 
      : model;
    
    const geminiModel = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: systemPrompt || undefined,
    });

    const chatHistory = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = geminiModel.startChat({
      history: chatHistory,
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessageStream(lastMessage.content);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              // Format as data stream for AI SDK compatibility
              const data = `0:${JSON.stringify(text)}\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Google AI API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
