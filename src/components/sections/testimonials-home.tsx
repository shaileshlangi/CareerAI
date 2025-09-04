import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const testimonials = [
  {
    name: 'Sarah L.',
    role: 'Product Manager',
    quote: "CareerAI's resume optimizer is a game-changer. I landed my dream job in a month!",
    image: 'https://picsum.photos/100/100?random=1',
    dataAiHint: 'woman smiling',
  },
  {
    name: 'David Chen',
    role: 'Hiring Manager @ TechCorp',
    quote: 'We filled our senior developer role in two weeks. The quality of candidates was outstanding.',
    image: 'https://picsum.photos/100/100?random=2',
    dataAiHint: 'man portrait',
  },
  {
    name: 'Emily R.',
    role: 'UX Designer',
    quote: 'The AI interview practice gave me the confidence I needed to ace my interviews. Highly recommended!',
    image: 'https://picsum.photos/100/100?random=3',
    dataAiHint: 'woman professional',
  },
  {
    name: 'Mark Robinson',
    role: 'Recruitment Agency Owner',
    quote: 'The automation tools have saved us countless hours. Our client submission rates have doubled.',
    image: 'https://picsum.photos/100/100?random=4',
    dataAiHint: 'man professional',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="container py-12">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
          Loved by Job Seekers and Employers
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Don't just take our word for it. Here's what our users have to say.
        </p>
      </div>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full mt-12"
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={80}
                      height={80}
                      className="rounded-full"
                      data-ai-hint={testimonial.dataAiHint}
                    />
                    <p className="mt-4 text-muted-foreground">"{testimonial.quote}"</p>
                    <div className="mt-4">
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
