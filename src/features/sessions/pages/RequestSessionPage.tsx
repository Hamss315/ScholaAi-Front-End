import RequestSessionHeader from "../components/RequestSessionHeader";
import RequestSessionForm from "../components/RequestSessionForm";

export default function RequestSessionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RequestSessionHeader />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl mb-2" style={{ color: "#1E3A8A" }}>
            Request a Session
          </h1>
          <p className="text-gray-600">
            Fill out the form and we’ll notify teachers who teach your selected subject.
          </p>
        </div>

        <RequestSessionForm />
      </div>
    </div>
  );
}
