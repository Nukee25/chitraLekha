import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

const severityColorMap = {
  CRITICAL: 'bg-red-600/90 text-red-50',
  HIGH: 'bg-orange-500/90 text-orange-50',
  MEDIUM: 'bg-yellow-500/90 text-yellow-950',
  LOW: 'bg-sky-600/90 text-sky-50',
}

function normalizeImageSource(base64) {
  if (!base64) return ''
  if (base64.startsWith('data:image')) return base64
  return `data:image/jpeg;base64,${base64}`
}

export default function AlertDashboard() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedAlertId, setExpandedAlertId] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchAlerts() {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/v1/chitra/alerts/`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch alerts (${response.status})`)
        }

        const data = await response.json()
        setAlerts(Array.isArray(data) ? data : [])
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Could not fetch alerts')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()

    return () => controller.abort()
  }, [])

  const renderedContent = useMemo(() => {
    if (loading) {
      return <p className="text-slate-300">Loading alerts...</p>
    }

    if (error) {
      return <p className="text-red-300">{error}</p>
    }

    if (!alerts.length) {
      return <p className="text-slate-300">No alerts yet.</p>
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {alerts.map((alert) => {
          const qwenDecision = alert.qwen_decision ?? {}
          const severityRaw = qwenDecision.severity || 'UNKNOWN'
          const severity = String(severityRaw).toUpperCase()
          const badgeStyle = severityColorMap[severity] ?? 'bg-slate-600 text-slate-100'
          const isExpanded = expandedAlertId === alert.id

          return (
            <article
              key={alert.id}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle}`}>
                  {severity}
                </span>
                <time className="text-xs text-slate-400">
                  {new Date(alert.timestamp_utc).toLocaleString()}
                </time>
              </div>

              <h2 className="text-lg font-semibold text-slate-50">
                {qwenDecision.primary_class || alert.event_type || 'Unknown event'}
              </h2>
              <p className="mt-1 text-sm text-slate-200">
                Action: <span className="font-medium">{qwenDecision.action || 'N/A'}</span>
              </p>

              <img
                src={normalizeImageSource(alert.contextual_frame_base64)}
                alt={qwenDecision.primary_class || 'Hazard frame'}
                className="mt-3 h-48 w-full rounded-lg object-cover"
              />

              <button
                type="button"
                className="mt-4 w-full rounded-md border border-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-800"
                onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
              >
                {isExpanded ? 'Hide details' : 'Show details'}
              </button>

              {isExpanded && (
                <div className="mt-3 space-y-3 rounded-md bg-slate-950/80 p-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">LLM rationale</h3>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-300">
                      {qwenDecision.rationale || 'No rationale available.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">YOLO metadata</h3>
                    <pre className="mt-1 max-h-48 overflow-auto rounded bg-slate-900 p-2 text-xs text-slate-300">
                      {JSON.stringify(alert.yolo_8_metadata ?? {}, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    )
  }, [alerts, error, expandedAlertId, loading])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">Chitra CCTV Hazard Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">Real-time alert feed from the hazard inference pipeline.</p>
      </header>
      {renderedContent}
    </main>
  )
}
