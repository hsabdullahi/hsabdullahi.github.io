import { ActionIcon } from "@/components/action-icon";
export default function StylePreview() {
  return (
    <main id="main" className="shell detail">
      <p className="eyebrow">Development only / Style reference</p>
      <h1>
        Engineered <em>editorial.</em>
      </h1>
      <p className="lead">Warm paper. Clear type. Space to think.</p>
      <section className="bio-section">
        <h2>Action icon meanings</h2>
        <ul>
          <li>
            <ActionIcon kind="internal" /> Internal page
          </li>
          <li>
            <ActionIcon kind="external" /> External website
          </li>
          <li>
            <ActionIcon kind="download" /> Download a file
          </li>
          <li>
            <ActionIcon kind="scroll" /> Scroll down this page
          </li>
          <li>
            <ActionIcon kind="email" /> Send email
          </li>
        </ul>
      </section>
      <div className="detail-grid">
        <section>
          <h2>Typography & colour</h2>
          <p>
            Georgia display, Arial body and Courier New metadata are documented
            system fallbacks pending licensed font assets.
          </p>
          {["ink", "paper", "surface", "blue", "oxide", "steel", "rule"].map(
            (t) => (
              <div
                key={t}
                style={{ borderBottom: "1px solid var(--rule)", padding: 16 }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: `var(--${t})`,
                    width: 40,
                    height: 24,
                    marginRight: 16,
                    border: "1px solid var(--ink)",
                  }}
                />
                <span className="mono">{t}</span>
              </div>
            ),
          )}
        </section>
        <section>
          <h2>Controls & states</h2>
          <p>
            <a className="button" href="#example">
              Primary action <ActionIcon kind="internal" />
            </a>
          </p>
          <p>
            <a href="#example">Underlined prose link</a>
          </p>
          <label>
            Example search
            <input type="search" aria-label="Example search" />
          </label>
          <div id="example" className="empty-state">
            <h3>No approved resources</h3>
            <p>
              No View or Download action is rendered without a valid resource.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
