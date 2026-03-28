import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground/50">404</h1>
      <h2 className="text-xl font-semibold mt-2">Page not found</h2>
      <p className="text-sm text-muted-foreground mt-1">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button className="mt-4">
          <Home className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
