import { useState } from "react";
import { Mail, CheckCircle, ArrowRight } from "../components/Icons";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="saas-page-container">
            <div className="saas-page-header">
                <div>
                    <h1 className="saas-page-title">Contact & Feedback</h1>
                    <p className="saas-page-subtitle">
                        Reach out for inquiries, feedback, or collaborations on full-stack web applications.
                    </p>
                </div>
            </div>

            <div className="saas-dashboard-grid">
                {/* Form Card */}
                <div className="saas-card">
                    <div className="card-header-action">
                        <div>
                            <h3 className="card-title">Send a Message</h3>
                            <p className="card-subtitle">Fill in the details below to reach out directly.</p>
                        </div>
                    </div>

                    {submitted && (
                        <div className="saas-alert saas-alert-success" role="alert">
                            <CheckCircle size={18} />
                            <span>
                                Thank you, <strong>{formData.name}</strong>! Your message has been submitted successfully.
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="saas-task-form">
                        <div className="saas-field">
                            <label className="saas-label">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="saas-input"
                            />
                        </div>

                        <div className="saas-field">
                            <label className="saas-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="your.email@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="saas-input"
                            />
                        </div>

                        <div className="saas-field">
                            <label className="saas-label">Message</label>
                            <textarea
                                name="message"
                                placeholder="Type your message here..."
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="saas-textarea"
                            />
                        </div>

                        <div className="form-action-bar">
                            <button type="submit" className="saas-btn saas-btn-primary">
                                <span>Send Message</span>
                                <ArrowRight />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Preview Card & Info */}
                <div className="saas-card">
                    <div className="card-header-action">
                        <div>
                            <h3 className="card-title">Live Message Preview</h3>
                            <p className="card-subtitle">Real-time state binding preview</p>
                        </div>
                    </div>

                    <div className="saas-preview-box">
                        <div className="preview-row">
                            <span className="preview-label">Name:</span>
                            <span className="preview-value">{formData.name || <em className="text-muted">Not specified</em>}</span>
                        </div>

                        <div className="preview-row">
                            <span className="preview-label">Email:</span>
                            <span className="preview-value">{formData.email || <em className="text-muted">Not specified</em>}</span>
                        </div>

                        <div className="preview-row">
                            <span className="preview-label">Message:</span>
                            <p className="preview-message-body">
                                {formData.message || <em className="text-muted">No message typed yet...</em>}
                            </p>
                        </div>
                    </div>

                    <div className="profile-section-divider" />

                    <div className="contact-direct-card">
                        <h4 className="contact-direct-title">Direct Inquiries</h4>
                        <div className="contact-link-item">
                            <Mail size={16} />
                            <a href="mailto:hetgangani08@gmail.com" className="contact-email-link">
                                hetgangani08@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
