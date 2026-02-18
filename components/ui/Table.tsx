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
    <div className={`saas-table-wrap ${className}`}>
      <div className="saas-table-scroll">
        <table className="saas-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={column.className ?? ''}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="saas-table-empty">
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
                  <tr key={key}>
                    {columns.map((column) => (
                      <td key={String(column.key)} className={column.className ?? ''}>
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
