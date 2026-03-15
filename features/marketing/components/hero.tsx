import { Button } from "@/components/ui/button";
import {
  LucideArrowRight,
  LucideBriefcase,
  LucideGraduationCap,
  LucideUser,
  LucideWandSparkles,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-500 via-white to-white"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-prose space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6 border border-blue-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Powered by Advanced AI
            </div>
            <div>
              <h1 className="scroll-m-20 text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15] mb-6">
                Craft your dream resume with{" "}
                <span className="inline-block bg-linear-to-r from-blue-700 to-blue-500 text-transparent bg-clip-text">
                  AI precision
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-100 mb-8 leading-relaxed max-w-lg">
                Stop struggling with formatting and writer's block. CVCopilot
                analyzes job descriptions and tailors your resume instantly to
                beat the ATS and get you hired.
              </p>
            </div>
            <Button
              size="lg"
              className="flex items-center gap-2 bg-linear-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-700  transition-colors duration-300"
            >
              Start Building Free <LucideArrowRight />
            </Button>
          </div>

          <div className="relative lg:ml-auto w-full">
            <div className="relative rounded-2xl bg-slate-900 p-2 shadow-2xl shadow-slate-200 ring-1 ring-slate-900/10">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl -z-10"></div>
              <div className="bg-slate-800 rounded-t-xl p-3 flex items-center gap-2 border-b border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto bg-slate-900/50 px-4 py-1 rounded text-xs text-slate-400 font-mono">
                  cvcopilot.ai/editor
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-600 rounded-b-xl overflow-hidden aspect-4/3 relative">
                <div className="flex h-full">
                  <div className="w-16 bg-white border-r border-slate-200  flex-col items-center py-4 gap-6 hidden sm:flex">
                    <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                      <LucideUser size="18" />
                    </div>
                    <div className="w-8 h-8 rounded hover:bg-slate-100 text-slate-400 flex items-center justify-center">
                      <LucideBriefcase size="18" />
                    </div>
                    <div className="w-8 h-8 rounded hover:bg-slate-100 text-slate-400 flex items-center justify-center">
                      <LucideGraduationCap size="18" />
                    </div>
                    <div className="w-8 h-8 rounded hover:bg-slate-100 text-slate-400 flex items-center justify-center">
                      <LucideWandSparkles size="18" />
                    </div>
                  </div>

                  <div className="flex-1 p-6 bg-slate-50 overflow-hidden relative">
                    <div
                      className="absolute top-1/3 right-8 z-20 bg-white p-4 rounded-xl shadow-xl border border-primary-100 max-w-xs animate-bounce"
                      style={{
                        animationDuration: "3s",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary-600 shrink-0">
                          <i className="fa-solid fa-robot"></i>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 mb-1">
                            AI Suggestion
                          </p>
                          <p className="text-xs text-slate-500">
                            Change "Managed team" to "Orchestrated a
                            cross-functional team of 12..." to increase impact.
                          </p>
                          <button className="mt-2 text-xs bg-blue-700 text-white px-3 py-1 rounded hover:bg-primary-700">
                            Apply Change
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white shadow-sm border border-slate-200 w-full h-full rounded-lg p-8 transform scale-95 origin-top">
                      <div className="h-8 w-1/3 bg-slate-800 rounded mb-2"></div>
                      <div className="h-4 w-1/4 bg-blue-600 rounded mb-8"></div>

                      <div className="h-4 w-full bg-slate-100 rounded mb-2"></div>
                      <div className="h-4 w-5/6 bg-slate-100 rounded mb-6"></div>

                      <div className="flex gap-4 mb-6">
                        <div className="w-1/3">
                          <div className="h-4 w-20 bg-slate-300 rounded mb-3"></div>
                          <div className="h-3 w-full bg-slate-100 rounded mb-2"></div>
                          <div className="h-3 w-full bg-slate-100 rounded mb-2"></div>
                          <div className="h-3 w-2/3 bg-slate-100 rounded mb-2"></div>
                        </div>
                        <div className="w-2/3">
                          <div className="h-4 w-32 bg-slate-300 rounded mb-3"></div>
                          <div className="h-3 w-full bg-slate-100 rounded mb-2"></div>
                          <div className="h-3 w-full bg-slate-100 rounded mb-2"></div>
                          <div className="h-3 w-full bg-slate-100 rounded mb-2"></div>
                          <div className="h-3 w-4/5 bg-slate-100 rounded mb-2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
