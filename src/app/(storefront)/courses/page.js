import { PageHeader } from "@/components/store/PageHeader";

export const metadata = { title: "Courses" };

export default function CoursesPage() {
  return (
    <div>
      <PageHeader
        title="Courses"
        subtitle="Explore WS CubeTech's learning programs."
      />
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl">
        <p className="font-body-md text-body-md text-on-surface-variant">
          A showcase of courses linking to the main learning platform will
          appear here.
        </p>
      </div>
    </div>
  );
}
