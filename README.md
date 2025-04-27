# Smart MicroBlog

A modern, SEO-optimized microblogging platform that allows users to share concise thoughts with AI-powered insights and social interactions. Built with React, Firebase, and Gemini AI.

## 🌟 Features

- **Concise Expression**: Share your thoughts in 300 characters or less
- **AI-Powered Analysis**: Get real-time insights on tone, clarity, sentiment, and repetition
- **Content Enhancement**: Rewrite posts in different tones (Formal, Informal, Humorous)
- **Social Engagement**: Like, dislike, and interact with other users' content
- **User Authentication**: Secure Google Sign-In integration
- **Responsive Design**: Beautiful interface that works on all devices
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **SEO Optimized**: Built with search engine visibility in mind

## 🚀 Tech Stack

- **Frontend**: React 19, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Authentication, Firestore)
- **AI Integration**: Google Gemini API
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting

## 📋 SEO Implementation

Smart MicroBlog implements modern SEO best practices:

- **Semantic HTML**: Properly structured headings (h1, h2, h3) and semantic elements
- **Structured Data**: JSON-LD for enhanced search result display
- **Meta Tags**: Comprehensive meta tags for better search engine indexing
- **OpenGraph & Twitter Cards**: Social media optimization for better sharing
- **Sitemap & Robots.txt**: Properly configured for search engine crawling
- **Performance Optimization**: Fast loading with resource preloading
- **Mobile Responsiveness**: Fully responsive design for all devices
- **Canonical URLs**: Prevents duplicate content issues
- **Accessible Content**: Screen reader friendly with proper ARIA attributes

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/WebDev-Haseeb/Micro-Blogging.git
   cd Micro-Blogging
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication with Google Sign-In
   - Set up Firestore Database
   - Add a web app to your Firebase project and get your config

4. **Set up Gemini AI API**:
   - Create a Google Cloud project
   - Enable the Gemini API
   - Generate an API key

5. **Create environment variables**:
   Create a `.env` file in the root directory with your API keys:
   ```
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-firebase-app-id
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

### Firebase Hosting (Recommended)

1. **Build the production version**:
   ```bash
   npm run build
   ```

2. **Install Firebase CLI if you haven't**:
   ```bash
   npm install -g firebase-tools
   ```

3. **Login to Firebase**:
   ```bash
   firebase login
   ```

4. **Initialize Firebase**:
   ```bash
   firebase init
   ```
   - Select Hosting
   - Select your Firebase project
   - Set "dist" as your public directory
   - Configure as a single-page app

5. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

### Domain & SEO Configuration

After deployment:

1. **Connect a custom domain** through Firebase Hosting settings
2. **Update sitemap.xml and robots.txt** with your actual domain
3. **Submit your sitemap** to Google Search Console
4. **Set up Google Analytics** for traffic monitoring
5. **Verify your site** in search engine webmaster tools:
   - [Google Search Console](https://search.google.com/search-console)
   - [Bing Webmaster Tools](https://www.bing.com/webmasters/)

## 🧪 Running Tests

```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Website**: [https://micro--blogging.web.app/](https://micro--blogging.web.app/)
- **Email**: contact@devhaseeb.me

---

<p align="center">Made with ❤️ by the Haseeb</p>
