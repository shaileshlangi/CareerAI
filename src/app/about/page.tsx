
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-20">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">About CareerAI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Welcome to CareerAI, where we are revolutionizing the recruitment landscape with the power of artificial intelligence. Our mission is to bridge the gap between talented professionals and innovative companies, making the hiring process faster, smarter, and more equitable for everyone involved.
          </p>
          <p>
            Founded on the principle that technology should empower human potential, CareerAI was created to solve the most pressing challenges in the modern job market. For job seekers, we offer a suite of AI-powered tools designed to optimize resumes, prepare for interviews, and uncover opportunities that perfectly match their skills and aspirations. For employers and recruiters, our platform provides intelligent shortlisting, automated interview scheduling, and insightful analytics to streamline the hiring workflow and identify the best candidates with unprecedented efficiency.
          </p>
          <p>
            Our team is composed of passionate technologists, seasoned HR professionals, and AI experts dedicated to building a platform that is not only powerful but also intuitive and user-friendly. We believe in a future where finding a dream job or hiring the perfect team member is no longer a daunting task, but an inspiring journey of growth and connection.
          </p>
          <p>
            Join us as we build the future of work. Faster Hiring, Smarter Careers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
