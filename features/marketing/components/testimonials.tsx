import Image from "next/image";
import { LuArrowLeft, LuArrowRight, LuStar } from "react-icons/lu";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Marketing Manager @ TechFlow",
      image: "https://i.pravatar.cc/150?u=sarah", // Placeholder avatars
      content:
        "I applied to 50 jobs with my old resume and got 0 calls. After using CVCopilot, I got 3 interviews in the first week. The AI suggestions are pure gold.",
    },
    {
      name: "David Chen",
      role: "Software Engineer @ CloudScale",
      image: "https://i.pravatar.cc/150?u=david",
      content:
        "The ATS checker saved me. I didn't realize my fancy formatting was unreadable by bots. CVCopilot fixed it instantly while keeping it looking great.",
    },
    {
      name: "Emily Rodriguez",
      role: "Product Designer @ Studio",
      image: "https://i.pravatar.cc/150?u=emily",
      content:
        "Simple, fast, and effective. The templates are modern and the AI writing assistant helped me articulate my achievements perfectly.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-muted">
      <div className="max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold  mb-6 tracking-tight">
              Loved by job seekers worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              Don't just take our word for it. See what our users have to say
              about their success stories.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-4">
            <button className="p-4 rounded-full border border-border bg-background hover:bg-slate-50 transition-colors">
              <LuArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button className="p-4 rounded-full bg-[#0f172a] hover:bg-slate-800 transition-colors">
              <LuArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-10 rounded-[2rem] bg-background border border-border shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, starI) => (
                    <LuStar
                      key={starI}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed italic mb-8">
                  "{t.content}"
                </p>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <Image
                  src={t.image}
                  alt={t.name}
                  height={48}
                  width={48}
                  className="w-12 h-12 rounded-full object-cover bg-slate-100"
                />
                <div>
                  <h4 className="font-bold  leading-none mb-1">{t.name}</h4>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
