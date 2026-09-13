import React from 'react';
import {
  Atom,
  FlaskConical,
  Droplets,
  Trophy,
  Layers,
  Boxes,
  GitCommit,
  Compass,
  Pipette,
  Scale,
  Flame,
  Repeat,
  Zap,
  Sparkles,
  ArrowLeftRight,
  HelpCircle,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ size?: number; color?: string; className?: string }>> = {
  Atom,
  FlaskConical,
  Droplets,
  Trophy,
  Layers,
  Boxes,
  GitCommit,
  Compass,
  Pipette,
  Scale,
  Flame,
  Repeat,
  Zap,
  Sparkles,
  ArrowLeftRight,
};

interface NavIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export const NavIcon: React.FC<NavIconProps> = ({ name, size = 16, color, className }) => {
  const Component = ICON_MAP[name] || HelpCircle;
  return <Component size={size} color={color} className={className} />;
};
