import React, { useState } from 'react';

function InstallRun({ installCommand, runCommand }) {
  // If neither command is available, do not render this component
  if (!installCommand && !runCommand) return null;

  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedRun, setCopiedRun] = useState(false);

  const handleCopy = async (text, setCopiedState) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Syntax highlighter mapping function for simple colored shell display
  const highlightCommand = (cmd) => {
    if (!cmd) return null;
    const parts = cmd.split(' ');
    return parts.map((part, index) => {
      // Color package manager commands (npm, yarn, pip, cargo, go)
      if (index === 0 && ['npm', 'yarn', 'pnpm', 'pip', 'cargo', 'go', 'python', 'python3', 'node', 'npm run'].includes(part)) {
        return <span key={index} className="syntax-keyword">{part} </span>;
      }
      // Color subcommands (install, run, dev, start, test)
      if (index === 1 && ['install', 'run', 'i', 'dev', 'start', 'test', 'build'].includes(part)) {
        return <span key={index} className="syntax-subcmd">{part} </span>;
      }
      // Color arguments and flags (e.g. --save, -d)
      if (part.startsWith('-')) {
        return <span key={index} className="syntax-flag">{part} </span>;
      }
      return <span key={index} className="syntax-arg">{part} </span>;
    });
  };

  return (
    <div className="install-run-card card">
      <h3 className="section-title-clean">🚀 Get started in seconds</h3>
      <p className="install-run-desc">Run these commands in your local environment to set up and start the application.</p>

      <div className="commands-grid">
        {installCommand && (
          <div className="command-box">
            <span className="command-label">Installation Command</span>
            <div className="code-container">
              <pre className="code-block monospace">
                <code>{highlightCommand(installCommand)}</code>
              </pre>
              <button 
                onClick={() => handleCopy(installCommand, setCopiedInstall)}
                className={`copy-btn btn ${copiedInstall ? 'copied' : ''}`}
                title="Copy Installation Command"
              >
                {copiedInstall ? (
                  <>
                    <i className="fa-solid fa-check"></i> Copied
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-copy"></i> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {runCommand && (
          <div className="command-box">
            <span className="command-label">Startup Command</span>
            <div className="code-container">
              <pre className="code-block monospace">
                <code>{highlightCommand(runCommand)}</code>
              </pre>
              <button 
                onClick={() => handleCopy(runCommand, setCopiedRun)}
                className={`copy-btn btn ${copiedRun ? 'copied' : ''}`}
                title="Copy Startup Command"
              >
                {copiedRun ? (
                  <>
                    <i className="fa-solid fa-check"></i> Copied
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-copy"></i> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .install-run-card {
          background-color: var(--bg-card);
          padding: 24px;
        }

        .install-run-desc {
          font-size: 0.92rem;
          color: var(--text-secondary);
          margin-top: 4px;
          margin-bottom: 20px;
        }

        .commands-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .commands-grid {
            grid-template-columns: 1fr;
          }
        }

        .command-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .command-label {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }

        .code-container {
          position: relative;
          background-color: #0d1117;
          border: 1px solid #30363d;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          overflow: hidden;
        }

        .code-block {
          margin: 0;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-all;
          flex-grow: 1;
          padding-right: 70px; /* Leave space for copy button */
        }

        .copy-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.8rem;
          padding: 6px 12px;
          background-color: #21262d;
          border: 1px solid #30363d;
          color: #c9d1d9;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .copy-btn:hover {
          background-color: #30363d;
          border-color: #8b949e;
        }

        .copy-btn.copied {
          background-color: rgba(46, 160, 67, 0.15);
          border-color: rgba(46, 160, 67, 0.4);
          color: var(--accent-green);
        }

        /* Monospace font styling */
        .monospace {
          font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
          font-size: 0.9rem;
        }

        /* Code syntax highlights */
        .syntax-keyword {
          color: #ff7b72;
          font-weight: 700;
        }
        .syntax-subcmd {
          color: #79c0ff;
        }
        .syntax-flag {
          color: #a5d6ff;
        }
        .syntax-arg {
          color: #c9d1d9;
        }
      `}</style>
    </div>
  );
}

export default InstallRun;
