import React from 'react';

export default function AdminTable({ columns, data, onRowClick }) {
  return (
    <div className="admin-grid-container">
      <div className="admin-grid-header">
        {columns.map((column) => (
          <div
            key={column.key}
            className="admin-grid-header-cell"
            style={{ flex: column.flex || 1 }}
          >
            {column.label}
          </div>
        ))}
      </div>
      <div className="admin-grid-body">
        {data.map((row, index) => (
          <div
            key={row._id || index}
            className="admin-grid-row"
            onClick={() => onRowClick && onRowClick(row)}
          >
            {columns.map((column) => (
              <div
                key={column.key}
                className="admin-grid-cell"
                style={{ flex: column.flex || 1 }}
              >
                {column.render ? column.render(row) : row[column.key]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
