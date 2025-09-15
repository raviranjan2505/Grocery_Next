"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CategoriesMainSkeleton = () => {
  return (
    <Card className="rounded-2xl shadow-md p-4">
      <CardContent className="flex justify-between h-full items-center">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-6 w-24" /> {/* title */}
          <Skeleton className="h-10 w-28 rounded-md" /> {/* button */}
        </div>
        <Skeleton className="h-20 w-32 rounded-md" /> {/* image */}
      </CardContent>
    </Card>
  );
};

export default CategoriesMainSkeleton;