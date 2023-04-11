import { Box, Button, Divider, Typography, useTheme, TextField } from '@mui/material'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { axiosInstance } from "../axios/axiosInstance.js"
import { HospitalModel } from '../models/Hospital.model.js';
import HospitalDialog from '../components/HospitalDialog.js';
import { ensureRemoveHospital, successAlert } from '../sweetAlert/sweetAlert.js';

export default function Hospital() {
  const theme = useTheme();
  const [hospitals, setHospitals] = useState<HospitalModel[] | null>(null)
  const [dialogHospital, setDialogHospital] = useState<boolean>(false)
  const [hostpitalId, setHostpitalId] = useState<number | null>(null)

  const column_data: GridColDef[] = [
    { field: 'hospital_code', headerName: 'รหัสโรงพยาบาล',  width: 200 },
    { field: 'hospital_name_th', headerName: 'ชื่อไทย', flex: 1 },
    { field: 'hospital_name_en', headerName: 'ชื่ออังกฤษ', flex: 1 },
    {
      field: 'created_at', headerName: 'เพิ่มเมื่อ', width: 200, valueFormatter: (params) => new Date(params.value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    },
    {
      field: 'hospital_id', headerName: 'จัดการ', flex: 1, renderCell: (row) => {
        return <Box display={"flex"} flexDirection={"row"} gap={1} justifyContent={"center"} alignItems={"center"} width={"50%"}>
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
    getHospitals()
  }, [dialogHospital])

  const getHospitals = () => {
    axiosInstance.get("/hospitals/get-hospitals").then((res) => {
      if (res.status == 200) {
        setHospitals(res.data)
      }
    })
  }

  const onDetailClick = (id: number) => {
    setHostpitalId(id)
    handleDialogOpen()
  }

  const onDeleteClick = (id: number) => {
    ensureRemoveHospital().then((check) => {
      if (check.isConfirmed) {
        axiosInstance.delete(`hospitals/remove-hospital/${id}`).then((res) => {
          if (res.status == 200) {
            successAlert(res.data).then(() => {
              getHospitals();
            })
          }
        })
      }
    })
  }

  const handleDialogOpen = () => {
    setDialogHospital(true)
  }

  const handleDialogClose = () => {
    setDialogHospital(false)
    setHostpitalId(null)
  }


  return (
    <Box display={"flex"} flexDirection={"column"} p={2}>
      <Typography variant='h5'>
        โรงพยาบาล
      </Typography>
      <Divider />
      <Box pt={1.5}>
        <Button variant='contained' color='success' onClick={handleDialogOpen}>
          เพิ่มโรงพยาบาล
        </Button>
      </Box>
      <Box width={"100%"} maxWidth={"100wh"} height={"70vh"} mt={3}>
        {hospitals && (
          <DataGrid
            rows={hospitals}
            columns={column_data}
            getRowId={(row: any) => row.hospital_id}
            components={{ Toolbar: GridToolbar }}
            showCellVerticalBorder
            showColumnVerticalBorder
          />
        )}
      </Box>
      {/* dialog hospital */}
      <HospitalDialog open={dialogHospital} handleDialogClose={handleDialogClose} hospitalId={hostpitalId} />

    </Box>
  )
}
