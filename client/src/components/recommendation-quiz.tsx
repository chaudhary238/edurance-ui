import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Question = {
    id: string;
    question_text: string;
    question_type: 'text' | 'number' | 'single_select';
    options?: string[];
};

type Answers = {
    [key: string]: string | number;
};

interface RecommendationQuizProps {
    onQuizComplete: (answers: Answers) => void;
}

export function RecommendationQuiz({ onQuizComplete }: RecommendationQuizProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Answers>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await fetch('/api/recommend/questions');
                if (!response.ok) {
                    throw new Error('Failed to load questions.');
                }
                const data = await response.json();
                setQuestions(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchQuestions();
    }, []);

    const handleAnswerChange = (id: string, value: string | number) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        onQuizComplete(answers);
    };

    if (isLoading) {
        return <p>Loading recommendation questions...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Help Us Find Your Perfect Policy</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {questions.map((q) => (
                            <div key={q.id}>
                                <Label htmlFor={q.id} className="text-lg font-medium">{q.question_text}</Label>
                                {q.question_type === 'number' && (
                                    <Input
                                        id={q.id}
                                        type="number"
                                        onChange={(e) => handleAnswerChange(q.id, parseInt(e.target.value, 10))}
                                        className="mt-2"
                                        required
                                    />
                                )}
                                {q.question_type === 'text' && (
                                    <Input
                                        id={q.id}
                                        type="text"
                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                        className="mt-2"
                                        required
                                    />
                                )}
                                {q.question_type === 'single_select' && q.options && (
                                    <RadioGroup
                                        onValueChange={(value) => handleAnswerChange(q.id, value)}
                                        className="mt-2 space-y-2"
                                    >
                                        {q.options.map((option) => (
                                            <div key={option} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                                                <Label htmlFor={`${q.id}-${option}`}>{option}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                )}
                            </div>
                        ))}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Finding...' : 'Find My Policy'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 