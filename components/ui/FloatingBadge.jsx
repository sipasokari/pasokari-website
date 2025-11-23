export default function FloatingBadge({ icon, title, subtitle }) {
  return (
    <div className="floating-badge">
      <div className="icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}