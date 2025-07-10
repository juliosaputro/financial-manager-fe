'use client';
import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Stack,
  TextField,
  Box,
} from '@mui/material';

export const CreateNewCategoryModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState({});

  // Reset form state when the modal is opened
  useEffect(() => {
    if (open) {
      const initialValues = columns.reduce((acc, column) => {
        if (column.accessorKey) {
          acc[column.accessorKey] = '';
        }
        return acc;
      }, {});
      initialValues.color = '#000000'; // Default color
      setValues(initialValues);
    }
  }, [open, columns]);

  const handleChange = (e) => {
    setValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Tambah Kategori Baru</DialogTitle>
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
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                value={values[column.accessorKey] || ''}
                onChange={handleChange}
              />
            ))}
            <Box>
              <InputLabel htmlFor="color-picker" sx={{ mb: 0.5 }}>
                Pilih Warna
              </InputLabel>
              <TextField
                id="color-picker"
                type="color"
                name="color"
                value={values.color || '#000000'}
                onChange={handleChange}
                fullWidth
              />
            </Box>
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