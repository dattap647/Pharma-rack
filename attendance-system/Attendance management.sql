CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role_id INT,
    manager_id INT,
    status ENUM('active', 'blocked', 'pending') NOT NULL,
    approval_id INT, -- New field: to store the ID of the approving manager/admin
    FOREIGN KEY (role_id) REFERENCES Roles(role_id),
	INDEX idx_email (email),
	INDEX idx_username (username),
    FOREIGN KEY (manager_id) REFERENCES Users(user_id),
    FOREIGN KEY (approval_id) REFERENCES Users(user_id)
);

CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

CREATE TABLE Attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date DATE,
    status ENUM('Pending', 'Approved', 'Rejected') NOT NULL,
	total_hours DECIMAL(5, 2),
	INDEX idx_user_id (user_id),
	INDEX idx_date (date),
	INDEX idx_status (status),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
	CONSTRAINT unique_user_date UNIQUE (user_id, date);
);

CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    message TEXT,
    is_read BOOLEAN DEFAULT 0,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id)
);


INSERT INTO `attendancesystem`.`roles` (`role_name`) VALUES ('admin');
INSERT INTO `attendancesystem`.`roles` (`role_name`) VALUES ('manager');
INSERT INTO `attendancesystem`.`roles` (`role_name`) VALUES ('user');

alter table attendancesystem.users DROP email;
alter table attendancesystem.users CHANGE username email varchar(255); 

CREATE TABLE manager_request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
	manager_id INT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
	request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
	approval_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
	FOREIGN KEY (manager_id) REFERENCES Users(user_id)
);