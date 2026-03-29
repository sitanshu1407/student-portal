import { useState, useEffect } from 'react';
import { getAssignments, createAssignment, deleteAssignment, getNotes, createNote, deleteNote } from '../api';

function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    file: null
  });

  const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, notesRes] = await Promise.all([
        getAssignments(),
        getNotes()
      ]);
      setAssignments(assignmentsRes.data);
      setNotes(notesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('subject', formData.subject);
      if (formData.dueDate) data.append('dueDate', formData.dueDate);
      if (formData.file) data.append('file', formData.file);

      if (modalType === 'assignment') {
        await createAssignment(data);
      } else {
        await createNote(data);
      }

      setShowModal(false);
      setFormData({ title: '', description: '', subject: '', dueDate: '', file: null });
      fetchData();
    } catch (err) {
      console.error('Error creating:', err);
      alert(err.response?.data?.msg || 'Error creating item');
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      if (type === 'assignment') {
        await deleteAssignment(id);
      } else {
        await deleteNote(id);
      }
      fetchData();
    } catch (err) {
      console.error('Error deleting:', err);
      alert(err.response?.data?.msg || 'Error deleting item');
    }
  };

  const handleDownload = (filePath, fileName) => {
    const url = `http://localhost:5000/${filePath}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openModal = (type) => {
    setModalType(type);
    setFormData({ title: '', description: '', subject: '', dueDate: '', file: null });
    setShowModal(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <p>Trident Academy of Technology - Student Study Portal</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments ({assignments.length})
        </button>
        <button
          className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes ({notes.length})
        </button>
      </div>

      {isTeacherOrAdmin && (
        <button
          className="btn btn-primary"
          style={{ marginBottom: '1.5rem', maxWidth: '200px' }}
          onClick={() => openModal(activeTab === 'assignments' ? 'assignment' : 'note')}
        >
          + Add {activeTab === 'assignments' ? 'Assignment' : 'Note'}
        </button>
      )}

      {activeTab === 'assignments' && (
        <div className="content-grid">
          {assignments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <h3>No Assignments Yet</h3>
              <p>Assignments will appear here once added by teachers.</p>
            </div>
          ) : (
            assignments.map((assignment) => (
              <div className="content-card" key={assignment._id}>
                <div className="card-header">
                  <h3 className="card-title">{assignment.title}</h3>
                  <span className="card-subject">{assignment.subject}</span>
                </div>
                <p className="card-description">{assignment.description}</p>
                <div className="card-meta">
                  <div>
                    <strong>Due Date:</strong>{' '}
                    <span style={{ color: isOverdue(assignment.dueDate) ? '#ef4444' : 'inherit' }}>
                      {formatDate(assignment.dueDate)}
                      {isOverdue(assignment.dueDate) && ' (Overdue)'}
                    </span>
                  </div>
                  <div>
                    <strong>Posted by:</strong> {assignment.teacher?.name}
                  </div>
                  {assignment.fileName && (
                    <div>
                      <strong>File:</strong> {assignment.fileName}
                    </div>
                  )}
                </div>
                <div className="card-actions">
                  {assignment.filePath && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleDownload(assignment.filePath, assignment.fileName)}
                    >
                      📥 Download
                    </button>
                  )}
                  {isTeacherOrAdmin && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(assignment._id, 'assignment')}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="content-grid">
          {notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No Notes Yet</h3>
              <p>Study notes will appear here once added by teachers.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div className="content-card" key={note._id}>
                <div className="card-header">
                  <h3 className="card-title">{note.title}</h3>
                  <span className="card-subject">{note.subject}</span>
                </div>
                <p className="card-description">{note.description}</p>
                <div className="card-meta">
                  <div>
                    <strong>Posted by:</strong> {note.teacher?.name}
                  </div>
                  <div>
                    <strong>Date:</strong> {formatDate(note.createdAt)}
                  </div>
                  {note.fileName && (
                    <div>
                      <strong>File:</strong> {note.fileName}
                    </div>
                  )}
                </div>
                <div className="card-actions">
                  {note.filePath && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleDownload(note.filePath, note.fileName)}
                    >
                      📥 Download
                    </button>
                  )}
                  {isTeacherOrAdmin && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(note._id, 'note')}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add {modalType === 'assignment' ? 'Assignment' : 'Note'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={`Enter ${modalType === 'assignment' ? 'assignment' : 'note'} title`}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Mathematics, Physics"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  required
                />
              </div>

              {modalType === 'assignment' && (
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Upload File (Optional)</label>
                <div className="file-upload">
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                  />
                  <label htmlFor="file" className="file-upload-label">
                    <span className="file-upload-icon">📁</span>
                    <span>Click to upload file</span>
                  </label>
                  {formData.file && <div className="file-name">✓ {formData.file.name}</div>}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add {modalType === 'assignment' ? 'Assignment' : 'Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
