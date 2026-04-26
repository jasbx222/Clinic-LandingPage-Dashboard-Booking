import type { ReactNode } from "react";
import { cn } from "./utils";

interface Column<T> {
  header: string;
  accessor: string | keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T>({ data, columns, className, onRowClick }: TableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-[2rem] border border-border/40 bg-white shadow-soft", className)}>
      <table className="w-full text-right text-sm text-text-primary border-collapse">
        <thead className="bg-bg-soft/50 text-text-muted uppercase text-[10px] font-black tracking-widest border-b border-border/40">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={cn("px-8 py-5", col.className, col.header === 'الإجراءات' && "text-center")}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/20">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-8 py-16 text-center text-text-muted font-bold">
                <div className="flex flex-col items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-bg-soft flex items-center justify-center">
                      <svg className="w-6 h-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                   </div>
                   لا توجد بيانات متاحة حالياً
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  "bg-white hover:bg-primary-light/5 transition-all duration-300 group", 
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={cn("px-8 py-5 whitespace-nowrap", col.className, col.header === 'الإجراءات' && "text-center")}>
                    <div className={cn("text-sm font-medium transition-all group-hover:translate-x-[-2px]", col.header === 'الإجراءات' && "flex justify-center")}>
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor as keyof T] as ReactNode)}
                    </div>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
