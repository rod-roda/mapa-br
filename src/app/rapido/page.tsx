import type { Metadata } from 'next';
import { QuizLoader } from '@/components/QuizLoader';

export const metadata: Metadata = {
  title: 'Teste rápido · MAPA//BR',
};

export default function RapidoPage() {
  return <QuizLoader mode="rapido" />;
}
