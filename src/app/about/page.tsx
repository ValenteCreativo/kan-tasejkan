import { redirect } from 'next/navigation';

// Redirect /about to /nosotros
export default function AboutRedirect() {
  redirect('/nosotros');
}
