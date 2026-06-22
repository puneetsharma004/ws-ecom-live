import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { CourseForm } from "@/components/admin/CourseForm";
import { deleteCourse } from "@/lib/admin/actions";
import { getCourseById } from "@/lib/db/courses";

export const metadata = { title: "Edit course" };

export default async function EditCoursePage({ params }) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();

  return (
    <div className="flex flex-col gap-stack-lg max-w-3xl">
      <Link
        href="/admin/courses"
        className="font-label-sm text-label-sm text-secondary hover:underline"
      >
        ← Courses
      </Link>
      <h1 className="font-headline-lg text-headline-lg text-on-surface">
        {course.title}
      </h1>

      <CourseForm mode="edit" course={course} />

      <form action={deleteCourse} className="flex">
        <input type="hidden" name="id" value={course.id} />
        <ConfirmSubmit
          message={`Delete "${course.title}"?`}
          className="text-label-md text-label-md text-error border border-error/40 rounded-lg px-stack-md py-stack-sm hover:bg-error hover:text-on-error transition-colors"
        >
          Delete course
        </ConfirmSubmit>
      </form>
    </div>
  );
}
