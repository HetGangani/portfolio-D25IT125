import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authApi";
import { CheckSquare, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "../components/Icons";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser(formData);

            if (!data.success) {
                setError(data.message || "Invalid credentials. Please try again.");
                return;
            }

            localStorage.setItem("token", data.token);
            navigate("/tasks");
        } catch {
            setError("Unable to connect to backend server. Ensure API is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="saas-auth-card">
            <div className="auth-card-header">
                <div className="auth-brand-badge">
                    <CheckSquare size={24} />
                </div>
                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">
                    Sign in to access your task workspace and cache telemetry.
                </p>
            </div>

            {error && (
                <div className="saas-alert saas-alert-danger" role="alert">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="saas-auth-form">
                {/* Email Field */}
                <div className="saas-field">
                    <label htmlFor="auth-email" className="saas-label">
                        Email Address
                    </label>
                    <div className="saas-input-icon-wrap">
                        <Mail size={18} className="input-icon-left" />
                        <input
                            id="auth-email"
                            type="email"
                            name="email"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="saas-input has-icon-left"
                            autoComplete="email"
                        />
                    </div>
                </div>

                {/* Password Field with Eye Toggle */}
                <div className="saas-field">
                    <div className="label-row-between">
                        <label htmlFor="auth-password" className="saas-label">
                            Password
                        </label>
                    </div>
                    <div className="saas-input-icon-wrap">
                        <Lock size={18} className="input-icon-left" />
                        <input
                            id="auth-password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="••••••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="saas-input has-icon-left has-icon-right"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="input-icon-btn-right"
                            title={showPassword ? "Hide password" : "Show password"}
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Submit Action Button */}
                <button
                    type="submit"
                    disabled={loading || !formData.email || !formData.password}
                    className="saas-btn saas-btn-primary saas-btn-full"
                >
                    {loading ? (
                        <>
                            <span className="saas-btn-spinner" />
                            <span>Authenticating...</span>
                        </>
                    ) : (
                        <>
                            <span>Sign In</span>
                            <ArrowRight />
                        </>
                    )}
                </button>
            </form>

            <div className="auth-card-footer">
                <p className="auth-footer-text">
                    Don't have an account yet?{" "}
                    <Link to="/register" className="auth-link">
                        Create an account
                    </Link>
                </p>
                <div className="auth-security-note">
                    <span>🔒 Secured by JWT Token Authentication & RBAC</span>
                </div>
            </div>
        </div>
    );
}

export default Login;
