export default function Footer({ text }: { text: string }) {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto shadow-sm">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <p className="text-center text-sm text-sl-text-muted">
          {text}
        </p>
        <div className="mt-4 flex space-x-4 text-xs text-gray-400 font-mono">
          <span>SYSTEM ONLINE</span>
          <span>•</span>
          <span>VER 2.0</span>
        </div>
      </div>
    </footer>
  )
}
