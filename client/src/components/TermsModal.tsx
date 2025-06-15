import React, { useEffect } from 'react';
import { X, Shield, Users, Lock, AlertTriangle, FileText, Clock } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptTerms: () => void; // <- add this
}

export default function TermsModal({ isOpen, onClose, onAcceptTerms }: TermsModalProps) {
  // Handle escape key and background click
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Enhanced Overlay with Animation */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
        aria-hidden="true" 
      />
      
      {/* Modal Container */}
      <div className="w-full max-w-2xl xl:max-w-3xl mx-auto bg-white shadow-2xl relative rounded-3xl flex flex-col z-10">
        
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-3xl">
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-6 right-6 p-2 rounded-full hover:bg-white/80 text-gray-500 hover:text-gray-800 transition-all duration-200 hover:scale-110"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Terms & Conditions
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <div className="space-y-6">
            
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to StudyBuddy!</h3>
                  <p className="text-gray-700 leading-relaxed">
                    By creating an account and using our platform, you agree to abide by these Terms & Conditions. 
                    StudyBuddy is designed to connect NUS students for collaborative learning and academic support.
                  </p>
                </div>
              </div>
            </div>

            {/* User Conduct */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">User Conduct & Responsibilities</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Maintain respectful and professional behavior in all interactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Use the platform exclusively for educational and academic purposes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Keep your login credentials secure and do not share your account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Report any inappropriate behavior or content to our support team</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Privacy & Data Protection */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Lock className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Privacy & Data Protection</h3>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      Your personal information is stored securely using industry-standard encryption and security measures.
                    </p>
                    <p>
                      We collect only necessary information for platform functionality and will never share your data 
                      with third parties without your explicit consent.
                    </p>
                    <p>
                      You have the right to access, update, or delete your personal data at any time through your account settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prohibited Activities */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <AlertTriangle className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Prohibited Activities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                      <span>Harassment or bullying</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                      <span>Spam or unsolicited messages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                      <span>Academic dishonesty</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                      <span>Sharing inappropriate content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                      <span>Creating fake accounts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                      <span>Violating others' privacy</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <strong>Note:</strong> Violation of these terms may result in account suspension or permanent termination.
                  </div>
                </div>
              </div>
            </div>

            {/* Updates & Changes */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-100">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Updates & Modifications</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may update these Terms & Conditions periodically to reflect changes in our services or legal requirements. 
                    Users will be notified of significant changes via email or platform notifications. Continued use of StudyBuddy 
                    after updates constitutes acceptance of the revised terms.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Need Help?</h3>
              <p className="text-gray-700 mb-3">
                If you have questions about these terms or need support, please contact us:
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Email:</strong> support@studybuddy.nus.edu.sg</p>
                <p><strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM SGT</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              By using StudyBuddy, you acknowledge that you have read and understood these terms.
            </p>
            <button
              onClick={onAcceptTerms}
              className="cursor-pointer px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}