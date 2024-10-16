// Features Section

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}
const Features: React.FC = () => (
  <section id="features" className="py-20 bg-black">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FeatureCard
          icon="📧"
          title="AI Generated Mails"
          description="Get Ai generated emails with one click"
        />
        <FeatureCard
          icon="⚡"
          title="Faster Bulk Mails"
          description="Send unique emails to multiple people"
        />
      </div>
    </div>
  </section>
);

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="relative z-10 overflow-hidden rounded-xl border border-zinc-950 p-[1px]">
    <div className="animate-rotate absolute inset-0 h-full w-full rounded-full bg-[conic-gradient(white_20deg,transparent_120deg)] opacity-30"></div>
    <div className="relative z-20 flex flex-col h-full rounded-[0.60rem] bg-black p-6">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </div>
);
export default Features;
