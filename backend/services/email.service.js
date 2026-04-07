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

    try {
        await transport.sendMail(options);
    } catch(err) {
        throw new Error(`Error sending email: ${err.message}`);
    }
}


async function newBatchSendEmail(toEmail, ccEmails=[], batchLink, batchObj){
    const approverList = (batchObj.approverList || []).map((a, index) => `
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

    try{
        await transport.sendMail(options);
    }catch(err){
        throw new Error(`Error sending email: ${err.message}`);
    }
}

async function batchStatusSendEmail(toEmail, ccEmails, batchLink, batchObj, action){
    
    const approverList = batchObj.pendingApprovers.map((a, index) => `
        <div>
            <strong>Approver ${index + 1}:</strong><br/>
            Name: ${a.name}<br/>
            Email: ${a.email}
        </div>
        <br />    
    `).join("");

    const Emailformat = {
        "approve": {
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    
                    <h2 style="color: #111;">Batch Approved</h2>

                    <p>Hello,</p>

                    <p>
                        <strong>${batchObj.currentApprover.name}</strong> has approved the batch 
                        <strong>${batchObj.title}</strong> at <strong>Level ${batchObj.approvalLevel}</strong>.
                    </p>

                    <p>
                        <strong>Batch Details:</strong><br/>
                        Batch Name: ${batchObj.title}<br/>
                        Event Name: ${batchObj.event.name}
                        Description: ${batchObj.event.description}
                        Created By: ${batchObj.createdBy}<br/>
                        CreatedAt: ${batchObj.createdAt}<br/>
                        
                    </p>

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
                        <strong>Pending Approval from: </strong><br/>
                        ${approverList}
                    </p>

                    <hr />

                    <p style="font-size: 12px; color: #777;">
                        This is an automated notification. Please do not reply.
                    </p>

                </div>`, 
            subject: "Batch Approved"
        },
        "reject": {
            subject: "Batch Rejected – Notification", 
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

                    <h2 style="color: #c00;">Batch Rejected</h2>

                    <p>Hello,</p>

                    <p>
                        The batch <strong>${batchObj.title}</strong> has been <strong>rejected</strong> by 
                        <strong>${batchObj.currentApprover.name}</strong> at <strong>Level ${batchObj.approvalLevel}</strong>.
                    </p>

                    <p>
                        <strong>Batch Details:</strong><br/>
                        Batch Name: ${batchObj.title}<br/>
                        Event Name: ${batchObj.event.name}
                        Description: ${batchObj.event.description}
                        Created By: ${batchObj.createdBy}<br/>
                        CreatedAt: ${batchObj.createdAt}<br/>
                        
                    </p>

                    <p style="margin: 20px 0;">
                        <a href="${batchLink}" 
                        style="
                            background-color: #c00;
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
                        No further approvals will be processed for this batch. Please contact the approver if you need more information.
                    </p>

                    <hr />

                    <p style="font-size: 12px; color: #777;">
                        This is an automated notification. Please do not reply.
                    </p>

                </div>`
        }
    }

    const options = {
        from: `COSA Support Team <${process.env.EMAIL_USER}>`,
        to: toEmail,
        cc: ccEmails.join(","),
        subject: Emailformat[action].subject,
        html: Emailformat[action].html,
    }

    try{
        if(!["approve", "reject"].includes(action)){
            throw new Error("Invalid action");
        }
        await transport.sendMail(options);
    }catch(err){
        throw new Error(err);
    }

} 

module.exports = {
    forgotPasswordSendEmail,
    newBatchSendEmail,
    batchStatusSendEmail
};

