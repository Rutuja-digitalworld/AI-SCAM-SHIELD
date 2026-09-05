import { useRef, useState } from 'react';
import { Upload, MessageSquare, Link2, QrCode, Loader2, ShieldCheck } from 'lucide-react';
import type { InputType } from '@/lib/types';
import { extractTextFromImage } from '@/lib/ocr';
import { decodeQRCode } from '@/lib/qr';

interface InputScreenProps {
  onAnalyze: (text: string, type: InputType) => void;
  onDemoSelect: (content: string, type: InputType) => void;
  loading: boolean;
}

type Tab = InputType;

const TABS: { id: Tab; label: string; icon: typeof Upload; placeholder: string }[] = [
  { id: 'screenshot', label: 'Screenshot', icon: Upload, placeholder: 'Upload a screenshot to analyze' },
  { id: 'message', label: 'Paste Message', icon: MessageSquare, placeholder: 'Paste the suspicious message, SMS, or WhatsApp text here...' },
  { id: 'url', label: 'Check URL', icon: Link2, placeholder: 'Paste a suspicious URL here...' },
  { id: 'upi', label: 'UPI / Payment', icon: QrCode, placeholder: 'Paste a UPI ID, payment request, or QR-decoded content here...' },
];

export function InputScreen({ onAnalyze, onDemoSelect, loading }: InputScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>('message');
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setImageError(null);
    setImagePreview(URL.createObjectURL(file));

    // Try QR decode first, then OCR
    const qrResult = await decodeQRCode(file);
    if (qrResult) {
      setText(qrResult);
      return;
    }

    const ocrText = await extractTextFromImage(file);
    if (ocrText) {
      setText(ocrText);
    } else {
      setImageError('Could not extract text from this image. Try typing the message manually below.');
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || loading) return;
    onAnalyze(text.trim(), activeTab);
  };

  const handleReset = () => {
    setText('');
    setImagePreview(null);
    setImageError(null);
  };

  const activeTabConfig = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="animate-fade-in">
      {/* STOP. CHECK. THEN PAY. banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
          <ShieldCheck className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-sm font-bold tracking-wider text-red-700 dark:text-red-300">
            STOP. CHECK. THEN PAY.
          </span>
        </div>
      </div>

      {/* Tab selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                handleReset();
              }}
              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white dark:bg-[#121826] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
              <span className="text-xs font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input area */}
      <div className="card p-4 sm:p-6">
        {activeTab === 'screenshot' && (
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl py-8 flex flex-col items-center gap-3 hover:border-blue-400 dark:hover:border-blue-600 transition-colors disabled:opacity-50"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Tap to upload a screenshot
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-600">
                    QR codes are also detected automatically
                  </span>
                </>
              )}
            </button>
            {imageError && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">{imageError}</p>
            )}
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={activeTabConfig.placeholder}
          rows={5}
          className="input-field resize-none font-mono text-sm"
          disabled={loading}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
            className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze for Scam Risk'
            )}
          </button>
          {text && !loading && (
            <button onClick={handleReset} className="btn-ghost px-4 py-3">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Demo cases */}
      <div className="mt-6">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 text-center">
          Or try a demo case
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DEMO_BUTTONS.map((demo) => (
            <button
              key={demo.id}
              onClick={() => onDemoSelect(demo.content, demo.inputType)}
              className="card px-3 py-2.5 text-left hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            >
              <span className="text-xs font-semibold block text-gray-800 dark:text-gray-200">
                {demo.title}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-500 line-clamp-1">
                {demo.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const DEMO_BUTTONS = [
  { id: 'kyc', title: 'Fake KYC SMS', description: 'Account expired link scam', inputType: 'message' as InputType, content: 'Dear Customer, Your KYC has been EXPIRED. Update your KYC immediately to avoid account BLOCK. Click here to update: http://bit.ly/sbi-kyc-update. SBI Bank' },
  { id: 'courier', title: 'Fake Courier', description: 'Customs duty scam', inputType: 'message' as InputType, content: 'Your parcel containing iPhone 15 Pro is held at Customs Delhi. Pay Rs.2,500 import duty immediately to release. Pay now: 9876543210@okbiz. Call customs officer: +91-9876543210. Urgent!' },
  { id: 'upi', title: 'UPI Request', description: 'Collect request scam', inputType: 'upi' as InputType, content: 'Payment request of Rs.4,999 from fraudster@okhdfc. Approve payment immediately to avoid late fee. This is urgent — pay within 30 minutes or legal action will be taken against you.' },
  { id: 'arrest', title: 'Digital Arrest', description: 'CBI impersonation', inputType: 'message' as InputType, content: 'This is CBI Cyber Crime Division. A legal case has been filed against you for money laundering. You are under digital arrest. Do not disconnect. Join video call immediately with your Aadhaar card and PAN card. Do not tell anyone. Call this number now: +91-9876543210' },
  { id: 'job', title: 'Fake Job Offer', description: 'WFH registration fee', inputType: 'message' as InputType, content: 'Congratulations! You have been selected for Work From Home Data Entry Job. Earn Rs.25,000 per day. Pay registration fee of Rs.500 to start. WhatsApp me on +91-9876543210. Limited seats only!' },
  { id: 'legit', title: 'Legitimate Bank', description: 'Real bank SMS', inputType: 'message' as InputType, content: 'Dear Customer, Rs.500.00 has been debited from your A/c XX1234 on 05-Sep-26. Available balance: Rs.12,345.67. If not you, call 1800-XXX-XXXX. - SBI' },
];
