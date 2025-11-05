import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

// This function will parse inline markdown like **bold** and *italic* into React elements.
// This is safer than using dangerouslySetInnerHTML.
const parseInlineToReact = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={index}>{part.slice(1, -1)}</em>;
        }
        return part;
      })}
    </>
  );
};


const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  
  const renderTable = (headerLine: string, alignmentLine: string, bodyLines: string[], key: string) => {
    const headers = headerLine.split('|').map(h => h.trim()).filter(Boolean);
    const alignments = alignmentLine.split('|').map(a => {
      const trimmed = a.trim();
      if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
      if (trimmed.endsWith(':')) return 'right';
      return 'left'; // default
    }).filter(Boolean);

    return (
      <div key={key} className="overflow-x-auto my-4 bg-white rounded-xl shadow-md border border-gray-200/80">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-purple-50 text-xs text-brand-purple-dark uppercase">
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  scope="col"
                  className="px-6 py-3 font-bold tracking-wider"
                  style={{ textAlign: alignments[index] || 'left' }}
                >
                  {parseInlineToReact(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyLines.map((row, rowIndex) => (
              <tr key={rowIndex} className={`border-b border-gray-200/80 last:border-b-0 hover:bg-purple-50/60 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}`}>
                {row.split('|').map(cell => cell.trim()).filter(Boolean).map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className="px-6 py-4 text-gray-800"
                    style={{ textAlign: alignments[cellIndex] || 'left' }}
                  >
                    {parseInlineToReact(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let listItems: string[] = [];
    
    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc pl-5 my-3 space-y-1">
            {listItems.map((item, index) => (
              <li key={index}>{parseInlineToReact(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Table check (lookahead one line)
      if (
        line.includes('|') &&
        i + 1 < lines.length &&
        lines[i + 1].includes('|') &&
        /^[|\s-:]+$/.test(lines[i + 1])
      ) {
        flushList();
        const headerLine = line;
        const alignmentLine = lines[i+1];
        const bodyLines: string[] = [];
        i += 2; // Move past header and alignment lines
        while (i < lines.length && lines[i].includes('|')) {
          bodyLines.push(lines[i]);
          i++;
        }
        i--; // Decrement to account for outer loop's increment
        elements.push(renderTable(headerLine, alignmentLine, bodyLines, `table-${i}`));
        continue;
      }
      
      const h3Match = line.match(/^###\s+(.*)/);
      if (h3Match) {
        flushList();
        elements.push(<h3 key={`h3-${i}`} className="text-lg font-semibold mt-4 mb-2">{parseInlineToReact(h3Match[1])}</h3>);
        continue;
      }

      const h2Match = line.match(/^##\s+(.*)/);
      if (h2Match) {
        flushList();
        elements.push(<h2 key={`h2-${i}`} className="text-xl font-bold mt-5 mb-3">{parseInlineToReact(h2Match[1])}</h2>);
        continue;
      }
      
      const h1Match = line.match(/^#\s+(.*)/);
      if (h1Match) {
        flushList();
        elements.push(<h1 key={`h1-${i}`} className="text-2xl font-extrabold mt-6 mb-4">{parseInlineToReact(h1Match[1])}</h1>);
        continue;
      }

      const listItemMatch = line.match(/^\s*[\*\-]\s+(.*)/);
      if (listItemMatch) {
        listItems.push(listItemMatch[1]);
        continue;
      }

      flushList();
      if (line.trim().length > 0) {
        elements.push(<p key={`p-${i}`} className="my-2">{parseInlineToReact(line)}</p>);
      }
    }

    flushList(); // Flush any remaining list items

    return elements;
  };

  return <div className="markdown-content">{renderContent()}</div>;
};

export default MarkdownRenderer;
