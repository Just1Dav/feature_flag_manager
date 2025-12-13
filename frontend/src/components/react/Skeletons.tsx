import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ItemSkeleton() {
  return (
    <>
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
    </>
  );
}

export function FeatureFlagItemSkeleton() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i} className="mt-3 flex flex-col justify-between p-6">
          <div className="flex flex-row items-center gap-4">
            <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}
