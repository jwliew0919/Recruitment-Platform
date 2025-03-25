import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { CreateCandidateDto } from '../services/candidate.service';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string(),
  skills: yup.string(),
  experience_years: yup.number().min(0, 'Experience years must be positive'),
  location: yup.string(),
  availability: yup.boolean()
});

interface Props {
  onSubmit: (candidate: CreateCandidateDto) => Promise<void>;
  initialValues?: CreateCandidateDto;
  open?: boolean;
  onClose?: () => void;
}

const defaultValues = {
  name: '',
  email: '',
  phone: '',
  skills: '',
  experience_years: 0,
  location: '',
  availability: false
};

const AddCandidateForm: React.FC<Props> = ({ onSubmit, initialValues, open, onClose }) => {
  const formik = useFormik({
    initialValues: initialValues || defaultValues,
    validationSchema: validationSchema,
    onSubmit: async (values: CreateCandidateDto) => {
      try {
        await onSubmit(values);
        formik.resetForm();
        if (onClose) {
          onClose();
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });

  const content = (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {initialValues ? 'Edit Candidate' : 'Add New Candidate'}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="Phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="skills"
              name="skills"
              label="Skills (comma-separated)"
              value={formik.values.skills}
              onChange={formik.handleChange}
              error={formik.touched.skills && Boolean(formik.errors.skills)}
              helperText={formik.touched.skills && formik.errors.skills}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="experience_years"
              name="experience_years"
              label="Years of Experience"
              type="number"
              value={formik.values.experience_years}
              onChange={formik.handleChange}
              error={formik.touched.experience_years && Boolean(formik.errors.experience_years)}
              helperText={formik.touched.experience_years && formik.errors.experience_years}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="location"
              name="location"
              label="Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="availability-label">Availability</InputLabel>
              <Select
                labelId="availability-label"
                id="availability"
                name="availability"
                value={formik.values.availability ? "true" : "false"}
                label="Availability"
                onChange={(e) => {
                  formik.setFieldValue('availability', e.target.value === "true");
                }}
                error={formik.touched.availability && Boolean(formik.errors.availability)}
              >
                <MenuItem value="true">Available</MenuItem>
                <MenuItem value="false">Not Available</MenuItem>
              </Select>
              {formik.touched.availability && formik.errors.availability && (
                <FormHelperText error>{formik.errors.availability}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              disabled={formik.isSubmitting}
            >
              {initialValues ? 'Update Candidate' : 'Add Candidate'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );

  return open !== undefined ? (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        {content}
      </DialogContent>
    </Dialog>
  ) : content;
};

export default AddCandidateForm; 