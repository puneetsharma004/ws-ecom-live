import Image from "next/image";
import { PageHeader } from "@/components/store/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { getPublishedCourses } from "@/lib/db/courses";

export const metadata = {
  title: "Courses",
  description:
    "Explore WS CubeTech's learning programs — full-stack development, data science, design and more.",
};
export const revalidate = 300;

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <div>
      <PageHeader
        title="Courses"
        subtitle="Level up with WS CubeTech's learning programs."
      />
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl">
        {courses.length === 0
          ? <p className="font-body-md text-body-md text-on-surface-variant">
              Courses are coming soon.
            </p>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {courses.map((course) => (
                <a
                  key={course.id}
                  href={course.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-transparent hover:border-outline-variant transition-colors"
                >
                  <div className="relative aspect-video bg-surface-container-low overflow-hidden">
                    {course.image_url
                      ? <Image
                          src={course.image_url}
                          alt={course.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      : <div className="w-full h-full flex items-center justify-center text-outline">
                          <Icon name="school" className="text-[48px]" />
                        </div>}
                  </div>
                  <div className="p-stack-md flex flex-col gap-stack-xs">
                    <h3 className="font-label-md text-label-md text-on-surface group-hover:text-secondary transition-colors">
                      {course.title}
                    </h3>
                    {course.blurb && (
                      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3">
                        {course.blurb}
                      </p>
                    )}
                    <div className="mt-stack-xs flex items-center justify-between">
                      {course.price_label && (
                        <span className="font-label-md text-label-md text-primary">
                          {course.price_label}
                        </span>
                      )}
                      <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                        Explore{" "}
                        <Icon name="arrow_outward" className="text-[16px]" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>}
      </div>
    </div>
  );
}
