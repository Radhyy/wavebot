import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateMenuClient from './CreateMenuClient';

export default async function CreateInteractiveMenuPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  
  const devices = await prisma.device.findMany({
    where: { userId: session.id }
  });

  return (
    <div className='dashboard-container'>
      <CreateMenuClient devices={devices} />
    </div>
  );
}
