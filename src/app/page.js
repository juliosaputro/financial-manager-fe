import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to the dashboard by default
  redirect('/pages/dashboard');
}