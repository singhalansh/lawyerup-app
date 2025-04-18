import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">
          <strong>Effective Date:</strong> 17th April, 2025 | <strong>Last Updated:</strong> 18th April, 2025
        </p>
        
        <div className="prose max-w-none">
          <p>
            This Privacy Policy outlines the data handling practices of the AI Virtual Legal Assistant ("Platform", "We", "Us", or "Our"). 
            It explains how we collect, use, and safeguard your information when you access or interact with our services.
          </p>
          <p>
            By using this Platform, you agree to the terms outlined in this Policy.
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. No Storage of Personal Data</h2>
            <p>1.1 The Platform does <strong>not collect or store</strong> any personally identifiable information (PII) such as your name, email address, phone number, or other personal identifiers by default.</p>
            <p>1.2 All user inputs are processed in a <strong>session-only environment</strong> and are automatically deleted after the response is generated.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Voluntary Data Sharing and Consent</h2>
            <p>2.1 If the Platform requires access to certain data (e.g., your location for identifying nearby legal professionals), such access is <strong>voluntary and based on opt-in consent</strong>.</p>
            <p>2.2 By enabling this feature, you consent to the temporary use of your data solely for the specified purpose.</p>
            <p>2.3 No location data or interaction history is stored after the session ends.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Purpose Limitation</h2>
            <p>3.1 All user inputs are used solely to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Generate contextually relevant legal information;</li>
              <li>Provide draft refinement assistance;</li>
              <li>Display nearby legal service providers using third-party services (e.g., Google Maps).</li>
            </ul>
            <p>3.2 The Platform does <strong>not use your data for advertising, profiling, or behavioral analysis.</strong></p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Third-Party Access</h2>
            <p>4.1 The Platform <strong>does not share</strong> any user data with third parties, except where necessary to render the service (e.g., using APIs like Google Maps).</p>
            <p>4.2 These third-party services operate under their own privacy policies. We do not control or assume responsibility for their practices.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. User Rights</h2>
            <p>5.1 In line with the <strong>Digital Personal Data Protection Bill, 2023</strong>, users retain the following rights:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Right to Consent:</strong> No data is processed without your explicit permission.</li>
              <li><strong>Right to Withdraw Consent:</strong> Consent for location or optional services can be withdrawn anytime.</li>
              <li><strong>Right to Access and Correction:</strong> Not applicable as no long-term data is stored.</li>
              <li><strong>Right to Erasure:</strong> All inputs are deleted after session termination—no manual deletion request is necessary.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Security Practices</h2>
            <p>6.1 Although no long-term data is retained, we follow industry-standard technical and organizational safeguards (encryption-in-transit, session isolation, access controls) to protect session data during use.</p>
            <p>6.2 In compliance with <strong>Section 43A of the IT Act, 2000</strong>, reasonable security measures are employed to protect any temporary data processed.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
            <p>7.1 The Platform is not intended for use by individuals under the age of 18 without supervision.</p>
            <p>7.2 We do not knowingly collect data from minors. If we become aware of any such interaction, it will be immediately terminated.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Updates and Amendments</h2>
            <p>8.1 This Privacy Policy may be updated periodically to reflect legal or functional changes. We recommend users review it regularly.</p>
            <p>8.2 Continued use of the Platform after any amendment constitutes acceptance of the revised Policy.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p>For any queries regarding this Privacy Policy, please contact us at:</p>
            <p className="mt-2">
              📧 Email: lawyerup.gmail.com<br />
              📍 Address: Delhi, India
            </p>
          </section>
          
          <div className="text-sm text-gray-600 mt-12 pt-6 border-t border-gray-200">
            Last updated: April 18, 2025
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;