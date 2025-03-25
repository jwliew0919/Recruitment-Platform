import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import candidateService from '../services/candidate.service';
import LoadingSpinner from '../components/LoadingSpinner';

interface DashboardStats {
  totalCandidates: number;
  availableCandidates: number;
  newCandidates: number;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCandidates: 0,
    availableCandidates: 0,
    newCandidates: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const candidates = await candidateService.getAllCandidates();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        setStats({
          totalCandidates: candidates.length,
          availableCandidates: candidates.filter(c => c.availability).length,
          newCandidates: candidates.filter(c => new Date(c.created_at) > thirtyDaysAgo).length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">Total Candidates</Typography>
              </Box>
              <Typography variant="h3">{stats.totalCandidates}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Typography variant="h6">Available Candidates</Typography>
              </Box>
              <Typography variant="h3">{stats.availableCandidates}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonAddIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Typography variant="h6">New Candidates (30 days)</Typography>
              </Box>
              <Typography variant="h3">{stats.newCandidates}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 