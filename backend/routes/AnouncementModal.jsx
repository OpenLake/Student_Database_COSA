import React, { useState } from 'react';
import axios from 'axios';

const CreateAnnouncementModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'General',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/announcements', form);
      onCreated(); // refresh list
      onClose();
    } catch (err) {
      console.error('Error creating announcement:', err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Create Announcement</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="w-full border rounded p-2"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="content"
            placeholder="Content"
            className="w-full border rounded p-2"
            value={form.content}
            onChange={handleChange}
            required
          />
          <select
            name="type"
            className="w-full border rounded p-2"
            value={form.type}
            onChange={handleChange}
          >
            <option value="General">General</option>
            <option value="Event">Event</option>
            <option value="OrganizationalUnit">Organizational Unit</option>
            <option value="Position">Position</option>
          </select>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;
