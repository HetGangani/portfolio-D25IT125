import { useState } from "react";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        alert(
            `Thank you, ${formData.name}!\n\nYour message has been submitted successfully.`
        );

        setFormData({
            name: "",
            email: "",
            message: ""
        });
    };

    return (
        <div className="page">
            <h1>Contact Me</h1>

            <form onSubmit={handleSubmit}>

                <label>Name</label><br />
                <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <label>Email</label><br />
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <label>Message</label><br />
                <textarea
                    name="message"
                    placeholder="Enter your message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                ></textarea>

                <br /><br />

                <button type="submit">
                    Send Message
                </button>

            </form>

            <hr />

            <h3>Live Preview</h3>

            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Message:</strong> {formData.message}</p>

        </div>
    );
}

export default Contact;