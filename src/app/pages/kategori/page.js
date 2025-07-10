'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_EditActionButtons,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Tooltip,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

import { CreateNewCategoryModal } from '../../components/kategori/CreateNewCategoryModal';
import useCategories from '@/app/hook/useCategories';

// Component for the edit form, to be used in the modal.
// This solves the "Hooks can only be called inside a React function component" error.
const EditCategoryForm = ({ row, table }) => {
  const [formValues, setFormValues] = useState(() => ({
    name: row.original.name ?? '',
    color: row.original.color ?? '#000000',
  }));

  // Update MRT's internal cache whenever formValues change
  useEffect(() => {
    row._valuesCache = { ...row._valuesCache, ...formValues };
  }, [formValues, row]);

  const handleChange = (e) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <DialogTitle textAlign="center">Edit Kategori</DialogTitle>
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
            <TextField label="Nama Kategori" name="name" value={formValues.name} onChange={handleChange} required />
            <Box>
              <InputLabel htmlFor="color-picker-edit" sx={{ mb: 0.5 }}>
                Pilih Warna
              </InputLabel>
              <TextField id="color-picker-edit" type="color" name="color" value={formValues.color} onChange={handleChange} fullWidth />
            </Box>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <MRT_EditActionButtons row={row} table={table} variant="text" />
      </DialogActions>
    </>
  );
};

export default function KategoriPage() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    loading,
    error,
  } = useCategories();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateNewRow = async (values) => {
    try {
      await addCategory(values); // Jangan buat id manual, biarkan backend handle
    } catch (err) {
      console.error('Gagal menambah kategori:', err);
    }
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      try {
        await updateCategory(row.original.id, values);
        exitEditingMode();
      } catch (err) {
        console.error('Gagal memperbarui kategori:', err);
      }
    }
  };

  const handleDeleteRow = useCallback(
    async (row) => {
      if (!confirm(`Yakin ingin menghapus kategori: ${row.getValue('name')}?`)) return;
      try {
        await deleteCategory(row.original.id);
      } catch (err) {
        console.error('Gagal menghapus kategori:', err);
      }
    },
    [deleteCategory]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Nama Kategori',
        muiEditTextFieldProps: { required: true },
        Cell: ({ cell, row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Box
              component="span"
              sx={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: row.original.color || '#ccc', // Fallback color
                border: '1px solid #ddd',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span>{cell.getValue()}</span>
          </Box>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: categories,
    editDisplayMode: 'modal',
    enableEditing: true,
    renderEditRowDialogContent: ({ row, table }) => <EditCategoryForm row={row} table={table} />,
    onEditingRowSave: handleSaveRowEdits,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Hapus">
          <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
        Tambah Kategori
      </Button>
    ),
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-medium">
        <Typography variant="h6">Gagal memuat data: {error}</Typography>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kategori</h1>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <MaterialReactTable table={table} />
      </div>

      <CreateNewCategoryModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
}
