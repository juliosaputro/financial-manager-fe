import { DatePicker } from "@mui/x-date-pickers";

export const FilterSelectYear = ({ value, onChange }) => {
  return (
    <DatePicker
      label="Pilih Tahun"
      views={["year"]}
      value={value}
      onChange={onChange}
    />
  );
};
