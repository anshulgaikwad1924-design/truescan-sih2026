import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ts-bg flex flex-col font-sans">
      <header className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ts-peach flex items-center justify-center shadow-inner">
            <span className="font-bold text-white text-xl leading-none">T</span>
          </div>
          <span className="font-bold text-2xl tracking-tight text-ts-text-primary">TrueScan</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ts-peach/20 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ts-mint/20 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-ts-text-primary tracking-tight max-w-4xl">
          Digitize and validate land records with <span className="text-transparent bg-clip-text bg-gradient-to-r from-ts-peach to-[#e69880]">AI Precision</span>
        </h1>
        <p className="mt-6 text-lg text-ts-text-muted max-w-2xl">
          An intelligent platform to digitize, organize, extract, and perform preliminary validation on land-record documents, empowering faster and more accurate human reviews.
        </p>
        
        <div className="mt-10 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="primary" size="lg" className="shadow-[0_4px_14px_rgba(232,168,149,0.4)]">
              Get Started
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg">
              Request Access
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {[
            {
              title: 'AI Extraction',
              description: 'Extract structured information from scanned documents automatically.',
            },
            {
              title: 'Validation Flags',
              description: 'Identify discrepancies, missing fields, and potential duplicates.',
            },
            {
              title: 'Human Verification',
              description: 'Streamlined review workflows for verification officers.',
            },
          ].map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-ts-ivory border border-ts-border shadow-[0_8px_16px_var(--color-ts-shadow)] flex flex-col items-center text-center transform transition-transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-ts-text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-ts-text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
