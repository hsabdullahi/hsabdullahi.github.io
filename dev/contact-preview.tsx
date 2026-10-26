export default function ContactPreview() {
  return (
    <main id="main" className="shell detail">
      <p className="eyebrow">Development fixture / contact & CV slots</p>
      <h1>
        A place to
        <br />
        <em>connect.</em>
      </h1>
      <p className="preview-notice">
        These slots are placeholders, excluded from production. No contact
        information or CV is implied.
      </p>
      <div className="detail-grid">
        <section>
          <h2>Public contact</h2>
          <p>
            Public email:{" "}
            <span className="mono">your-name@example.invalid</span>
          </p>
          <p>
            Replace with the approved email in content/profile.json to enable a
            real mail link.
          </p>
        </section>
        <section>
          <h2>Curriculum vitae</h2>
          <p>
            Add an approved, referee-free CV file and its metadata to enable
            View and Download actions on About and the footer.
          </p>
          <div className="empty-state">
            <h3>CV file not supplied</h3>
            <p>The download action appears when an approved file exists.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
