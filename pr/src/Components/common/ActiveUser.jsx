import React, { useState } from "react";
import { getRole } from "../../auth";
import { toast } from "react-toastify";
import { Button, Input } from "reactstrap";
import { UserRole, UserStatus } from "../../auth/user-service";
const ActiveUser = ({ user, key, handleUpdate }) => {
  const role = getRole();
  const [data, setData] = useState({
    userId: user.user_id,
    status: user.status,
    role: user.role_id,
  });
  const [edit, setEdit] = useState(false);
  const status = [
    {
      id: 1,
      status: "active",
    },
    {
      id: 2,
      status: "blocked",
    },
  ];
  const roles = [
    {
      role_id: 1,
      role: "Admin",
    },
    {
      role_id: 2,
      role: "Manager",
    },
    {
      role_id: 3,
      role: "User",
    },
  ];
  const updateUserStatus = () => {
    UserStatus(data.userId, data.status)
      .then((response) => {
        setEdit(!edit);
        toast.success("Status updated Successfully");
        handleUpdate();
      })
      .catch((error) => {
        toast.error("something went wrong");
        console.error("Error updating user data:", error);
      });
  };

  const updateUserRole = () => {
    const requestData = {
      user_ids: [data.userId],
      role: data.role,
    };

    UserRole(requestData)
      .then((response) => {
        console.log(response.data.data);
        setEdit(!edit);
        toast.success("Role updated Successfully");
        handleUpdate();
      })
      .catch((error) => {
        toast.error("something went wrong");
      });
  };

  const submitStatus = () => {
    switch (role) {
      case 1:
        if (user.role_id !== data.role) updateUserRole();
        if (data.status !== user.status) updateUserStatus();
        break;
      case 2:
        if (data.status !== user.status) updateUserStatus();
        break;
      default:
        return;
    }
  };

  const handleChangeStatus = (e) => {
    setData({
      ...data,
      status: e.target.value,
    });
  };

  const handleChangeRole = (e) => {
    setData({
      ...data,
      role: e.target.value,
    });
  };

  return (
    <div className="row mx-4 my-2" key={key}>
      <div className="col mt-3 ">{user.first_name}</div>
      <div className="col mt-3">{user.email}</div>
      {edit ? (
        <div className="col">
          <Input
            type="select"
            className="w-50"
            value={data.status}
            onChange={(e) => handleChangeStatus(e)}
          >
            <option value="">Select Option</option>
            {status.map((s, i) => (
              <option key={s.id} value={s.status}>
                {s.status}
              </option>
            ))}
          </Input>
        </div>
      ) : (
        <div className="col mt-3">{user.status}</div>
      )}

      {role === 1 ? (
        edit ? (
          <div className="col">
            <Input
              type="select"
              className="w-50"
              value={data.role_id}
              onChange={(e) => handleChangeRole(e)}
            >
              <option value="">Select Option</option>
              {roles.map((role, i) => (
                <option key={role.id} value={role.role_id}>
                  {role.role}
                </option>
              ))}
            </Input>
          </div>
        ) : (
          <div className="col mt-3">{user.role_id}</div>
        )
      ) : null}

      {user.role_id === 3 && role === 1 ? (
        <div className="col mt-3">
          {user.manager_id === null ? "No manager Assign" : user.manager_id}
        </div>
      ) : null}
      <div className="col">
        {edit ? (
          <div className="d-flex gap-1">
            <Button
              className="dark"
              onClick={submitStatus}
              color="success"
              outline
            >
              Save
            </Button>

            <Button
              className="dark"
              onClick={() => setEdit(!edit)}
              color="danger"
              outline
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button className="dark" onClick={() => setEdit(!edit)}>
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActiveUser;
