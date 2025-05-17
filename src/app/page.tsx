import { Chat } from '@/components/Chat';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-gray-200 bg-white px-4 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">AI Chat Assistant</h1>
        </header>
        <Chat />
      </div>
    </main>
  );
}
