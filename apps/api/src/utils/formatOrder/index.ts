export const formatOrder = () => {
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
    const datePart = `${new Date().getFullYear()}${new Date().getMonth()}`.slice(-4)
    const timePart = Date.now().toString().slice(-4)

    const orderId = `ORD${datePart}${randomPart}${timePart}`;

    return { orderId }
};