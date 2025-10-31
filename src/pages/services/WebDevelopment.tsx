import { ServicePageLayout } from "@/components/ServicePageLayout";

const WebDevelopment = () => {
  return (
    <ServicePageLayout
      title="Web Development"
      imageUrl="/images/web-dev.jpeg"
    >
      <p>
        Your website is often the first impression potential customers have of your business. We build modern, responsive, and high-performing websites that not only look great but also drive engagement and conversions.
      </p>
      <h3>Our Web Development Services:</h3>
      <ul>
        <li><strong>Custom Website Design:</strong> We create unique, visually appealing designs that reflect your brand identity and provide an exceptional user experience (UX).</li>
        <li><strong>Responsive Development:</strong> Our websites are fully responsive, ensuring a seamless experience across all devices, from desktops to smartphones.</li>
        <li><strong>E-Commerce Solutions:</strong> We build robust online stores with secure payment gateways, inventory management, and user-friendly interfaces to help you sell more online.</li>
        <li><strong>Content Management Systems (CMS):</strong> We empower you to manage your website content easily with powerful and intuitive CMS platforms like WordPress, Shopify, or custom solutions.</li>
        <li><strong>Web Application Development:</strong> For more complex needs, we develop powerful web applications that streamline your business processes and deliver value to your users.</li>
      </ul>
      <p>
        Let's build a website that becomes your most valuable marketing asset and a powerful tool for business growth.
      </p>
    </ServicePageLayout>
  );
};

export default WebDevelopment;