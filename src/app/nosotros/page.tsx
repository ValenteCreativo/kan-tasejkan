import { redirect } from 'next/navigation';

// Redirect /nosotros to /quienes-somos
export default function NosotrosRedirect() {
  redirect('/quienes-somos');
}
