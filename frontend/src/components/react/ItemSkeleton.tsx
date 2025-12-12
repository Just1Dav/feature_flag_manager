import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ISkeletonProps {
  containerClass: string;
}

export function ItemSkeleton({ containerClass }: ISkeletonProps) {
  return (
    <div className={containerClass}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="flex h-35 flex-col justify-between p-6">
            <div className="flex flex-row items-center gap-4">
              <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
