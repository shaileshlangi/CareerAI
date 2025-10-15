
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';

const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/jobs', label: 'Job Board' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, isLoggedIn } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth();
    await auth.signOut();
    setIsOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-headline text-2xl font-bold text-primary">CareerAI</span>
          </Link>
        </div>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
             <Link href="/dashboard" className="transition-colors hover:text-primary">
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {!loading && (
            <nav className="hidden items-center space-x-2 md:flex">
              {isLoggedIn ? (
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </nav>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col h-full">
                <div className="flex items-center border-b pb-4">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                    <span className="font-headline text-2xl font-bold text-primary">CareerAI</span>
                  </Link>
                </div>
                <div className="flex-grow py-4">
                  <nav className="grid gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-lg font-medium transition-colors hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                     {isLoggedIn && (
                      <Link href="/dashboard" className="text-lg font-medium transition-colors hover:text-primary" onClick={() => setIsOpen(false)}>
                        Dashboard
                      </Link>
                    )}
                  </nav>
                </div>
                {!loading && (
                  <div className="border-t pt-4">
                    <div className="flex flex-col space-y-2">
                       {isLoggedIn ? (
                        <Button variant="ghost" onClick={handleLogout}>
                           <LogOut className="mr-2 h-4 w-4" />
                           Log Out
                        </Button>
                      ) : (
                        <>
                          <Button variant="ghost" asChild>
                            <Link href="/login" onClick={() => setIsOpen(false)}>Log In</Link>
                          </Button>
                          <Button asChild>
                            <Link href="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
