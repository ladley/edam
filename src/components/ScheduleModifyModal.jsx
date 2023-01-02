import React from 'react'

import Modal from '@mui/material/Modal';

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import styled from 'styled-components'
import OtherDatePicker from 'react-datepicker';
import moment from 'moment'
import { db } from '../firebase'

export default function ScheduleModifyModal({ modalOpen, setModalOpen, fetchSchedule, id }) {
  // 
  const [selectedDay, setSelectedDay] = React.useState()
  const [startTime, setStartTime] = React.useState()
  const [endTime, setEndTime] = React.useState()
  const [title, setTitle] = React.useState('')
  const [prevData, setPrevData] = React.useState({})

  React.useEffect(() => {
    fetchScheduleInfo()
  }, [id])

  React.useEffect(() => {
    if (prevData.startDT) {
      setSelectedDay(new Date(prevData.startDT.seconds * 1000))
      setStartTime(new Date(prevData.startDT.seconds * 1000))
      setEndTime(new Date(prevData.endDT.seconds * 1000))
      setTitle(prevData?.title)
    }

  }, [prevData])

  const fetchScheduleInfo = async () => {
    const res = await db.collection('Schedule').doc(id).get()
    if (res.exists) {
      console.log(res.data())
      setPrevData(res.data())
      // const start = new Date(res.data().startDT.seconds * 1000)
      // setStartTime(new Date(res.data().startDT.seconds * 1000))
      // setEndTime(new Date(res.data().endDT.seconds * 1000))
      // setSelectedDay(start)
    }
  }

  const handleUpdateSchedule = async (data) => {
    try {
      await db.collection('Schedule').doc(id).set({
        ...prevData,
        ...data,
      })
      fetchSchedule()
      handleClose()
    } catch (e) {
      console.error("Error occured while update schedule data", e)
    }
  }

  const handleDeleteSchedule = async () => {
    try {
      await db.collection('Schedule').doc(id).delete()
      fetchSchedule()
      handleClose()
    } catch (e) {
      console.error("Error occured while update delete data", e)
    }
  }

  const handleClose = () => {
    setSelectedDay()
    setStartTime()
    setEndTime()
    // setStudentList()
    // setSelectedStudent()
    setModalOpen(false)
  }
  return (
    <Modal
      open={modalOpen}
      onClose={() => handleClose()}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Card
        style={{
          overflow: 'visible'
        }}
      >
        <CardContent
          style={{
            gap: 8,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant='h3' style={{ marginBottom: 20 }}>
            스케줄 수정
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="날짜"
              value={selectedDay}
              onChange={(date) => {
                setSelectedDay(date.$d);
                console.log(date.$d)
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TimePickerWrap>

            <OtherDatePicker
              placeholderText='시작시간'
              selected={startTime}
              onChange={(time) => {
                setStartTime(time)
                setEndTime(moment(time).add('4', 'hour').toDate())
              }}
              showTimeSelect
              showTimeSelectOnly
              timeFormat="aa HH:mm"
              timeIntervals={30}
              timeCaption="시작시간"
              dateFormat="aa hh:mm"
            />
            ~
            <OtherDatePicker
              placeholderText='종료시간'
              selected={endTime}
              onChange={(time) => setEndTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeFormat="aa HH:mm"
              timeIntervals={30}
              timeCaption="종료시간"
              dateFormat="aa hh:mm"
            />
          </TimePickerWrap>
          <TextField
            fullWidth
            label='메모'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant='contained' color='inherit'
            onClick={() => setModalOpen(false)}
          >
            취소하기
          </Button>
          <Button variant='contained' color='error'
            onClick={() => handleDeleteSchedule()}
          >
            삭제하기
          </Button>
          <Button variant='contained' color='primary'
            onClick={() => handleUpdateSchedule({
              startDT: startTime,
              endDT: endTime,
              title
            })}
          >
            수정하기
          </Button>
        </CardActions>
      </Card>
    </Modal>
  )
}

const TimePickerWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`