interface SimpleTableProps {
  title: string;
  columns: string[];
  rows: Array<Array<string | number>>;
}

export function SimpleTable({
  title,
  columns,
  rows,
}: SimpleTableProps): React.JSX.Element {
  const hasRows = rows.length > 0;
  return (
    <section className="panel">
      <header className="panel-head">
        <h3>{title}</h3>
      </header>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hasRows
              ? rows.map((row, index) => (
                  <tr key={`${title}-${index}`}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${title}-${index}-${cellIndex}`}>{cell}</td>
                    ))}
                  </tr>
                ))
              : (
                <tr>
                  <td className="table-empty" colSpan={columns.length}>
                    Aucune donnee disponible pour les filtres selectionnes.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
