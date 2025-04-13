import { useQuery } from "@tanstack/react-query";
import { Template } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function Templates() {
  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ['/api/templates']
  });

  // Group templates by category
  const groupedTemplates = templates?.reduce((groups: Record<string, Template[]>, template) => {
    const category = template.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(template);
    return groups;
  }, {});

  const displayName = (category: string) => {
    switch (category) {
      case 'allgemein': return 'Allgemeine Vorlagen';
      case 'literatur': return 'Literarische Analyse';
      case 'lyrik': return 'Lyrik-Analyse';
      case 'sachtexte': return 'Sachtextanalyse';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-primary">Vorlagen</h1>
        <p className="text-secondary mt-1">Fertige Strukturen für verschiedene Arten von Textanalysen</p>
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
          {groupedTemplates && Object.entries(groupedTemplates).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold text-primary mb-4">{displayName(category)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map(template => (
                  <Link key={template.id} href={`/?template=${template.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-lg text-primary">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-secondary">
                          <h3 className="font-medium mb-1">Struktur:</h3>
                          <ul className="list-disc list-inside mb-2">
                            {(template.details as any).structure.slice(0, 3).map((item: string, index: number) => (
                              <li key={index}>{item}</li>
                            ))}
                            {(template.details as any).structure.length > 3 && <li>...</li>}
                          </ul>
                          <p className="text-xs text-accent">Klicken, um diese Vorlage zu verwenden →</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
