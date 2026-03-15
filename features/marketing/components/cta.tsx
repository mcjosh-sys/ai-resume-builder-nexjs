import Link from "next/link";

export const CallToAction = () => {
  return (
    <section className="py-20 px-6 ">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0f1d] px-8 py-16 md:py-24 text-center shadow-2xl">
          {/* Background Decorative Gradients */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-blue-600/20 blur-[100px]" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-[100px]" />

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight max-w-2xl">
              Ready to land your dream job?
            </h2>

            <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
              Join thousands of professionals who have accelerated their careers
              with CVCopilot. No credit card required to start.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/builder"
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#0a0f1d] font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-lg shadow-white/5"
              >
                Build My Resume Now
              </Link>

              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-4 bg-[#0a0f1d] text-white font-bold rounded-xl border border-slate-800 hover:bg-slate-900 transition-colors"
              >
                View Pricing
              </Link>
            </div>

            <p className="mt-8 text-sm text-slate-500 font-medium">
              Free 7-day trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
