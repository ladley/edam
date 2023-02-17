import React from 'react';
import styled from 'styled-components'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import { useNavigate } from 'react-router-dom'
import { Box, Button, Card, CardContent, Divider, TextField } from '@mui/material';

import AcademyListTable from './AcademyListTable'

import { db, auth } from '../../firebase'

export default function Add() {
  const [title, setTitle] = React.useState('학원 등록하기')
  const [id, setId] = React.useState('')
  const [name, setName] = React.useState('')
  const [tel, setTel] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [registDT, setRegistDT] = React.useState(new Date())
  const [bankAccount, setbankAccount] = React.useState('')

  const navigate = useNavigate()

  React.useEffect(() => {
    getAcademyInfo()
  }, [])

  const getAcademyInfo = async () => {

    const academyRes = await db.collection('Academy').where('admins', 'array-contains', auth.currentUser.uid).get()
    if (academyRes.docs.length) {
      academyRes.forEach((doc) => {
        setTitle('학원 정보 수정')
        setId(doc.id)
        setName(doc.data().name || '')
        setTel(doc.data().tel || '')
        setAddress(doc.data().address || '')
        setbankAccount(doc.data().bankAccount || '')
      })
    }
  }

  const handleAddAcademy = async () => {
    try {
      const res = await db.collection('Academy').add({})

      console.log('Academy added..', res)
      const addeAcademyId = res.id

      await db.collection('Academy').doc(addeAcademyId).set({
        admins: [auth.currentUser.uid],
        id: addeAcademyId,
        name, tel, address, registDT, bankAccount
      })

      navigate('/dashboard/academy')
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdateAcademy = async () => {
    try {
      await db.collection('Academy').doc(id).update({
        name, tel, address, bankAccount
      })

      navigate('/dashboard/academy')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Card>
      <CardContent>
        <Box>
          <h1 style={{ marginBottom: 12 }}>{title}</h1>
          <AcademyListTable />
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
            <Button
              style={{ margin: 8 }}
              fullWidth
              variant='contained'
              onClick={() => handleUpdateAcademy()}
            >
              수정하기
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
