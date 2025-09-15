"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CategorySkeleton = () => {
  return (
    <Card className="cursor-pointer rounded-xl shadow-sm p-2">
      <CardContent className="flex flex-col items-center space-y-2">
        <Skeleton className="h-20 w-20 rounded-lg" />
        <Skeleton className="h-4 w-16" />
      </CardContent>
    </Card>
  );
};

export default CategorySkeleton;
