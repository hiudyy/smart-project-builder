
import React from 'react';

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  // This is a simple markdown parser implementation
  // In a real app, you would use a proper markdown library like react-markdown
  
  const formatMarkdown = (markdown: string): React.ReactNode => {
    // Process headers
    const headerContent = markdown.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>');
    const headerContent2 = headerContent.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold my-3">$1</h2>');
    const headerContent3 = headerContent2.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold my-2">$1</h3>');
    
    // Process lists
    const listContent = headerContent3.replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>');
    const orderedListContent = listContent.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4">$2</li>');
    
    // Process bold and italic
    const boldContent = orderedListContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const italicContent = boldContent.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Process paragraphs
    const paragraphContent = italicContent.replace(/^(?!<[hl]).+$/gm, (match) => {
      if (match.trim() === '') return '';
      return `<p class="my-2">${match}</p>`;
    });
    
    return <div dangerouslySetInnerHTML={{ __html: paragraphContent }} />;
  };
  
  return <div className="prose max-w-none">{formatMarkdown(content)}</div>;
}
