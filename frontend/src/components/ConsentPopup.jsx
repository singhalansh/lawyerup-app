import React, { useState, useEffect } from "react";

const ConsentPopup = ({ isOpen, onClose }) => {
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }

    if (timeRemaining === 0) {
      setTimerComplete(true);
    }

    return () => clearTimeout(timer);
  }, [isOpen, timeRemaining]);

  const handleSubmit = () => {
    if (termsChecked && privacyChecked && timerComplete) {
      onClose(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Consent Required</h2>

        <p className="mb-6">
          Before using our service, you must agree to our Terms & Conditions and
          Privacy Policy.
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={termsChecked}
                onChange={() => setTermsChecked(!termsChecked)}
                className="w-4 h-4 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms & Conditions
                </a>
              </label>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="privacy"
                type="checkbox"
                checked={privacyChecked}
                onChange={() => setPrivacyChecked(!privacyChecked)}
                className="w-4 h-4 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="privacy" className="font-medium text-gray-700">
                I agree to the{" "}
                <a
                  href="/privacy"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            {!timerComplete ? (
              <p className="text-amber-600 font-medium">
                Please wait {timeRemaining} more seconds
              </p>
            ) : (
              <p className="text-green-600 font-medium">You can now submit</p>
            )}
          </div>

          <div className="flex gap-3">
            {/* <button 
              onClick={() => onClose(false)} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Decline
            </button> */}
            <button
              onClick={handleSubmit}
              disabled={!termsChecked || !privacyChecked || !timerComplete}
              className={`px-4 py-2 rounded-md ${
                termsChecked && privacyChecked && timerComplete
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-300 text-white cursor-not-allowed"
              }`}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentPopup;
