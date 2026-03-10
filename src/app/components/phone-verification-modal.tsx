'use client';

export type PhoneVerificationModalProps = {
  open: boolean;
  onVerifyLater?: () => void;
  onVerifyNow?: () => void;
};

export default function PhoneVerificationModal({
  open,
  onVerifyLater,
  onVerifyNow,
}: PhoneVerificationModalProps) {
  if (!open) return null;

  return (
    <div
      className="phone-verification-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="phone-verification-title"
    >
      <div
        className="phone-verification-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="phone-verification-content">
          <h2
            id="phone-verification-title"
            className="phone-verification-title"
          >
            Reminder: Verify your account
          </h2>

          <div className="phone-verification-divider" />

          <p className="phone-verification-body">
            Your account is not verified yet. Verify your phone number in order
            to submit reports and interact with other user reports.
          </p>

          <div className="phone-verification-actions">
            <button
              type="button"
              onClick={onVerifyLater}
              className="phone-verification-button"
            >
              Verify Later
            </button>
            <button
              type="button"
              onClick={onVerifyNow}
              className="phone-verification-button"
            >
              Verify Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
