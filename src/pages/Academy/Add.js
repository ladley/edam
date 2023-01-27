import React from 'react';
import styled from 'styled-components'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import { useNavigate } from 'react-router-dom'

import { Box, Button, Card, CardContent, Divider, TextField } from '@mui/material';

import { db, auth } from '../../firebase'

const startOfToday = new Date()
startOfToday.setHours(0)
startOfToday.setMinutes(0)
startOfToday.setSeconds(0)

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
  const [birth, setBirth] = React.useState(new Date())
  const [phone, setPhone] = React.useState('')
  const [admin, setAdmin] = React.useState('')
  const [registDT, setRegistDT] = React.useState(new Date())
  const [bankAccount, setbankAccount] = React.useState('')
  

  
  const navigate = useNavigate()

  React.useEffect(() => {
    console.log(auth.currentUser.uid)
  }, [])

  const handleAddStudent = async () => {
    try {
      const academyRes = await db.collection('Academy').where('admins', 'array-contains', auth.currentUser.uid).get()
      let academyId = ''
      if (academyRes.docs.length)
        academyRes.forEach((doc) => { academyId = doc.id })

      const res = await db.collection('Student').add({})

      console.log('student added..', res)
      const addedStudentId = res.id

      const addDataRes = await db.collection('Student').doc(addedStudentId).set({
        id: addedStudentId,
        regularSchedule: DEFAULT_REGULAR_SCHEDULE,
        targetAcademy: db.collection('Academy').doc(academyId),
        name, birth, phone
      })

      console.log('data add success:', addDataRes)

      navigate('/dashboard/student')
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              label="관리자"
              variant="outlined"
              margin="normal"
              fullWidth
              value={admin}
              onChange={(e) => setAdmin(e.target.value)}
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
              onClick={() => handleAddStudent()}
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
