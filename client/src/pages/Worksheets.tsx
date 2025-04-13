import { useQuery } from "@tanstack/react-query";
import { Worksheet } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

export default function Worksheets() {
  const [, setLocation] = useLocation();
  const { data: worksheets, isLoading } = useQuery<Worksheet[]>({
    queryKey: ['/api/worksheets']
  });

  // Group worksheets by category
  const groupedWorksheets = worksheets?.reduce((groups: Record<string, Worksheet[]>, worksheet) => {
    const category = worksheet.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(worksheet);
    return groups;
  }, {});

  const displayName = (category: string) => {
    switch (category) {
      case 'basis': return 'Grundlagen';
      case 'fortgeschritten': return 'Fortgeschrittene Techniken';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-primary">Arbeitsblätter</h1>
        <p className="text-secondary mt-1">Hilfreiche Ressourcen für die Textanalyse und Inhaltsangabe</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedWorksheets && Object.entries(groupedWorksheets).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold text-primary mb-4">{displayName(category)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map(worksheet => (
                  <Card 
                    key={worksheet.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setLocation(`/worksheets/${worksheet.id}`)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">{worksheet.title}</CardTitle>
                      <CardDescription>{worksheet.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-secondary">
                        {(worksheet.content as any).sections?.slice(0, 2).map((section: any, index: number) => (
                          <div key={index} className="mb-2">
                            <p className="font-medium">{section.title}</p>
                            {section.text && <p className="truncate">{section.text}</p>}
                            {section.items && (
                              <p>{section.items.slice(0, 2).join(', ')}...</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
