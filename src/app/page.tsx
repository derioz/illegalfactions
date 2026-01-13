import { Hero } from '@/components/landing/Hero';
import { FactionGrid } from '@/components/landing/FactionGrid';

export default function Home() {
  return (
    <>
      <Hero />
      <section id="factions">
        <FactionGrid />
      </section>
    </>
  );
}
