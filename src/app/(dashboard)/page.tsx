import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
            Your Thoughts, Your Identity, Hidden: Anonymous Feedback
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
            " Welcome to our anonymous feedback platform! Whether you're a store owner, dance instructor, or run any other business, we're here to help you gather honest feedback from your employees, students, or customers. With our platform, they can share their thoughts openly and anonymously, ensuring you receive valuable insights to improve your services. Join us in embracing anonymity to foster a culture of open communication and continuous improvement "
        </p>
      </section>

      {/* carousel for show demo */}
    </main>
  );
}
