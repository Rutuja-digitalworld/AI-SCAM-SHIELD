import type { ScamAnalysis } from './types';

function buildContext(analysis: ScamAnalysis | null): string {
  if (!analysis) return '';
  const indText = analysis.indicators
    .map((i) => `- ${i.label}: ${i.description}`)
    .join('\n');
  const recText = analysis.recommendations.join('\n');
  return `\n\nCURRENT ANALYSIS CONTEXT:\nRisk Score: ${analysis.riskScore}/100 (${analysis.riskLevel})\nScam Type: ${analysis.scamType}\nIndicators:\n${indText}\nRecommendations:\n${recText}`;
}

const SYSTEM_PROMPT = `You are "Scam Shield", an AI assistant that helps Indian users identify and protect themselves from digital scams. You are knowledgeable about Indian scam patterns: fake KYC, UPI/QR scams, phishing, courier scams, job scams, investment scams, lottery scams, OTP/PIN requests, government/police impersonation, digital arrest scams, and fake payment screenshots.

RULES:
1. NEVER say "This is a scam" as a definitive statement. Use "Potentially fraudulent" or "High-risk indicators detected."
2. Be clear, calm, and trustworthy. Use simple language.
3. NEVER ask for or accept OTP, PIN, CVV, passwords, card numbers, or banking credentials.
4. If asked about verification, always tell users to use the official app or website directly — never links from messages.
5. When asked to explain in Hindi/Hinglish, use simple conversational Hinglish (Hindi written in English script).
6. Keep answers concise — 3-5 sentences unless the user asks for more detail.
7. If you don't have enough information, say so and ask for more details.`;

export function generateChatResponse(
  userMessage: string,
  analysis: ScamAnalysis | null,
  history: { role: string; content: string }[],
): string {
  const ctx = buildContext(analysis);
  const lower = userMessage.toLowerCase();

  // Hindi/Hinglish explanation request
  if (lower.includes('hindi') || lower.includes('hinglish') || lower.includes('simple') || lower.includes("i'm 60") || lower.includes('im 60') || lower.includes('explain like')) {
    if (analysis && analysis.indicators.length > 0) {
      const indList = analysis.indicators.map((i) => i.label).join(', ');
      if (analysis.riskLevel === 'HIGH') {
        return `Sunie, aaj kal bahut scams ho rahe hain. Is message mein kuch cheezein suspicious hain: ${indList}. Iska matlab hai ki ye log aapka paisa ya details churana chahte hain. Meri advice: kabhi bhi kisi ko apna OTP, PIN ya password mat bataye. Agar bank se related hai to apne bank ke official app se check karein. Is link par click mat karein. Agar lagta hai scam hai to 1930 par call karke report karein. Bachat hi acha hai!`;
      } else if (analysis.riskLevel === 'MEDIUM') {
        return `Dekhiye, is message mein kuch baatein thodi suspicious lagti hain: ${indList}. Pakka scam nahi hai, lekin dhyan se check karein. Apna OTP, PIN, password kisi ko mat dein. Official app se verify karke hi aage badhein. Doubt ho to 1930 par report kar sakte hain.`;
      }
    }
    return `Is message mein koi khaas scam indicator nahi mila. Phir bhi, kabhi bhi apna OTP, PIN, CVV ya password kisi ko mat bataye. Agar kuch suspicious lage to official app se verify karein.`;
  }

  // "Is this safe?"
  if (lower.includes('safe') || lower.includes('is this message')) {
    if (!analysis) return 'Please submit the message or screenshot first so I can analyze it for you. I will check it for scam indicators and tell you whether it is safe.';
    if (analysis.riskLevel === 'LOW') return 'Based on the analysis, this message does not show strong scam indicators. However, always stay cautious and never share sensitive information like OTP or PIN with anyone.';
    if (analysis.riskLevel === 'MEDIUM') return 'This message shows some potentially fraudulent indicators. I would not call it safe. Do not click any links or share any information. Verify through the official app or website before taking any action.';
    return 'This message is potentially fraudulent with high-risk indicators detected. I strongly recommend you do not act on it — do not click links, do not pay, and do not share any information. Report it to 1930.';
  }

  // "Why is this suspicious?"
  if (lower.includes('why') && (lower.includes('suspicious') || lower.includes('suspicious') || lower.includes('risk'))) {
    if (!analysis || analysis.indicators.length === 0) return 'No significant scam indicators were detected in this content. If you still feel something is off, please share more details and I will take another look.';
    const top = analysis.indicators.slice(0, 3).map((i) => `${i.label} — ${i.description}`).join('\n\n');
    return `Here are the main reasons this content is flagged:\n\n${top}\n\nThese are common tactics scammers use. Each indicator adds to the risk score of ${analysis.riskScore}/100.`;
  }

  // "What should I do?"
  if (lower.includes('what should') || lower.includes('what to do') || lower.includes('how to') || lower.includes('what do i do')) {
    if (!analysis) return 'Please submit the content first. Once I analyze it, I will give you specific steps on what to do next.';
    return analysis.recommendations.slice(0, 4).join('\n\n');
  }

  // "How can I verify"
  if (lower.includes('verify') || lower.includes('how can i check')) {
    return 'To verify safely: 1) Open the official app or website directly from your phone — do not use any link from the message. 2) Call the official customer care number printed on the back of your card or from the official website. 3) Check your bank statement or transaction history in the banking app. 4) Never call any phone number provided in the suspicious message itself.';
  }

  // Fake payment screenshot
  if (lower.includes('fake payment') || lower.includes('screenshot') || lower.includes('payment done')) {
    return 'A screenshot alone cannot prove that payment was completed. Screenshots can be edited or fabricated. To verify a payment independently: check your bank account statement or UPI app transaction history for the specific amount, date, and UTR/reference number. If the transaction does not appear in your bank records, the payment was not received — regardless of what the screenshot shows.';
  }

  // Default response with context
  if (analysis && analysis.indicators.length > 0) {
    return `Based on the analysis (risk score: ${analysis.riskScore}/100, ${analysis.riskLevel}), the main concern is ${analysis.scamType.toLowerCase()}. Key indicators include: ${analysis.indicators.slice(0, 3).map((i) => i.label).join(', ')}. ${analysis.recommendations[0]} If you have a more specific question, feel free to ask!`;
  }

  return 'I can help you understand if a message, screenshot, URL, or UPI request is potentially fraudulent. Submit content for analysis using the main screen, then ask me any questions about the results. You can also ask me to explain things in simple Hindi.';
}
