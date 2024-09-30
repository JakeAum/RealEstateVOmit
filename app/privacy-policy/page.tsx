import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
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
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Effective Date: September 29, 2024

At ReVo, we are committed to protecting your privacy and ensuring the security of any information we collect. This Privacy Policy outlines our practices regarding data collection, use, and disclosure.

 1. Information We Collect

User Data
- We do not collect any personal user data.

Non-Personal Data
- We collect non-personal data in the form of searches conducted on our platform. This information is used solely for the purpose of request completion and improving our service.

 2. Use of Information

The non-personal data we collect is used exclusively for:
- Completing user requests
- Improving our service and user experience
- Analyzing usage patterns to enhance our platform's functionality

 3. Data Sharing and Disclosure

We do not share the data we collect with any third parties. Your searches and any other non-personal information remain strictly confidential within our organization.

 4. Data Security

We implement appropriate technical and organizational measures to protect the information we collect against unauthorized access, alteration, disclosure, or destruction.

 5. Children's Privacy

ReVo does not knowingly collect any data from children under the age of 13. Our service is not directed at children, and we do not intentionally gather information from individuals under the age of 13.

 6. Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify users of any changes via email. We encourage you to review this Privacy Policy periodically for any changes.

 7. Your Consent

By using ReVo, you consent to our Privacy Policy and agree to its terms.

 8. Contact Us

If you have any questions about this Privacy Policy, please contact us at:

Email: jacobauman00@gmail.com

This privacy policy was last updated on September 29, 2024.`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
