import { ServicePageLayout } from "@/components/ServicePageLayout";

const AppDevelopment = () => {
  return (
    <ServicePageLayout
      title="App Development"
      imageUrl="/images/app-dev.png"
    >
      <p>
        Reach your customers wherever they are with a custom mobile application. We specialize in developing intuitive, high-performance mobile apps for both iOS and Android platforms that enhance user engagement and open up new revenue streams.
      </p>
      <h3>Our App Development Process:</h3>
      <ul>
        <li><strong>Strategy & UI/UX Design:</strong> We start by understanding your goals and target audience to create a strategic plan and an intuitive, beautiful user interface.</li>
        <li><strong>Native & Cross-Platform Development:</strong> Whether you need a native app for maximum performance or a cross-platform solution for wider reach and cost-efficiency, we have the expertise to deliver.</li>
        <li><strong>Backend Development & API Integration:</strong> We build secure and scalable backends to power your app and seamlessly integrate with third-party services and APIs.</li>
        <li><strong>Testing & Quality Assurance:</strong> Our rigorous testing process ensures your app is bug-free, stable, and performs flawlessly across all target devices.</li>
        <li><strong>Deployment & Maintenance:</strong> We handle the entire submission process to the Apple App Store and Google Play Store, and offer ongoing maintenance and support to keep your app up-to-date.</li>
      </ul>
      <p>
        Turn your idea into a reality with a mobile app that your users will love.
      </p>
    </ServicePageLayout>
  );
};

export default AppDevelopment;