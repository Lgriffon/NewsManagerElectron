import React, { useEffect, useState } from "react";
import { fetchList } from "../api/apiClient";
import type { Article } from "../components/Article";

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour appeler l'API
  const loadArticles = async () => {
    try {
      const res = await fetchList(151, 0); // appel API réel
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

  if (loading) {
    return <p style={{ textAlign: "center" }}>Chargement...</p>;
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Liste des Articles</h2>

      {articles.length === 0 && (
        <p style={{ textAlign: "center" }}>Aucun article trouvé.</p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {articles.map((article) => (
          <li
            key={article.id}
            style={{
              background: "#f2f2f2",
              marginBottom: "15px",
              padding: "15px",
              borderRadius: "8px",
            }}
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

            {article.image_data && article.image_media_type && (
              <img
                src={`data:${article.image_media_type};base64,${article.image_data}`}
                alt={article.title}
                style={{ maxWidth: "100%", borderRadius: "6px", marginTop: "10px" }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
