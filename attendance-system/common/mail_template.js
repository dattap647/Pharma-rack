const sendMail = require('./nodemailer');
const CommonUtility = require('../utilities/common_utility');
const momemt = require('moment');

async function addAttendanceNotification(user_id, dates, uuid) {
    try {
        const commonUtility = new CommonUtility();
        const result = await commonUtility.getManagerEmail(user_id);
        const subject = `New Attendance added by ${result?.user_name}`;
        const date_formatted = dates.map(date => momemt(date).format('YYYY-MM-DD'));
        const message = `<!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              background-color: #007BFF;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${subject}</h1>
            </div>
            <div class="content">
              <p>Dear ${result?.manager_name},</p>
              <p>This is to inform you that ${result?.user_name} has added new attendance for ${JSON.stringify(date_formatted)}. Please review and approve or reject this attendance record.</p>
              
              <p>To approve or reject this attendance record, please log in to the application and access the attendance management section.</p>
              <p>If you have any questions or concerns, please feel free to contact ${result?.user_name} directly.</p>
              <br/>
              <br/>
              <div> <a href="http://localhost:3000/approve-attendance?status=Approved&token=${uuid}"> Approve </a> | <a href="http://localhost:3000/approve-attendance?status=Rejected&token=${uuid}"> Reject </a> </div>
            </div>
          </div>
        </body>
        </html>
        `
        return sendMail(result?.manager_email, subject, message);
    } catch (error) {
        throw new CustomError(error, error?.statusCode || 500, "addAttendanceNotification");
    }
}

async function sendManagerAssignmentRequestNotification(user_id, manager_id) {
  try {
      const commonUtility = new CommonUtility();
      const user = await commonUtility.getUserByUserId(user_id);
      const manager = await commonUtility.getUserByUserId(manager_id);
      const subject = `Manager assignment request added by ${user?.first_name}`;
      const message = `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background-color: #007BFF;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${subject}</h1>
          </div>
          <div class="content">
            <p>Dear ${manager?.first_name},</p>
            <p>This is to inform you that ${user?.first_name} has added new manager assignment request. Please review and approve or reject this manager assignment request.</p>
            
            <p>To approve or reject this manager assignment request, please log in to the application and access the manager assignment section.</p>
            <p>If you have any questions or concerns, please feel free to contact ${user?.first_name} directly.</p>
          </div>
        </div>
      </body>
      </html>
      `
      return sendMail(manager?.email, subject, message);
  } catch (error) {
      throw new CustomError(error, error?.statusCode || 500, "sendManagerAssignmentRequestNotification");
  }
}

async function registerUserNotification(user_id, manager_id, uuid) {
  try {
      const commonUtility = new CommonUtility();
      const user = await commonUtility.getUserByUserId(user_id);
      const manager = await commonUtility.getUserByUserId(manager_id);
      const subject = `New User Register on platform`;
      const message = `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background-color: #007BFF;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${subject}</h1>
          </div>
          <div class="content">
            <p>Dear ${manager?.first_name},</p>
            <p>This is to inform you that ${user?.first_name} with email ${user?.email} has been register. Please review and approve or reject this user.</p>
            
            <p>To approve or reject this user, please log in to the application and approve or reject this user.</p>
            <br/>
            <br/>
            <div> <a href="http://localhost:3000/approve-user?status=active&token=${uuid}"> Approve </a> | <a href="http://localhost:3000/approve-user?status=blocked&token=${uuid}"> Reject </a> </div>
          </div>
        </div>
      </body>
      </html>
      `
      return sendMail(manager?.email, subject, message);
  } catch (error) {
      throw new CustomError(error, error?.statusCode || 500, "registerUserNotification");
  }
}

async function approveAttendanceNotification(attendance_id, status) {
  try {
      const commonUtility = new CommonUtility();
      const user_details = await commonUtility.getUsersByAttendanceId(attendance_id);
      const subject = `Attendance record with id ${attendance_id} ${status}`;
      const message = `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background-color: #007BFF;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${subject}</h1>
          </div>
          <div class="content">
            <p>Dear ${user_details?.first_name},</p>
            <p>This is to inform you that your attendance regularization request with id ${attendance_id} is ${status}.</p>
            
            <p>If you have any questions or concerns, please feel free to contact your manager directly.</p>
          </div>
        </div>
      </body>
      </html>
      `
      return sendMail(user_details?.email, subject, message);
  } catch (error) {
      throw new CustomError(error, error?.statusCode || 500, "approveAttendanceNotification");
  }
}

async function approveManagerRequestNotification(id, status) {
  try {
      const commonUtility = new CommonUtility();
      const user_details = await commonUtility.getUserByManagerRequestId(id);
      const subject = `Manager assignment request with id ${id} ${status}`;
      const message = `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background-color: #007BFF;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${subject}</h1>
          </div>
          <div class="content">
            <p>Dear ${user_details?.first_name},</p>
            <p>This is to inform you that your manager assignment request with id ${id} is ${status}.</p>
            
            <p>If you have any questions or concerns, please feel free to contact your manager directly.</p>
          </div>
        </div>
      </body>
      </html>
      `
      return sendMail(user_details?.email, subject, message);
  } catch (error) {
      throw new CustomError(error, error?.statusCode || 500, "approveAttendanceNotification");
  }
}

async function approveRegistrationNotification(id, status) {
  try {
      const commonUtility = new CommonUtility();
      const user_details = await commonUtility.getUserByUserId(id);
      const subject = `Your account status is changed to ${status}.`;
      const message = `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background-color: #007BFF;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${subject}</h1>
          </div>
          <div class="content">
            <p>Dear ${user_details?.first_name},</p>
            <p>This is to inform you that your account status is changed to ${status}.</p>
            
            <p>If you have any questions or concerns, please feel free to contact your manager directly.</p>
          </div>
        </div>
      </body>
      </html>
      `
      return sendMail(user_details?.email, subject, message);
  } catch (error) {
      throw new CustomError(error, error?.statusCode || 500, "approveRegistrationNotification");
  }
}

module.exports = {
    addAttendanceNotification,
    sendManagerAssignmentRequestNotification,
    approveAttendanceNotification,
    approveManagerRequestNotification,
    registerUserNotification,
    approveRegistrationNotification
}