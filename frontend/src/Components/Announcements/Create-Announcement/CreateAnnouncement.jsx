function CreateAnnouncement() {
  return (
    <div>
      <form
        action="submit"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = {
            title: formData.get("title"),
            content: formData.get("content"),
            type: formData.get("type"),
          };
          console.log("Creating announcement:", data);
        }}
      >
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea id="content" name="content" required></textarea>
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <select id="type" name="type" required>
            <option value="General">General</option>
            <option value="Event">Event</option>
            <option value="Organizational Unit">Organizational Unit</option>
            <option value="Position">Position</option>
          </select>
        </div>
        <button type="submit">Create Announcement</button>
      </form>
    </div>
  );
}
export default CreateAnnouncement;
