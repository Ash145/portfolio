import { Button } from "@/components/Button";
import {
  ArrowRight,
  ChevronDown,
  Github,
  Linkedin,
  Download,
} from "lucide-react";
import { AnimatedBorderButton } from "../components/AnimatedBorderButton";

const skills = [
  "React",
  "Socket.io",
  "Node.js",
  "Express.js",
  "Redux",
  "Python",
  "PostgreSQL",
  "Tailwind CSS",
  "Git",
  "GitHub",
];

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Bg */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt="Hero image"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background" />
      </div>

      {/* Green Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full opacity-60"
            style={{
              backgroundColor: "#20B2A6",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `slow-drift ${
                15 + Math.random() * 20
              }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Junior Full Stack Developer
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in animation-delay-100">
                Crafting <span className="text-primary glow-text">digital</span>
                <br />
                experiences with
                <br />
                <span className="font-serif italic font-normal text-white">
                  precision.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg animate-fade-in animation-delay-200">
                Hi, I'm Syed Ashik Ahamed — a junior full stack developer
                specializing in React, Node.js, and TypeScript. I build
                scalable, performant web applications.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-300">
              <Button
                size="lg"
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                Contact Me <ArrowRight className="w-5 h-5" />
              </Button>
              <AnimatedBorderButton href="/SyedAshikAhamedResume.pdf" download>
                <Download className="w-5 h-5" />
                Download CV
              </AnimatedBorderButton>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 animate-fade-in animation-delay-400">
              <span className="text-sm text-muted-foreground">Follow me: </span>
              {[
                { icon: Github, href: "https://github.com/Ash145" },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/ash0714/",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  {<social.icon className="w-5 h-5" />}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Experience highlight */}
          <div className="relative animate-fade-in animation-delay-300 max-w-sm mx-auto lg:mx-0 lg:ml-auto w-full">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-primary/5 blur-2xl" />

            <div className="relative glass rounded-3xl p-8 border border-primary/20 space-y-8">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Experience
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-6xl md:text-7xl font-bold text-primary leading-none">
                    1.7
                  </span>
                  <span className="text-lg text-muted-foreground pb-2">
                    years
                  </span>
                </div>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  Building modern web apps with clean UIs, solid APIs, and
                  real-time features.
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                  <span className="relative rounded-full h-3 w-3 bg-green-500" />
                </span>
                <div>
                  <p className="font-medium">Open to work</p>
                  <p className="text-xs text-muted-foreground">
                    Available for full-time & freelance roles
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-surface/60 px-4 py-3 border border-border/50">
                  <p className="text-xl font-semibold text-primary">FS</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Full Stack
                  </p>
                </div>
                <div className="rounded-2xl bg-surface/60 px-4 py-3 border border-border/50">
                  <p className="text-xl font-semibold text-primary">RT</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Real-time apps
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-20 animate-fade-in animation-delay-600">
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Technologies I work with
          </p>
          <div className="relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 w-32
             bg-gradient-to-r from-background to-transparent z-10"
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-32
             bg-gradient-to-l from-background to-transparent z-10"
            />
            <div className="flex animate-marquee">
              {[...skills, ...skills].map((skill, idx) => (
                <div key={idx} className="flex-shrink-0 px-8 py-4">
                  <span className="text-xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 
      animate-fade-in animation-delay-800"
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
