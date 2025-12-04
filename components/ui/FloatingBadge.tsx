import { ReactNode } from 'react';

interface FloatingBadgeProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export default function FloatingBadge({ icon, title, subtitle }: FloatingBadgeProps) {
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