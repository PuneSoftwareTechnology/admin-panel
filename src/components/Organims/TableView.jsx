import React from "react";
import moment from "moment/moment";

const TableView = ({
  data,
  headers,
  onRowClick = () => {},
  onCellClick,
  onDelete,
  columnStyleMap = {},
}) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-600">
          <tr>
            {headers
              .filter((header) => header !== "deleted")
              .map((header, index) => (
                <th key={index} className="px-4 text-white py-2 border">
                  {header}
                </th>
              ))}
            {onDelete && <th className="px-4 text-white py-2 border"></th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={row.id || index}
                className={
                  index % 2 === 0
                    ? "bg-white hover:bg-gray-100 cursor-pointer"
                    : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                }
                onClick={() => onRowClick(row)}
              >
                {Object.keys(row)
                  .filter((key) => key !== "deleted")
                  .map((key, cellIndex) => {
                    const columnName = headers[cellIndex];
                    const ColumnComponent = columnStyleMap[columnName];
                    return (
                      <td
                        key={cellIndex}
                        className="px-4 py-2 border"
                        onClick={(e) => {
                          if (onCellClick) {
                            e.stopPropagation();
                            onCellClick(key, row);
                          }
                        }}
                      >
                        {key === "created_at" ? (
                          moment(row[key]).format("MMM Do YY, h:mm a")
                        ) : ColumnComponent ? (
                          <ColumnComponent value={row[key]} />
                        ) : (
                          row[key]
                        )}
                      </td>
                    );
                  })}
                {!!onDelete && (
                  <td
                    className="px-4 py-2 border text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(row);
                    }}
                  >
                    <span className="bg-red-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
                      Delete
                    </span>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center text-xl font-semibold py-4"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
