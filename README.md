# Lenovo MicroBlog

A beautiful and highly responsive micro-blogging website using React (frontend) and Firebase (backend).

## Features

- Google Sign-In authentication
- View all blogs posted by users
- Post your own blog with a character limit of 300 characters
- AI-powered insights (tone, clarity, sentiment, repetition) on your blogs using the Gemini API
- Rewrite your blogs in different tones: Formal, Informal, Humorous, etc.
- View your own posts easily
- Responsive design with light and dark mode support

## Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion for animations
- **Backend**: Firebase (Authentication + Firestore Database)
- **AI Integration**: Google Gemini API

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd micro-blogging
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase and Gemini API keys:

```
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_GEMINI_API_KEY=your-gemini-api-key
```

4. Start the development server:

```bash
npm run dev
```

## Build for Production

```bash
npm run build
```

## Usage

1. Sign in with your Google account
2. Browse the latest posts from all users on the home page
3. Create a new post (max 300 characters)
4. Analyze your post for tone, clarity, sentiment, and repetition
5. Rewrite your post in different tones if desired
6. View all your posts in the "My Posts" section

## Project Structure

```
src/
├── components/    # Reusable UI components
├── contexts/      # Context providers for state management
├── pages/         # Page components
├── services/      # API and external service integrations
├── firebase.js    # Firebase configuration and utility functions
├── App.jsx        # Main application component with routing
└── main.jsx       # Entry point
```

## License

[MIT](LICENSE)
