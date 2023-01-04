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

export default function ScheduleAddingModal({ modalOpen, setModalOpen, scheduleInfo, fetchSchedule }) {

  const [selectedDay, setSelectedDay] = React.useState()
  const [startTime, setStartTime] = React.useState()
  const [endTime, setEndTime] = React.useState()
  const [studentList, setStudentList] = React.useState([])
  const [selectedStudent, setSelectedStudent] = React.useState()
  const [title, setTitle] = React.useState('')

  React.useEffect(() => {
    fetchStudentList()
  }, [])

  React.useEffect(() => {
    setStudentList([])
    setSelectedDay(scheduleInfo.day)
    fetchStudentList()
  }, [modalOpen])

  React.useEffect(() => {
    setStartTime(selectedDay)
    setEndTime(selectedDay)
  }, [selectedDay])

  const fetchStudentList = async () => {
    // setStudentList([])
    const res = await db.collection('Student').get()
    res.forEach((doc) => {
      // console.log(doc.data())
      setStudentList(prev => [...prev, {...doc.data(), id: doc.id}])
      // console.log(doc.id, scheduleInfo.id)
      if (doc.id === scheduleInfo.id) {
        setSelectedStudent(doc.data())
      }
    })
  }

  const handleAddSchedule = async (data) => {
    try {
      await db.collection('Schedule').add({
        ...data,
        targetStudent: db.collection('Student').doc(selectedStudent.id)
      })
      fetchSchedule()
      handleClose()
    } catch (e) {
      console.error("Error occured while adding schedule data", e)
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
            스케줄 추가하기
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">이름</InputLabel>
            <Select
              value={selectedStudent && selectedStudent.id}
              defaultValue={'aa'}
              label="Age"
              onChange={(e) => {
                setSelectedStudent(studentList.filter(student => student.id === e.target.value)[0])
              }}
            >
              { studentList && studentList.map((item, index) =>
                <MenuItem key={`student-${index}`} value={item.id}>{item.name}</MenuItem>
              )}
            </Select>
          </FormControl>
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
          <Button variant='contained' color='error'
            onClick={() => setModalOpen(false)}
          >
            취소하기
          </Button>
          <Button variant='contained' color='primary'
            onClick={() => handleAddSchedule({
              startDT: startTime,
              endDT: endTime,
              title
            })}
          >
            추가하기
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