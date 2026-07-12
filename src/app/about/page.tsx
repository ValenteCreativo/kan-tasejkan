import { redirect } from 'next/navigation';

// Redirect /about to /quienes-somos
export default function AboutRedirect() {
  redirect('/quienes-somos');
}
