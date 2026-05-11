import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Inner Compass',
    template: '%s | Inner Compass',
  },
  description: 'AI-powered journaling coach combining biblical psychology and behavioral science for personal growth and self-discovery',
  keywords: ['journaling', 'AI coach', 'biblical psychology', 'personal growth', 'mental health', 'self-discovery'],
  authors: [{ name: 'Inner Compass Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Inner Compass - AI Journaling Coach',
    description: 'Discover yourself through AI-powered journaling with biblical wisdom and behavioral science',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inner Compass - AI Journaling Coach',
    description: 'Discover yourself through AI-powered journaling with biblical wisdom and behavioral science',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background`}>
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <a href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">Inner Compass</span>
              </a>

              <nav className="hidden md:flex items-center space-x-6">
                <a href="/journal" className="text-sm font-medium text-foreground-muted hover:text-primary transition-colors">
                  Journal
                </a>
                <a href="/pricing" className="text-sm font-medium text-foreground-muted hover:text-primary transition-colors">
                  Pricing
                </a>
                <a href="/auth" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-all">
                  Get Started
                </a>
              </nav>

              <button className="md:hidden p-2 text-foreground-muted hover:text-foreground">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border bg-background-secondary">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">Inner Compass</span>
                </div>
                <p className="text-sm text-foreground-muted">
                  Discover yourself through AI-powered journaling with biblical wisdom and behavioral science.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/journal" className="text-foreground-muted hover:text-primary transition-colors">Journal</a></li>
                  <li><a href="/pricing" className="text-foreground-muted hover:text-primary transition-colors">Pricing</a></li>
                  <li><a href="/auth" className="text-foreground-muted hover:text-primary transition-colors">Sign In</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-foreground-muted hover:text-primary transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-foreground-muted hover:text-primary transition-colors">Blog</a></li>
                  <li><a href="#" className="text-foreground-muted hover:text-primary transition-colors">Support</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-foreground-muted hover:text-primary transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-foreground-muted hover:text-primary transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-foreground-muted hover:text-primary transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-center text-sm text-foreground-muted">
                © {new Date().getFullYear()} Inner Compass. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
