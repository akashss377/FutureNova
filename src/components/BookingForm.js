import { useState } from "react";
import Button from "./Button";
import { company, cities, services } from "../data/siteData";

const emptyForm = { name: "", city: "", service: "", date: "", message: "" };

export default function BookingForm() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const found = {};
    if (!form.name.trim()) found.name = "Enter your name.";
    if (!form.city) found.city = "Choose your city.";
    if (!form.service) found.service = "Choose a service.";
    return found;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // Option 1 (works today): open WhatsApp with the booking details filled in.
    const text = [
      "New booking request",
      `Name: ${form.name}`,
      `City: ${form.city}`,
      `Service: ${form.service}`,
      form.date && `Preferred date: ${form.date}`,
      form.message && `Notes: ${form.message}`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");

    // Option 2 (later, with the Django backend): send the form to your API instead.
    // fetch("http://localhost:8000/api/bookings/", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(form),
    // });

    setSent(true);
    setForm(emptyForm);
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <h2>Book a cleaning</h2>
      <p>Fill in the details and we will confirm on WhatsApp.</p>

      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} autoComplete="name" />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="row g-3">
        <div className="field col-sm-6">
          <label htmlFor="city">City</label>
          <select id="city" name="city" value={form.city} onChange={handleChange}>
            <option value="">Select city</option>
            {cities.map((c) => <option key={c}>{c}</option>)}
          </select>
          {errors.city && <span className="field-error">{errors.city}</span>}
        </div>
        <div className="field col-sm-6">
          <label htmlFor="service">Service</label>
          <select id="service" name="service" value={form.service} onChange={handleChange}>
            <option value="">Select service</option>
            {services.map((s) => <option key={s.id}>{s.title}</option>)}
          </select>
          {errors.service && <span className="field-error">{errors.service}</span>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="date">Preferred date (optional)</label>
        <input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
      </div>

      <div className="field">
        <label htmlFor="message">Anything we should know? (optional)</label>
        <textarea id="message" name="message" rows="3" value={form.message} onChange={handleChange} />
      </div>

      <Button type="submit">Send booking on WhatsApp</Button>
      {sent && (
        <p className="form-success" role="status">
          WhatsApp has opened with your details. Press send there and we will reply soon.
        </p>
      )}
    </form>
  );
}
