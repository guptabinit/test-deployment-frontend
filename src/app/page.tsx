import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/super-admin/dashboard');
}
