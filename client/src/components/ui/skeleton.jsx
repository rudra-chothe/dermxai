import { cn } from "@/lib/utils";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
};

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex items-center">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="ml-3 sm:ml-4 flex-1">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
    </div>
  );
};

const SkeletonActivity = () => {
  return (
    <div className="flex items-start space-x-2 sm:space-x-3">
      <Skeleton className="w-2 h-2 rounded-full mt-2" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-48 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
};

const SkeletonInsight = () => {
  return (
    <div className="text-center">
      <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-3 sm:mb-4" />
      <Skeleton className="h-4 w-24 mx-auto mb-2" />
      <Skeleton className="h-6 w-12 mx-auto mb-1" />
      <Skeleton className="h-3 w-20 mx-auto" />
    </div>
  );
};

export { Skeleton, SkeletonCard, SkeletonActivity, SkeletonInsight };
