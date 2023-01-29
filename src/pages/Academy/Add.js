import React from 'react';
import styled from 'styled-components'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import { useNavigate } from 'react-router-dom'

import { Box, Button, Card, CardContent, Divider, TextField } from '@mui/material';

import { db, auth } from '../../firebase'

export const DEFAULT_REGULAR_SCHEDULE = [
  {
    day: 'Sunday',
    korLabel: '일',
    use: false,
    schedules: []
  },
  {
    day: 'Monday',
    korLabel: '월',
    use: false,
    schedules: []
  },
  {
    day: 'Tuesday',
    korLabel: '화',
    use: false,
    schedules: []
  },
  {
    day: 'Wednesday',
    korLabel: '수',
    use: false,
    schedules: []
  },
  {
    day: 'Thursday',
    korLabel: '목',
    use: false,
    schedules: []
  },
  {
    day: 'Friday',
    korLabel: '금',
    use: false,
    schedules: []
  },
  {
    day: 'Saturday',
    korLabel: '토',
    use: false,
    schedules: []
  },
]

export default function Add() {

  const [name, setName] = React.useState('')
  const [tel, setTel] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [registDT, setRegistDT] = React.useState(new Date())
  const [bankAccount, setbankAccount] = React.useState('')
  const [addMaterialData, setAddMaterialData] = React.useState({
    name: '',
    phone: 0,
    admin: 0,
    registDT: 0,
    bankAccount: '',
  })
  
  const navigate = useNavigate()

  const handleAddAcademy = async () => {
    try {
      const res = await db.collection('Academy').add({})

      console.log('Academy added..', res)
      const addeAcademyId = res.id

      const addAcademyRes = await db.collection('Academy').doc(addeAcademyId).set({
        admins: [auth.currentUser.uid],
        id: addeAcademyId,
        name,tel, address, registDT, bankAccount
      })

      console.log('data add success:', addAcademyRes)

      navigate('/dashboard/academy')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Card>
      <CardContent>
        <Box>
          <h1 style={{ marginBottom: 12 }}>학원 등록하기</h1>
          <Divider />
          <FormWrap>
            <TextField
              label="학원명"
              variant="outlined"
              margin="normal"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="전화번호"
              tyle="number"
              variant="outlined"
              margin="normal"
              fullWidth
              value={tel}
              onChange={(e) => setTel(e.target.value)}
            />
            
            <TextField
              label="주소"
              variant="outlined"
              margin="normal"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="생성월시"
                value={registDT}
                inputFormat='YYYY-MM-DD'
                onChange={(newValue) => {
                  setRegistDT(newValue.$d);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <TextField
              label="계좌정보"
              variant="outlined"
              margin="normal"
              fullWidth
              value={bankAccount}
              onChange={(e) => setbankAccount(e.target.value)}
            />
            <Button
              style={{ margin: 8 }}
              fullWidth
              variant='contained'
              onClick={() => handleAddAcademy()}
            >
              추가하기
            </Button>
          </FormWrap>
        </Box>
      </CardContent>
    </Card>
  )
}

const FormWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
