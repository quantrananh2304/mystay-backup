export const onlyPhoneNumber = (e) => {
  const charCode = e.which ? e.which : e.keyCode
  if ((e.srcElement.value === 0 && charCode === 48) || charCode === 46) {
    e.preventDefault()
  }
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    e.preventDefault()
  } else {
    return true
  }
}
