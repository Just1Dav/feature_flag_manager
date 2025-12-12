import { type LucideIcon } from 'lucide-react';

interface IProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ Icon, title, description }: IProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 rounded-full bg-orange-100/70 p-6">
        <Icon className="h-12 w-12 text-orange-600" />
      </div>

      <h2 className="text-foreground mb-2 text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
    </div>
  );
}
