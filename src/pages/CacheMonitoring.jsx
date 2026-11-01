import { useState, useEffect, useCallback, useRef } from "react";
import { getCacheStats } from "../api";
import {
    RefreshCw,
    Database,
    Key,
    TrendingUp,
    BarChart2,
    Clock,
    AlertCircle,
    Layers,
    Shield
} from "../components/Icons";

function CacheMonitoring() {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

    const isMountedRef = useRef(true);

    const fetchStats = useCallback(async (isInitial = false) => {
        if (!isInitial) {
            setRefreshing(true);
        }

        try {
            const data = await getCacheStats();

            if (!isMountedRef.current) return;
            setError(null);

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

        async function loadInitialTelemetry() {
            try {
                const data = await getCacheStats();
                if (!isMountedRef.current || !data) return;

                if (data.success === false) {
                    setError(data.message || "Failed to load cache statistics.");
                    setStatsData(null);
                    return;
                }

                setStatsData(data);
                setLastUpdated(new Date());
            } catch (err) {
                if (isMountedRef.current) {
                    setError(err.message || "Unable to reach the backend server.");
                }
            } finally {
                if (isMountedRef.current) {
                    setLoading(false);
                }
            }
        }

        loadInitialTelemetry();

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
        <div className="saas-page-container">
            {/* Top Header */}
            <div className="saas-page-header">
                <div>
                    <div className="header-badge-row">
                        <span className="saas-pill-admin">
                            <Shield size={12} style={{ marginRight: 4 }} />
                            Admin Console
                        </span>
                    </div>
                    <h1 className="saas-page-title">Cache Monitoring & Telemetry</h1>
                    <p className="saas-page-subtitle">
                        Real-time inspection of in-memory <code>node-cache</code> hits, misses, keys, and expiration TTL.
                    </p>
                </div>

                <div className="saas-header-actions">
                    <button
                        className={`saas-btn saas-btn-secondary ${refreshing ? "loading" : ""}`}
                        onClick={() => fetchStats(false)}
                        disabled={loading || refreshing}
                        type="button"
                        title="Refresh statistics immediately"
                    >
                        <RefreshCw size={16} className={refreshing ? "spin-icon" : ""} />
                        <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                    </button>

                    <button
                        className={`saas-toggle-pill-btn ${autoRefreshEnabled ? "active" : ""}`}
                        onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                        type="button"
                        title="Toggle 5-second auto refresh"
                    >
                        <span className={`pulse-indicator ${autoRefreshEnabled ? "live" : ""}`} />
                        <span>{autoRefreshEnabled ? "Auto-Refresh: 5s" : "Auto-Refresh: Off"}</span>
                    </button>
                </div>
            </div>

            {/* Status Information Bar */}
            {lastUpdated && (
                <div className="saas-status-bar-card">
                    <div className="status-left">
                        <span className="saas-live-badge">
                            <span className="pulse-dot-green" />
                            Backend Telemetry Active
                        </span>
                        <span className="status-divider">•</span>
                        <span className="status-endpoint-tag">
                            GET /tasks/cache/stats
                        </span>
                    </div>

                    <div className="status-right">
                        <Clock size={14} />
                        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                </div>
            )}

            {/* Content Body */}
            {loading ? (
                <div className="saas-card saas-loader-card">
                    <div className="saas-spinner-ring" />
                    <h4>Loading telemetry metrics...</h4>
                    <p>Querying in-memory NodeCache statistics from Express API.</p>
                </div>
            ) : error ? (
                <div className="saas-card saas-error-card">
                    <div className="error-icon-box">
                        <AlertCircle size={32} />
                    </div>
                    <h3>Cache Telemetry Unavailable</h3>
                    <p>{error}</p>
                    <button
                        className="saas-btn saas-btn-primary saas-btn-sm"
                        onClick={() => fetchStats(true)}
                        type="button"
                    >
                        Retry Connection
                    </button>
                </div>
            ) : (
                <>
                    {/* Primary Metrics 4-Card Grid */}
                    <div className="saas-stats-grid">
                        {/* Hits Card */}
                        <div className="saas-stat-card">
                            <div className="stat-card-header">
                                <span className="stat-label">Cache Hits</span>
                                <div className="stat-icon-wrapper stat-icon-emerald">
                                    <TrendingUp size={18} />
                                </div>
                            </div>
                            <div className="stat-value text-emerald">{hits}</div>
                            <div className="stat-footer">
                                <span className="stat-hint">Direct in-memory RAM hits</span>
                            </div>
                        </div>

                        {/* Misses Card */}
                        <div className="saas-stat-card">
                            <div className="stat-card-header">
                                <span className="stat-label">Cache Misses</span>
                                <div className="stat-icon-wrapper stat-icon-amber">
                                    <Database size={18} />
                                </div>
                            </div>
                            <div className="stat-value text-amber">{misses}</div>
                            <div className="stat-footer">
                                <span className="stat-hint">Fallback database queries</span>
                            </div>
                        </div>

                        {/* Cached Keys Card */}
                        <div className="saas-stat-card">
                            <div className="stat-card-header">
                                <span className="stat-label">Tracked Keys</span>
                                <div className="stat-icon-wrapper stat-icon-indigo">
                                    <Key size={18} />
                                </div>
                            </div>
                            <div className="stat-value text-indigo">{cachedKeys.length}</div>
                            <div className="stat-footer">
                                <span className="stat-hint">Active entries stored in memory</span>
                            </div>
                        </div>

                        {/* Hit Ratio Card */}
                        <div className="saas-stat-card">
                            <div className="stat-card-header">
                                <span className="stat-label">Hit Ratio</span>
                                <div className="stat-icon-wrapper stat-icon-blue">
                                    <BarChart2 size={18} />
                                </div>
                            </div>
                            <div className="stat-value">{hitRatio}%</div>
                            <div className="stat-footer">
                                <span className="stat-hint">
                                    {totalRequests === 0
                                        ? "No queries recorded yet"
                                        : `${hits} of ${totalRequests} total requests`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Hit Ratio Progress Visualizer Card */}
                    <div className="saas-card saas-progress-banner">
                        <div className="progress-banner-header">
                            <div>
                                <h3 className="card-title">Cache Efficiency Visualizer</h3>
                                <p className="card-subtitle">
                                    Percentage of read operations fulfilled without querying MongoDB
                                </p>
                            </div>
                            <div className="progress-percentage-pill">
                                <span>{hitRatio}% Hit Rate</span>
                            </div>
                        </div>

                        <div className="saas-progress-track">
                            <div
                                className="saas-progress-bar"
                                style={{ width: `${Math.min(100, Math.max(0, parseFloat(hitRatio) || 0))}%` }}
                                role="progressbar"
                                aria-valuenow={parseFloat(hitRatio) || 0}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            />
                        </div>
                    </div>

                    {/* Detailed Configuration & Keys Grid */}
                    <div className="saas-dashboard-grid">
                        {/* Left: Configuration Card */}
                        <div className="saas-card">
                            <div className="card-header-action">
                                <div>
                                    <h3 className="card-title">Engine Configuration</h3>
                                    <p className="card-subtitle">Active parameters applied in utils/cache.js</p>
                                </div>
                            </div>

                            <div className="saas-config-table">
                                <div className="config-row">
                                    <span className="config-key">Cache Engine</span>
                                    <span className="config-value-badge">node-cache (In-Memory)</span>
                                </div>

                                <div className="config-row">
                                    <span className="config-key">Standard TTL</span>
                                    <span className="config-value-highlight">{ttl} Seconds</span>
                                </div>

                                <div className="config-row">
                                    <span className="config-key">Automatic Cleanup</span>
                                    <span className="config-value">Every {Math.max(ttl * 2, 120)}s</span>
                                </div>

                                <div className="config-row">
                                    <span className="config-key">Invalidation Triggers</span>
                                    <span className="config-value">POST, PUT, DELETE mutations</span>
                                </div>

                                <div className="config-row">
                                    <span className="config-key">Authorization</span>
                                    <span className="config-value-badge admin">Admin Role Required</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Cached Keys Card */}
                        <div className="saas-card">
                            <div className="card-header-action">
                                <div>
                                    <h3 className="card-title">Currently Cached Keys</h3>
                                    <p className="card-subtitle">Active keys stored in RAM ({cachedKeys.length})</p>
                                </div>
                            </div>

                            {cachedKeys.length === 0 ? (
                                <div className="saas-empty-state-compact">
                                    <div className="empty-state-icon">
                                        <Layers size={28} />
                                    </div>
                                    <h4>No active cache keys</h4>
                                    <p>
                                        Keys are populated on <code>GET /tasks</code> and invalidated on mutations.
                                    </p>
                                </div>
                            ) : (
                                <div className="saas-key-chip-list">
                                    {cachedKeys.map((key) => {
                                        const isCollection = key === "all_tasks";
                                        return (
                                            <div key={key} className="saas-key-card-item">
                                                <div className="key-item-left">
                                                    <span className={`key-type-pill ${isCollection ? "collection" : "single"}`}>
                                                        {isCollection ? "Collection" : "Task Item"}
                                                    </span>
                                                    <code className="key-code-string">{key}</code>
                                                </div>
                                                <span className="key-ttl-pill">
                                                    {ttl}s TTL
                                                </span>
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
