import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ColorsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Colors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-10" />
            <Skeleton className="flex-1 h-10" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-10" />
            <Skeleton className="flex-1 h-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AssetsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-32 h-32 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SEOSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-36" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ContactSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function BusinessHoursSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-10 w-32" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SocialMediaSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function BrandingPageSkeleton() {
  return (
    <div className="container space-y-6 p-8">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ColorsSkeleton />
        <AssetsSkeleton />
        <SEOSkeleton />
        <ContactSkeleton />
        <BusinessHoursSkeleton />
        <SocialMediaSkeleton />
      </div>
    </div>
  );
}
