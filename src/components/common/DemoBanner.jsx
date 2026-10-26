import { BACKEND_REPO_URL } from "../../lib/config";

export default function DemoBanner() {
  return (
    <div className="demo-banner" role="note">
      <p>
        Read-only demo. Collections load from public Google Sheets. Login and
        editing use the Flask API, which isn&apos;t hosted here; see the{" "}
        <a href={BACKEND_REPO_URL} target="_blank" rel="noreferrer">
          backend repo
        </a>
        .
      </p>
    </div>
  );
}
