import { NextRequest } from 'next/server';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  favicon?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use DuckDuckGo API for instant answers + web search
    const results: SearchResult[] = [];

    // Try DuckDuckGo Instant Answer API first
    try {
      const instantUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const instantResponse = await fetch(instantUrl);
      const instantData = await instantResponse.json();

      // Add instant answer if available
      if (instantData.AbstractText) {
        results.push({
          title: instantData.Heading || 'DuckDuckGo Answer',
          url: instantData.AbstractURL || 'https://duckduckgo.com',
          snippet: instantData.AbstractText,
          favicon: 'https://duckduckgo.com/favicon.ico',
        });
      }

      // Add related topics
      if (instantData.RelatedTopics) {
        for (const topic of instantData.RelatedTopics.slice(0, 3)) {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(' - ')[0] || 'Related',
              url: topic.FirstURL,
              snippet: topic.Text,
              favicon: topic.Icon?.URL || 'https://duckduckgo.com/favicon.ico',
            });
          }
        }
      }
    } catch (e) {
      console.error('Instant answer error:', e);
    }

    // If no results, try scraping DuckDuckGo lite
    if (results.length === 0) {
      try {
        const liteUrl = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`;
        const liteResponse = await fetch(liteUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });
        const html = await liteResponse.text();
        
        // Parse lite results - they have a simpler structure
        const linkRegex = /<a[^>]*class="result-link"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi;
        const snippetRegex = /<td[^>]*class="result-snippet"[^>]*>([^<]*)<\/td>/gi;
        
        const links: { url: string; title: string }[] = [];
        let match;
        
        while ((match = linkRegex.exec(html)) !== null && links.length < 5) {
          links.push({ url: match[1], title: match[2].trim() });
        }
        
        const snippets: string[] = [];
        while ((match = snippetRegex.exec(html)) !== null) {
          snippets.push(match[1].trim());
        }
        
        for (let i = 0; i < links.length; i++) {
          try {
            const urlObj = new URL(links[i].url);
            results.push({
              title: links[i].title || urlObj.hostname,
              url: links[i].url,
              snippet: snippets[i] || '',
              favicon: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`,
            });
          } catch {
            continue;
          }
        }
      } catch (e) {
        console.error('Lite search error:', e);
      }
    }

    // If still no results, provide a fallback with useful context
    if (results.length === 0) {
      // For time-related queries, provide timezone info
      if (query.toLowerCase().includes('time')) {
        const now = new Date();
        const delhiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        results.push({
          title: 'Current Time Information',
          url: 'https://time.is/Delhi',
          snippet: `Current time in Delhi (IST): ${delhiTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} on ${delhiTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
          favicon: 'https://time.is/favicon.ico',
        });
      }
    }

    console.log('Search results for:', query, results);

    return new Response(
      JSON.stringify({ results }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Search API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to perform search', results: [] }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
