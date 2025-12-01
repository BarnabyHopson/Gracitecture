import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="mt-auto py-8 px-4 border-t border-gray-200">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
        <Image
          src="/logo.png"
          alt="Rocky Road AI logo"
          width={80}
          height={80}
          className="opacity-70"
        />
        <p className="text-center text-gray-600">
          Made by{' '}
          <a 
            href="https://www.rockyroadai.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-ochre hover:text-fire-red transition-colors"
          >
            Rocky Road AI
          </a>
          {' '}– Epsom, UK
        </p>
      </div>
    </footer>
  )
}
