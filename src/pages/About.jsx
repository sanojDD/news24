import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./About.css";

const About = () => {
  const formik = useFormik({
    initialValues: { name: "", email: "", message: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      message: Yup.string()
        .min(10, "Must be at least 10 characters")
        .required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/contact",
          values,
        );
        if (response.status === 201) {
          alert("Message sent successfully!");
          resetForm();
        }
      } catch (err) {
        console.error(
          "Submission Error Details:",
          err.response?.data || err.message,
        );

        alert("Failed to send message. Please try again later.");
      }
    },
  });

  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>
          About <span>TukTuk</span>
        </h1>
        <p>A premium short-video platform built for Nepal, by Sanoj_Dev.</p>
      </section>

      <section className="contact-section">
        <h2>Get in Touch</h2>
        <form onSubmit={formik.handleSubmit} className="contact-form">
          <div className="input-group">
            <input
              name="name"
              placeholder="Your Name"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="error">{formik.errors.name}</div>
            ) : null}
          </div>

          <div className="input-group">
            <input
              name="email"
              placeholder="Your Email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="input-group">
            <textarea
              name="message"
              placeholder="How can we help?"
              rows="5"
              {...formik.getFieldProps("message")}
            />
            {formik.touched.message && formik.errors.message ? (
              <div className="error">{formik.errors.message}</div>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="submit-btn"
          >
            {formik.isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default About;
