import { Blueprint } from '../../../shared/components/Blueprint.jsx';

export function CertificateForm({ name, onNameChange, onDownload }) {
  const trimmed = name.trim();

  return (
    <Blueprint className="certificate-form">
      <h4>Your certificate</h4>
      <p className="body-note">Download an image with your XP, level and badges to share what you learned.</p>
      <label className="certificate-form__label">
        Name on the certificate
        <input
          className="input certificate-form__input"
          type="text"
          maxLength={40}
          placeholder="Your name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
        />
      </label>
      <div>
        <Blueprint
          as="button"
          type="button"
          onClick={() => trimmed && onDownload(trimmed)}
          disabled={!trimmed}
          className="btn btn-primary btn-tall btn-wide"
        >
          Download certificate (PNG)
        </Blueprint>
      </div>
    </Blueprint>
  );
}
