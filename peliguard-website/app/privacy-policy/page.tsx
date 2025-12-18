import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <main className="page-container">
      <section className="page-section">
        <div className="page-content">
          <div className="max-w-5xl mx-auto">
            <div className="content-card rounded-[2rem] p-6 sm:p-8 md:p-10 lg:p-14">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-10">
                Privacy <span className="text-blue-600">Policy</span>
              </h1>
              
              <div className="space-y-4 sm:space-y-6 md:space-y-8 text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed font-light">
                <p>
                  This Privacy Policy governs the processing of your personal data by the Yeti Industries 
                  group of companies (referred to as: "Yeti", "Peliguard" "we", "us", "our") captured 
                  through the following methods:
                </p>
                
                <ul className="list-disc list-inside space-y-3 ml-4">
                  <li>When you visit our global and local websites (the "Website");</li>
                  <li>When you communicate with us via e-mail, telephone, fax and/or social media channels; and/or</li>
                  <li>Through other online and offline channels.</li>
                </ul>
                
                <p>
                  If you want more information on how we process personal data via cookies, social plugins 
                  and other types of tracking technology, please refer to our Cookie Policy.
                </p>
                
                <div className="mt-12 pt-10 border-t border-gray-200">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">IN GENERAL</h2>
                  <p className="mb-4">
                    You can contact us via e-mail at{' '}
                    <a href="mailto:privacy@peliguard.com" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                      privacy@peliguard.com
                    </a>.
                  </p>
                  <p>
                    A reference in this Privacy Policy to certain laws or regulations also includes any 
                    change, replacement or annulment of these laws or regulations, including any related 
                    executive decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
