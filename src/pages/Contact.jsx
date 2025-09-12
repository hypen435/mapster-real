import { useState } from "react";
import "../contact.css"

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!form.name || !form.email || !form.message) {
      setError("Please fill out all required fields.");
      return;
    }

    setError("");
    setSubmitted(true);
  };

  return (
    <section className="contact-section">
      <h1 className="title">Contact Us</h1>
      <p className="subtitle">
        Fill out the form below and we’ll get back to you shortly.
      </p>

      {submitted ? (
        <div className="notice success">
          ✅ Thanks {form.name}! We’ll reach out to you soon.
        </div>
      ) : (
        <form className="contact-form" onSubmit={onSubmit}>
          {error && <div className="notice error">{error}</div>}

          <div className="form-grid">
            <label className="field">
              <span>Name*</span>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Jane Doe"
                required
              />
            </label>

            <label className="field">
              <span>Email*</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="jane@email.com"
                required
              />
            </label>

            <label className="field">
              <span>Phone</span>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={onChange}
                placeholder="+91 98765 43210"
              />
            </label>
          </div>

          <label className="field full">
            <span>Message*</span>
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              rows="5"
              placeholder="How can we help?"
              required
            />
          </label>

          <button className="btn primary" type="submit">
            Send Message
          </button>
        </form>
      )}
    </section>
  );
}
