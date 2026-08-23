export default function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="section">
      <div className="section-head">
        <h2>{title}</h2>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
