import Image from 'next/image';
import { Translations } from '../types';

interface ClientsProps {
  t: Translations;
}

export default function Clients({ t }: ClientsProps) {
  return (
    <section id="clients" className="section-container clients-section">
        <h2 className="section-title">{t.clientsTitle}</h2>
        <div className="clients-grid">
            <div className="client-logo hidden-on-load">
              <Image src="/assets/clients/pelni.png" alt="Pelni" width={150} height={80} className="object-contain" />
            </div>
            <div className="client-logo hidden-on-load">
              <Image src="/assets/clients/mib.png" alt="MIB" width={150} height={80} className="object-contain" />
            </div>
        </div>
    </section>
  );
}