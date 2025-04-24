
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

export function DailyPractice() {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Daily Practice</h2>
      <div className="flex flex-col space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <CardTitle>Pronunciation</CardTitle>
            <CardDescription>Complete today's pronunciation exercise</CardDescription>
          </Card>
          <Card className="p-4">
            <CardTitle>Grammar</CardTitle>
            <CardDescription>Learn about present perfect tense</CardDescription>
          </Card>
          <Card className="p-4">
            <CardTitle>Vocabulary</CardTitle>
            <CardDescription>10 new business terms</CardDescription>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DailyPractice;