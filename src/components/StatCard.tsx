import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  className = "",
}: StatCardProps) {
  return (
    <Card
      className={`w-[150px] h-[100px] rounded-lg p-4 relative ${className}`}
    >
      <CardContent className="p-0 h-full flex flex-col">
        <h3
          className="text-xs font-medium text-muted-foreground truncate"
          title={title}
        >
          {title}
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <p
            className="text-xl font-bold text-foreground text-center truncate"
            title={value}
          >
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
