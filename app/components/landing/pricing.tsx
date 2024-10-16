// Pricing Section

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}
const Pricing: React.FC = () => (
  <section id="pricing" className="py-20 bg-black text-white">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-12 ">
        Simple, usage-based pricing
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        <PricingCard
          title="Free"
          price="$0"
          description="free for all with limited usage"
          features={["send 20 mails as bulk", "generate Quick mails"]}
          highlighted={true}
        />
        {/* <PricingCard
            title="Free"
            price="$0"
            description="free for all with limited usage"
            features={["send 20 mails as bulk", "generate Quick mails"]}
            highlighted={false}
          /> */}
      </div>
    </div>
  </section>
);

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  description,
  features,
  highlighted,
}) => (
  <div className="relative z-10 overflow-hidden rounded-xl border border-gray-900 p-[1.5px]">
    <div className="animate-rotate absolute inset-0 h-full w-full rounded-full bg-[conic-gradient(blue_20deg,transparent_120deg)] opacity-30"></div>
    <div
      className={`relative z-20 flex flex-col h-full rounded-[0.60rem] ${
        highlighted ? "bg-gray-950" : "bg-black"
      } p-8`}
    >
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <p className="text-4xl font-bold mb-6">
        {price}
        <span className="text-xl font-normal">{period}</span>
      </p>
      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <a
        href="#"
        className={`mt-auto block text-center ${
          highlighted
            ? "bg-white text-blue-600 hover:bg-gray-100"
            : "bg-gray-800 hover:bg-gray-700 text-white"
        } font-bold py-2 px-4 rounded-md transition duration-300`}
      >
        {highlighted ? "Start Free Trial" : "Get Started"}
      </a>
    </div>
  </div>
);
export default Pricing;
