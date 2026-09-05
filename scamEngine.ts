import type { Indicator, ScamAnalysis, InputType, RiskLevel } from './types';

interface ScamPattern {
  id: string;
  label: string;
  description: string;
  category: string;
  weight: number;
  regex: RegExp;
}

const PATTERNS: ScamPattern[] = [
  {
    id: 'urgency',
    label: 'Urgency / threat language',
    description: 'The message pressures you to act immediately or threatens consequences. Scammers create panic so you act before thinking.',
    category: 'Psychological pressure',
    weight: 15,
    regex: /(?:urgent|immediately|within\s*\d+\s*(?:hours|hrs|min)|act now|before\s+midnight|today\s+itself|warn|warning|account\s+will\s+be\s+(?:blocked|closed|suspended|frozen)|suspend|block|close\s+account|disable|deactivate|final\s+warning|last\s+warning|legal\s+action|action\s+will\s+be\s+taken)/i,
  },
  {
    id: 'kyc',
    label: 'Fake KYC / account update request',
    description: 'Genuine banks never ask you to complete KYC by clicking a link in a message. This is one of the most common scams in India.',
    category: 'Bank impersonation',
    weight: 22,
    regex: /(?:kyc|know\s+your\s+customer|update\s+(?:your\s+)?(?:kyc|details|account)|verify\s+(?:your\s+)?(?:kyc|account|details)|kyc\s+(?:update|verification|pending|expired|required)|re-?kyc)/i,
  },
  {
    id: 'bank_impersonation',
    label: 'Bank / financial institution impersonation',
    description: 'The message claims to be from a bank, RBI, or financial institution. Always verify by calling the official number on the back of your card.',
    category: 'Impersonation',
    weight: 18,
    regex: /(?:rbi|reserve\s+bank|sbi|state\s+bank|hdfc|icici|axis|kotak|punjab\s+national|pnb|canara|bank\s+of\s+(?:baroda|india)|yes\s+bank|idfc|paytm|phonepe|google\s*pay|gpay|bharatpe|amazon\s*pay)/i,
  },
  {
    id: 'otp_pin_request',
    label: 'Requests OTP / PIN / CVV / password',
    description: 'No legitimate organisation will ever ask for your OTP, PIN, CVV, or password. This is always a scam — no exceptions.',
    category: 'Credential harvesting',
    weight: 30,
    regex: /(?:otp|one\s+time\s+password|pin|cvv|cvc|password|passwd|card\s+number|expiry|expiry\s+date|cvv2|mpin|tpin|upi\s+pin|debit\s+card\s+(?:number|details)|credit\s+card\s+(?:number|details))/i,
  },
  {
    id: 'phishing_link',
    label: 'Suspicious link / shortened URL',
    description: 'The message contains a link that may lead to a fake website designed to steal your information. Never click links in unsolicited messages.',
    category: 'Phishing',
    weight: 20,
    regex: /(?:bit\.ly|tinyurl|t\.co|goo\.gl|shorte\.st|cutt\.ly|is\.gd|buff\.ly|rebrand\.ly|http[s]?:\/\/(?!www\.(?:google|facebook|instagram|whatsapp|youtube|amazon|flipkart|irctc|airtel|jio|sbi|icici|hdfc|axis|paytm|phonepe|gpay))[\w.-]+)/i,
  },
  {
    id: 'lottery_prize',
    label: 'Lottery / prize / reward scam',
    description: 'You are told you won a prize, lottery, or reward you never entered. Real prizes never require you to pay a fee to claim them.',
    category: 'Advance fee fraud',
    weight: 25,
    regex: /(?:lottery|lucky\s+draw|won|winner|prize|reward|congratulations|congrats|you\s+have\s+(?:won|been\s+selected)|kbc|kaun\s+banega|crorepati|lucky\s+winner|cash\s+prize|gift\s+card|free\s+(?:gift|prize|reward))/i,
  },
  {
    id: 'job_scam',
    label: 'Fake job / work-from-home offer',
    description: 'Offers of easy money or work-from-home jobs that require you to pay a registration or processing fee are almost always scams.',
    category: 'Employment fraud',
    weight: 20,
    regex: /(?:work\s+from\s+home|wfh|part\s*[- ]?time\s+job|earn\s+(?:₹|rs\.?|rupees?)\s*\d+|earn\s+money|easy\s+money|data\s+entry\s+job|form\s+filling|registration\s+fee|joining\s+fee|job\s+offer|salary\s+\d+|home\s+based\s+job|typing\s+job|captcha)/i,
  },
  {
    id: 'investment_scam',
    label: 'Investment / trading scam',
    description: 'Promises of guaranteed high returns with little or no risk are the hallmark of investment fraud. All investments carry risk.',
    category: 'Investment fraud',
    weight: 22,
    regex: /(?:invest|investment|trading|double\s+your\s+money|guaranteed\s+returns?|high\s+returns?|profit|crypto|bitcoin|forex|share\s+market\s+tips|trading\s+app|demat|mutual\s+fund\s+guaranteed|sip\s+guaranteed)/i,
  },
  {
    id: 'courier_scam',
    label: 'Courier / delivery scam',
    description: 'Messages about a parcel held up in customs or requiring a delivery fee are common scams. Real couriers do not ask for fees via WhatsApp or SMS.',
    category: 'Courier fraud',
    weight: 18,
    regex: /(?:courier|parcel|package|delivery\s+(?:pending|fee|charge)|customs|held\s+up|bluedart|dtdc|delhivery|ekart|fedex|tracking\s+(?:id|number)|shipment|import\s+duty|customs\s+charge)/i,
  },
  {
    id: 'customer_care',
    label: 'Fake customer care number',
    description: 'A phone number is shared as a "customer care" or "helpline" contact. Scammers run fake helplines to extract your details.',
    category: 'Impersonation',
    weight: 18,
    regex: /(?:customer\s+care|helpline|support\s+number|toll\s*[- ]?free|call\s+(?:now|immediately|this\s+number)|contact\s+us\s+(?:at|on)|(?:whatsapp|wa)\s*(?:no|number|@)\s*[\d+])/i,
  },
  {
    id: 'govt_impersonation',
    label: 'Government / police impersonation',
    description: 'Claims that police, CBI, or a government body is contacting you about a legal case or "digital arrest" are scams. No agency conducts arrests over phone or message.',
    category: 'Impersonation',
    weight: 28,
    regex: /(?:digital\s+arrest|police|cbi|enforcement\s+directorate|ed\s+official|income\s+tax|gst\s+department|customs\s+officer|narcotics|legal\s+case|fir\s+filed|arrest\s+warrant|summons|cyber\s+crime|cybercrime|interrogation|nodal\s+officer)/i,
  },
  {
    id: 'upi_payment',
    label: 'UPI / payment request',
    description: 'A payment request or UPI handle is included. Never send money to unknown UPI IDs or scan QR codes from untrusted sources.',
    category: 'Payment fraud',
    weight: 20,
    regex: /(?:upi|gpay|phonepe|paytm|bhim|google\s*pay|scan\s+(?:qr|code)|qr\s+code|pay\s+\d+|send\s+money|payment\s+(?:request|pending)|rs\.?\s*\d+|₹\s*\d+|[\w.-]+@[\w.-]+(?:ok|pay|ybl|ibl|axl|sbi|hdfc|apl))/i,
  },
  {
    id: 'whatsapp_telegram',
    label: 'Redirect to WhatsApp / Telegram',
    description: 'Being asked to move the conversation to WhatsApp or Telegram is a tactic to avoid detection on the original platform.',
    category: 'Channel switching',
    weight: 12,
    regex: /(?:whatsapp\s+(?:me|us|now|on|@))|(?:telegram\s+(?:me|us|now|on|@))|(?:wa\s*me\s*[: ]?\s*[\d+])|(?:contact\s+(?:on|via)\s*(?:whatsapp|telegram))/i,
  },
  {
    id: 'generic_greeting',
    label: 'Generic / non-personalised greeting',
    description: 'The message uses a generic greeting instead of your name, suggesting it was sent in bulk to many people.',
    category: 'Bulk message',
    weight: 8,
    regex: /(?:dear\s+(?:customer|user|sir|madam|member|client|card\s*holder|account\s*holder|valued\s*customer)|hi\s+(?:customer|user)|hello\s+(?:customer|user))/i,
  },
  {
    id: 'payment_screenshot_keywords',
    label: 'Payment screenshot indicators',
    description: 'Keywords typical of payment screenshots were detected. A screenshot alone cannot prove payment was completed.',
    category: 'Payment screenshot',
    weight: 10,
    regex: /(?:paid|payment\s+(?:successful|done|completed|received)|transaction\s+id|utr|reference\s+(?:id|number|no)|upi\s+(?:ref|reference)|txn\s+id|credited|debited|amount\s+received|payment\s+to\s+|received\s+from)/i,
  },
];

const URL_SUSPICIOUS_TLDS = /\.(?:zip|mov|country|kim|cricket|science|work|party|gq|tk|ml|cf|ga|cn|ru|su)$/i;

const URL_SUSPICIOUS_PATTERNS: ScamPattern[] = [
  {
    id: 'url_ip_address',
    label: 'Uses IP address instead of domain',
    description: 'Legitimate organisations use domain names, not raw IP addresses. This is a strong phishing indicator.',
    category: 'URL structure',
    weight: 20,
    regex: /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
  },
  {
    id: 'url_many_subdomains',
    label: 'Excessive subdomains',
    description: 'A large number of subdomains can be used to make a fake URL look like it belongs to a real brand.',
    category: 'URL structure',
    weight: 12,
    regex: /^https?:\/\/(?:[^/]+\.){4,}[^/]+/,
  },
  {
    id: 'url_suspicious_tld',
    label: 'Suspicious top-level domain',
    description: 'This domain uses a TLD commonly associated with spam and phishing campaigns.',
    category: 'URL structure',
    weight: 15,
    regex: /(?:\.zip|\.mov|\.country|\.kim|\.cricket|\.science|\.work|\.party|\.gq|\.tk|\.ml|\.cf|\.ga)$/i,
  },
  {
    id: 'url_brand_impersonation',
    label: 'Brand name in path, not domain',
    description: 'The brand name appears in the URL path rather than the domain itself — a classic phishing technique to look legitimate.',
    category: 'URL structure',
    weight: 18,
    regex: /^https?:\/\/(?!.*\b(?:sbi|icici|hdfc|axis|paytm|phonepe|gpay|amazon|flipkart|irctc|airtel|jio)\b\.)(?:[\w.-]+)/i,
  },
  {
    id: 'url_no_https',
    label: 'No HTTPS encryption',
    description: 'The link does not use HTTPS. Any page asking for personal or payment details should always be encrypted.',
    category: 'URL structure',
    weight: 10,
    regex: /^http:\/\//,
  },
  {
    id: 'url_url_shortener',
    label: 'Shortened / redirect URL',
    description: 'Shortened URLs hide the real destination. Scammers use them to disguise phishing links.',
    category: 'URL structure',
    weight: 15,
    regex: /^https?:\/\/(?:bit\.ly|tinyurl|t\.co|goo\.gl|shorte\.st|cutt\.ly|is\.gd|buff\.ly|rebrand\.ly|ow\.ly|tiny\.cc)/i,
  },
  {
    id: 'url_at_symbol',
    label: '@ symbol in URL',
    description: 'The @ symbol in a URL can be used to hide the real destination — everything before @ is ignored by the browser.',
    category: 'URL structure',
    weight: 15,
    regex: /@/,
  },
  {
    id: 'url_login_keyword',
    label: 'Login / verify / account keyword',
    description: 'The URL contains keywords like "login", "verify", or "account" — commonly used in phishing pages that mimic real login screens.',
    category: 'URL structure',
    weight: 12,
    regex: /(?:login|signin|verify|account|update|secure|wallet|kyc|confirm|activate)/i,
  },
];

const UPI_PATTERNS: ScamPattern[] = [
  {
    id: 'upi_unknown_handle',
    label: 'Unknown UPI handle',
    description: 'This UPI ID does not match any verified merchant. Never send money to UPI handles you cannot independently verify.',
    category: 'UPI analysis',
    weight: 15,
    regex: /[\w.-]+@[\w.-]+/,
  },
  {
    id: 'upi_request_language',
    label: 'Pressure to pay via UPI',
    description: 'The message creates urgency around sending a UPI payment. Real organisations do not pressure you to pay instantly via a link.',
    category: 'UPI analysis',
    weight: 18,
    regex: /(?:pay\s+(?:now|immediately|today)|send\s+(?:money|rs|₹)|payment\s+(?:pending|due|required)|pay\s+the\s+(?:amount|fee)|scan\s+and\s+pay|scan\s+(?:qr|code))/i,
  },
  {
    id: 'upi_collect_request',
    label: 'UPI collect / payment request',
    description: 'A collect request means money is being pulled FROM your account, not sent to you. Approving it debits your money.',
    category: 'UPI analysis',
    weight: 25,
    regex: /(?:collect\s+(?:request|payment)|payment\s+request\s+received|approve\s+payment|accept\s+(?:request|payment)|pay\s+request)/i,
  },
];

const RECOMMENDATIONS_HIGH = [
  'Do NOT pay or send any money.',
  'Do NOT click any links in this message.',
  'Do NOT share your OTP, PIN, CVV, password, or any banking details.',
  'Do NOT scan any QR code or approve any UPI collect request.',
  'Verify independently by opening the official app or website directly — do not use any link from this message.',
  'Report this message to 1930 (National Cyber Crime Helpline) or at cybercrime.gov.in.',
  'Block the sender and delete the message.',
];

const RECOMMENDATIONS_MEDIUM = [
  'Do not share any personal or financial information in response to this message.',
  'Do not click any links or scan QR codes until you have verified the source.',
  'Verify by contacting the organisation through their official website or app — do not use any contact details from this message.',
  'If in doubt, report to 1930 (National Cyber Crime Helpline) or cybercrime.gov.in.',
];

const RECOMMENDATIONS_LOW = [
  'This message does not show strong scam indicators, but stay cautious.',
  'Never share OTP, PIN, CVV, or passwords with anyone.',
  'If anything feels off, verify through the official app or website before acting.',
];

function scoreToLevel(score: number): RiskLevel {
  if (score <= 30) return 'LOW';
  if (score <= 70) return 'MEDIUM';
  return 'HIGH';
}

function pickScamType(indicators: Indicator[], inputType: InputType): string {
  if (indicators.length === 0) {
    return inputType === 'url' ? 'No significant threat indicators' : 'No significant threat indicators';
  }
  const byCategory = new Map<string, number>();
  for (const ind of indicators) {
    byCategory.set(ind.category, (byCategory.get(ind.category) ?? 0) + ind.weight);
  }
  const sorted = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
}

function buildSummary(score: number, level: RiskLevel, scamType: string, count: number): string {
  if (count === 0) {
    return 'No significant scam indicators were detected in this content. However, always stay cautious — scammers constantly change their tactics.';
  }
  if (level === 'HIGH') {
    return `High-risk indicators detected. This content shows strong signs of ${scamType.toLowerCase()}. We strongly recommend you do not act on it.`;
  }
  if (level === 'MEDIUM') {
    return `Potentially fraudulent content. Several risk indicators related to ${scamType.toLowerCase()} were detected. Proceed with caution and verify before taking any action.`;
  }
  return `Low-risk content. A few minor indicators were detected but nothing strongly suggests fraud. Stay alert and verify if anything seems unusual.`;
}

function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s]+/i);
  return match ? match[0] : null;
}

export function analyzeContent(text: string, inputType: InputType): ScamAnalysis {
  const cleaned = text.trim();
  let patterns = PATTERNS;
  let workingText = cleaned;

  if (inputType === 'url') {
    const url = extractUrl(cleaned) ?? cleaned;
    workingText = url;
    patterns = [...PATTERNS, ...URL_SUSPICIOUS_PATTERNS];
  } else if (inputType === 'upi') {
    patterns = [...PATTERNS, ...UPI_PATTERNS];
  } else if (inputType === 'screenshot') {
    patterns = [...PATTERNS, ...URL_SUSPICIOUS_PATTERNS, ...UPI_PATTERNS];
  }

  const matched: Indicator[] = [];
  for (const p of patterns) {
    if (p.regex.test(workingText)) {
      matched.push({
        id: p.id,
        label: p.label,
        description: p.description,
        weight: p.weight,
        matched: true,
        category: p.category,
      });
    }
  }

  const rawScore = matched.reduce((sum, ind) => sum + ind.weight, 0);
  const riskScore = Math.min(100, rawScore);
  const riskLevel = scoreToLevel(riskScore);
  const scamType = pickScamType(matched, inputType);

  let recommendations: string[];
  if (riskLevel === 'HIGH') recommendations = RECOMMENDATIONS_HIGH;
  else if (riskLevel === 'MEDIUM') recommendations = RECOMMENDATIONS_MEDIUM;
  else recommendations = RECOMMENDATIONS_LOW;

  const summary = buildSummary(riskScore, riskLevel, scamType, matched.length);

  const result: ScamAnalysis = {
    riskScore,
    riskLevel,
    scamType,
    indicators: matched,
    recommendations,
    summary,
    inputType,
    analyzedText: cleaned,
  };

  if (inputType === 'screenshot' && /(?:paid|payment|transaction|utr|reference|txn|credited|debited|received)/i.test(cleaned)) {
    result.screenshotWarning =
      'A screenshot alone cannot prove that payment was completed. Verify the transaction independently through your bank app or statement.';
  }

  return result;
}

export function getDemoAnalyses() {
  return [];
}
