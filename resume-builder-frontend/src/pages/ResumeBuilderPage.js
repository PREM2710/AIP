import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import axios from 'axios';

const ResumeBuilderPage = () => {
  const location = useLocation();
  const templateId = new URLSearchParams(location.search).get('template');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    profileImage: null,
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formData).some((val) => !val)) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/resumes/add', formData);
      alert('Resume saved successfully!');
      console.log('Resume saved:', response.data);
    } catch (err) {
      console.error('Error saving resume:', err.response?.data || err.message);
      setError('Failed to save resume. Please try again.');
    }
  };

  const exportToPDF = () => {
    if (Object.values(formData).some((val) => !val)) {
      setError('All fields are required.');
      return;
    }

    const doc = new jsPDF();
    doc.text(`Resume - Template ${templateId}`, 20, 10);
    doc.text(`Name: ${formData.name}`, 20, 20);
    doc.text(`Email: ${formData.email}`, 20, 30);
    doc.text(`Phone: ${formData.phone}`, 20, 40);
    doc.text(`LinkedIn: ${formData.linkedin}`, 20, 50);
    doc.text(`GitHub: ${formData.github}`, 20, 60);
    doc.text(`Summary: ${formData.summary}`, 20, 70);
    doc.text(`Experience: ${formData.experience}`, 20, 90);
    doc.text(`Education: ${formData.education}`, 20, 110);
    doc.text(`Skills: ${formData.skills}`, 20, 130);

    const fileName = `${formData.name.replace(/\s+/g, '_')}_resume.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="resume-builder">
      <h1>Resume - {formData.name}</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleFormSubmit}>
        <label>Name: <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} /></label>
        <label>Email: <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} /></label>
        <label>Phone: <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} /></label>
        <label>LinkedIn: <input type="text" name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleInputChange} /></label>
        <label>GitHub: <input type="text" name="github" placeholder="GitHub URL" value={formData.github} onChange={handleInputChange} /></label>
        <label>Summary: <textarea name="summary" placeholder="Summary or Objective" value={formData.summary} onChange={handleInputChange} /></label>
        <label>Experience: <textarea name="experience" placeholder="Experience Details" value={formData.experience} onChange={handleInputChange} /></label>
        <label>Education: <textarea name="education" placeholder="Education Details" value={formData.education} onChange={handleInputChange} /></label>
        <label>Skills: <textarea name="skills" placeholder="Skills" value={formData.skills} onChange={handleInputChange} /></label>
        <label>Profile Image: <input type="file" name="profileImage" accept="image/*" onChange={handleImageUpload} /></label>

        <button type="submit">Save and Preview</button>
      </form>

      <button onClick={exportToPDF}>Export to PDF</button>

      <div className="resume-preview">
        <h2>Preview</h2>
        <div className="preview-content">
          <h3>{formData.name}</h3>
          <p>Email: {formData.email}</p>
          <p>Phone: {formData.phone}</p>
          <p>LinkedIn: {formData.linkedin}</p>
          <p>GitHub: {formData.github}</p>
          <h4>Summary</h4>
          <p>{formData.summary}</p>
          <h4>Experience</h4>
          <p>{formData.experience}</p>
          <h4>Education</h4>
          <p>{formData.education}</p>
          <h4>Skills</h4>
          <p>{formData.skills}</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;