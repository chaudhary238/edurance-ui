import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Policy } from '@shared/schema';

interface ComparisonReportDisplayProps {
  report: string;
}

export const ComparisonReportDisplay: React.FC<ComparisonReportDisplayProps> = ({ report }) => {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-6 mb-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-md font-semibold mt-4 mb-2" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-outside pl-5 space-y-1 my-2" {...props} />,
          p: ({node, ...props}) => <p className="mb-2" {...props} />,
          table: ({node, ...props}) => <table className="w-full text-sm my-4 border-collapse border border-neutral-300" {...props} />,
          thead: ({node, ...props}) => <thead className="bg-neutral-100" {...props} />,
          th: ({node, ...props}) => <th className="p-2 border border-neutral-300 text-left" {...props} />,
          td: ({node, ...props}) => <td className="p-2 border border-neutral-300" {...props} />,
        }}
      >
        {report}
      </ReactMarkdown>
    </div>
  );
}; 