import type { Metadata } from 'next';
import { QuizLoader } from '@/components/QuizLoader';

export const metadata: Metadata = {
  title: 'Teste completo · MAPA//BR',
};

export default function TestePage() {
  return <QuizLoader mode="completo" />;
}
