/**
 * Convert Tiptap HTML output to Markdown
 * This is a simple converter for common formatting
 */

export function htmlToMarkdown(html: string): string {
  let markdown = html;

  // Headers
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n');
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n');
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n');
  markdown = markdown.replace(/<h4>(.*?)<\/h4>/g, '#### $1\n\n');
  markdown = markdown.replace(/<h5>(.*?)<\/h5>/g, '##### $1\n\n');
  markdown = markdown.replace(/<h6>(.*?)<\/h6>/g, '###### $1\n\n');

  // Bold
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
  markdown = markdown.replace(/<b>(.*?)<\/b>/g, '**$1**');

  // Italic
  markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
  markdown = markdown.replace(/<i>(.*?)<\/i>/g, '*$1*');

  // Strikethrough
  markdown = markdown.replace(/<s>(.*?)<\/s>/g, '~~$1~~');
  markdown = markdown.replace(/<strike>(.*?)<\/strike>/g, '~~$1~~');
  markdown = markdown.replace(/<del>(.*?)<\/del>/g, '~~$1~~');

  // Underline (Markdown doesn't have native underline, use HTML)
  markdown = markdown.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');

  // Links
  markdown = markdown.replace(/<a href="(.*?)".*?>(.*?)<\/a>/g, '[$2]($1)');

  // Images
  markdown = markdown.replace(/<img src="(.*?)" alt="(.*?)".*?>/g, '![$2]($1)');
  markdown = markdown.replace(/<img src="(.*?)".*?>/g, '![]($1)');

  // Code
  markdown = markdown.replace(/<code>(.*?)<\/code>/g, '`$1`');
  markdown = markdown.replace(/<pre><code>(.*?)<\/code><\/pre>/g, '```\n$1\n```\n');

  // Blockquotes
  markdown = markdown.replace(/<blockquote>(.*?)<\/blockquote>/g, (match, content) => {
    return content
      .split('\n')
      .map((line: string) => `> ${line}`)
      .join('\n') + '\n';
  });

  // Lists - Unordered
  markdown = markdown.replace(/<ul>(.*?)<\/ul>/g, (match, content) => {
    const result = content.replace(/<li>(.*?)<\/li>/g, '- $1\n');
    return result + '\n';
  });

  // Lists - Ordered
  markdown = markdown.replace(/<ol>(.*?)<\/ol>/g, (match, content) => {
    let counter = 1;
    const result = content.replace(/<li>(.*?)<\/li>/g, () => {
      return `${counter++}. ${RegExp.$1}\n`;
    });
    return result + '\n';
  });

  // Task Lists
  markdown = markdown.replace(
    /<li data-checked="true".*?>(.*?)<\/li>/g,
    '- [x] $1\n'
  );
  markdown = markdown.replace(
    /<li data-checked="false".*?>(.*?)<\/li>/g,
    '- [ ] $1\n'
  );

  // Paragraphs
  markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n');

  // Line breaks
  markdown = markdown.replace(/<br\s*\/?>/g, '\n');

  // Horizontal rule
  markdown = markdown.replace(/<hr\s*\/?>/g, '\n---\n\n');

  // Clean up extra nested tags and attributes
  markdown = markdown.replace(/<div.*?>(.*?)<\/div>/g, '$1\n');
  markdown = markdown.replace(/<span.*?>(.*?)<\/span>/g, '$1');
  markdown = markdown.replace(/<label.*?>.*?<\/label>/g, '');
  markdown = markdown.replace(/<input.*?>/g, '');

  // Remove any remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '');

  // Clean up excessive newlines
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  markdown = markdown.trim();

  return markdown;
}

/**
 * Convert Markdown to HTML for Tiptap
 * This is a simple converter for common formatting
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^###### (.*?)$/gm, '<h6>$1</h6>');
  html = html.replace(/^##### (.*?)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Strikethrough
  html = html.replace(/~~(.*?)~~/g, '<s>$1</s>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // Images (must come after links)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');

  // Code blocks
  html = html.replace(/```(.*?)```/g, '<pre><code>$1</code></pre>');

  // Inline code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Unordered lists
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>\n?)+/g, '<ul>$&</ul>');

  // Task lists
  html = html.replace(/^- \[x\] (.*?)$/gm, '<li data-checked="true">$1</li>');
  html = html.replace(/^- \[ \] (.*?)$/gm, '<li data-checked="false">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');

  // Blockquotes
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr />');

  // Paragraphs
  html = html.replace(/^(?!<[hou]|<li|<pre|<bl)(.+)$/gm, '<p>$1</p>');

  // Line breaks
  html = html.replace(/\n/g, '<br />');

  return html;
}
