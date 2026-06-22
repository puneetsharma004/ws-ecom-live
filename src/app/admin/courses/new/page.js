import Link from "next/link";
import { CourseForm } from "@/components/admin/CourseForm";

export const metadata = { title: "New course" };

export default function NewCoursePage() {
  return (
    <div className="flex flex-col gap-stack-md max-w-3xl">
      <Link
        href="/admin/courses"
        className="font-label-sm text-label-sm text-secondary hover:underline"
      >
        ← Courses
      </Link>
      <h1 className="font-headline-lg text-headline-lg text-on-surface">
        New course
      </h1>
      <CourseForm mode="create" />
    </div>
  );
}
