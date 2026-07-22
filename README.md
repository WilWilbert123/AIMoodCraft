# AI MoodCraft 🧠✨

A smart journaling application with AI-powered mood tracking and sentiment analysis.

## Features

- 📝 **Journal Entries**: Write and manage your daily thoughts
- 😊 **Mood Tracking**: Log your mood with emojis and intensity
- 🤖 **AI Insights**: Get personalized insights and recommendations
- 📊 **Analytics**: Visualize your mood patterns and trends
- 🔍 **Sentiment Analysis**: AI-powered text analysis
- 📱 **Responsive**: Works on all devices
- 💾 **Local Storage**: All data stored locally

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Router v6
- Lucide Icons
- date-fns

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/ai-moodcraft.git
cd ai-moodcraft
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open http://localhost:5173 in your browser

### Build for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Project Structure

\`\`\`
src/
├── components/     # Reusable components
│   ├── ui/        # UI primitives
│   ├── layout/    # Layout components
│   ├── journal/   # Journal components
│   ├── mood/      # Mood components
│   └── ai/        # AI components
├── pages/          # Page components
├── store/          # Zustand stores
├── hooks/          # Custom hooks
├── utils/          # Utility functions
├── types/          # TypeScript types
└── ...             # Config files
\`\`\`

## Features in Detail

### Journal Management
- Create, edit, and delete entries
- Rich text support
- Mood selection for each entry
- Search and filter entries

### Mood Tracking
- Select mood from 8 different emotions
- Track mood intensity
- View mood timeline
- Mood statistics and trends

### AI Features
- Sentiment analysis of journal entries
- Personalized insights and recommendations
- Mood pattern recognition
- Writing consistency tracking

### Dashboard
- Overview of journaling statistics
- Recent mood timeline
- Quick access to insights

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

MIT

## Acknowledgments

- Built with React and TypeScript
- Icons by Lucide
- Styling with Tailwind CSS# AIMoodCraft
