import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, model, provider, systemPrompt } = await req.json();

    let apiUrl: string;
    let apiKey: string | undefined;
    let headers: Record<string, string>;

    switch (provider) {
      case 'groq':
        apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
          return new Response('Groq API key not configured', { status: 400 });
        }
        apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        };
        break;
      case 'openrouter':
        apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
          return new Response('OpenRouter API key not configured', { status: 400 });
        }
        apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        };
        break;
      case 'fireworks':
      default:
        apiKey = process.env.FIREWORKS_API_KEY;
        if (!apiKey) {
          return new Response('Fireworks API key not configured', { status: 400 });
        }
        apiUrl = 'https://api.fireworks.ai/inference/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        };
        break;
    }

    const chatMessages = [];
    
    if (systemPrompt) {
      chatMessages.push({ role: 'system', content: systemPrompt });
    }

    for (const msg of messages) {
      chatMessages.push({
        role: msg.role,
        content: String(msg.content),
      });
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: chatMessages,
        stream: true,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return new Response(errorText, { status: response.status });
    }

    // Forward the stream
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                
                try {
                  const json = JSON.parse(data);
                  const content = json.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            }
          }
        } finally {
          controller.close();
          reader.releaseLock();
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
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
