export interface DemoCase {
  id: string;
  title: string;
  description: string;
  inputType: 'message' | 'screenshot' | 'url' | 'upi';
  content: string;
}

export const DEMO_CASES: DemoCase[] = [
  {
    id: 'fake-kyc',
    title: 'Fake KYC SMS',
    description: 'A text message claiming your KYC has expired and asking you to click a link.',
    inputType: 'message',
    content:
      'Dear Customer, Your KYC has been EXPIRED. Update your KYC immediately to avoid account BLOCK. Click here to update: http://bit.ly/sbi-kyc-update. SBI Bank',
  },
  {
    id: 'fake-courier',
    title: 'Fake Courier Message',
    description: 'A WhatsApp message about a parcel stuck in customs requiring a fee.',
    inputType: 'message',
    content:
      'Your parcel containing iPhone 15 Pro is held at Customs Delhi. Pay Rs.2,500 import duty immediately to release. Pay now: 9876543210@okbiz. Call customs officer: +91-9876543210. Urgent!',
  },
  {
    id: 'suspicious-upi',
    title: 'Suspicious UPI Request',
    description: 'A message pressuring you to approve a UPI collect request.',
    inputType: 'upi',
    content:
      'Payment request of Rs.4,999 from fraudster@okhdfc. Approve payment immediately to avoid late fee. This is urgent — pay within 30 minutes or legal action will be taken against you.',
  },
  {
    id: 'digital-arrest',
    title: 'Digital Arrest Scam',
    description: 'A message claiming police are conducting a digital arrest over video call.',
    inputType: 'message',
    content:
      'This is CBI Cyber Crime Division. A legal case has been filed against you for money laundering. You are under digital arrest. Do not disconnect. Join video call immediately with your Aadhaar card and PAN card. Do not tell anyone. Call this number now: +91-9876543210',
  },
  {
    id: 'job-scam',
    title: 'Fake Job Offer',
    description: 'A work-from-home job offer asking for a registration fee.',
    inputType: 'message',
    content:
      'Congratulations! You have been selected for Work From Home Data Entry Job. Earn Rs.25,000 per day. Pay registration fee of Rs.500 to start. WhatsApp me on +91-9876543210. Limited seats only!',
  },
  {
    id: 'legit-bank',
    title: 'Legitimate Bank Notification',
    description: 'A genuine bank SMS with no scam indicators for comparison.',
    inputType: 'message',
    content:
      'Dear Customer, Rs.500.00 has been debited from your A/c XX1234 on 05-Sep-26. Available balance: Rs.12,345.67. If not you, call 1800-XXX-XXXX. - SBI',
  },
];
