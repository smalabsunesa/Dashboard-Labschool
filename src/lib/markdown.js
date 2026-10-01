export function escapeHtml(text = '') {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function markdownToHtml(markdown = '') {
  const escaped = escapeHtml(markdown);

  const formatted = escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-700">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-slate-900 underline decoration-dotted underline-offset-4" target="_blank" rel="noopener noreferrer">$1</a>');

  const lines = formatted.split('\n');
  const htmlParts = [];
  let listOpen = false;

  lines.forEach((line) => {
    if (/^\s*[-*]\s+/.test(line)) {
      if (!listOpen) {
        htmlParts.push('<ul class="list-disc pl-5 space-y-1 text-slate-600">');
        listOpen = true;
      }
      htmlParts.push(`<li>${line.replace(/^\s*[-*]\s+/, '')}</li>`);
    } else if (line.trim().length === 0) {
      if (listOpen) {
        htmlParts.push('</ul>');
        listOpen = false;
      }
    } else {
      if (listOpen) {
        htmlParts.push('</ul>');
        listOpen = false;
      }
      htmlParts.push(`<p>${line}</p>`);
    }
  });

  if (listOpen) {
    htmlParts.push('</ul>');
  }

  return htmlParts.join('') || '<p class="text-slate-600">Information coming soon.</p>';
}
