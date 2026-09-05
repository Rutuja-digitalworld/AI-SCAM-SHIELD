import { AlertTriangle, CheckCircle2, XCircle, Info, RotateCcw, Lightbulb } from 'lucide-react';
import type { ScamAnalysis } from '@/lib/types';
import { RiskMeter } from './RiskMeter';

interface AnalysisResultProps {
  analysis: ScamAnalysis;
  onReset: () => void;
  onAskChatbot: (question: string) => void;
}

export function AnalysisResult({ analysis, onReset, onAskChatbot }: AnalysisResultProps) {
  const { riskScore, riskLevel, scamType, indicators, recommendations, summary, screenshotWarning } = analysis;

  const borderColor =
    riskLevel === 'HIGH'
      ? 'border-red-500/30'
      : riskLevel === 'MEDIUM'
        ? 'border-amber-500/30'
        : 'border-emerald-500/30';

  return (
    <div className="animate-slide-up space-y-4">
      {/* Main result card */}
      <div className={`card p-5 sm:p-6 border-2 ${borderColor}`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <RiskMeter score={riskScore} level={riskLevel} />
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
              <AlertTriangle className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Detected: {scamType}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {summary}
            </p>
            {screenshotWarning && (
              <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  {screenshotWarning}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Why is this suspicious */}
      {indicators.length > 0 && (
        <div className="card p-5 sm:p-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Why is this suspicious?
          </h3>
          <div className="space-y-3">
            {indicators.map((ind) => (
              <div key={ind.id} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
                  <span className="text-xs">⚠</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{ind.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    {ind.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 font-medium">
                      {ind.category}
                    </span>
                    <span className="text-[10px] text-gray-400">+{ind.weight} pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {indicators.length === 0 && (
        <div className="card p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                No significant scam indicators detected
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This content did not match known scam patterns. However, always stay cautious — scammers constantly change their tactics. Never share OTP, PIN, or passwords.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* What should I do */}
      <div className="card p-5 sm:p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">
          <Lightbulb className="w-4 h-4 text-blue-500" />
          What should I do?
        </h3>
        <div className="space-y-2.5">
          {recommendations.map((rec, i) => {
            const isDo = rec.startsWith('✅') || rec.includes('Verify') || rec.includes('Report') || rec.includes('Block');
            return (
              <div key={i} className="flex items-start gap-3">
                {isDo ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{rec}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick ask buttons */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Ask Scam Shield
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => onAskChatbot(q)}
              className="text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={onReset}
        className="w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Analyze another message
      </button>
    </div>
  );
}

const QUICK_QUESTIONS = [
  'Is this message safe?',
  'Why is this suspicious?',
  'What should I do?',
  'Explain in simple Hindi',
];
