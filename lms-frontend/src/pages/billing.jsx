import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { useFetchUserEnrollmentsQuery } from "@/store/services/enrollment-service";
import { getApiErrorMessage, getCourseId } from "@/lib/api-error";

export default function BillingPage() {
  const { data: enrollments = [], error, isLoading } = useFetchUserEnrollmentsQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{getApiErrorMessage(error, "Unable to fetch billing details.")}</p>;
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="text-sm text-muted-foreground">Review account access and enrolled course activity.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Plan</CardDescription>
            <CardTitle className="text-3xl">Free</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Courses</CardDescription>
            <CardTitle className="text-3xl">{enrollments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Amount due</CardDescription>
            <CardTitle className="text-3xl">$0</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Billing history</CardTitle>
          <CardDescription>No paid invoices are attached to this account.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {enrollments.length === 0 ? (
            <div className="grid gap-3 rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">No course activity yet.</p>
              <Link to="/" className={buttonVariants({ className: "w-fit" })}>
                Explore courses
              </Link>
            </div>
          ) : (
            enrollments.map((enrollment) => {
              const course = enrollment.course || {};
              const courseId = getCourseId(course);

              return (
                <div key={enrollment._id} className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <h2 className="font-medium">{course.title || "Course enrollment"}</h2>
                    <p className="text-sm text-muted-foreground">Included with your free account.</p>
                  </div>
                  <Link to={`/player/${courseId}`}>
                    <Button variant="outline" className="w-full md:w-auto">
                      View course
                    </Button>
                  </Link>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
