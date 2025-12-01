import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchDetail } from '../api/apiClient.ts'
import type { Article } from '../components/Article.tsx'
 
export default function DetailPage() {
  const { id = '' } = useParams()
  const [data, setData] = useState<Article | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const res = await fetchDetail(id)
        if (!cancelled) setData(res)
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (id) load()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) return <p style={{ padding: 16 }}>Loading…</p>
  if (error) return <p style={{ color: 'crimson', padding: 16 }}>Error: {String(error)}</p>
  if (!data) return null

  if(data){
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
            <Link to="/">← Back to list</Link>

            <article style={{ marginTop: 20 }}>
            {/* Image si présente */}
            {data.image_data && (
                <img
                src={`data:${data.image_media_type};base64,${data.image_data}`}
                alt={data.title}
                style={{
                    width: '50%',
                    height: 'auto',
                    borderRadius: 8,
                    marginBottom: 16,
                }}
                />
            )}

            {/* Titre */}
            <h1 style={{ marginBottom: 4 }}>{data.title}</h1>

            {/* Sous-titre éventuel */}
            {data.subtitle && (
                <h2 style={{ marginTop: 0, opacity: 0.8, fontSize: '1.1rem' }} dangerouslySetInnerHTML={{ __html: data.subtitle }}>
                </h2>
            )}

            {/* Catégorie */}
            <p style={{ fontStyle: 'italic', color: '#555', marginTop: 8 }}>
                Category: {data.category}
            </p>

            {/* Auteur */}
            <p style={{ marginTop: 4, color: '#666' }}>
                By <strong>{data.username}</strong>
            </p>

            {/* Date de mise à jour */}
            {data.update_date && (
                <p style={{ marginTop: 4, color: '#777' }}>
                Updated: {new Date(data.update_date).toLocaleDateString()}
                </p>
            )}

            {/* Abstract */}
            <p style={{ marginTop: 16, fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: data.abstract }}></p>

            {/* Corps de l'article */}
            {data.body && (
                <div
                style={{
                    marginTop: 16,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                }}
                dangerouslySetInnerHTML={{ __html: data.body }}
                >
                </div>
            )}
            </article>
        </main>
    )}

}