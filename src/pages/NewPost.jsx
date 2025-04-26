import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { addBlogPost } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { analyzeBlogText, rewriteText } from '../services/gemini';
import CharacterCounter from '../components/CharacterCounter';

const MAX_CHARS = 300;
const MIN_CHARS = 5; // Added minimum character requirement

const NewPost = () => {
  const { currentUser } = useAuth();
  const { showSuccess, showError, showInfo } = useAlert();
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [selectedTone, setSelectedTone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);
  const resultsSectionRef = useRef(null);
  const navigate = useNavigate();

  // Check if content meets minimum length requirement
  const isValidLength = content.trim().length >= MIN_CHARS;

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_CHARS) {
      setContent(newContent);
    }
  };

  // Enhance the CharacterCounter component to show min chars requirement
  const EnhancedCharacterCounter = ({ current, max, min }) => {
    const isUnderMin = current < min && current > 0;
    const charText = isUnderMin
      ? `${min - current} more needed`
      : `${current}/${max}`;

    return (
      <div className="flex items-center justify-end px-3 py-2 text-xs">
        <span
          className={`font-medium ${
            current > max
              ? 'text-red-500 dark:text-red-400'
              : isUnderMin
              ? 'text-red-500 dark:text-red-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {charText}
        </span>
      </div>
    );
  };

  const scrollToResults = () => {
    if (resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleAnalyzeClick = async () => {
    if (!content.trim()) {
      showError('Please enter some text before analyzing.', 3000);
      return;
    }

    if (content.trim().length < MIN_CHARS) {
      showError(`Your blog must be at least ${MIN_CHARS} characters.`, 3000);
      return;
    }

    try {
      setIsAnalyzing(true);
      showInfo('Analyzing your text...', 2000);

      const result = await analyzeBlogText(content);

      // Check if result contains error message
      if (result.includes('Unable to analyze text')) {
        showError(
          'AI service is temporarily unavailable. Please try again later.',
          5000
        );
        setAnalysis('');
      } else {
        setAnalysis(result);
        showSuccess('Analysis complete!', 3000);
        // Wait for state update then scroll
        setTimeout(scrollToResults, 100);
      }
    } catch (error) {
      console.error('Error analyzing content:', error);
      showError('Failed to analyze content. Please try again.', 5000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRewriteClick = async (tone) => {
    if (!content.trim()) {
      showError('Please enter some text before rewriting.', 3000);
      return;
    }

    if (content.trim().length < MIN_CHARS) {
      showError(`Your blog must be at least ${MIN_CHARS} characters.`, 3000);
      return;
    }

    try {
      setSelectedTone(tone);
      setIsRewriting(true);
      showInfo(`Rewriting in ${tone} tone...`, 2000);

      const result = await rewriteText(content, tone);

      // Check if result contains error message
      if (result.includes('Unable to rewrite text')) {
        showError(
          'AI service is temporarily unavailable. Please try again later.',
          5000
        );
        setRewrittenContent('');
      } else {
        setRewrittenContent(result);
        showSuccess('Rewriting complete!', 3000);
        // Wait for state update then scroll
        setTimeout(scrollToResults, 100);
      }
    } catch (error) {
      console.error(`Error rewriting content in ${tone} tone:`, error);
      showError('Failed to rewrite content. Please try again.', 5000);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleUseRewritten = () => {
    if (rewrittenContent && !rewrittenContent.includes('Unable to rewrite text')) {
      const trimmed = rewrittenContent.substring(0, MAX_CHARS);
      setContent(trimmed);
      setRewrittenContent('');
      setSelectedTone('');
      showInfo('Rewritten text applied to editor', 3000);

      // Focus the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      showError('Please write something before posting.', 3000);
      return;
    }

    if (content.trim().length < MIN_CHARS) {
      showError(`Your blog must be at least ${MIN_CHARS} characters.`, 3000);
      return;
    }

    if (content.length > MAX_CHARS) {
      showError(`Content exceeds the maximum character limit of ${MAX_CHARS}.`, 3000);
      return;
    }

    try {
      setIsSubmitting(true);
      showInfo('Posting your blog...', 2000);

      await addBlogPost(currentUser, content);
      showSuccess('Your blog has been posted successfully!', 3000);
      navigate('/');
    } catch (error) {
      console.error('Error posting blog:', error);
      showError('Failed to post your blog. Please try again.', 5000);
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
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create
        </span>{' '}
        New Blog
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all dark:border-gray-700 dark:bg-gray-900 dark:shadow-gray-900/30"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4 p-6">
            <label
              htmlFor="content"
              className="mb-2 block text-lg font-medium text-gray-700 dark:text-gray-300"
            >
              What's on your mind?{' '}
            </label>
            <div className="relative overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 dark:border-gray-700 dark:bg-gray-800">
              {/* Subtle gradient background effect */}
              <div className="pointer-events-none absolute inset-0 opacity-50">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-purple-50 opacity-30 dark:from-blue-900/10 dark:to-purple-900/10"></div>
              </div>

              <textarea
                ref={textareaRef}
                id="content"
                rows="6"
                className="w-full resize-none border-0 bg-transparent p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Share your thoughts..."
                value={content}
                onChange={handleContentChange}
                disabled={isSubmitting}
              />

              {/* Modified character counter that shows min requirement */}
              <EnhancedCharacterCounter 
                current={content.length} 
                max={MAX_CHARS} 
                min={MIN_CHARS} 
              />
            </div>
            {/* Progress indicator for character count */}
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <motion.div
                className={`h-full ${
                  content.trim().length < MIN_CHARS && content.trim().length > 0
                    ? "bg-red-500 dark:bg-red-600"
                    : content.length > MAX_CHARS - 20
                    ? "bg-red-500 dark:bg-red-600"
                    : content.length > MAX_CHARS * 0.8
                    ? "bg-amber-500 dark:bg-amber-600"
                    : "bg-emerald-500 dark:bg-emerald-600"
                }`}
                initial={{ width: 0 }}
                animate={{
                  width: content.trim().length < MIN_CHARS && content.trim().length > 0
                    ? `${(content.trim().length / MIN_CHARS) * 100}%`
                    : `${(content.trim().length / MAX_CHARS) * 100}%`
                }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={`inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm ring-1 ring-inset transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isValidLength
                    ? "bg-white text-gray-700 ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-600"
                    : "bg-gray-100 text-gray-400 ring-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:ring-gray-700"
                }`}
                onClick={handleAnalyzeClick}
                disabled={!isValidLength || isAnalyzing || isSubmitting}
              >
                {isAnalyzing ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Analyze My Blog
                  </>
                )}
              </button>

              <div className="dropdown relative inline-block">
                <button
                  type="button"
                  className={`inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm ring-1 ring-inset transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                    isValidLength
                      ? "bg-white text-gray-700 ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-600"
                      : "bg-gray-100 text-gray-400 ring-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:ring-gray-700"
                  }`}
                  disabled={!isValidLength || isRewriting || isSubmitting}
                  onClick={() => handleRewriteClick("Formal")}
                >
                  {isRewriting && selectedTone === "Formal" ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Rewriting...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                      Formal
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                className={`inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm ring-1 ring-inset transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isValidLength
                    ? "bg-white text-gray-700 ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-600"
                    : "bg-gray-100 text-gray-400 ring-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:ring-gray-700"
                }`}
                disabled={!isValidLength || isRewriting || isSubmitting}
                onClick={() => handleRewriteClick("Informal")}
              >
                {isRewriting && selectedTone === "Informal" ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Rewriting...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    Informal
                  </>
                )}
              </button>

              <button
                type="button"
                className={`inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm ring-1 ring-inset transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isValidLength
                    ? "bg-white text-gray-700 ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-600"
                    : "bg-gray-100 text-gray-400 ring-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:ring-gray-700"
                }`}
                disabled={!isValidLength || isRewriting || isSubmitting}
                onClick={() => handleRewriteClick("Humorous")}
              >
                {isRewriting && selectedTone === "Humorous" ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Rewriting...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Humorous
                  </>
                )}
              </button>

              <motion.button
                type="submit"
                whileHover={isValidLength ? { scale: 1.02 } : {}}
                whileTap={isValidLength ? { scale: 0.98 } : {}}
                className={`ml-auto inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-gray-900 ${
                  isValidLength
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-md"
                    : "bg-gradient-to-r from-gray-400 to-gray-500"
                }`}
                disabled={
                  !isValidLength || isAnalyzing || isRewriting || isSubmitting
                }
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Posting...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Post Blog
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>

      <div ref={resultsSectionRef}>
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI Analysis
                </h2>
              </div>
              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="prose max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">{analysis}</div>
                </div>
              </div>
            </motion.div>
          )}

          {rewrittenContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5 text-purple-500 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Rewritten as {selectedTone}
                </h2>
              </div>
              <div className="mb-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="whitespace-pre-wrap">{rewrittenContent}</div>
              </div>
              <button
                type="button"
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-all hover:from-purple-600 hover:to-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                onClick={handleUseRewritten}
                disabled={rewrittenContent.includes('Unable to rewrite')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Use This Version
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NewPost;