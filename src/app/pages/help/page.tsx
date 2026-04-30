import '@/app/styles/privacy.css';

export default function HelpPage() {
  return (
    <div className="privacy-page">
      <div className="privacy-shell">
        <header className="privacy-header">
          <p className="privacy-kicker">Cora Student Project</p>
          <h1>App Help</h1>
          <p className="privacy-intro">
            Install Cora on your device for faster access from your home screen or desktop.
          </p>
        </header>

        <main className="privacy-content">
          <section className="privacy-section">
            <h2>Android (Chrome)</h2>
            <ol>
              <li>Open Cora in Chrome.</li>
              <li>Tap the three-dot menu in the top-right corner.</li>
              <li>Select <strong>Add to Home screen</strong> or <strong>Install app</strong>.</li>
              <li>Confirm by tapping <strong>Install</strong> / <strong>Add</strong>.</li>
              <li>Launch Cora from your home screen like a normal app.</li>
            </ol>
          </section>

          <section className="privacy-section">
            <h2>iPhone / iPad (Safari)</h2>
            <ol>
              <li>Open Cora in Safari (not Chrome or in-app browsers).</li>
              <li>Tap the <strong>Share</strong> button.</li>
              <li>Scroll and tap <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong> in the top-right corner.</li>
              <li>Open Cora from your home screen.</li>
            </ol>
          </section>

          <section className="privacy-section">
            <h2>Windows (Chrome or Edge)</h2>
            <ol>
              <li>Open Cora in Chrome or Microsoft Edge.</li>
              <li>Look for the install icon in the address bar (screen + plus icon).</li>
              <li>
                Click the icon and choose <strong>Install</strong>, or use the browser menu and
                select <strong>Install Cora</strong>.
              </li>
              <li>Pin it to Taskbar/Start if desired for quick access.</li>
            </ol>
          </section>

          <section className="privacy-section">
            <h2>macOS (Safari or Chrome)</h2>
            <p>
              <strong>Safari (macOS Sonoma or newer):</strong>
            </p>
            <ol>
              <li>Open Cora in Safari.</li>
              <li>In the menu bar, choose <strong>File &gt; Add to Dock</strong>.</li>
              <li>Confirm to create a Dock app shortcut.</li>
            </ol>
            <p>
              <strong>Chrome:</strong>
            </p>
            <ol>
              <li>Open Cora in Chrome.</li>
              <li>Click the install icon in the address bar, then click <strong>Install</strong>.</li>
            </ol>
          </section>

          <section className="privacy-section">
            <h2>Troubleshooting</h2>
            <ul>
              <li>If install options are missing, refresh the page and try again.</li>
              <li>Make sure you are using a supported browser version.</li>
              <li>On iOS, installation works only through Safari.</li>
              <li>
                If the app looks outdated after install, close it and reopen from browser once to
                refresh cached assets.
              </li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
