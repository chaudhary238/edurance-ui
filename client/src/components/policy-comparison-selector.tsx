import { useState } from 'react';
import { Policy } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface PolicyComparisonSelectorProps {
  policies: Policy[];
  onCompare: (selectedPolicies: Policy[]) => void;
}

export const PolicyComparisonSelector: React.FC<PolicyComparisonSelectorProps> = ({ policies, onCompare }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (policyNumber: string) => {
    setSelected(prev => {
      if (prev.includes(policyNumber)) {
        return prev.filter(p => p !== policyNumber);
      }
      if (prev.length < 2) {
        return [...prev, policyNumber];
      }
      // If 2 are already selected, this new selection replaces the first one.
      return [prev[1], policyNumber];
    });
  };
  
  const handleCompareClick = () => {
    const selectedPolicies = policies.filter(p => selected.includes(p.policyNumber));
    if (selectedPolicies.length === 2) {
      onCompare(selectedPolicies);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Select two policies to compare</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {policies.map(policy => (
                <div 
                    key={policy.policyNumber} 
                    onClick={() => handleSelect(policy.policyNumber)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selected.includes(policy.policyNumber) ? 'border-primary shadow-lg' : 'border-neutral-200'}`}
                >
                    <div className="flex items-start gap-4">
                        <Checkbox 
                            id={policy.policyNumber}
                            checked={selected.includes(policy.policyNumber)}
                            onCheckedChange={() => handleSelect(policy.policyNumber)}
                            className="mt-1"
                        />
                        <div className="flex-1">
                            <label htmlFor={policy.policyNumber} className="font-semibold text-neutral-800 cursor-pointer">{policy.policyName}</label>
                            <p className="text-sm text-neutral-500">{policy.insurerName}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <Button onClick={handleCompareClick} disabled={selected.length !== 2} className="w-full">
            Compare ({selected.length}/2 selected)
        </Button>
    </div>
  );
}; 