import { useState, useEffect } from "react";
import { BlogArticle, BlogFormData } from "@/types/blog";

const STORAGE_KEY = "shosh_blog_articles";

const DEFAULT_ARTICLES: BlogArticle[] = [
  {
    id: "1",
    title: "Shosholoza Progressive Party Launches 5 Point Plan",
    excerpt: "Our comprehensive plan to transform South Africa through service delivery, job creation, and anti-corruption measures.",
    content: "The Shosholoza Progressive Party is proud to announce our 5 Point Plan for South Africa. This comprehensive strategy addresses the most pressing issues facing our communities...\n\n1. Quality Service Delivery - Regional management offices for community-based service delivery\n2. Job Creation & Skills - Job Centres in every community with free Wi-Fi and youth training\n3. Zero Tolerance for Corruption - Dismantling municipal corruption networks\n4. Safe & United Communities - Youth Brigades supporting community safety\n5. Reclaim Our Cities - Cleaning cities and supporting local entrepreneurs",
    author: "Shosh Team",
    category: "Policy",
    imageUrl: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
  },
  {
    id: "2",
    title: "Youth Empowerment: Our Vision for the Next Generation",
    excerpt: "Creating opportunities for young South Africans through education, skills development, and meaningful employment.",
    content: "The future of South Africa lies in its youth. Our party is committed to empowering young people through various initiatives including job centers, skills training programs, and youth brigades that instill discipline and purpose...",
    author: "Shosh Team",
    category: "Youth",
    imageUrl: "",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    published: true,
  },
  {
    id: "3",
    title: "Fighting Corruption: A Zero Tolerance Approach",
    excerpt: "Our commitment to dismantling corruption networks and building transparent, accountable governance.",
    content: "Corruption has plagued our municipalities for too long. We are implementing a zero-tolerance approach with local Anti-Corruption Units, lifestyle audits, and prosecution of water tank mafias and tender cartels...",
    author: "Shosh Team",
    category: "Governance",
    imageUrl: "",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    published: true,
  },
  {
    id: "4",
    title: "Community Service Delivery: Putting People First",
    excerpt: "Regional management offices and community cooperatives for efficient service delivery.",
    content: "We are establishing regional management offices that work directly with communities to ensure efficient service delivery. By outsourcing waste management, pothole repairs, and water maintenance to local cooperatives, we create jobs while improving services...",
    author: "Shosh Team",
    category: "Service Delivery",
    imageUrl: "",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    published: true,
  },
];

export const useBlog = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setArticles(JSON.parse(stored));
    } else {
      setArticles(DEFAULT_ARTICLES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ARTICLES));
    }
    setLoading(false);
  }, []);

  const addArticle = (data: BlogFormData) => {
    const newArticle: BlogArticle = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newArticle, ...articles];
    setArticles(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newArticle;
  };

  const updateArticle = (id: string, data: BlogFormData) => {
    const updated = articles.map((article) =>
      article.id === id
        ? { ...article, ...data, updatedAt: new Date().toISOString() }
        : article
    );
    setArticles(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteArticle = (id: string) => {
    const updated = articles.filter((article) => article.id !== id);
    setArticles(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getArticle = (id: string) => {
    return articles.find((article) => article.id === id);
  };

  const getRecentArticles = (limit: number = 4) => {
    return articles
      .filter((article) => article.published)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  };

  const getArticlesByCategory = (category: string) => {
    return articles
      .filter((article) => article.published && article.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return {
    articles,
    loading,
    addArticle,
    updateArticle,
    deleteArticle,
    getArticle,
    getRecentArticles,
    getArticlesByCategory,
  };
};
