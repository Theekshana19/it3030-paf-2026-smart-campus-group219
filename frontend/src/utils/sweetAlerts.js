import Swal from 'sweetalert2';

const baseClasses = {
  popup: 'rounded-2xl',
  title: 'font-headline text-on-surface',
  confirmButton: 'rounded-lg font-semibold px-6 py-2',
  cancelButton: 'rounded-lg font-semibold px-6 py-2',
};

/**
 * @param {{title: string; text: string; confirmText?: string}} args
 */
export async function confirmEmergencyOverrideAlert({
  title = 'Confirm emergency override?',
  text = 'This will publish urgent status schedules to the selected resources. Only continue if the incident is verified.',
  confirmText = 'Yes, apply override',
}) {
  const result = await Swal.fire({
    icon: 'error',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    confirmButtonColor: '#B3261E',
    cancelButtonColor: '#A0A4AB',
    focusCancel: true,
    customClass: baseClasses,
  });
  return result.isConfirmed;
}

export async function confirmDeleteAlert({ title, text, confirmText = 'Delete' }) {
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    confirmButtonColor: '#BA1A1A',
    cancelButtonColor: '#A0A4AB',
    focusCancel: true,
    customClass: baseClasses,
  });
  return result.isConfirmed;
}

/**
 * @param {{title: string; text?: string}} args
 */
export function successAlert({ title, text }) {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 1800,
    showConfirmButton: false,
    customClass: baseClasses,
  });
}

