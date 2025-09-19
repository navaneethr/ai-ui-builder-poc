import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column {
  key: string;
  label: string;
}

interface BasicTableProps {
  data: Array<Record<string, any>>;
  columns: Column[];
  className?: string;
}

export default function BasicTable({
  data,
  columns,
  className = "",
}: BasicTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className={`rounded-md border ${className}`}>
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow className="border-b-0">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className="font-semibold max-w-[300px] border-r border-b last:border-r-0"
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} className="border-b-0">
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className="font-medium max-w-[300px] truncate border-r border-b last:border-r-0"
                >
                  {row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
