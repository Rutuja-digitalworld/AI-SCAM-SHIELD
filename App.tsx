import { useState } from 'react';
import { Header } from '@/components/Header';
import { InputScreen } from '@/components/InputScreen';
import { AnalysisResult } from '@/components/AnalysisResult';
import { Chatbot } from '@/components/Chatbot';
import { analyzeContent } from '@/lib/scamEngine';
import type { InputType, ScamAnalysis } from '@/lib/types';
import { ShieldCheck, Lock } from 'lucide-react';

function App() {
  const [analysis, setAnalysis] = useState<ScamAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatQuestion, setChatQuestion] = useState<string | null>(null);

  const handleAnalyze = (text: string, type: InputType) => {
    setLoading(true);
    setTimeout(() => {
      const result = analyzeContent(text, type);
      setAnalysis(result);
      setLoading(false);
    }, 600);
  };

  const handleDemoSelect = (content: string, type: InputType) => {
    handleAnalyze(content, type);
  };

  const handleReset = () => {
    setAnalysis(null);
  };

  const handleAskChatbot = (question: string) => {
    setChatQuestion(question);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0e1a] text-gray-900 dark:text-gray-100 transition-colors">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {!analysis ? (
          <>
            {/* Hero section */}
            <div className="text-center mb-8 pt-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 mb-4">
                <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                Protect yourself from{' '}
                <span className="text-blue-600 dark:text-blue-400">digital scams</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                Submit any suspicious message, screenshot, URL, or payment request. AI will analyze it and tell you the risk score, why it's suspicious, and what to do next.
              </p>
            </div>

            <InputScreen
              onAnalyze={handleAnalyze}
              onDemoSelect={handleDemoSelect}
              loading={loading}
            />

            {/* Safety note */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-600">
              <Lock className="w-3.5 h-3.5" />
              <span>We never ask for or store OTP, PIN, CVV, passwords, or card numbers.</span>
            </div>
          </>
        ) : (
          <div className="pt-4">
            <AnalysisResult
              analysis={analysis}
              onReset={handleReset}
              onAskChatbot={handleAskChatbot}
            />
          </div>
        )}
      </main>

      <Chatbot
        analysis={analysis}
        initialQuestion={chatQuestion}
        onQuestionConsumed={() => setChatQuestion(null)}
      />
    </div>
  );
}

export default App;
