import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = import.meta.env.VITE_API_URL;

function App() {
  const [issues, setIssues] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    reportedBy: '',
    status: 'open'
  });

  const fetchIssues = async () => {
    try {
      const res = await axios.get(`${API}/api/issues`);
      setIssues(res.data);
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const issueData = {
      ...form,
      date: new Date().toISOString()
    };

    try {
      const res = await axios.post(`${API}/api/issues`, issueData);
      setIssues((prev) => [...prev, res.data]);
      setForm({
        title: '',
        description: '',
        reportedBy: '',
        status: 'open'
      });
    } catch (err) {
      console.error('Add Error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/issues/${id}`);
      setIssues((prev) => prev.filter((issue) => issue._id !== id));
    } catch (err) {
      console.error('Delete Error:', err);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    try {
      const res = await axios.put(`${API}/api/issues/${id}`, {
        status: newStatus
      });
      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === id ? res.data.issue : issue
        )
      );
    } catch (err) {
      console.error('Update Error:', err);
    }
  };

  return (
    <div className="container">
      <h1>Community Issue Tracker 🛠️</h1>

      <form onSubmit={handleSubmit} className="issue-form">
        <input
          name="title"
          placeholder="Issue Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="reportedBy"
          placeholder="Reported By"
          value={form.reportedBy}
          onChange={handleChange}
          required
        />
        <input
          name="status"
          placeholder="Status"
          value={form.status}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Issue</button>
      </form>

      <ul className="issue-list">
        {issues.map((issue) => (
          <li key={issue._id} className={`issue ${issue.status}`}>
            <h3>{issue.title}</h3>
            <p>{issue.description}</p>
            <p><strong>Reported By:</strong> {issue.reportedBy}</p>
            <p><strong>Date:</strong> {new Date(issue.date).toLocaleString()}</p>
            <p><strong>Status:</strong> {issue.status}</p>
            <button onClick={() => handleStatusToggle(issue._id, issue.status)}>
              Toggle Status
            </button>
            <button onClick={() => handleDelete(issue._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
