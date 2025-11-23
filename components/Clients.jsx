export default function Clients({ t }) {
  return (
    <section id="clients" className="section-container clients-section">
        <h2 className="section-title">{t.clientsTitle}</h2>
        <div className="clients-grid">
            <div className="client-logo hidden-on-load"><img src="/assets/clients/pelni.png" alt="Pelni" /></div>
            <div className="client-logo hidden-on-load"><img src="/assets/clients/mib.png" alt="MIB" /></div>
        </div>
    </section>
  );
}