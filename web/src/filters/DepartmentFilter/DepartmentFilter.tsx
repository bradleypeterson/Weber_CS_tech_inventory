import { useQuery } from "react-query";
import { MultiSelect } from "../../elements/MultiSelect/MultiSelect";

export function DepartmentFilter() {
  const { data, isLoading } = useQuery("Departments", () => [{ label: "CS", value: 1 }]);

  if (isLoading) return <>Loading</>;
  if (data === undefined) return <></>;

  return (
    <div className="filter-container">
      <p>Department</p>
      <MultiSelect options={data} width="100%" placeholder="Select Department" />
    </div>
  );
}
