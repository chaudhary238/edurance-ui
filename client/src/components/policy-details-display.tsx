"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PolicyDetails = {
  [key: string]: any;
};

interface PolicyDetailsDisplayProps {
  details: PolicyDetails | null;
}

function DetailSection({ title, content }: { title: string; content: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-semibold text-lg text-neutral-800 mb-2">{title}</h4>
      <div className="text-neutral-700 space-y-2 text-sm">{content}</div>
    </div>
  );
}

export default function PolicyDetailsDisplay({ details }: PolicyDetailsDisplayProps) {
  if (!details) {
    return <p>No details available.</p>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Policy Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(details).map(([key, value]) => {
          if (!value) return null;
          
          let content = null;
          if (typeof value === 'object' && value !== null) {
            content = (
              <ul className="list-disc pl-5 space-y-1">
                {Object.entries(value).map(([subKey, subValue]) => (
                  <li key={subKey}>
                    <span className="font-medium capitalize">{subKey.replace(/_/g, ' ')}:</span> {String(subValue)}
                  </li>
                ))}
              </ul>
            );
          } else {
            content = <p>{String(value)}</p>;
          }
          
          return (
            <DetailSection
              key={key}
              title={key.replace(/_/g, ' ')}
              content={content}
            />
          );
        })}
      </CardContent>
    </Card>
  );
} 