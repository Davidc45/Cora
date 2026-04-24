import {
  getCategoryLabel,
  type CommunityResource,
} from './resources-data';

function tryTelHref(phone: string): string | undefined {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `tel:+${digits}`;
  return undefined;
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6.62 10.79a15.91 15.91 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"
        fill="currentColor"
      />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
    </svg>
  );
}

export function ResourceCard({ resource }: { resource: CommunityResource }) {
  const badgeClass = `resources-card__badge resources-card__badge--${resource.category}`;
  const phoneHref = resource.phone ? tryTelHref(resource.phone) : undefined;

  return (
    <article className="resources-card">
      <div className={badgeClass}>{getCategoryLabel(resource.category)}</div>
      <h2 className="resources-card__title">{resource.title}</h2>
      <p className="resources-card__desc">{resource.description}</p>
      <div className="resources-card__actions">
        <a
          href={resource.websiteUrl}
          className="resources-card__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLinkIcon className="resources-card__link-icon" />
          Visit website
        </a>
        {resource.phone ? (
          <div className="resources-card__phone">
            <PhoneIcon className="resources-card__phone-icon" />
            {phoneHref ? (
              <a href={phoneHref} className="resources-card__phone-text">
                {resource.phone}
              </a>
            ) : (
              <span className="resources-card__phone-text">{resource.phone}</span>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}
