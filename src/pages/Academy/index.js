import React, { useEffect, useState } from 'react';

// material
import {
  Stack,
  Container,
  Typography,

} from '@mui/material';
// components
import Page from '../../components/Page';
import AcademyInfo from './AcademyInfo'
import { db, auth } from '../../firebase'

export default function User() {
  const [academy, setAcademy] = useState([])

  useEffect(() => {
    fetchAcademy()
  }, [])

  const fetchAcademy = async () => {
    const academyRes = await db.collection('Academy').where('admins', 'array-contains', auth.currentUser.uid).get()
    if (academyRes.docs.length)
      academyRes.forEach((doc) => {
        setAcademy(prev => [...prev, {
          ...doc.data(),
          id: doc.id
        }])
      })
  }

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            학원
          </Typography>
        </Stack>
          <AcademyInfo
          academy={academy}
          />
      </Container>
    </Page>
  );
}
