import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useBlog } from "@/hooks/useBlog";
import { motion } from "framer-motion";
import { Calendar, User, Tag, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getArticle } = useBlog();
  const [article, setArticle] = useState(getArticle(id || ""));
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    setArticle(getArticle(id || ""));
  }, [id, getArticle]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h2>
          <Link to="/blog">
            <Button variant="hero">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <Navigation />
      <main className="pt-16">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/blog">
              <Button variant="outline" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Shosh News
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Article Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 pb-20"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* Hero Image/Gradient */}
              <div className="h-64 md:h-96 bg-gradient-to-br from-green-400 via-green-500 to-yellow-400 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-green-700 font-semibold rounded-full shadow-lg inline-block mb-3">
                    {article.category}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-2xl">
                    {article.title}
                  </h1>
                </div>
              </div>

              {/* Meta Information */}
              <div className="p-6 md:p-8 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    <span className="font-medium">{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-green-600" />
                    <span>{article.category}</span>
                  </div>
                </div>
              </div>

              {/* Article Body */}
              <div className="p-6 md:p-8">
                <div className="prose prose-lg max-w-none">
                  {article.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Share Section */}
              <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">Share this article</span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: article.title,
                            text: article.excerpt,
                            url: window.location.href,
                          });
                        }
                      }}
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
