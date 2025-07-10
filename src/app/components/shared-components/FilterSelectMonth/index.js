import { DatePicker } from "@mui/x-date-pickers";

export const FilterSelectMonth = ({ value, onChange }) => {
  return (
    <DatePicker
      label="Pilih Bulan"
      views={["month"]}
      value={value}
      onChange={onChange}
    />
  );
};
