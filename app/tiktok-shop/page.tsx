import type { Metadata } from 'next';
import TikTokShopCreator from './creator';
import './shop.css';

export const metadata: Metadata = {
  title: 'TikTok Shop Creator | Prompt AI Studio',
  description: 'Monte falas por tempo e nicho de roupa e copie o prompt completo para Google Flow.',
};

export default function TikTokShopPage() {
  return <TikTokShopCreator/>;
}
