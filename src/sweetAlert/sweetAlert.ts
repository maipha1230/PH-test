import Swal from 'sweetalert2'


export const successAlert = (msg: string) => {
    return Swal.fire({
        title: 'Success',
        text: msg,
        icon: 'success',
        showConfirmButton: false,
        timer: 2500
    })
}

export const waringAlert = (msg: string) => {
    return Swal.fire({
        title: 'Warning',
        text: msg,
        icon: 'warning',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
        timer: 5000
    })
}

export const logoutAlert = () => {
  return Swal.fire({
    title: "Sign out",
    text: "คุณต้องการออกจากระบบใช่หรือไม่ ?",
    icon: "question",
    showConfirmButton: true,
    confirmButtonText: "ใช่",
    showCancelButton: true,
    cancelButtonText: "ไม่"
  })
}

export const ensureRemoveHospital = () => {
    return Swal.fire({
        title: "Are you sure ?",
        text: 'คุณต้องการลบโรงพยาบาลนี้ใช่หรือไม่?',
        icon: "question",
        showConfirmButton: true,
        confirmButtonText: "ใช่",
        showCancelButton: true,
        cancelButtonText: "ไม่"
    })
}

export const ensureRemoveUser = () => {
    return Swal.fire({
        title: "Are you sure ?",
        text: 'คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?',
        icon: "question",
        showConfirmButton: true,
        confirmButtonText: "ใช่",
        showCancelButton: true,
        cancelButtonText: "ไม่"
    })
}

export const ensureRemoveBank = () => {
    return Swal.fire({
        title: "Are you sure ?",
        text: 'คุณต้องการลบธนาคารนี้ใช่หรือไม่?',
        icon: "question",
        showConfirmButton: true,
        confirmButtonText: "ใช่",
        showCancelButton: true,
        cancelButtonText: "ไม่"
    })
}

export const ensureAddUserHospital = () => {
    return Swal.fire({
        title: "Are you sure ?",
        text: 'คุณต้องการบรรจุเข้าโรงพยาลนี้ใช่หรือไม่?',
        icon: "question",
        showConfirmButton: true,
        confirmButtonText: "ใช่",
        showCancelButton: true,
        cancelButtonText: "ไม่"
    })
}

export const ensureRemoveUserHospital = () => {
    return Swal.fire({
        title: "Are you sure ?",
        text: 'คุณต้องนำออกจากรายการบรรจุโรงพยาลนี้ใช่หรือไม่?',
        icon: "question",
        showConfirmButton: true,
        confirmButtonText: "ใช่",
        showCancelButton: true,
        cancelButtonText: "ไม่"
    })
}

export const ensureRemoveUserBankAccount = () => {
    return Swal.fire({
        title: "Are you sure ?",
        text: 'คุณต้องนำออกจากรายการสมุดบัญชีของผู้ใช้ใช่หรือไม่?',
        icon: "question",
        showConfirmButton: true,
        confirmButtonText: "ใช่",
        showCancelButton: true,
        cancelButtonText: "ไม่"
    })
}
