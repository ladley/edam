import React, { useEffect, useState } from 'react';

// material
import {
  Stack,
  Container,
  Typography,
} from '@mui/material';

import { useLocation } from 'react-router-dom';
// components
import Page from '../../components/Page';
import AcademyInfo from './AcademyInfo'
import { db, auth } from '../../firebase'

// components
import { AcademySort, AcademyList, AcademyCartWidget } from './AcademyList'
// mock
import PRODUCTS from '../../_mock/products';


export default function User() {
  const [academy, setAcademy] = useState([])
  const location = useLocation()

  useEffect(() => {
    fetchAcademy()
  }, [location])

  const fetchAcademy = async () => {
    const academyRes = await db.collection('Academy').where('admins', 'array-contains', auth.currentUser.uid).get()
    if (academyRes.docs.length)
      academyRes.forEach((doc) => {
        setAcademy({
          ...doc.data(),
          id: doc.id
        })
      })
  }
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

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

      <Container>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <AcademySort />
          </Stack>
        </Stack>

        <AcademyList Academys={PRODUCTS} />
        <AcademyCartWidget />
      </Container>
    </Page>
  );
}
