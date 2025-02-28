import { useQuery } from "react-query";
import { MultiSelect } from "../../elements/MultiSelect/MultiSelect";
import { useFilters } from "../useFilters";

export function DepartmentFilter() {
  const { data, isLoading } = useQuery("Departments", () => [{ label: "CS", value: 1 }]);
  const { filters, selectedFilters, selectFilter } = useFilters();
  if (isLoading) return <>Loading</>;
  if (data === undefined) return <></>;

  return (
    <div className="filter-container">
      <p>Department</p>
      <MultiSelect
        options={data}
        values={selectedFilters["Department"] ?? filters["Department"]}
        width="100%"
        placeholder="Select Department"
        onChange={(value) => selectFilter("Department", value)}
      />
    </div>
  );
}
