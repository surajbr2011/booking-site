import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200/50", className)}
      {...props}
    />
  );
}

export function RoomSkeleton() {
  return (
    <div className="bg-white rounded-[40px] p-[22px] flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-50">
      <Skeleton className="h-[24px] w-3/4 mx-auto mb-4 mt-2" />
      <Skeleton className="w-full aspect-[4/3] rounded-[32px] mb-5" />
      <div className="flex items-center gap-[14px] px-2 mb-4">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex items-center justify-between px-2 pb-2 mt-auto">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}
