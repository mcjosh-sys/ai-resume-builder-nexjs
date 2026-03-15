import { LuFileJson, LuTarget, LuWandSparkles } from "react-icons/lu";

export const FeaturesSection = () => {
  const features = [
    {
      title: "AI Content Writer",
      description:
        "Stuck on a bullet point? Our AI generates professional, action-oriented descriptions tailored to your specific job title and industry.",
      icon: <LuWandSparkles className="w-6 h-6 text-blue-600" />,
      iconBg: "bg-blue-50",
    },
    {
      title: "ATS Optimization",
      description:
        "We analyze your resume against Applicant Tracking Systems to ensure you don't get filtered out by robots before a human sees you.",
      icon: <LuTarget className="w-6 h-6 text-indigo-600" />,
      iconBg: "bg-indigo-50",
    },
    {
      title: "Smart Import",
      description:
        "Upload your old PDF or LinkedIn profile, and we'll instantly reformat it into a modern, professional template of your choice.",
      icon: <LuFileJson className="w-6 h-6 text-emerald-600" />,
      iconBg: "bg-emerald-50",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold  mb-6 tracking-tight">
            Supercharge your job search
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our AI-powered engine doesn't just format your resume—it rewrites it
            to highlight your strengths and match job requirements.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-start"
            >
              {/* Icon Container */}
              <div className={`p-3 rounded-xl ${feature.iconBg} mb-6`}>
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold  mb-4">{feature.title}</h3>

              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
