import { useState } from 'react';
import api from '../api/client';

const initialForm = { name: '', email: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null); // null | 'sending' | 'ok' | 'error'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/messages', form);
      setStatus('ok');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="contact">
      <div className="section-label reveal"><span className="section-num">04</span>Get in touch</div>
      <h2 className="glitch reveal" data-text="CONTACT">CONTACT</h2>
      <p className="contact-sub reveal">Available for freelance &amp; collaborations</p>

      <form className="contact-form reveal" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your message"
          value={form.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" className="btn" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </button>
        {status === 'ok' && <div className="form-status ok">Message sent — thank you!</div>}
        {status === 'error' && <div className="form-status err">Something went wrong. Try again.</div>}
      </form>

      <div className="social-links reveal">
        <a href="#">Twitter</a>
        <a href="#">GitHub</a>
        <a href="#">Instagram</a>
        <a href="#">Behance</a>
      </div>
    </section>
  );
}
