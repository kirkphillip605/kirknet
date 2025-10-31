import { ServicePageLayout } from "@/components/ServicePageLayout";

const MSP = () => {
  return (
    <ServicePageLayout
      title="Managed Service Provider (MSP)"
      imageUrl="/images/msp.png"
    >
      <p>
        Focus on running your business while we handle your IT. As your Managed Service Provider (MSP), we offer proactive, comprehensive IT management and support to keep your systems running smoothly, securely, and efficiently.
      </p>
      <h3>Our Managed Services Include:</h3>
      <ul>
        <li><strong>Proactive Monitoring & Maintenance:</strong> We monitor your systems 24/7 to detect and resolve issues before they become problems, ensuring maximum uptime and productivity.</li>
        <li><strong>Help Desk & User Support:</strong> Our friendly and knowledgeable support team is ready to assist your employees with any technical issues, providing fast and effective solutions.</li>
        <li><strong>Network Management & Security:</strong> We manage and secure your network infrastructure, protecting you from cyber threats with firewalls, antivirus solutions, and regular security audits.</li>
        <li><strong>Data Backup & Disaster Recovery:</strong> We implement robust backup solutions to protect your critical data and ensure business continuity in the event of a disaster.</li>
        <li><strong>Vendor Management:</strong> We act as your single point of contact for all your technology vendors, saving you time and hassle.</li>
      </ul>
      <p>
        Experience peace of mind with reliable, expert IT management from KirkNetworks.
      </p>
    </ServicePageLayout>
  );
};

export default MSP;