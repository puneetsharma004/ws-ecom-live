import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { getAdminCourses } from "@/lib/db/courses";

export const metadata = { title: "Courses" };

export default async function AdminCoursesPage() {
  const courses = await getAdminCourses();

  return (
    <div className="flex flex-col gap-stack-md">
      <div className="flex items-center justify-between gap-stack-sm">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          Courses
        </h1>
        <Link
          href="/admin/courses/new"
          className="bg-primary text-on-primary px-stack-md py-stack-sm rounded-lg font-label-md text-label-md hover:opacity-90 flex items-center gap-unit"
        >
          <Icon name="add" className="text-[20px]" />
          New course
        </Link>
      </div>

      <div className="glass-card rounded-xl p-stack-md overflow-x-auto">
        {courses.length === 0
          ? <p className="font-body-md text-body-md text-on-surface-variant">
              No courses yet.
            </p>
          : <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-label-sm text-on-surface-variant">
                  <th className="pb-3 font-medium pr-4">Title</th>
                  <th className="pb-3 font-medium pr-4">Price</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-body-md text-on-surface">
                {courses.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-low/50"
                  >
                    <td className="py-3 pr-4 font-medium">
                      <Link
                        href={`/admin/courses/${c.id}`}
                        className="hover:text-secondary"
                      >
                        {c.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-on-surface-variant">
                      {c.price_label ?? "—"}
                    </td>
                    <td className="py-3">
                      <Badge variant={c.is_published ? "success" : "neutral"}>
                        {c.is_published ? "published" : "draft"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>}
      </div>
    </div>
  );
}
