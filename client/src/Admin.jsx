import React, { useState, useEffect } from 'react';
import './Admin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    BPS: '',
    memberName: '',
    designation: '',
    Branch: '',
    parentId: '',
    childrenIds: [],
    imageLink: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalMessage, setModalMessage] = useState(null); // State for modal message

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/');
      console.log('API Response:', response.data); 
      setMembers(response.data);
    } catch (err) {
      console.error('Error fetching members', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await axios.put(`http://localhost:8080/api/members/${editingId}`, form);
    } else {
      console.log(form);
      await axios.post('http://localhost:8080/api/members', form);
    }
    fetchMembers();
    setForm({
      BPS: '',
      memberName: '',
      designation: '',
      Branch: '',
      parentId: '',
      imageLink: ''
    });
    setEditMode(false);
  };

  const handleEdit = (member) => {
    setForm(member);
    setEditingId(member.id);
    setEditMode(true);
  };

  const handleDelete = async (id, childrenIds) => {
    if (childrenIds && childrenIds.length > 0) {
      setModalMessage('This member has children and cannot be deleted.'); // Show modal with message
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/members/${id}`);
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const closeModal = () => {
    setModalMessage(null); // Close modal
  };

  return (
    <div style={{ top: 0 }}>
      <div style={{ borderColor: '#309e0c', borderStyle: 'solid', backgroundColor: "#E6FFE2", paddingLeft: 300, height: 70, marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: '#309e0c', backgroundColor: "#E6FFE2", fontSize: 35, margin: 0 }}>National Assembly Organization Chart</h2>
        
        <button
          style={{
            height: 40,
            borderRadius: 5,
            border: '1px solid #309e0c',
            marginLeft: 80,
            fontSize: 16,
            backgroundColor: "#309e0c",
            color: '#E6FFE2',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          Go to Chart
        </button>
      </div>

      <div className="admin-container">
        <form onSubmit={handleSubmit}>
          <input type="number" name="BPS" placeholder="BPS" value={form.BPS} onChange={handleChange} />
          <input type="text" name="memberName" placeholder="Member Name" value={form.memberName} onChange={handleChange} required />
          <input type="text" name="designation" placeholder="Designation" value={form.designation} onChange={handleChange} />
          <input type="text" name="Branch" placeholder="Branch" value={form.Branch} onChange={handleChange} />
          <input type="text" name="parentId" placeholder="Parent ID" value={form.parentId} onChange={handleChange} />
          <input type="text" name="imageLink" placeholder="Image Link" value={form.imageLink} onChange={handleChange} />
          <button type="submit">{editMode ? 'Update' : 'Add'} Member</button>
        </form>

        <h2>Members List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>BPS</th>
              <th>Member Name</th>
              <th>Designation</th>
              <th>Branch</th>
              <th>Parent ID</th>
              <th>Children IDs</th>
              <th>Image Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.BPS}</td>
                <td>{member.memberName}</td>
                <td>{member.designation}</td>
                <td>{member.Branch}</td>
                <td>{member.parentId}</td>
                <td>{Array.isArray(member.childrenIds) ? member.childrenIds.join(', ') : member.childrenIds}</td>
                <td>{member.imageLink}</td>
                <td>
                  <button onClick={() => handleEdit(member)}>Edit</button>
                  <button onClick={() => handleDelete(member.id, member.childrenIds)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalMessage && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
