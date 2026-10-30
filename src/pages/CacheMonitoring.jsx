import { useState, useEffect, useCallback, useRef } from "react";
import { getCacheStats } from "../api";

function CacheMonitoring() {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

    const isMountedRef = useRef(true);

    const fetchStats = useCallback(async (isInitial = false) => {
        if (isInitial) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }
        setError(null);

        try {
            const data = await getCacheStats();

            if (!isMountedRef.current) return;

            if (!data) {
                // 401 redirect handled by api.js handleResponse
                return;
            }

            if (data.success === false) {
                setError(data.message || "Failed to load cache statistics.");
                setStatsData(null);
                return;
            }

            setStatsData(data);
            setLastUpdated(new Date());
        } catch (err) {
            if (!isMountedRef.current) return;
            setError(err.message || "Unable to reach the backend server.");
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, []);

    // Initial load and 5-second automatic refresh with unmount cleanup
    useEffect(() => {
        isMountedRef.current = true;
        fetchStats(true);

        let intervalId = null;
        if (autoRefreshEnabled) {
            intervalId = setInterval(() => {
                fetchStats(false);
            }, 5000);
        }

        return () => {
            isMountedRef.current = false;
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchStats, autoRefreshEnabled]);

    // Calculate Hit Ratio: (Hits / (Hits + Misses)) * 100
    const hits = statsData?.hits ?? 0;
    const misses = statsData?.misses ?? 0;
    const totalRequests = hits + misses;
    const hitRatio = totalRequests > 0
        ? ((hits / totalRequests) * 100).toFixed(1)
        : "0";

    const cachedKeys = statsData?.keys || [];
    const ttl = statsData?.ttl ?? 60;

    return (
        <div className="page cache-monitoring-page">
            <div className="cache-header">
                <div>
                    <h1>⚡ In-Memory Cache Monitoring</h1>
                    <p className="repo-subtitle">
                        Real-time metrics, hit/miss ratios, and key inspection for <code>node-cache</code>.
                    </p>
                </div>

                <div className="cache-controls">
                    <button
                        className="cache-refresh-btn"
                        onClick={() => fetchStats(false)}
                        disabled={loading || refreshing}
                        title="Click to refresh statistics immediately"
                    >
                        {refreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
                    </button>

                    <button
                        className={`cache-toggle-btn ${autoRefreshEnabled ? "active" : ""}`}
                        onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                        title="Toggle 5-second auto-refresh"
                    >
                        {autoRefreshEnabled ? "⏱️ Auto-refresh: ON (5s)" : "⏸️ Auto-refresh: OFF"}
                    </button>
                </div>
            </div>

            {lastUpdated && (
                <div className="cache-status-bar">
                    <span className="cache-status-badge live">
                        ● Backend Connected
                    </span>
                    <span className="cache-timestamp">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                </div>
            )}

            {loading ? (
                <div className="cache-loader-box">
                    <div className="spinner"></div>
                    <p>Loading cache telemetry from backend...</p>
                </div>
            ) : error ? (
                <div className="cache-error-box">
                    <h3>⚠️ Cache Statistics Unavailable</h3>
                    <p>{error}</p>
                    <button
                        className="cache-retry-btn"
                        onClick={() => fetchStats(true)}
                    >
                        Retry Connection
                    </button>
                </div>
            ) : (
                <>
                    {/* Primary Metrics Grid */}
                    <div className="cache-metrics-grid">
                        {/* Hits Card */}
                        <div className="cache-metric-card hits-card">
                            <div className="card-top">
                                <span className="card-label">Total Cache Hits</span>
                                <span className="card-icon">🎯</span>
                            </div>
                            <div className="card-value hits-value">{hits}</div>
                            <div className="card-hint">Requests served directly from RAM</div>
                        </div>

                        {/* Misses Card */}
                        <div className="cache-metric-card misses-card">
                            <div className="card-top">
                                <span className="card-label">Total Cache Misses</span>
                                <span className="card-icon">🔍</span>
                            </div>
                            <div className="card-value misses-value">{misses}</div>
                            <div className="card-hint">Requests querying MongoDB database</div>
                        </div>

                        {/* Cached Keys Count Card */}
                        <div className="cache-metric-card keys-card">
                            <div className="card-top">
                                <span className="card-label">Cached Keys</span>
                                <span className="card-icon">🔑</span>
                            </div>
                            <div className="card-value keys-value">{cachedKeys.length}</div>
                            <div className="card-hint">Active entries stored in memory</div>
                        </div>

                        {/* Hit Ratio Card */}
                        <div className="cache-metric-card ratio-card">
                            <div className="card-top">
                                <span className="card-label">Cache Hit Ratio</span>
                                <span className="card-icon">📈</span>
                            </div>
                            <div className="card-value ratio-value">{hitRatio}%</div>
                            <div className="card-hint">
                                {totalRequests === 0
                                    ? "No cache requests recorded yet"
                                    : `${hits} hits out of ${totalRequests} total requests`}
                            </div>
                        </div>
                    </div>

                    {/* Cache Configuration & Detailed Telemetry */}
                    <div className="cache-details-section">
                        <div className="cache-section-card">
                            <h3>⚙️ Cache Configuration</h3>
                            <div className="cache-config-grid">
                                <div className="config-item">
                                    <span className="config-label">Cache Engine:</span>
                                    <span className="config-val">node-cache (In-Memory)</span>
                                </div>
                                <div className="config-item">
                                    <span className="config-label">Configured TTL:</span>
                                    <span className="config-val highlight">{ttl} seconds</span>
                                </div>
                                <div className="config-item">
                                    <span className="config-label">Automatic Cleanup:</span>
                                    <span className="config-val">Active (Every {Math.max(ttl * 2, 120)}s)</span>
                                </div>
                                <div className="config-item">
                                    <span className="config-label">Endpoint:</span>
                                    <span className="config-val code">GET /tasks/cache/stats</span>
                                </div>
                            </div>
                        </div>

                        {/* Cached Keys List */}
                        <div className="cache-section-card">
                            <div className="keys-header">
                                <h3>🏷️ Currently Cached Keys ({cachedKeys.length})</h3>
                                <span className="keys-subtext">Dynamically tracked in memory</span>
                            </div>

                            {cachedKeys.length === 0 ? (
                                <div className="cache-empty-keys">
                                    <p>📭 No keys are currently stored in cache.</p>
                                    <span className="empty-subtext">
                                        Cache entries expire after {ttl} seconds or are invalidated upon task creation, update, or deletion.
                                    </span>
                                </div>
                            ) : (
                                <div className="cache-key-list">
                                    {cachedKeys.map((key) => {
                                        const isCollection = key === "all_tasks";
                                        return (
                                            <div key={key} className="cache-key-chip">
                                                <span className={`chip-badge ${isCollection ? "badge-collection" : "badge-item"}`}>
                                                    {isCollection ? "Collection" : "Single Task"}
                                                </span>
                                                <code className="chip-key">{key}</code>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CacheMonitoring;

