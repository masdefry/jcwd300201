export const phoneNumberValidation = (phoneNumber: string)=> {
    const phone = /^[0-9]+$/
    return phone?.test(phoneNumber)
}