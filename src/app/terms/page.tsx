
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="container py-12 md:py-20">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
           <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
            <p>This is a placeholder for your Terms of Service. This agreement sets the rules and expectations for users of your platform. It's a legally binding contract, so it’s crucial to have a clear and comprehensive one.</p>

            <h3 className="font-bold text-lg text-card-foreground">1. Acceptance of Terms</h3>
            <p>By accessing or using CareerAI, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.</p>

            <h3 className="font-bold text-lg text-card-foreground">2. User Accounts</h3>
            <p>Explain the responsibilities of users regarding their accounts, such as maintaining the confidentiality of their password and being responsible for all activities that occur under their account.</p>

            <h3 className="font-bold text-lg text-card-foreground">3. User Content</h3>
            <p>Define what constitutes "User Content" (resumes, job postings, etc.) and outline the rights you have to use that content to provide your service. Also, detail user responsibilities for the content they post.</p>
            
            <h3 className="font-bold text-lg text-card-foreground">4. Prohibited Activities</h3>
            <p>List activities that are not allowed on your platform, such as posting false information, infringing on intellectual property rights, harassing other users, or attempting to breach the security of the site.</p>
            
            <h3 className="font-bold text-lg text-card-foreground">5. Payments, Subscriptions, and Refunds</h3>
            <p>Clearly describe your payment terms for subscriptions and other services. Include details about billing cycles, payment methods, and your refund policy.</p>

            <h3 className="font-bold text-lg text-card-foreground">6. Disclaimers and Limitation of Liability</h3>
            <p>This section is crucial for limiting your legal liability. It should state that your service is provided "as is" and that you are not liable for any damages that may arise from its use.</p>

            <h3 className="font-bold text-lg text-card-foreground">7. Governing Law</h3>
            <p>Specify the jurisdiction whose laws will govern the agreement (e.g., "the laws of India").</p>
        </CardContent>
      </Card>
    </div>
  );
}
