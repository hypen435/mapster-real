import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import '../about.css'; // Assume we have some CSS for styling
const FeatureCard = ({ icon, title, description, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ scale: 1.05 }}
      className="feature-card"
    >
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    { icon: "📍", title: "Pinpoint Accuracy", description: "Report issues with precise GPS locations" },
    { icon: "📸", title: "Visual Evidence", description: "Add photos to make reports more compelling" },
    { icon: "🗺️", title: "Interactive Maps", description: "Explore community issues in real-time" },
    { icon: "🤝", title: "Community Power", description: "Collaborate with neighbors to solve problems" }
  ];

  return (
    <section className="stack gap-2xl py-2xl">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.h1 
          className="title gradient-text"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          About Mapster
        </motion.h1>
        <motion.p 
          className="muted lead"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Transforming how communities identify, report, and resolve local issues through collaborative mapping
        </motion.p>
      </motion.div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} index={index} />
        ))}
      </div>

      <motion.div 
        className="cta-section"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cta-button"
        >
          Join Our Community
        </motion.button>
      </motion.div>
    </section>
  );
}