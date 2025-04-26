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
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  // Add meta tags for PWA
  useEffect(() => {
    document.title = 'Smart MicroBlog';
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Share your thoughts in 300 characters or less with AI-powered insights';
    document.head.appendChild(metaDescription);
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
