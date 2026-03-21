import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">TAC Calabash</h1>
      <p className="text-muted-foreground mb-8">Desktop Application</p>
      <p className="text-sm text-muted-foreground">Offline-capable church management</p>
    </main>
  );
}

export default App;
