import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Fakawang 2.0',
  description: 'Learn more about Fakawang 2.0, the leading provider of premium digital goods and cloud accounts.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-sl-dark py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            About <span className="text-sl-blue">Us</span>
          </h1>
          <p className="text-gray-400 font-mono">
            Empowering developers and businesses with instant access to cloud infrastructure.
          </p>
        </div>

        <div className="bg-sl-card p-8 md:p-12 rounded-xl border border-white/5 shadow-xl space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              At Fakawang 2.0, our mission is to simplify the procurement of digital assets. We believe that access to cloud computing resources like AWS, Google Cloud, and Azure should be seamless and immediate. Whether you are a solo developer testing a new app or a startup scaling your operations, we provide the verified accounts you need to get started instantly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Why Trust Us?</h2>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>
                <strong className="text-white">Verification Process:</strong> Every account goes through a rigorous verification process to ensure stability and longevity.
              </li>
              <li>
                <strong className="text-white">Instant Delivery:</strong> Our automated system delivers your credentials immediately after payment confirmation.
              </li>
              <li>
                <strong className="text-white">Crypto Friendly:</strong> We support privacy-focused payment methods including USDT, Bitcoin, and Ethereum.
              </li>
              <li>
                <strong className="text-white">24/7 Support:</strong> Our dedicated support team is available via Telegram to assist with any issues.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-400 leading-relaxed">
              Have questions or need a custom order? Reach out to our support team directly. We value your business and are committed to providing the best service possible.
            </p>
            <div className="mt-6">
              <a href="/contact" className="inline-block bg-sl-blue text-black font-bold px-6 py-3 rounded hover:bg-white transition-colors uppercase tracking-wide">
                Get Support
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
