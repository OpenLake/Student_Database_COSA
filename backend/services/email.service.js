const nodemailer = require("nodemailer");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }  
})

async function forgotPasswordSendEmail(email, link){
    const options = {
        from: `COSA Support Team <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset Request – Action Required",
        html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #111;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password.</p>
                    <p>
                        Click the button below to set a new password. This link will expire in 
                        <strong>10 minutes</strong>.
                    </p>
                    <p style="margin: 20px 0;">
                        <a href="${link}" 
                        style="
                            background-color: #151515;
                            color: #fff;
                            padding: 12px 20px;
                            text-decoration: none;
                            border-radius: 5px;
                            display: inline-block;
                        ">
                        Reset Password
                        </a>
                    </p>
                    <p>If you did not request this, you can safely ignore this email.</p>
                    <hr />
                    <p style="font-size: 12px; color: #777;">
                        This is an automated message. Please do not reply.
                    </p>
                </div>       
        ` 
    }

    await transport.sendMail(options,function (res, error) {
      if (error) {
        return res.status(500).json({ message: "Error sending email" });
      }
    });
}


async function newBatchSendEmail(toEmail, ccEmails=[], batchLink, batchObj){
    const approverList = batchObj.approvers.map((a, index) => `
        <div>
            <strong>Approver ${index + 1}:</strong><br/>
            Name: ${a.name}<br/>
            Email: ${a.email}
        </div>
        <br />    
    `).join("");

    const options = {
        from: `COSA Support Team <${process.env.EMAIL_USER}>`,
        to: toEmail,
        cc: ccEmails.join(","),
        subject: "Batch Created Successfully – Action Required from Approvers",
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            
            <h2 style="color: #111;">New Batch Created</h2>

            <p>Hello,</p>

            <p>
                A new batch has been created by the club coordinator. Please find the details below:
            </p>

            <p>
                <strong>Batch Name:</strong> ${batchObj.title}<br/>
                <strong>Event Name:</strong> ${batchObj.event.name}<br/>
                <strong>Description:</strong> ${batchObj.event.description || "N/A"}
                <strong>Created By:</strong> ${batchObj.createdBy}<br/>
                <strong>Created At:</strong> ${batchObj.createdAt}<br/>
            </p>

            <p>
                <strong>Approvers Assigned:</strong><br/>
            </p>
            ${approverList}
            

            <p style="margin: 20px 0;">
                <a href="${batchLink}" 
                style="
                    background-color: #151515;
                    color: #fff;
                    padding: 12px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    display: inline-block;
                ">
                View Batch Details
                </a>
            </p>

            <p>
                <strong>Note for Approvers:</strong> Please review and take the necessary action on this batch.
            </p>

            <p>
                If you have any questions, please contact the coordinator.
            </p>

            <hr />

            <p style="font-size: 12px; color: #777;">
                This is an automated notification. Please do not reply.
            </p>

        </div>
        `
    }

    await transport.sendMail(options,function (res, error) {
      if (error) {
        return res.status(500).json({ message: "Error sending email" });
      }
    });
}

module.exports = {
    forgotPasswordSendEmail,
    newBatchSendEmail
};

