import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | HorseCost</title>
        <meta name="description" content="HorseCost terms of service. Read our terms and conditions before using our calculators." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://horsecost.co.uk/terms-of-service" />
      </Helmet>

      <div className="bg-white">
        <div className="bg-amber-50 border-b border-amber-200 py-8 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Link to="/" className="flex items-center gap-2 text-amber-700 hover:text-amber-800 font-semibold mb-4">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-gray-600 mt-2">Last updated: November 2025</p>
          </div>
        </div>

        <div className="py-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700">
                By accessing and using HorseCost (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. License Grant</h2>
              <p className="text-gray-700 mb-4">
                HorseCost grants you a limited, non-exclusive, revocable license to use our Service for personal, non-commercial purposes. This license does not include the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the Site</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-4">
                The materials on HorseCost are provided on an 'as-is' basis. HorseCost makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
              <p className="text-gray-700">
                While we strive for accuracy, HorseCost does not warrant that the materials are accurate, complete, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Calculator Use Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                <strong>IMPORTANT:</strong> All calculators on HorseCost are provided for informational and planning purposes only. They are not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Professional financial, tax, or legal advice</li>
                <li>A substitute for professional consultation with accountants, veterinarians, or business advisors</li>
                <li>Guaranteed to be accurate or applicable to your specific situation</li>
                <li>Intended to replace your own calculations or research</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You assume full responsibility for all decisions made based on calculator results. Always consult qualified professionals before making important business or financial decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitations of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall HorseCost or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on HorseCost, even if HorseCost or a HorseCost-authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Governing Law</h2>
              <p className="text-gray-700">
                These terms and conditions are governed by and construed in accordance with the laws of the United Kingdom, and you irrevocably submit to the exclusive jurisdiction of the courts located in England.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="font-semibold text-gray-900">HorseCost</p>
                <p className="text-gray-700">Email: hello@horsecost.co.uk</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
