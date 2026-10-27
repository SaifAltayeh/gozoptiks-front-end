import { getStore, loadCatalog } from "@/frontend/catalog";

export const metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  await loadCatalog();
  const store = getStore();
  const { contact } = store;

  return (
    <div className="page">
      <div className="contact-grid" data-reveal>
        <div>
          <p className="kicker">Store</p>
          <h1 className="display">{store.wordmark}</h1>
          <p className="body-lg" style={{ marginTop: "1rem" }}>
            {contact.notes}
          </p>
        </div>
        <div className="form" style={{ gap: "1.25rem" }}>
          {contact.addressLines.length ? (
            <div>
              <p className="kicker">Address</p>
              {contact.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {contact.mapUrl ? (
                <p>
                  <a className="text-link" href={contact.mapUrl} target="_blank" rel="noreferrer">
                    Open map
                  </a>
                </p>
              ) : null}
            </div>
          ) : (
            <div>
              <p className="kicker">Address</p>
              <p className="muted">Store address to be confirmed.</p>
            </div>
          )}
          <div>
            <p className="kicker">Phone</p>
            {contact.phone ? (
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
            ) : (
              <p className="muted">Phone number to be confirmed.</p>
            )}
          </div>
          <div>
            <p className="kicker">Email</p>
            {contact.email ? (
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            ) : (
              <p className="muted">Email address to be confirmed.</p>
            )}
          </div>
          <div>
            <p className="kicker">Hours</p>
            <p className="muted">{contact.hours ?? "Opening hours to be confirmed."}</p>
          </div>
          <div>
            <p className="kicker">Social</p>
            {contact.instagram || contact.social.length ? (
              <ul>
                {contact.instagram ? (
                  <li>
                    <a href={contact.instagram} target="_blank" rel="noreferrer">
                      Instagram
                    </a>
                  </li>
                ) : null}
                {contact.social.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Social accounts to be confirmed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
