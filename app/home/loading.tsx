import SkeletonCard from "@/components/SkeletonCard";

const colClassDia = `grid mt-4 gap-5 grid-cols-1  md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4`;

export default function Loading() {
  return (
    <section className={colClassDia}>
      {Array.from({ length: 8 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </section>
  );
}
