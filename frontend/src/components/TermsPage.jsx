import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const TermsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <p className="text-gray-600 mb-8">Effective Date: 17 April 2025</p>
        
        <div className="prose max-w-none">
          <p>
            Welcome to the AI Virtual Legal Assistant platform ("Platform", "We", "Our", or "Us"). Please read these Terms and Conditions ("Terms") carefully before using the services offered by us.
          </p>
          <p>
            By accessing or using our services, you ("User", "You") agree to be bound by the following terms and conditions, which govern your access to and use of the AI Legal Assistant and its features.
          </p>
          
          <hr className="my-8" />
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Nature of Service</h2>
            <p>1.1 The Platform is an AI-based legal informational tool designed to provide basic guidance on legal topics, assist in refining legal drafts, and direct users to nearby legal professionals through publicly available data.</p>
            <p>1.2 The Platform does not provide legal advice, legal representation, or services requiring a licensed advocate under the Advocates Act, 1961.</p>
            <p>1.3 All responses are general in nature, non-binding, and intended solely to enhance user awareness. Users are strongly encouraged to consult a licensed legal professional before acting on any information obtained from the Platform.</p>
          </section>
          
          <hr className="my-8" />
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Eligibility</h2>
            <p>2.1 By using this Platform, you affirm that you are competent to contract under the Indian Contract Act, 1872.</p>
            <p>2.2 If you are under 18 years of age, you must use the Platform under the supervision of a parent or legal guardian.</p>
          </section>
          
          <hr className="my-8" />
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Privacy and Data Use</h2>
            <p>3.1 We do not collect or retain any personally identifiable information (PII) without your explicit consent.</p>
            <p>3.2 Any use of location data (e.g., for finding nearby lawyers) is voluntary and subject to user consent at the time of access.</p>
            <p>3.3 All data inputs provided by you are processed only within the current session and are not stored, reused, or transferred to any third-party system or database.</p>
            <p>3.4 For more details on data handling, please refer to our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.</p>
          </section>
          
          <hr className="my-8" />
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Use of the Platform</h2>
            <p>4.1 You agree to use the Platform solely for lawful purposes and in accordance with these Terms.</p>
            <p>4.2 You shall not:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the Platform to upload or transmit any defamatory, obscene, or unlawful content;</li>
              <li>Reverse-engineer, scrape, or attempt to exploit the Platform's backend systems;</li>
              <li>Impersonate any other person or misrepresent your affiliation.</li>
            </ul>
            <p>4.3 You are solely responsible for the content and context of any information you submit to the Platform.</p>
          </section>
          
          <hr className="my-8" />
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property Rights</h2>
            <p>5.1 All content, including but not limited to design, structure, user interface, AI training logic, and branding elements, are the intellectual property of the Platform creators, unless otherwise attributed.</p>
            <p>5.2 Where the Platform utilizes publicly available statutes or judgments, such content is used under the public domain or fair-use principles.</p>
            <p>5.3 Any AI-generated documents or suggestions are offered under a permissive, non-exclusive license to the user and carry no claim of authorship or ownership by the Platform.</p>
          </section>
          
          <hr className="my-8" />
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
            <p>6.1 The Platform may integrate APIs or services from third parties, such as Google Maps or legal search engines, to enhance functionality.</p>
            <p>6.2 We are not responsible for the accuracy, reliability, or data handling practices of such third-party services.</p>
          </section>
          
          <hr className="my-8" />
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p>7.1 The Platform and all its features are provided on an "as-is" and "as-available" basis, without warranties of any kind.</p>
            <p>7.2 Under no circumstances shall the creators, developers, or affiliates of the Platform be liable for any direct, indirect, incidental, special, or consequential damages arising out of your use or inability to use the Platform.</p>
          </section>
          
          <hr className="my-8" />
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Legal Disclaimer</h2>
            <p>8.1 This Platform is not a substitute for legal advice or legal services.</p>
            <p>8.2 No lawyer-client relationship is created by the use of the Platform.</p>
            <p>8.3 Any reliance placed on the Platform's responses is strictly at the user's own risk.</p>
          </section>
          
          <hr className="my-8" />
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Governing Law and Dispute Resolution</h2>
            <p>9.1 These Terms shall be governed by and construed in accordance with the laws of India.</p>
            <p>9.2 Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located at [Insert Jurisdiction], India.</p>
          </section>
          
          <hr className="my-8" />
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Amendments and Updates</h2>
            <p>10.1 We reserve the right to amend these Terms at any time without prior notice.</p>
            <p>10.2 Continued use of the Platform after any such changes constitutes your acceptance of the revised Terms.</p>
          </section>
          
          <div className="text-sm text-gray-600 mt-12 pt-6 border-t border-gray-200">
            Last updated: April 17, 2025
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsPage;