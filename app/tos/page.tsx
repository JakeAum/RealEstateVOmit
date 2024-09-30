import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: 
// - Name: ReVo
// - Contact information: jacobauman00@gmail.com
// - Description: A tool to search for properties then automatically generate a contract with relevant infromation
// - User data collected: none
// - Non-personal data collection: web cookies, address searched
// - Link to privacy-policy:
// - Governing Law: USA
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Effective Date: September 29, 2024

Welcome to ReVo. By accessing or using our website, you agree to be bound by these Terms of Service ("Terms"). Please read them carefully.

 1. Acceptance of Terms

By using ReVo, you agree to these Terms and our Privacy Policy. If you do not agree, please do not use our service.

 2. Description of Service

ReVo is a tool that allows users to search for properties and automatically generate contracts with relevant information. We strive to provide accurate and useful information, but we do not guarantee the completeness, accuracy, or reliability of any content generated through our service.

 3. User Responsibilities

You agree to:
- Provide accurate information when using our service
- Use ReVo only for lawful purposes
- Not attempt to gain unauthorized access to our systems or interfere with the service

 4. Intellectual Property

All content and functionality on ReVo, including but not limited to text, graphics, logos, and software, is the property of ReVo or its licensors and is protected by copyright and other intellectual property laws.

 5. Data Collection and Privacy

We collect non-personal data through web cookies and addresses searched. We do not collect personal user data. For more information, please refer to our Privacy Policy.

 6. Disclaimer of Warranties

ReVo is provided "as is" without any warranties, express or implied. We do not warrant that the service will be uninterrupted or error-free.

 7. Limitation of Liability

To the fullest extent permitted by law, ReVo shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.

 8. Governing Law

These Terms shall be governed by and construed in accordance with the laws of the United States of America, without regard to its conflict of law provisions.

 9. Changes to Terms

We may modify these Terms at any time. Users will be notified of any changes via email. Your continued use of ReVo after such modifications constitutes your acceptance of the updated Terms.

 10. Contact Information

If you have any questions about these Terms, please contact us at jacobauman00@gmail.com.

By using ReVo, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
