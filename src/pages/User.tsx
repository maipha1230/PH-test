import { Box, Button, Divider, Typography, useTheme, TextField } from '@mui/material'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { axiosInstance } from "../axios/axiosInstance.js"
import HospitalDialog from '../components/HospitalDialog.js';
import { ensureRemoveHospital, ensureRemoveUser, successAlert } from '../sweetAlert/sweetAlert.js';
import { UserModel } from '../models/User.model.js';
import UserDialog from '../components/UserDialog.js';

export default function User() {
  const theme = useTheme();
  const [users, setUsers] = useState<UserModel[] | null>(null)
  const [dialogUser, setDialogUser] = useState<boolean>(false)
  const [userId, setUserId] = useState<number | null>(null)

  const column_data: GridColDef[] = [
    { field: 'user_code', headerName: 'รหัสผู้ใช้งาน', width: 200 },
    { field: 'user_firstname_th', headerName: 'ชื่อ(ไทย)', flex: 1 },
    { field: 'user_lastname_th', headerName: 'นามสกุล(ไทย)', flex: 1 },
    { field: 'user_firstname_en', headerName: 'ชื่อ(อังกฤษ)', flex: 1 },
    { field: 'user_lastname_en', headerName: 'นามสกุล(อังกฤษ)', flex: 1 },
    {
      field: 'created_at', headerName: 'เข้าร่วมเมื่อ', flex: 1, valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'user_id', headerName: 'จัดการ', flex: 1, renderCell: (row) => {
        return <Box display={"flex"} flexDirection={"row"} gap={1} justifyContent={"center"} alignItems={"center"}>
          <Button fullWidth color='warning' variant='contained' onClick={() => onDetailClick(row.value)}>
            แก้ไข
          </Button>
          <Button fullWidth color='error' variant='contained' onClick={() => onDeleteClick(row.value)}>
            ลบ
          </Button>
        </Box>
      }
    }
  ]

  //use effect
  useEffect(() => {
    getUsers()
  }, [dialogUser])

  const getUsers = () => {
    axiosInstance.get("/users/get-users").then((res) => {
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
        axiosInstance.delete(`users/remove-user/${id}`).then((res) => {
          if (res.status == 200) {
            successAlert(res.data).then(() => {
              getUsers();
            })
          }
        })
      }
    })
  }

  const handleDialogOpen = () => {
    setDialogUser(true)
  }

  const handleDialogClose = () => {
    setDialogUser(false)
    setUserId(null)
  }


  return (
    <Box display={"flex"} flexDirection={"column"} p={2}>
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
        {users && (
          <DataGrid
            rows={users}
            columns={column_data}
            getRowId={(row: any) => row.user_id}
            components={{ Toolbar: GridToolbar }}
            showCellVerticalBorder
            showColumnVerticalBorder
          />
        )}
      </Box>
      {/* dialog user */}
      <UserDialog open={dialogUser} handleDialogClose={handleDialogClose} userId={userId} />

    </Box>
  )
}
