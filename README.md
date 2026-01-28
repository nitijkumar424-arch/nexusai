<p align="center">
  <img src="https://img.icons8.com/fluency/96/artificial-intelligence.png" alt="Nexus AI Logo" width="96" height="96">
</p>

<h1 align="center">🚀 Nexus AI</h1>

<p align="center">
  <strong>A next-generation AI chat platform with multi-model support, real-time web search, and intelligent personas</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#%EF%B8%8F-configuration">Configuration</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-deployment">Deployment</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React">
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/nitijkumar424-arch/nexusai?style=social" alt="Stars">
  <img src="https://img.shields.io/github/forks/nitijkumar424-arch/nexusai?style=social" alt="Forks">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

---

## ✨ Features

<table>
<tr>
<td>

### 🤖 Multi-Model Support
Switch between **10+ AI models** from 4 providers:
- **Groq** - Llama 3.3 70B, Llama 3.1 8B ⚡
- **Google** - Gemini 2.0 Flash, Gemini 1.5 Pro
- **OpenRouter** - Free Llama & Gemma models
- **Fireworks** - Dobby 70B, Llama models

</td>
<td>

### 🌐 Real-Time Web Search
**Perplexity-style** search integration:
- Live data for any query
- Source citations with links
- Automatic context injection
- Always up-to-date answers

</td>
</tr>
<tr>
<td>

### 🎭 AI Personas
**5 specialized personas** for different tasks:
- 🧠 **Nexus** - General assistant
- 💻 **CodeMaster** - Software engineer
- 📚 **Scholar** - Researcher
- ✨ **Muse** - Creative writer
- 👨‍🏫 **Professor** - Educator

</td>
<td>

### 🎤 Voice Features
Hands-free interaction:
- **Voice input** via microphone
- **Text-to-speech** for responses
- **Continuous recognition** mode
- Works on all modern browsers

</td>
</tr>
<tr>
<td>

### 🔀 Conversation Branching
**Git-like** conversation management:
- Fork from any message
- Explore alternative paths
- Full history preservation
- Easy navigation

</td>
<td>

### 💻 Interactive Code
Developer-friendly features:
- **100+ languages** syntax highlighting
- **One-click copy** to clipboard
- **Download** as file
- **Execute JS** in browser

</td>
</tr>
</table>

### 🎨 Beautiful UI/UX

- **Glassmorphism** design with blur effects
- **Smooth animations** powered by Framer Motion
- **Dark/Light themes** with system preference
- **Responsive** for all devices
- **PWA support** - Install as app

---

## 🎬 Demo

### Main Chat Interface
```
┌─────────────────────────────────────────────────────────────┐
│  🚀 Nexus AI                              [New Chat]        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [Model: Llama 3.3 70B ▼] [Persona: Nexus ▼]         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─ You ─────────────────────────────────────────────────┐  │
│  │ What's the current time in Tokyo?                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ Nexus ───────────────────────────────────────────────┐  │
│  │ 📍 Source: time.is/Tokyo                              │  │
│  │                                                       │  │
│  │ The current time in Tokyo is **10:30 AM JST**         │  │
│  │ (Japan Standard Time) on Wednesday, January 28, 2026. │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [🌐] [🎤] [📎]  Ask anything...          [Send ➤]    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **npm** or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/nitijkumar424-arch/nexusai.git
cd nexusai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your API keys

# Start development server
npm run dev
```

🌐 Open **[http://localhost:3000](http://localhost:3000)**

---

## ⚙️ Configuration

### Environment Variables

```env
# 🔥 Groq (Recommended - FREE & Ultra Fast)
GROQ_API_KEY=your_groq_api_key

# 🧠 Google AI Studio (FREE tier)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key

# 🌐 OpenRouter (FREE models)
OPENROUTER_API_KEY=your_openrouter_key

# 🚀 Fireworks AI (Optional)
FIREWORKS_API_KEY=your_fireworks_key
```

### Getting Free API Keys

<details>
<summary><b>🔥 Groq (Recommended)</b> - 14,400 req/day FREE</summary>

1. Go to [console.groq.com](https://console.groq.com)
2. Sign in with Google/GitHub
3. Click "API Keys" → "Create API Key"
4. Copy to `.env.local`

</details>

<details>
<summary><b>🧠 Google AI Studio</b> - 1,500 req/day FREE</summary>

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with Google
3. Click "Create API Key"
4. Copy to `.env.local`

</details>

<details>
<summary><b>🌐 OpenRouter</b> - Free tier with limits</summary>

1. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
2. Create account
3. Generate API key
4. Copy to `.env.local`

</details>

---

## 🛠 Tech Stack

<table>
<tr>
<td align="center" width="100">
<img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js">
<br><b>Next.js 16</b>
</td>
<td align="center" width="100">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript">
<br><b>TypeScript</b>
</td>
<td align="center" width="100">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind">
<br><b>Tailwind 4</b>
</td>
<td align="center" width="100">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React">
<br><b>React 19</b>
</td>
<td align="center" width="100">
<img src="https://skillicons.dev/icons?i=vercel" width="48" height="48" alt="Vercel">
<br><b>Vercel</b>
</td>
</tr>
</table>

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Styling** | Tailwind CSS 4.0, shadcn/ui, Framer Motion |
| **State** | Zustand with persistence |
| **AI** | Groq, Google AI, OpenRouter, Fireworks |
| **Features** | Web Speech API, React Markdown, Prism |

### 📁 Project Structure

```
nexus-ai/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API endpoints
│   │   │   ├── chat/       # Chat completion
│   │   │   └── search/     # Web search
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main page
│   ├── components/
│   │   ├── chat/           # Chat UI components
│   │   ├── layout/         # Layout components
│   │   ├── settings/       # Settings dialog
│   │   └── ui/             # shadcn components
│   ├── lib/                # Utilities & configs
│   ├── store/              # Zustand store
│   └── types/              # TypeScript types
├── public/                  # Static assets
└── docs/                    # Documentation
```

---

## 🚀 Deployment

### Deploy on Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nitijkumar424-arch/nexusai&env=GROQ_API_KEY&envDescription=API%20keys%20for%20AI%20providers&envLink=https://github.com/nitijkumar424-arch/nexusai%23configuration)

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables on Vercel

Add these in **Settings → Environment Variables**:

| Variable | Required |
|----------|----------|
| `GROQ_API_KEY` | ✅ Recommended |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Optional |
| `OPENROUTER_API_KEY` | Optional |

---

## 📱 PWA Installation

Nexus AI works as a **Progressive Web App**:

1. Open in Chrome/Edge
2. Click install icon in address bar
3. Enjoy native app experience!

---

## 🤝 Contributing

Contributions are welcome! 

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

<p align="center">
  <strong>Nitij Kumar</strong>
  <br>
  B.Tech Final Year Student
  <br><br>
  <a href="https://github.com/nitijkumar424-arch">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
</p>

---

<p align="center">
  <b>⭐ Star this repo if you found it helpful!</b>
</p>

<p align="center">
  Made with ❤️ by Nitij Kumar
</p>
