const steps = [
  {
    step: 1,
    title: "Create Your Profile",
    description: "Sign up as a job seeker or an employer and set up your profile in minutes.",
  },
  {
    step: 2,
    title: "Leverage AI Tools",
    description: "Optimize resumes, post jobs, or let our AI find the perfect match for you.",
  },
  {
    step: 3,
    title: "Apply & Hire",
    description: "Job seekers can apply with their optimized resume, while employers can shortlist and interview top candidates.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-card/50 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A simple, streamlined process to connect talent with opportunity.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-2xl">
                  {item.step}
                </div>
              </div>
              <h3 className="mt-6 text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
