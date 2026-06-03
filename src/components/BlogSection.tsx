import { Link } from "react-router-dom";
import { useBlog } from "@/hooks/useBlog";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Calendar, User, ArrowRight, Newspaper } from "lucide-react";
import { Button } from "./ui/button";

const BlogSection = () => {
  const { getRecentArticles } = useBlog();
  const recentArticles = getRecentArticles(4);

  // Multi-level parallax
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Each layer moves at a different speed
  const layer1Y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], ["-25%", "25%"]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const layer1X = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const layer2X = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-green-50 via-white to-yellow-50 relative overflow-hidden"
    >
      {/* Multi-Level Parallax Background Layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Layer 1 — slowest, large blobs */}
        <motion.div
          style={{ y: layer1Y, x: layer1X }}
          className="absolute inset-0"
        >
          <div className="absolute top-10 left-[-5%] w-72 h-72 bg-green-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-yellow-300/15 rounded-full blur-3xl" />
        </motion.div>

        {/* Layer 2 — faster, mid-size shapes */}
        <motion.div
          style={{ y: layer2Y, x: layer2X }}
          className="absolute inset-0"
        >
          <div className="absolute top-1/3 right-[8%] w-56 h-56 bg-emerald-400/15 rounded-full blur-2xl" />
          <div className="absolute bottom-1/4 left-[12%] w-48 h-48 bg-amber-400/15 rounded-full blur-2xl" />
          <div className="absolute top-[60%] left-[40%] w-36 h-36 bg-green-200/20 rounded-full blur-xl" />
        </motion.div>

        {/* Layer 3 — subtle base pulse (original blobs kept for familiarity) */}
        <motion.div style={{ y: layer3Y }} className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-200/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Newspaper className="w-8 h-8 text-green-600" />
            <span className="text-green-600 font-semibold text-lg">
              SHOSH NEWS
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest Updates
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Stay informed with the latest news, policies, and stories from the
            Shosholoza Progressive Party
          </p>
        </motion.div>

        {/* Blog Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {recentArticles.map((article, index) => (
            <motion.div key={article.id} variants={itemVariants}>
              <Link to={`/blog/${article.id}`}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full border border-gray-100 group">
                  {/* Gradient Header */}
                  <div className="h-32 bg-gradient-to-br from-green-400 via-green-500 to-yellow-400 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300" />
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-semibold rounded-full shadow-md">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Read More */}
                    <div className="flex items-center text-green-600 font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link to="/blog">
            <Button variant="hero" size="lg" className="group">
              View All Articles
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
