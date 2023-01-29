import React, { useEffect, useState } from 'react';
import { filter } from 'lodash';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material
import {
  Stack,
  Button,
  Container,
  Typography,

} from '@mui/material';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import AcademyInfo from './AcademyInfo'
import { db, auth } from '../../firebase'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'tel', label: '전화번호', alignRight: false },
  { id: 'address', label: '주소', alignRight: false },
  { id: 'registDT', label: '등록시간', alignRight: false },
  { id: 'bankAccount', label: '등록계좌', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [academy, setAcademy] = useState([])

  const navigate = useNavigate()

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
    else navigate('/dashboard/academy/add')
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = academy.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };



  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - academy.length) : 0;

  const filteredAcademy = applySortFilter(academy, getComparator(order, orderBy), filterName);

  const isAcademyNotFound = filteredAcademy.length === 0;

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            학원
          </Typography>
          <Button variant="contained" component={RouterLink} to="add" startIcon={<Iconify icon="eva:plus-fill" />}>
            학원 등록하기
          </Button>
        </Stack>
          <AcademyInfo
          academy={academy}
          />
      </Container>
    </Page>
  );
}
