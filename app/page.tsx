import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-radial opacity-30 from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Discover Yourself
              </span>
              <br />
              <span className="text-foreground">Through AI-Powered Journaling</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground-muted mb-8 max-w-2xl mx-auto">
              Inner Compass combines biblical psychology and behavioral science to help you understand your patterns, emotions, and growth journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Start Journaling Free
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-foreground bg-background-secondary border border-border rounded-lg hover:bg-border transition-all">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Inner Compass?
            </h2>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
              A unique blend of ancient wisdom and modern AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card group">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-primary mb-4 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Coaching</h3>
              <p className="text-foreground-muted">
                Get personalized insights and guidance powered by advanced AI that understands your unique journey.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card group">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-accent mb-4 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Biblical Archetypes</h3>
              <p className="text-foreground-muted">
                Track your journey through biblical character patterns - Cain, Jonah, Solomon, Moses, Job, and David.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card group">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-primary mb-4 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Emotion Detection</h3>
              <p className="text-foreground-muted">
                Automatically classify emotions in your writing and identify patterns over time with visual analytics.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card group">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-accent mb-4 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Vector Memory</h3>
              <p className="text-foreground-muted">
                Semantic search across all your past entries to connect insights and discover hidden patterns.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card group">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-primary mb-4 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Crisis Detection</h3>
              <p className="text-foreground-muted">
                Built-in safety features detect concerning language and provide immediate resources when needed.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card group">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-accent mb-4 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Weekly Trends</h3>
              <p className="text-foreground-muted">
                Visualize your emotional patterns and growth over time with comprehensive analytics dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg text-foreground-muted mb-8">
              Join thousands of others discovering themselves through guided journaling and AI insights.
            </p>
            <Link href="/auth" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-primary rounded-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              Get Started for Free
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
