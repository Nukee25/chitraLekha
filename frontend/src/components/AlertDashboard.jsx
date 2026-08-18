import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1/chitra/alerts/'

const severityClassMap = {
  CRITICAL: 'bg-red-500/20 text-red-300 border-red-500/50',
  HIGH: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
  MEDIUM: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
  LOW: 'bg-green-500/20 text-green-300 border-green-500/50',
}

const getImageSrc = (value) => {
  if (!value) return ''
  if (value.startsWith('data:image')) return value
  return `data:image/jpeg;base64,${value}`
}

export default function AlertDashboard() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const loadAlerts = async () => {
    try {
      setError('')
      const { data } = await axios.get(API_URL)
      setAlerts(Array.isArray(data) ? data : [])
    } catch {
      setError('Failed to fetch alerts from backend API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlerts()
    const poll = setInterval(loadAlerts, 5000)
    return () => clearInterval(poll)
  }, [])

  const cards = useMemo(() => {
    if (!alerts.length) return null

    return alerts.map((alert) => {
      const decision = alert.qwen_decision || {}
      const severity = (decision.severity || 'UNKNOWN').toUpperCase()
      const badgeClasses = severityClassMap[severity] || 'bg-slate-700/70 text-slate-200 border-slate-500/50'
      const isExpanded = expandedId === alert.id

      return (
        <article key={alert.id} className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
          <div className="mb-3 flex items-start justify-between gap-3">
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${badgeClasses}`}>
              {severity}
            </span>
            <p className="text-xs text-slate-400">{new Date(alert.timestamp_utc).toLocaleString()}</p>
          </div>

          <h2 className="text-lg font-semibold text-slate-100">{decision.primary_class || 'Unknown class'}</h2>
          <p className="mt-1 text-sm text-slate-300">Action: {decision.action || 'N/A'}</p>

          {alert.contextual_frame_base64 ? (
            <img
              src={getImageSrc(alert.contextual_frame_base64)}
              alt={`${decision.primary_class || 'hazard'} contextual frame`}
              className="mt-3 h-48 w-full rounded-lg border border-slate-700 object-cover"
            />
          ) : (
            <div className="mt-3 flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-700 text-xs text-slate-500">
              No contextual frame available
            </div>
          )}

          <button
            type="button"
            className="mt-4 rounded-md bg-indigo-500/80 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
            onClick={() => setExpandedId(isExpanded ? null : alert.id)}
          >
            {isExpanded ? 'Hide details' : 'Show details'}
          </button>

          {isExpanded && (
            <div className="mt-4 space-y-4 rounded-lg border border-slate-700 bg-slate-950/60 p-3">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">LLM rationale</p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{decision.rationale || 'No rationale provided.'}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">YOLO metadata</p>
                <pre className="max-h-64 overflow-auto rounded-md bg-black/50 p-2 text-xs text-slate-200">
                  {JSON.stringify(alert.yolo_8_metadata || {}, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </article>
      )
    })
  }, [alerts, expandedId])

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Chitra Hazard Alerts</h1>
        <button
          type="button"
          onClick={loadAlerts}
          className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-slate-400">Loading alerts...</p>}
      {error && <p className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
      {!loading && !alerts.length && !error && (
        <p className="rounded-md border border-slate-700 bg-slate-900/70 p-4 text-slate-300">No hazard alerts yet.</p>
      )}

      {!!alerts.length && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards}</div>}
    </section>
  )
}
