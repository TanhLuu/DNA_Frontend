import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import axios from 'axios';

const SampleTypeManagementPopup = ({ open, onClose }) => {
  const [sampleTypes, setSampleTypes] = useState([]);
  const [newSampleType, setNewSampleType] = useState('');
  const [editingSampleType, setEditingSampleType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = '/api/sample-types';

  const fetchSampleTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setSampleTypes(response.data);
    } catch (err) {
      setError('Lỗi khi lấy danh sách loại mẫu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchSampleTypes();
    }
  }, [open]);

  const handleAdd = async () => {
    if (!newSampleType.trim()) {
      setError('Tên loại mẫu không được để trống');
      return;
    }
    try {
      await axios.post(API_URL, { sampleType: newSampleType });
      setNewSampleType('');
      setError('');
      fetchSampleTypes();
    } catch (err) {
      setError('Lỗi khi thêm loại mẫu: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (sampleType) => {
    setEditingSampleType(sampleType);
    setNewSampleType(sampleType.sampleType);
  };

  const handleUpdate = async () => {
    if (!newSampleType.trim()) {
      setError('Tên loại mẫu không được để trống');
      return;
    }
    try {
      await axios.put(`${API_URL}/${editingSampleType.id}`, { sampleType: newSampleType });
      setNewSampleType('');
      setEditingSampleType(null);
      setError('');
      fetchSampleTypes();
    } catch (err) {
      setError('Lỗi khi cập nhật loại mẫu: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa loại mẫu này?');
    if (!confirmed) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchSampleTypes();
    } catch (err) {
      setError('Lỗi khi xóa loại mẫu: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Quản lý loại mẫu</DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: '20px' }}>
          <TextField
            label="Tên loại mẫu"
            value={newSampleType}
            onChange={(e) => setNewSampleType(e.target.value)}
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error}
          />
          <Button
            variant="contained"
            color={editingSampleType ? 'primary' : 'success'}
            onClick={editingSampleType ? handleUpdate : handleAdd}
            style={{ marginTop: '10px' }}
          >
            {editingSampleType ? 'Cập nhật' : 'Thêm'}
          </Button>
          {editingSampleType && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setEditingSampleType(null);
                setNewSampleType('');
                setError('');
              }}
              style={{ marginTop: '10px', marginLeft: '10px' }}
            >
              Hủy chỉnh sửa
            </Button>
          )}
        </div>
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên loại mẫu</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleTypes.length > 0 ? (
                sampleTypes.map((sampleType) => (
                  <TableRow key={sampleType.id}>
                    <TableCell>{sampleType.id}</TableCell>
                    <TableCell>{sampleType.sampleType}</TableCell>
                    <TableCell>
                      <Tooltip title="Chỉnh sửa loại mẫu">
                        <Button
                          color="primary"
                          onClick={() => handleEdit(sampleType)}
                        >
                          Sửa
                        </Button>
                      </Tooltip>
                      <Tooltip title="Xóa loại mẫu">
                        <Button
                          color="error"
                          onClick={() => handleDelete(sampleType.id)}
                        >
                          Xóa
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                    Không tìm thấy loại mẫu nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SampleTypeManagementPopup;