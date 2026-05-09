export default function SearchPageHeader({
  teachersCount,
}: {
  teachersCount: number;
}) {
  return (
    <div className="mb-6">

      <h1 className="text-4xl mb-2" style={{ color: "#1E3A8A" }}>
        Find Teachers
      </h1>

      <p className="text-gray-600">
        Search and filter from our network of{" "}
        <span className="font-semibold">{teachersCount}</span>{" "}
        qualified educators
      </p>

    </div>
  );
}