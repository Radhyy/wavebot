import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import InteractiveMenuClient from './InteractiveMenuClient';

export default async function InteractiveMenuPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  
  const [menus, devices, user] = await Promise.all([
    prisma.interactiveMenu.findMany({
      where: { userId: session.id },
      include: { device: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.device.findMany({
      where: { userId: session.id }
    }),
    (prisma as any).user.findUnique({
      where: { id: session.id }
    })
  ]);

  return (
    <div className='dashboard-container'>
      <InteractiveMenuClient menus={menus} devices={devices} userPlan={user?.plan || 'FREE'} />
    </div>
  );
}
