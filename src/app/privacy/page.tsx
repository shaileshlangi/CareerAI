
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12 md:py-20">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
            <p>This is a placeholder for your Privacy Policy. It's important to be transparent with your users about how you collect, use, and protect their data. A comprehensive privacy policy builds trust and is often required by law.</p>
            
            <h3 className="font-bold text-lg text-card-foreground">1. Information We Collect</h3>
            <p>Clearly state what personal data you collect. This might include names, email addresses, phone numbers, resume details, payment information, and usage data.</p>
            
            <h3 className="font-bold text-lg text-card-foreground">2. How We Use Your Information</h3>
            <p>Explain why you collect this data. Examples include: to provide and improve your services, to process payments, to personalize user experience, to communicate with users, and for security purposes.</p>

            <h3 className="font-bold text-lg text-card-foreground">3. Data Sharing and Disclosure</h3>
            <p>Detail the circumstances under which you might share user data with third parties. This could include service providers (like payment gateways), legal requirements, or with user consent (e.g., when a job seeker applies to a company).</p>

            <h3 className="font-bold text-lg text-card-foreground">4. Data Security</h3>
            <p>Describe the measures you take to protect user data from unauthorized access or breaches. Mentioning technologies like encryption and secure servers is a good idea.</p>

            <h3 className="font-bold text-lg text-card-foreground">5. User Rights</h3>
            <p>Inform users of their rights regarding their data, such as the right to access, correct, or delete their personal information.</p>
            
            <h3 className="font-bold text-lg text-card-foreground">6. Cookies and Tracking Technologies</h3>
            <p>Explain your use of cookies and other tracking technologies and provide information on how users can manage their preferences.</p>

            <h3 className="font-bold text-lg text-card-foreground">7. Contact Us</h3>
            <p>Provide a way for users to contact you with any questions or concerns about their privacy.</p>
        </CardContent>
      </Card>
    </div>
  );
}
