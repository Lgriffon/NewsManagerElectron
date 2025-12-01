import React, { useEffect, useMemo, useState } from "react";
import { fetchList } from "../api/apiClient";
import type { Article } from "../components/Article";
import { Link } from "react-router-dom";

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  // Fonction pour appeler l'API
  const loadArticles = async () => {
    try {
      const res = await fetchList(); // appel API réel
      setArticles(res);
    } catch (err) {
      console.error("Erreur API :", err);
      setError("Impossible de charger les articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const categories: Array<{ value: string; label: string }> = [
    { value: "", label: "All" },
    { value: "national", label: "National" },
    { value: "international", label: "International" },
    { value: "sports", label: "Sports" },
    { value: "economy", label: "Economy" },
    { value: "technology", label: "Technology" },
  ];

  const thumbnailUrl = (a: Article): string => {
    if (a.image_media_type && a.image_data) {
      return `data:${a.image_media_type};base64,${a.image_data}`;
    }
    console.log("No image data for article ID:", a.id);
    return "";
  };


  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const byCat = !activeCategory || (a.category || "").toLowerCase() === activeCategory;
      const byQuery =
        !q || [a.title, a.abstract ?? "", a.subtitle ?? ""].some((t) => (t || "").toLowerCase().includes(q));
      return byCat && byQuery;
    });
  }, [articles, activeCategory, query]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>List of Articles</h2>

      {}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        <input
          aria-label="Search"
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              style={{
                padding: "6px 10px",
                borderRadius: 20,
                border: activeCategory === cat.value ? "2px solid #007acc" : "1px solid #ccc",
                background: activeCategory === cat.value ? "#e6f4ff" : "#fff",
                cursor: "pointer",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filteredArticles.length === 0 && (
        <p style={{ textAlign: "center" }}>No article found.</p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredArticles.map((article) => (
          <li
            key={article.id}
            style={{
              background: "#f2f2f2",
              marginBottom: "15px",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <Link
              to={`/${article.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h3>{article.title}</h3>
              {article.subtitle && (
                <p style={{ fontStyle: "italic" }}>{article.subtitle}</p>
              )}
              <p>
                <strong>Catégorie : </strong>
                {article.category}
              </p>
              <p>{article.abstract}</p>

            {thumbnailUrl(article) && (
              <img
                src={thumbnailUrl(article)}
                alt={article.title}
                style={{ maxWidth: "100%", borderRadius: "6px", marginTop: "10px" }}
              />
            )}
              {article.thumbnail_image && article.thumbnail_media_type && (
                <img
                  src={`data:${article.thumbnail_media_type};base64,${article.thumbnail_image}`}
                  alt={article.title}
                  style={{
                    maxWidth: "100%",
                    borderRadius: "6px",
                    marginTop: "10px",
                  }}
                />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
