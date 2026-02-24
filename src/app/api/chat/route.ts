import { NextRequest } from 'next/server';

// Product knowledge base for recommendations
const PRODUCT_KNOWLEDGE = `
You have access to these product recommendations with real Amazon/Udemy links. When users ask for product recommendations, suggest these with their actual links:

## Tech & Gadgets
- **MacBook Air M3** - Best laptop for developers (₹1,14,900) - https://www.amazon.in/dp/B0CX22ZW1T
- **Logitech MX Master 3S** - Premium wireless mouse (₹9,495) - https://www.amazon.in/dp/B09HM94VDS
- **Sony WH-1000XM5** - Noise cancelling headphones (₹26,990) - https://www.amazon.in/dp/B09XS7JWHH
- **Samsung 27" 4K Monitor** - Great for coding (₹27,999) - https://www.amazon.in/dp/B09TPL5FZT
- **Keychron K2 Keyboard** - Mechanical keyboard (₹7,999) - https://www.amazon.in/dp/B08B5WHYTT
- **Apple AirPods Pro 2** - Best wireless earbuds (₹24,900) - https://www.amazon.in/dp/B0BDKD8DVD
- **Anker USB-C Hub** - 7-in-1 hub (₹4,999) - https://www.amazon.in/dp/B07ZVKTP53

## Books for Developers
- **Clean Code** by Robert Martin (₹2,499) - https://www.amazon.in/dp/0132350882
- **System Design Interview** by Alex Xu (₹1,999) - https://www.amazon.in/dp/B08CMF2CQF
- **Designing Data-Intensive Applications** (₹4,299) - https://www.amazon.in/dp/9352135245
- **Atomic Habits** by James Clear (₹499) - https://www.amazon.in/dp/1847941834
- **The Pragmatic Programmer** (₹2,850) - https://www.amazon.in/dp/0135957052
- **Cracking the Coding Interview** (₹599) - https://www.amazon.in/dp/0984782850

## Online Courses
- **Complete Web Developer Course** on Udemy (₹449) - https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/
- **Machine Learning by Andrew Ng** on Coursera (Free) - https://www.coursera.org/learn/machine-learning
- **React - The Complete Guide** on Udemy (₹449) - https://www.udemy.com/course/react-the-complete-guide-incl-redux/
- **DSA for Coding Interviews** on Udemy (₹499) - https://www.udemy.com/course/master-the-coding-interview-data-structures-algorithms/
- **AWS Solutions Architect** on Udemy (₹449) - https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/
- **Python Bootcamp** on Udemy (₹449) - https://www.udemy.com/course/complete-python-bootcamp/

## Workspace Setup
- **Green Soul Jupiter Chair** - Ergonomic office chair (₹19,999) - https://www.amazon.in/dp/B07KT1TFPF
- **BenQ ScreenBar** - Monitor light bar (₹8,500) - https://www.amazon.in/dp/B076VNFZJG
- **Laptop Stand** - Twelve South BookArc (₹5,999) - https://www.amazon.in/dp/B086RWK8Y5

Always provide the actual links when recommending products. Format recommendations nicely with product name, brief description, price, and clickable link.
`;

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
    
    // Build enhanced system prompt with product knowledge
    const enhancedSystemPrompt = `${systemPrompt || 'You are a helpful AI assistant.'}

${PRODUCT_KNOWLEDGE}

Important: When users ask for product recommendations, buying links, suggestions for laptops, books, courses, headphones, or any products - always provide the actual Amazon/Udemy links from your knowledge base above. Be helpful and provide real, working links.`;
    
    chatMessages.push({ role: 'system', content: enhancedSystemPrompt });

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
