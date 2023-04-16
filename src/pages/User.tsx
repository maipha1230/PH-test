import { Box, Button, Divider, Typography, useTheme, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {  ensureRemoveUser, successAlert } from '../sweetAlert/sweetAlert.js';
import { UserModel } from '../models/User.model.js';
import UserDialog from '../components/UserDialog.js';
import UserHospitalDialog from '../components/UserHospitalDialog.js';
import axios from 'axios';
import UserBankDialog from '../components/UserBankDialog.js';
import { useSearchParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";

export default function User() {
  const theme = useTheme();
  const [users, setUsers] = useState<UserModel[]>([])
  const [dialogUser, setDialogUser] = useState<boolean>(false)
  const [dialogUserHospital, setDialogUserHospital] = useState<boolean>(false)
  const [dialogUserBank, setDialogUserBank] = useState<boolean>(false)
  const [userId, setUserId] = useState<number | null>(null)

  const columns = [
    {
      name: "user_code",
      label: "รหัสผู้ใช้",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "user_firstname_th",
      label: "ชื่อผู่ใช้(ไทย)",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "user_lastname_th",
      label: "นามสกุลผู้ใช้(ไทย)",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "user_firstname_en",
      label: "ชื่อผู้ใช้(อังกฤษ)",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "user_lastname_en",
      label: "นามสกุลผู้ใช้(อังกฤษ)",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "created_at",
      label: "เข้าร่วมเมื่อ",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: string) => <span>{new Date(value).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}</span>
      }
    },
    {
      name: "user_status",
      label: "สถานะผู้ใช้",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: number) => {
          return (
            <Typography color={value == 1 ? "#3e8e46" : "#d32f2f"}>{value == 1 ? 'อนุมัติแล้ว' : 'ยังไม่อนุมัติ'}</Typography>
          )
        }
      }
    },
    {
      name: "user_id",
      label: "จัดการ",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: number) => {
          return (
            <Box display={"flex"} flexDirection={{ xs: "column", lg: "row" }} gap={0.5} justifyContent={"center"} alignItems={"center"} width={"100%"}>
              <Button fullWidth color='warning' variant='contained' onClick={() => onDetailClick(value)}>
                แก้ไข
              </Button>
              <Button fullWidth color='secondary' variant='contained' onClick={() => onHospitalClick(value)}>
                โรงพยาบาล
              </Button>
              <Button fullWidth color='success' variant='contained' onClick={() => onUserBankClick(value)}>
                สมุดบัญชี
              </Button>
              <Button fullWidth color='error' variant='contained' onClick={() => onDeleteClick(value)}>
                ลบ
              </Button>
            </Box>
          )
        }
      }
    },
  ];

  const [searchParams] = useSearchParams();

  //use effect
  useEffect(() => {
    getUsers()
    if (searchParams.get("user_id")) {
      setUserId(Number(searchParams.get("user_id")))
      handleUserHospitalDialogOpen()
    }

  }, [dialogUser])

  const handleDialogOpen = () => {
    setDialogUser(true)
  }

  const handleDialogClose = () => {
    setDialogUser(false)
    setUserId(null)
  }

  const handleUserHospitalDialogOpen = () => {
    setDialogUserHospital(true)
  }

  const handleUserHospitalDialogClose = () => {
    setDialogUserHospital(false)
    setUserId(null)
  }
  const handleUserBankDialogOpen = () => {
    setDialogUserBank(true)
  }

  const handleUserBankDialogClose = () => {
    setDialogUserBank(false)
    setUserId(null)
  }

  const getUsers = () => {
    axios.get("/users/get-users").then((res) => {
      if (res.status == 200) {
        setUsers(res.data)
      }
    })
  }

  const onDetailClick = (id: number) => {
    setUserId(id)
    handleDialogOpen()
  }

  const onDeleteClick = (id: number) => {
    ensureRemoveUser().then((check) => {
      if (check.isConfirmed) {
        axios.delete(`users/remove-user/${id}`).then((res) => {
          if (res.status == 200) {
            successAlert(res.data).then(() => {
              getUsers();
            })
          }
        })
      }
    })
  }

  const onHospitalClick = (id: number) => {
    setUserId(id)
    handleUserHospitalDialogOpen()
  }

  const onUserBankClick = (id: number) => {
    setUserId(id)
    handleUserBankDialogOpen()
  }


  return (
    <Box display={"flex"} flexDirection={"column"} p={{ xs: 0, md: 2 }}>
      <Typography variant='h5'>
        ผู้ใช้งาน
      </Typography>
      <Divider />
      <Box pt={1.5}>
        <Button variant='contained' color='success' onClick={handleDialogOpen}>
          เพิ่มผู้ใช้งาน
        </Button>
      </Box>
      <Box width={"100%"} maxWidth={"100wh"} height={"70vh"} mt={3}>
        <MUIDataTable
          title={"ตารางผู้ใช้งาน"}
          data={users}
          columns={columns}
          options={{ filterType: 'checkbox', }}
        />
      </Box>
      {/* dialog user */}
      {dialogUser && <UserDialog open={dialogUser} handleDialogClose={handleDialogClose} userId={userId} />}

      {/* dialog user hospital */}
      {dialogUserHospital && <UserHospitalDialog open={dialogUserHospital} handleDialogClose={handleUserHospitalDialogClose} userId={userId} />}

      {/* dialog user bank */}
      {dialogUserBank && <UserBankDialog open={dialogUserBank} handleDialogClose={handleUserBankDialogClose} userId={userId} />}

    </Box>
  )
}
