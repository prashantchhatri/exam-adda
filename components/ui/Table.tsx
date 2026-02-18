import { type ReactNode } from 'react';

export type TableColumn<T> = {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
};

type TableProps<T extends Record<string, unknown>> = {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((row: T, index: number) => string);
  emptyText?: string;
  className?: string;
};

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  emptyText = 'No records found.',
  className = '',
}: TableProps<T>) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${column.className ?? ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const key =
                  typeof rowKey === 'function'
                    ? rowKey(row, index)
                    : String(row[rowKey] ?? index);
                return (
                  <tr key={key} className="border-t border-slate-200 dark:border-slate-800">
                    {columns.map((column) => (
                      <td key={String(column.key)} className={`px-4 py-3 text-sm text-slate-700 dark:text-slate-200 ${column.className ?? ''}`}>
                        {column.render
                          ? column.render(row)
                          : String(row[column.key as keyof T] ?? '-')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
