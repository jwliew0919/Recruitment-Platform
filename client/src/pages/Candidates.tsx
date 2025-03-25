import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Container,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import AddCandidateForm from '../components/AddCandidateForm';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import candidateService, { Candidate, CreateCandidateDto } from '../services/candidate.service';

const Candidates: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<number | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await candidateService.getAllCandidates();
      setCandidates(data);
    } catch (error) {
      console.error('Error loading candidates:', error);
      setError('Failed to load candidates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      if (searchQuery.trim()) {
        const results = await candidateService.searchCandidates(searchQuery);
        setCandidates(results);
      } else {
        await loadCandidates();
      }
    } catch (error) {
      console.error('Error searching candidates:', error);
      setError('Failed to search candidates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (values: CreateCandidateDto) => {
    try {
      setLoading(true);
      setError(null);
      await candidateService.createCandidate(values);
      await loadCandidates();
      setSuccess('Candidate added successfully!');
    } catch (error) {
      console.error('Error adding candidate:', error);
      setError('Failed to add candidate. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (candidate: Candidate) => {
    setEditingCandidate(candidate);
  };

  const handleEditSubmit = async (candidateData: any) => {
    if (!editingCandidate) return;
    try {
      await candidateService.updateCandidate(editingCandidate.id, candidateData);
      setSuccess('Candidate updated successfully');
      setEditingCandidate(null);
      await loadCandidates();
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  };

  const handleDeleteClick = (id: number) => {
    setCandidateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!candidateToDelete) return;
    try {
      setLoading(true);
      setError(null);
      await candidateService.deleteCandidate(candidateToDelete);
      await loadCandidates();
      setSuccess('Candidate deleted successfully!');
    } catch (error) {
      console.error('Error deleting candidate:', error);
      setError('Failed to delete candidate. Please try again later.');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setCandidateToDelete(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading candidates..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Candidates
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsAddFormOpen(true)}
        >
          Add Candidate
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search candidates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>{candidate.name}</TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>{candidate.phone}</TableCell>
                  <TableCell>{candidate.skills || ''}</TableCell>
                  <TableCell>{candidate.experience_years} years</TableCell>
                  <TableCell>{candidate.location}</TableCell>
                  <TableCell>{candidate.availability ? 'Available' : 'Not Available'}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(candidate)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(candidate.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={candidates.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <AddCandidateForm
        open={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSubmit={handleAddCandidate}
      />

      <Dialog open={!!editingCandidate} onClose={() => setEditingCandidate(null)}>
        <DialogTitle>Edit Candidate</DialogTitle>
        <DialogContent>
          <AddCandidateForm
            onSubmit={handleEditSubmit}
            initialValues={editingCandidate || undefined}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Candidate"
        message={`Are you sure you want to delete this candidate? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setCandidateToDelete(null);
        }}
      />

      <ErrorMessage
        message={error || ''}
        open={!!error}
        onClose={() => setError(null)}
      />

      <SuccessMessage
        message={success || ''}
        open={!!success}
        onClose={() => setSuccess(null)}
      />
    </Container>
  );
};

export default Candidates; 