'use client';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';

/**
 * Komponen Date Picker reusable
 *
 * @param {string} label - Label yang ditampilkan pada input
 * @param {dayjs.Dayjs | null} value - Nilai tanggal saat ini
 * @param {function} onChange - Fungsi yang dipanggil saat nilai berubah
 * @param {object} textFieldProps - Props tambahan untuk TextField
 */
const SharedComponentDatePicker = ({
  label = 'Tanggal',
  value,
  onChange,
  textFieldProps = {},
}) => {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      format="YYYY-MM-DD"
      slotProps={{
        textField: {
          fullWidth: true,
          variant: 'outlined',
          ...textFieldProps,
        },
      }}
    />
  );
};

export default SharedComponentDatePicker;
