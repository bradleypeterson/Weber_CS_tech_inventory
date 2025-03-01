import { useMemo } from "react";
import { useQuery } from "react-query";
import { fetchDepartments } from "../../api/departments";
import { MultiSelect } from "../../elements/MultiSelect/MultiSelect";
import { useFilters } from "../useFilters";

export function DepartmentFilter() {
  const { data, isLoading } = useQuery("Departments", () => fetchDepartments());
  const { filters, selectedFilters, selectFilter } = useFilters();

  const options = useMemo(() => data?.map((row) => ({ label: row.Name, value: row.DepartmentID })), [data]);

  if (isLoading) return <>Loading</>;
  if (data === undefined || options === undefined) return <></>;

  return (
    <div className="filter-container">
      <p>Department</p>
      <MultiSelect
        options={options}
        values={selectedFilters["Department"] ?? filters["Department"]}
        width="100%"
        placeholder="Select Department"
        onChange={(value) => selectFilter("Department", value)}
      />
    </div>
  );
}
