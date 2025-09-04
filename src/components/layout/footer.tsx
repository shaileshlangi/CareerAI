import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

const socialLinks = [
  { Icon: Twitter, href: '#', name: 'Twitter' },
  { Icon: Github, href: '#', name: 'GitHub' },
  { Icon: Linkedin, href: '#', name: 'LinkedIn' },
];

const footerLinks = [
  { href: '/products', label: 'Products' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export default function Footer() {
  return (
    <footer className="bg-card/50 text-card-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="font-headline text-2xl font-bold text-primary">
              CareerAI
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Faster Hiring, Smarter Careers.
            </p>
            <div className="mt-4 flex space-x-4">
              {socialLinks.map(({ Icon, href, name }) => (
                <Link key={name} href={href} className="text-muted-foreground hover:text-primary">
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold">Platform</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.slice(0, 2).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Company</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.slice(2, 4).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.slice(4, 6).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CareerAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
