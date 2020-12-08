import { motion } from "framer-motion";
import cool from "../assets/img/cool.png";
import "../styles/Home.styles.scss";

const HomePage: React.FC = () => {
  const product = "cool";
  return (
    <motion.div
      exit={{ opacity: 0, x: "-100vw", scale: 0.8 }}
      initial={{ opacity: 0, x: "-100vw", scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "tween", ease: "anticipate", duration: 1 }}
      className="cool-id"
    >
      <h1>Hello World</h1>
      <a href="/about">Go to About</a>
      {/* <a href="/about">
        <motion.img
          layoutId={product}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          src={cool}
          alt="COOL"
        />
      </a> */}
    </motion.div>
  );
};

export default HomePage;
