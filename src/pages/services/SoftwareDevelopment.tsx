import { ServicePageLayout } from "@/components/ServicePageLayout";

const SoftwareDevelopment = () => {
  return (
    <ServicePageLayout
      title="Software Development"
      imageUrl="/images/software-dev.jpg"
    >
      <p>
        Off-the-shelf software doesn't always fit. We build custom software solutions tailored to your unique business processes, helping you increase efficiency, reduce costs, and gain a competitive edge.
      </p>
      <h3>Our Custom Software Solutions:</h3>
      <ul>
        <li><strong>Enterprise Applications:</strong> We develop large-scale applications to manage your core business operations, from ERP and CRM systems to supply chain management tools.</li>
        <li><strong>API Development & Integration:</strong> We create robust APIs and integrate your systems with third-party services to ensure seamless data flow and functionality across your entire software ecosystem.</li>
        <li><strong>Database Design & Management:</strong> Our experts design and manage efficient, secure, and scalable databases to handle your critical business data.</li>
        <li><strong>Legacy System Modernization:</strong> We can help you update or migrate your outdated systems to modern platforms, improving performance, security, and maintainability.</li>
        <li><strong>Cloud-Based Solutions:</strong> We build and deploy software on cloud platforms like AWS and Azure for maximum scalability, reliability, and cost-effectiveness.</li>
      </ul>
      <p>
        Empower your business with software that is built specifically for you.
      </p>
    </ServicePageLayout>
  );
};

export default SoftwareDevelopment;