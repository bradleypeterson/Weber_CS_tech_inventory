import { useQuery } from "react-query";
import { MultiSelect } from "../../elements/MultiSelect/MultiSelect";
import { useFilters } from "../useFilters";

export function AssetClassFilter() {
  const { data, isLoading } = useQuery("Asset Classes", () => [{ label: "Printer", value: 1 }]);
  const { filters, selectedFilters, selectFilter } = useFilters();
  if (isLoading) return <>Loading</>;
  if (data === undefined) return <></>;

  return (
    <div className="filter-container">
      <p>Asset Class</p>
      <MultiSelect
        options={data}
        values={selectedFilters["Asset Class"] ?? filters["Asset Class"]}
        width="100%"
        placeholder="Select Asset Class"
        onChange={(value) => selectFilter("Asset Class", value)}
      />
    </div>
  );
}
