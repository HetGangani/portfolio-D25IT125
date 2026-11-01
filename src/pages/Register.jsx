import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authApi";
import { CheckSquare, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from "../components/Icons";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
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

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const data = await registerUser(formData);

            if (!data.success) {
                setError(data.message || "Registration failed.");
                return;
            }

            setMessage("Account created successfully! Redirecting to sign in...");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
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
                <h2 className="auth-title">Create your account</h2>
                <p className="auth-subtitle">
                    Get started with modern task management and development workflows.
                </p>
            </div>

            {message && (
                <div className="saas-alert saas-alert-success" role="alert">
                    <CheckCircle size={18} />
                    <span>{message}</span>
                </div>
            )}

            {error && (
                <div className="saas-alert saas-alert-danger" role="alert">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="saas-auth-form">
                {/* Email Field */}
                <div className="saas-field">
                    <label htmlFor="register-email" className="saas-label">
                        Work Email Address
                    </label>
                    <div className="saas-input-icon-wrap">
                        <Mail size={18} className="input-icon-left" />
                        <input
                            id="register-email"
                            type="email"
                            name="email"
                            placeholder="developer@company.com"
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
                    <label htmlFor="register-password" className="saas-label">
                        Create Password
                    </label>
                    <div className="saas-input-icon-wrap">
                        <Lock size={18} className="input-icon-left" />
                        <input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="At least 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="saas-input has-icon-left has-icon-right"
                            autoComplete="new-password"
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
                            <span>Creating Account...</span>
                        </>
                    ) : (
                        <>
                            <span>Register Account</span>
                            <ArrowRight />
                        </>
                    )}
                </button>
            </form>

            <div className="auth-card-footer">
                <p className="auth-footer-text">
                    Already have an account?{" "}
                    <Link to="/login" className="auth-link">
                        Sign in instead
                    </Link>
                </p>
                <div className="auth-security-note">
                    <span>🛡️ Default user role assigned with least-privilege security</span>
                </div>
            </div>
        </div>
    );
}

export default Register;
