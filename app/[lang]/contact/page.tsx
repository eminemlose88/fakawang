import { getDictionary } from '@/lib/dictionary'

export const dynamic = 'force-dynamic'

export default async function ContactPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const { lang } = params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-sl-dark flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sl-purple/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-sl-blue/10 rounded-full blur-[100px]"></div>
       </div>

      <div className="max-w-md w-full space-y-8 bg-sl-card p-10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/5 relative z-10">
        <div className="text-center">
          <h2 className="mt-2 text-4xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            联系客服
          </h2>
          <div className="h-1 w-20 bg-sl-blue mx-auto mt-4 mb-6 shadow-[0_0_10px_#00EAFF]"></div>
          <p className="mt-2 text-sm text-gray-400 font-mono">
            如果您遇到任何问题，请通过 Telegram 联系我们的客服人员。
          </p>
        </div>

        <div className="mt-8 space-y-4">
            {/* Customer Service 1 */}
            <a
              href="https://t.me/honk1030"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full flex justify-center items-center py-4 px-4 border border-sl-blue/30 text-sm font-bold uppercase tracking-wider rounded text-white bg-sl-blue/10 hover:bg-sl-blue hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sl-blue transition-all duration-300 shadow-[0_0_15px_rgba(0,234,255,0.1)] hover:shadow-[0_0_20px_rgba(0,234,255,0.6)]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                <svg className="h-5 w-5 text-sl-blue group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </span>
              联系一号客服 (@honk1030)
            </a>

            {/* Customer Service 2 */}
            <a
              href="https://t.me/eminemlose"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full flex justify-center items-center py-4 px-4 border border-sl-purple/30 text-sm font-bold uppercase tracking-wider rounded text-white bg-sl-purple/10 hover:bg-sl-purple hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sl-purple transition-all duration-300 shadow-[0_0_15px_rgba(157,0,255,0.1)] hover:shadow-[0_0_20px_rgba(157,0,255,0.6)]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                 <svg className="h-5 w-5 text-sl-purple group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </span>
              联系二号客服 (@eminemlose)
            </a>

            {/* TG Channel */}
            <a
              href="https://t.me/honk1030aws"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full flex justify-center items-center py-4 px-4 border border-green-500/30 text-sm font-bold uppercase tracking-wider rounded text-white bg-green-500/10 hover:bg-green-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                 <svg className="h-5 w-5 text-green-500 group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </span>
              加入 TG 补货频道 (@honk1030aws)
            </a>
        </div>
      </div>
    </div>
  )
}
