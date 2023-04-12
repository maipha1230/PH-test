import React, { useState, forwardRef, useImperativeHandle } from "react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingModal = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => {
        return {
            setOpen: setOpen,
        }
    })
    const [open, setOpen] = useState(false)

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: 99999 }}
            open={open}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
})

export default LoadingModal