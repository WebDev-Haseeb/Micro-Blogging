import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AlertProvider from './contexts/AlertContext';
import Navigation from './components/Navigation';
import AuthRequired from './components/AuthRequired';
import Landing from './pages/Landing';
import Home from './pages/Home';
import NewPost from './pages/NewPost';
import MyPosts from './pages/MyPosts';
import NotFound from './pages/NotFound';
import AlertDemo from './pages/AlertDemo';
import { useEffect } from 'react';
// eslint-disable-next-line
import { AnimatePresence } from 'framer-motion';

function App() {
  // Add meta tags for SEO and PWA
  useEffect(() => {
    // Set document title with primary keyword
    document.title = 'Smart MicroBlog | Share Short Thoughts with AI Insights';
    
    // Meta description with keywords and call to action
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Create and share micro blog posts in 300 characters or less. Smart MicroBlog offers AI-powered insights, multiple writing tones, and seamless social interactions. Join today!';
    document.head.appendChild(metaDescription);
    
    // Keywords meta tag
    const metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = 'microblogging, AI writing assistant, short form content, blog insights, social writing platform, content analysis';
    document.head.appendChild(metaKeywords);
    
    // Open Graph tags for social sharing
    const ogTitle = document.createElement('meta');
    ogTitle.property = 'og:title';
    ogTitle.content = 'Smart MicroBlog | Short-Form Content with AI Insights';
    document.head.appendChild(ogTitle);
    
    const ogDescription = document.createElement('meta');
    ogDescription.property = 'og:description';
    ogDescription.content = 'Express your thoughts in 300 characters with AI-powered tone analysis and recommendations. Connect with writers on Smart MicroBlog.';
    document.head.appendChild(ogDescription);
    
    const ogType = document.createElement('meta');
    ogType.property = 'og:type';
    ogType.content = 'website';
    document.head.appendChild(ogType);
    
    // Twitter Card tags
    const twitterCard = document.createElement('meta');
    twitterCard.name = 'twitter:card';
    twitterCard.content = 'summary_large_image';
    document.head.appendChild(twitterCard);
    
    const twitterTitle = document.createElement('meta');
    twitterTitle.name = 'twitter:title';
    twitterTitle.content = 'Smart MicroBlog | AI-Enhanced Micro Content Platform';
    document.head.appendChild(twitterTitle);
    
    // Canonical URL to prevent duplicate content issues
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = window.location.href.split('?')[0];
    document.head.appendChild(canonicalLink);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AlertProvider>
            <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
              <Navigation />
              <main className="flex-1">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/" element={<Home />} />
                    <Route 
                      path="/post" 
                      element={
                        <AuthRequired>
                          <NewPost />
                        </AuthRequired>
                      } 
                    />
                    <Route 
                      path="/my-posts" 
                      element={
                        <AuthRequired>
                          <MyPosts />
                        </AuthRequired>
                      } 
                    />
                    <Route path="/alert-demo" element={<AlertDemo />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
              </main>
              <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                <div className="container mx-auto px-4">
                  <p>© {new Date().getFullYear()} Smart MicroBlog | Built with React & Firebase</p>
                </div>
              </footer>
            </div>
          </AlertProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
