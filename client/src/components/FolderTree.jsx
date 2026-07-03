import React from 'react';

function FolderTree({ folderStructure = [] }) {
  if (!folderStructure || folderStructure.length === 0) return null;

  // Normalize and sort items so they appear in top-down hierarchical tree order
  const sortedItems = [...folderStructure].map(item => {
    // Determine type if missing
    let type = item.type;
    if (!type) {
      type = item.name.endsWith('/') ? 'folder' : 'file';
    }
    return { ...item, type };
  }).sort((a, b) => {
    const aPath = a.name.replace(/\/$/, '');
    const bPath = b.name.replace(/\/$/, '');
    return aPath.localeCompare(bPath, undefined, { numeric: true, sensitivity: 'base' });
  });

  return (
    <div className="folder-tree-card card">
      <h3 className="section-title-clean">📁 Project Structure</h3>
      
      {/* IDE/Terminal container window */}
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <span className="terminal-title">workspace-explorer</span>
        </div>
        
        <div className="terminal-body monospace">
          {sortedItems.map((item, idx) => {
            const cleanName = item.name.replace(/\/$/, '');
            const parts = cleanName.split('/');
            const depth = parts.length - 1;
            const displayName = parts[parts.length - 1] + (item.type === 'folder' || item.name.endsWith('/') ? '/' : '');
            
            // Check if last sibling under the same parent prefix
            const parentPrefix = parts.slice(0, -1).join('/');
            const siblings = sortedItems.filter(x => {
              const xClean = x.name.replace(/\/$/, '');
              const xParts = xClean.split('/');
              const xParent = xParts.slice(0, -1).join('/');
              return xParts.length === parts.length && xParent === parentPrefix;
            });
            
            const isLastSibling = siblings.length > 0 && siblings[siblings.length - 1].name === item.name;
            const treeConnector = depth > 0 ? (isLastSibling ? '└── ' : '├── ') : '';
            
            // Add vertical guide lines
            let verticalGuides = '';
            for (let d = 0; d < depth; d++) {
              // We can determine if the parent folder at depth d has siblings after it
              // For simplicity, we use vertical bars:
              verticalGuides += '│   ';
            }

            const icon = item.type === 'folder' || item.name.endsWith('/') ? '📁' : '📄';

            return (
              <div 
                key={idx} 
                className="tree-row" 
                title={`${item.name}: ${item.purpose}`}
              >
                <span className="tree-guide">{verticalGuides + treeConnector}</span>
                <span className="tree-node-icon">{icon}</span>
                <span className="tree-node-name">{displayName}</span>
                {item.purpose && (
                  <span className="tree-node-purpose"> // {item.purpose}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .folder-tree-card {
          background-color: var(--bg-card);
          padding: 24px;
        }

        .terminal-window {
          background-color: #0d1117;
          border: 1px solid #30363d;
          border-radius: 8px;
          margin-top: 16px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .terminal-header {
          background-color: #161b22;
          border-bottom: 1px solid #30363d;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .terminal-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }

        .dot-red { background-color: #f78166; }
        .dot-yellow { background-color: #e3b341; }
        .dot-green { background-color: #3fb950; }

        .terminal-title {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          color: #8b949e;
          font-weight: 600;
        }

        .terminal-body {
          padding: 20px;
          max-height: 480px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .monospace {
          font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
          font-size: 0.9rem;
        }

        .tree-row {
          display: flex;
          align-items: center;
          white-space: nowrap;
          padding: 2px 4px;
          border-radius: 4px;
          transition: background-color 0.15s ease;
          cursor: help;
        }

        .tree-row:hover {
          background-color: rgba(240, 246, 252, 0.05);
        }

        .tree-guide {
          color: #30363d;
          user-select: none;
          letter-spacing: 0px;
        }

        .tree-node-icon {
          margin-right: 8px;
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
          user-select: none;
        }

        .tree-node-name {
          color: #c9d1d9;
          font-weight: 500;
        }

        .tree-row:hover .tree-node-name {
          color: #58a6ff;
        }

        .tree-node-purpose {
          color: #8b949e;
          font-style: italic;
          margin-left: 16px;
          font-size: 0.85rem;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tree-row:hover .tree-node-purpose {
          color: #acb6c2;
        }
      `}</style>
    </div>
  );
}

export default FolderTree;
