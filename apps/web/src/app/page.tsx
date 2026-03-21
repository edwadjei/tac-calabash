import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">TAC Calabash</h1>
      <p className="text-muted-foreground mb-8">Church Management Solution</p>
      <Link
        href="/login"
        className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:opacity-90"
      >
        Login to Dashboard
      </Link>
    </main>
  );
}
