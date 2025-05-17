import { Chat } from '@/components/Chat';
import { Clock } from '@/components/Clock';
import { UserMenu } from '@/components/UserMenu';
import { AnimatedTitle } from '@/components/AnimatedTitle';

const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@devriazul.com';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex-shrink-0 border-b border-gray-200 bg-white px-2 sm:px-4 md:px-8 py-3 md:py-4 flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-8">
        <AnimatedTitle />
        <div className="flex-1 hidden md:flex justify-center order-2 md:order-none">
          <Clock />
        </div>
        <div className="flex-1 flex justify-center md:justify-end order-3">
          <UserMenu email={adminEmail} />
        </div>
      </header>
      <main className="flex-1 overflow-hidden mx-auto w-full px-2 sm:px-4 md:px-8">
        <Chat />
      </main>
    </div>
  );
}
