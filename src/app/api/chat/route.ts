import { NextRequest } from 'next/server';

// Product knowledge base for recommendations with Markdown links
const PRODUCT_KNOWLEDGE = `
## YOUR PRODUCT DATABASE - USE THESE EXACT LINKS

When users ask about products, laptops, books, courses, headphones, keyboards, or any buying recommendations, YOU MUST provide these exact products with clickable markdown links.

### LAPTOPS & COMPUTERS
1. **MacBook Air M3** - Best for developers, incredible performance - ₹1,14,900
   [Buy on Amazon](https://www.amazon.in/dp/B0CX22ZW1T)

2. **Dell XPS 15** - Windows alternative with great display - ₹1,49,990
   [Buy on Amazon](https://www.amazon.in/dp/B0BXKJ2XJ4)

### MICE & KEYBOARDS
1. **Logitech MX Master 3S** - Premium wireless mouse - ₹9,495
   [Buy on Amazon](https://www.amazon.in/dp/B09HM94VDS)

2. **Keychron K2 Mechanical Keyboard** - Best for typing - ₹7,999
   [Buy on Amazon](https://www.amazon.in/dp/B08B5WHYTT)

### HEADPHONES & EARBUDS
1. **Sony WH-1000XM5** - Best noise cancelling headphones - ₹26,990
   [Buy on Amazon](https://www.amazon.in/dp/B09XS7JWHH)

2. **Apple AirPods Pro 2** - Best wireless earbuds - ₹24,900
   [Buy on Amazon](https://www.amazon.in/dp/B0BDKD8DVD)

3. **Sony WF-1000XM5** - Premium earbuds - ₹19,990
   [Buy on Amazon](https://www.amazon.in/dp/B0C4TMHJPK)

### MONITORS
1. **Samsung 27" 4K Monitor** - Great for coding - ₹27,999
   [Buy on Amazon](https://www.amazon.in/dp/B09TPL5FZT)

2. **LG 27" UltraGear Gaming Monitor** - For gaming - ₹21,999
   [Buy on Amazon](https://www.amazon.in/dp/B08XN5XPDH)

### PROGRAMMING BOOKS
1. **Clean Code** by Robert C. Martin - Must read for developers - ₹2,499
   [Buy on Amazon](https://www.amazon.in/dp/0132350882)

2. **System Design Interview** by Alex Xu - Best for interviews - ₹1,999
   [Buy on Amazon](https://www.amazon.in/dp/B08CMF2CQF)

3. **Designing Data-Intensive Applications** - Backend bible - ₹4,299
   [Buy on Amazon](https://www.amazon.in/dp/9352135245)

4. **Cracking the Coding Interview** - Interview prep - ₹599
   [Buy on Amazon](https://www.amazon.in/dp/0984782850)

5. **The Pragmatic Programmer** - Career advice - ₹2,850
   [Buy on Amazon](https://www.amazon.in/dp/0135957052)

### SELF-HELP BOOKS
1. **Atomic Habits** by James Clear - Build better habits - ₹499
   [Buy on Amazon](https://www.amazon.in/dp/1847941834)

2. **Deep Work** by Cal Newport - Focus and productivity - ₹399
   [Buy on Amazon](https://www.amazon.in/dp/0349411905)

### ONLINE COURSES
1. **Complete Web Developer Course** - HTML, CSS, JS, React - ₹449
   [Buy on Udemy](https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/)

2. **Machine Learning by Andrew Ng** - Best ML course - FREE
   [Enroll on Coursera](https://www.coursera.org/learn/machine-learning)

3. **React - The Complete Guide** - Master React - ₹449
   [Buy on Udemy](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)

4. **DSA for Coding Interviews** - Crack FAANG - ₹499
   [Buy on Udemy](https://www.udemy.com/course/master-the-coding-interview-data-structures-algorithms/)

5. **AWS Solutions Architect** - Cloud certification - ₹449
   [Buy on Udemy](https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/)

6. **Python Bootcamp** - Learn Python - ₹449
   [Buy on Udemy](https://www.udemy.com/course/complete-python-bootcamp/)

### WORKSPACE & ACCESSORIES
1. **Green Soul Jupiter Chair** - Ergonomic office chair - ₹19,999
   [Buy on Amazon](https://www.amazon.in/dp/B07KT1TFPF)

2. **BenQ ScreenBar** - Monitor light for eye comfort - ₹8,500
   [Buy on Amazon](https://www.amazon.in/dp/B076VNFZJG)

3. **Anker USB-C Hub** - 7-in-1 for laptops - ₹4,999
   [Buy on Amazon](https://www.amazon.in/dp/B07ZVKTP53)

4. **Laptop Stand** - Better posture - ₹5,999
   [Buy on Amazon](https://www.amazon.in/dp/B086RWK8Y5)

---
IMPORTANT INSTRUCTIONS:
1. When user asks for product recommendations, ALWAYS include the markdown links like [Buy on Amazon](url)
2. Format your response nicely with product name, description, price, and the clickable link
3. You can recommend multiple products based on user's needs and budget
4. The links are REAL and WORKING - always include them
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

CRITICAL INSTRUCTION: When users ask for ANY product recommendations (laptops, books, courses, headphones, keyboards, monitors, chairs, etc.), you MUST:
1. Use the products from the database above
2. Format links as markdown: [Buy on Amazon](https://amazon.in/dp/xxx)
3. Include product name, description, price, and the clickable link
4. These are REAL working links - always include them in your response
5. Never say you cannot provide links - YOU HAVE THE LINKS ABOVE`;
    
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
