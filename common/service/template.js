const verificationTemplate = (key) => {
    return `<div style="text-align: center;">
    <h1>Verify Your Email</h1>
    <p>Thank you for signing up, Please verify your email to complete your registration</p>
    <p>Your verification key: ${key}</p>
</div>`
}

const updateTemplate = (key) => {
    return `<div style="text-align: center;">
    <h1>Verify Your Email</h1>
    <p>Please verify your email to complete your update</p>
    <p>Your verification key: ${key}</p>
</div>`
}

const forgetTemplate = (key) => {
    return `<div style="text-align: center;">
    <h1>Reset password</h1>
    <p>Please verify your reset password key wthin 1 hour</p>
    <p>Your verification key: ${key}</p>
</div>`
}

const verificationCartTemplate = (key) => {
    return `<div style="text-align: center;">
    <h1>Verify Your Email</h1>
    <p>Please verify your email to submit your cart</p>
    <p>Your verification key: ${key}</p>
</div>`
}



module.exports = {
    verificationTemplate,
    updateTemplate,
    forgetTemplate,
    verificationCartTemplate
}