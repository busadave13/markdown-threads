import type MarkdownIt from 'markdown-it';

/**
 * markdown-it plugin that transforms mermaid code blocks into
 * zoomable/pannable diagram frames with a toolbar.
 */
export function markdownItMermaid(md: MarkdownIt): void {
  const defaultFence = md.renderer.rules.fence;
  let diagramCounter = 0;

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const info = token.info.trim().toLowerCase();

    if (info === 'mermaid') {
      const dId = 'diagram-' + (diagramCounter++);
      const escaped = md.utils.escapeHtml(token.content);
      return '<div class="mermaid-frame" data-diagram-id="' + dId + '">'
        + '<div class="mermaid-frame-toolbar">'
        + '<span class="diagram-label">&#x1F4CA; Diagram</span>'
        + '<button onclick="zoomDiagram(\'' + dId + '\', -1)" title="Zoom out">&#x2796;</button>'
        + '<span class="zoom-level" id="zoom-label-' + dId + '">100%</span>'
        + '<button onclick="zoomDiagram(\'' + dId + '\', 1)" title="Zoom in">&#x2795;</button>'
        + '<button onclick="resetDiagram(\'' + dId + '\')" title="Reset view">Reset</button>'
        + '</div>'
        + '<div class="mermaid-frame-viewport" id="viewport-' + dId + '">'
        + '<div class="mermaid-frame-content" id="content-' + dId + '">'
        + '<div class="mermaid">' + escaped + '</div>'
        + '</div></div></div>\n';
    }

    // Fall back to default fence rendering for non-mermaid blocks
    if (defaultFence) {
      return defaultFence(tokens, idx, options, env, self);
    }
    return self.renderToken(tokens, idx, options);
  };
}
