
# GermanAI Writer

A web application that helps users write better German text analyses, summaries, and literary interpretations.

## Features

- Text analysis and summarization tools
- Step-by-step writing guides
- Templates for different text types
- Worksheets for learning and practice
- Mobile-responsive design

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Shadcn/UI
- Backend: Express.js, Node.js
- AI Integration: Anthropic Claude, OpenAI
- Database: PostgreSQL with Drizzle ORM

## Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL database connection string
- `ANTHROPIC_API_KEY`: Anthropic API key for Claude
- `OPENAI_API_KEY`: OpenAI API key

## Production

To build and run in production:

```bash
npm run build
npm run start
```

## License

MIT
