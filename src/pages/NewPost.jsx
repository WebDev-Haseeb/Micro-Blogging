import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { addBlogPost } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { analyzeBlogText, rewriteText } from '../services/gemini';
import CharacterCounter from '../components/CharacterCounter';

const MAX_CHARS = 300;

const NewPost = () => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [selectedTone, setSelectedTone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_CHARS) {
      setContent(newContent);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!content.trim()) return;
    
    try {
      setIsAnalyzing(true);
      setError('');
      const result = await analyzeBlogText(content);
      setAnalysis(result);
      
      // Auto-scroll to see the results
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    } catch (error) {
      console.error('Error analyzing content:', error);
      setError('Failed to analyze content. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRewriteClick = async (tone) => {
    if (!content.trim()) return;
    
    try {
      setSelectedTone(tone);
      setIsRewriting(true);
      setError('');
      const result = await rewriteText(content, tone);
      setRewrittenContent(result);
      
      // Auto-scroll to see the results
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    } catch (error) {
      console.error(`Error rewriting content in ${tone} tone:`, error);
      setError(`Failed to rewrite content in ${tone} tone. Please try again.`);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleUseRewritten = () => {
    if (rewrittenContent) {
      const trimmed = rewrittenContent.substring(0, MAX_CHARS);
      setContent(trimmed);
      setRewrittenContent('');
      setSelectedTone('');
      
      // Focus the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please write something before posting.');
      return;
    }
    
    if (content.length > MAX_CHARS) {
      setError(`Content exceeds the maximum character limit of ${MAX_CHARS}.`);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      await addBlogPost(currentUser, content);
      navigate('/');
    } catch (error) {
      console.error('Error posting blog:', error);
      setError('Failed to post your blog. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <motion.h1 
        className="mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="gradient-text">Create</span> New Post
      </motion.h1>
      
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="card mb-6 overflow-visible p-6"
      >
        <div className="mb-4">
          <label htmlFor="content" className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
            What's on your mind? (Max {MAX_CHARS} characters)
          </label>
          <textarea
            ref={textareaRef}
            id="content"
            rows="5"
            className="input resize-none"
            placeholder="Share your thoughts..."
            value={content}
            onChange={handleContentChange}
            disabled={isSubmitting}
          />
          <CharacterCounter current={content.length} max={MAX_CHARS} />
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          >
            {error}
          </motion.div>
        )}
        
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleAnalyzeClick}
            disabled={!content.trim() || isAnalyzing || isSubmitting}
          >
            {isAnalyzing ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze My Blog'
            )}
          </button>
          
          <div className="relative">
            <button
              type="button"
              className="btn-secondary"
              disabled={!content.trim() || isRewriting || isSubmitting}
              onClick={() => handleRewriteClick('Formal')}
            >
              {isRewriting && selectedTone === 'Formal' ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Rewriting...
                </>
              ) : (
                'Rewrite as Formal'
              )}
            </button>
          </div>
          
          <button
            type="button"
            className="btn-secondary"
            disabled={!content.trim() || isRewriting || isSubmitting}
            onClick={() => handleRewriteClick('Informal')}
          >
            {isRewriting && selectedTone === 'Informal' ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Rewriting...
              </>
            ) : (
              'Rewrite as Informal'
            )}
          </button>
          
          <button
            type="button"
            className="btn-secondary"
            disabled={!content.trim() || isRewriting || isSubmitting}
            onClick={() => handleRewriteClick('Humorous')}
          >
            {isRewriting && selectedTone === 'Humorous' ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Rewriting...
              </>
            ) : (
              'Rewrite as Humorous'
            )}
          </button>
          
          <button
            type="submit"
            className="btn-primary !bg-gradient-to-r !from-blue-500 !to-purple-600 text-white"
            disabled={!content.trim() || isAnalyzing || isRewriting || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Posting...
              </>
            ) : (
              'Post Blog'
            )}
          </button>
        </div>
      </motion.form>
      
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card mb-6 p-6"
          >
            <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              AI Analysis
            </h2>
            <div className="prose max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap">{analysis}</div>
            </div>
          </motion.div>
        )}
        
        {rewrittenContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card mb-6 p-6"
          >
            <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              Rewritten as {selectedTone}
            </h2>
            <div className="mb-4 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              {rewrittenContent}
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={handleUseRewritten}
            >
              Use This Version
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewPost; 