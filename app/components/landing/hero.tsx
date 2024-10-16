// Hero Section
const Hero: React.FC = () => (
  <section className="bg-black text-white py-20">
    <div className="container mx-auto px-6">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white  to-black inline-block text-transparent bg-clip-text">
          Send Better Emails faster ..
        </h1>
        <p className="text-xl mb-8 text-gray-400 ">
          Send emails to multiple people at the same time,Send unique AI
          generated proffessional emails with one click.
        </p>
        <div className="flex space-x-4">
          <a
            href="/auth/signup"
            className="bg-white text-black font-bold py-2 px-6 rounded-md text-lg transition duration-300 hover:bg-gray-200"
          >
            Get started
          </a>
          <a
            href="/quickmail"
            className="bg-white text-black font-bold py-2 px-6 rounded-md text-lg transition duration-300 hover:bg-gray-200"
          >
            Try it now
          </a>
        </div>
      </div>
    </div>
  </section>
);
export default Hero;
