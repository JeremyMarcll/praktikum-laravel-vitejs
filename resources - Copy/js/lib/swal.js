import Swal from "sweetalert2";

/**
 * Success Alert
 */
export const showSuccess = (message, title = "Berhasil!") => {
    return Swal.fire({
        icon: "success",
        title: title,
        text: message,
        showConfirmButton: true,
        timer: 3000,
        timerProgressBar: true,
    });
};

/**
 * Error Alert
 */
export const showError = (message, title = "Error!") => {
    return Swal.fire({
        icon: "error",
        title: title,
        text: message,
        showConfirmButton: true,
    });
};

/**
 * Warning Alert
 */
export const showWarning = (message, title = "Perhatian!") => {
    return Swal.fire({
        icon: "warning",
        title: title,
        text: message,
        showConfirmButton: true,
    });
};

/**
 * Confirm Dialog
 */
export const showConfirm = (message, title = "Konfirmasi") => {
    return Swal.fire({
        icon: "question",
        title: title,
        text: message,
        showCancelButton: true,
        confirmButtonText: "Ya, Lanjutkan",
        cancelButtonText: "Batal",
    });
};

/**
 * Info Alert
 */
export const showInfo = (message, title = "Informasi") => {
    return Swal.fire({
        icon: "info",
        title: title,
        text: message,
        showConfirmButton: true,
    });
};