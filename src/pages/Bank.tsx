import { Box, Button, Divider, Typography, useTheme, TextField } from '@mui/material'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { axiosInstance } from "../axios/axiosInstance.js"
import { ensureRemoveBank, successAlert } from '../sweetAlert/sweetAlert.js';
import { BankModel } from '../models/Bank.model.js';
import BankDialog from '../components/BankDialog.js';

export default function Bank() {
    const theme = useTheme();
    const [banks, setBanks] = useState<BankModel[] | null>(null)
    const [dialogBank, setDialogBank] = useState<boolean>(false)
    const [bankId, setBankId] = useState<number | null>(null)

    const column_data: GridColDef[] = [
        { field: 'bank_name_th', headerName: 'ธนาคาร(ไทย)', flex: 1 },
        { field: 'bank_name_en', headerName: 'ธนาคาร(อังกฤษ)', flex: 1 },
        {
            field: 'bank_id', headerName: 'จัดการ', flex: 1, renderCell: (row) => {
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
        getBanks()
    }, [dialogBank])

    const getBanks = () => {
        axiosInstance.get("/banks/get-banks").then((res) => {
            if (res.status == 200) {
                setBanks(res.data)
            }
        })
    }

    const onDetailClick = (id: number) => {
        setBankId(id)
        handleDialogOpen()
    }

    const onDeleteClick = (id: number) => {
        ensureRemoveBank().then((check) => {
            if (check.isConfirmed) {
                axiosInstance.delete(`banks/remove-bank/${id}`).then((res) => {
                    if (res.status == 200) {
                        successAlert(res.data).then(() => {
                            getBanks();
                        })
                    }
                })
            }
        })
    }

    const handleDialogOpen = () => {
        setDialogBank(true)
    }

    const handleDialogClose = () => {
        setDialogBank(false)
        setBankId(null)
    }


    return (
        <Box display={"flex"} flexDirection={"column"} p={2}>
            <Typography variant='h5'>
                ธนาคาร
            </Typography>
            <Divider />
            <Box pt={1.5}>
                <Button variant='contained' color='success' onClick={handleDialogOpen}>
                    เพิ่มธนาคาร
                </Button>
            </Box>
            <Box width={"100%"} maxWidth={"100wh"} height={"70vh"} mt={3}>
                {banks && (
                    <DataGrid
                        rows={banks}
                        columns={column_data}
                        getRowId={(row: any) => row.bank_id}
                        // components={{ Toolbar: GridToolbar }}
                        showCellVerticalBorder
                        showColumnVerticalBorder
                        
                    />
                )}
            </Box>
            {/* dialog bank */}
            <BankDialog open={dialogBank} handleDialogClose={handleDialogClose} bankId={bankId} />

        </Box>
    )
}
