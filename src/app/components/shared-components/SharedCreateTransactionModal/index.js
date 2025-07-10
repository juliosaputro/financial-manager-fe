'use client';
import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import dayjs from 'dayjs';
import useCategories from '@/app/hook/useCategories';
import SharedComponentDatePicker from '../SharedComponentDatePicker';

export const SharedCreateTransactionModal = ({ open, columns, onClose, onSubmit, title }) => {
  const {categories} = useCategories();

  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {})
  );

  // Reset values saat modal dibuka ulang
  useEffect(() => {
    if (open) {
      setValues(
        columns.reduce((acc, column) => {
          acc[column.accessorKey ?? ''] =
            column.accessorKey === 'date' ? dayjs() : '';
          return acc;
        }, {})
      );
    }
  }, [open, columns]);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    // Validasi sederhana
    if (!values.description || !values.amount || !values.category || !values.date) {
      alert('Semua field wajib diisi.');
      return;
    }

    const payload = {
      ...values,
      amount: parseInt(values.amount, 10) || 0, // Parse amount ke integer
      date: dayjs(values.date).format('YYYY-MM-DD'), // format sebelum dikirim
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">{title || 'Tambah Transaksi'}</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
              paddingTop: '1rem',
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === 'category') {
                return (
                  <Autocomplete
                    key="category"
                    options={categories.map((cat) => cat.name)}
                    value={values.category || ''}
                    onChange={(_, newValue) =>
                      setValues((prev) => ({ ...prev, category: newValue }))
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Kategori" />
                    )}
                    fullWidth
                  />
                );
              }

              if (column.accessorKey === 'date') {
                return (
                  <SharedComponentDatePicker
                    key="date"
                    label="Tanggal"
                    value={values.date || null}
                    onChange={(newDate) =>
                      setValues((prev) => ({ ...prev, date: newDate }))
                    }
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                );
              }

              if (column.accessorKey === 'amount') {
                return (
                  <TextField
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    type="number" // <-- Mengaktifkan number pad di mobile
                    value={values[column.accessorKey] || ''}
                    onChange={handleChange}
                    InputProps={{
                      // Menambahkan "Rp" untuk konteks
                      startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                    }}
                  />
                );
              }

              return (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  type={column.muiEditTextFieldProps?.type || 'text'}
                  value={values[column.accessorKey] || ''}
                  onChange={handleChange}
                />
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Batal</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};
