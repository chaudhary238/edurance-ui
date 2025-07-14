import React from 'react';

interface ChatMessageContentProps {
  content: string | React.ReactNode;
}

export const ChatMessageContent: React.FC<ChatMessageContentProps> = ({ content }) => {
  if (typeof content !== 'string') {
    return <>{content}</>;
  }

  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = (key: string | number) => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={`ul-${key}`} className="list-disc list-outside pl-5 space-y-1 my-2">
          {currentList.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      currentList.push(trimmedLine.substring(2));
    } else {
      flushList(index);
      if (trimmedLine.length > 0) {
        renderedElements.push(<p key={`p-${index}`}>{trimmedLine}</p>);
      }
    }
  });

  flushList('final');

  if (renderedElements.length === 0 && content) {
    return <p>{content}</p>;
  }
  
  return <div>{renderedElements}</div>;
}; 