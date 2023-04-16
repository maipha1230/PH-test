import { Box, Grid, Paper, Typography, useTheme } from '@mui/material'
import { cyan, blue } from '@mui/material/colors'
import Chart from "react-apexcharts";
import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function Dashboard() {
  const [hospitalCount, setHospitalCount] = useState<number | null>(null)
  const [userCount, setUserCount] = useState<number | null>(null)
  const [adminCount, setAdminCount] = useState<number | null>(null)
  const [userBankCount, setUserBankCount] = useState<number | null>(null)
  const [hospitaUserChart, setHospitalUserChart] = useState<any>(null)

  useEffect(() => {
    getHospitaCount()
    getAdminCount()
    getUserCount()
    getUserBankCount()
    getHospitalUserChart()
  }, [])

  const getHospitaCount = async () => {
    const res = await axios.get('/hospitals/get-hospital-count')
    if (res.status == 200) {
      setHospitalCount(res.data.count)
    }
  }
  const getAdminCount = async () => {
    const res = await axios.get('/users/get-admin-count')
    if (res.status == 200) {
      setAdminCount(res.data.count)
    }
  }
  const getUserCount = async () => {
    const res = await axios.get('/users/get-user-count')
    if (res.status == 200) {
      setUserCount(res.data.count)
    }
  }
  const getUserBankCount = async () => {
    const res = await axios.get('/banks/get-user-bank-count')
    if (res.status == 200) {
      setUserBankCount(res.data.count)
    }
  }

  const getHospitalUserChart = async () => {
    const res = await axios.get('/hospitals/get-hospital-user-chart')
    if (res.status == 200) {
      const data = []
      const categories = []
      const temp = res.data
      for (let t of temp) {
        data.push(t.count)
        categories.push([t.hospital_name_th, t.hospital_name_en])
      }
      const chartOptions = {
        chart: {
          type: 'bar',
          height: 500,
        },
        series: [{
          name: 'พนักงานในแต่ละโรงพยาบาล',
          data: data,
        }],
        xaxis: {
          categories: categories,
          labels: {
            style: {
              fontSize: '12px', // set the font size to 12 pixels
              fontWeight: 'bold', // set the font weight to bold
              fontFamily: 'Chakra Petch, sans-serif' 
            }
          }
        },
        plotOptions: {
          bar: {
            colors: {
              ranges: [{
                from: 0,
                to: 100,
                color: '#2e5596'
              }]
            },
            borderRadius: 4,
            horizontal: true,
          }
        },
      };
      setHospitalUserChart(chartOptions)
    }
  }


  return (
    <Box display={"flex"} gap={2} flexDirection={"column"} p={ {xs: 0, md: 3}} >
      <Typography variant='h5'>
        แดชบอร์ด
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3} >
          {hospitalCount && <Paper elevation={3}
            sx={{
              border: "none",
              borderRadius: "1rem",
              p: 3,
              display: "flex",
              flexDirection: "column",
            }}>
            <Typography variant='h6' color={'primary'}>โรงพยาบาล</Typography>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"}>
              <Typography variant='h3' color={'primary'} fontWeight={"bold"}>{hospitalCount}</Typography>
            </Box>
          </Paper>}
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          {userCount && <Paper elevation={3}
            sx={{
              border: "none",
              borderRadius: "1rem",
              p: 3,
              display: "flex",
              flexDirection: "column",
            }}>
            <Typography variant='h6' color={'secondary'}>ผู้ใช้งาน</Typography>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"}>
              <Typography variant='h3' color={'secondary'} fontWeight={"bold"}>{userCount}</Typography>
            </Box>
          </Paper>}
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          {adminCount && <Paper elevation={3}
            sx={{
              border: "none",
              borderRadius: "1rem",
              p: 3,
              display: "flex",
              flexDirection: "column",
            }}>
            <Typography variant='h6' color={'#6fbf73'}>ผู้ดูแลระบบ</Typography>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"}>
              <Typography variant='h3' color={'#6fbf73'} fontWeight={"bold"}>{adminCount}</Typography>
            </Box>
          </Paper>}
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          {userBankCount && <Paper elevation={3}
            sx={{
              border: "none",
              borderRadius: "1rem",
              p: 3,
              display: "flex",
              flexDirection: "column",
            }}>
            <Typography variant='h6' color={'#f8AC59'}>สมุดบัญชีในระบบ</Typography>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"}>
              <Typography variant='h3' color={'#f8AC59'} fontWeight={"bold"}>{userBankCount}</Typography>
            </Box>
          </Paper>}
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ width: "100%", height: "auto", p: 3 }}>
            <Typography variant='h6'>พนักงานในแต่ละโรงพยาบาล</Typography>
            {hospitaUserChart && <Chart options={hospitaUserChart} series={hospitaUserChart.series} type='bar' height={500}></Chart>}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
