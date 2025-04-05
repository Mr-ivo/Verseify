# Scripture Reading App

A modern Bible application built with React, TypeScript, and Tailwind CSS that allows users to read different Bible translations, search for verses, and explore scripture.

## Features

- Browse multiple Bible translations
- Navigate books and chapters
- Read scripture with a clean, modern interface
- Search for specific verses or topics
- Responsive design for all devices

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your API key:
   - Get an API key from [Scripture API](https://scripture.api.bible/)
   - Create a `.env` file in the root directory
   - Add your API key: `VITE_BIBLE_API_KEY=your_api_key_here`

4. Start the development server:
   ```
   npm run dev
   ```

## Deployment to Vercel

This app is configured for easy deployment to Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Make sure to add your `VITE_BIBLE_API_KEY` as an environment variable in the Vercel project settings
4. Deploy!

## Technologies Used

- React 19
- TypeScript
- Tailwind CSS
- React Router
- Axios for API requests
- Scripture API (api.bible)

## Project Structure

```
src/
├── components/       # UI components
├── pages/            # Page components
├── services/         # API services
├── context/          # React context for state management
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## License

MIT
