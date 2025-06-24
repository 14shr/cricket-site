import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function LoadingSkeleton() {
  return (
    <Card className="shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader>
        <Skeleton className="h-6 w-1/2 bg-muted/80" />
        <Skeleton className="h-4 w-full mt-2 bg-muted/80" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-5 w-28 bg-muted/80" /></TableHead>
              <TableHead><Skeleton className="h-5 w-20 bg-muted/80" /></TableHead>
              <TableHead><Skeleton className="h-5 w-24 bg-muted/80" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell><Skeleton className="h-8 w-16 bg-muted/80" /></TableCell>
              <TableCell><Skeleton className="h-8 w-16 bg-muted/80" /></TableCell>
              <TableCell><Skeleton className="h-8 w-16 bg-muted/80" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
