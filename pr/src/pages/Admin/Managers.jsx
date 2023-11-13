import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Container,
} from "reactstrap";
import CustomNavbar from "../../Components/CustomNavbar";
import { getToken } from "../../auth";
import axios from "axios";
import CustomButton from "../../Components/common/CustomButton";
const apiUrl = `http://localhost:3001/attendance-management/v1/admin/manager-list`;
const Managers = () => {
  const [open, setOpen] = useState("");
  const [userlist, setUserList] = useState([]);
  const [userlistBymanagerId, setUserListbyManager] = useState([]);
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
      fetchUserbyManagerid(id);
    }
  };
  const fetchManagerList = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token available");
        return;
      }
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log("Console Response... ", response.data.data);
      if (response.data.success) {
        setUserList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching manager list:", error);
    }
  };

  const fetchUserbyManagerid = async (id) => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token available");
        return;
      }
      const response = await axios.get(
        `http://localhost:3001/attendance-management/v1/admin/users-list/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.data.success) {
        console.log("data", response.data.data);
        setUserListbyManager(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching manager list:", error);
    }
  };

  useEffect(() => {
    fetchManagerList();
  }, []);

  return (
    <Container>
      <CustomNavbar />
      <div className="d-flex mt-3 mr-3 mx-3 justify-content-end">
        <CustomButton
          color="black"
          bgcolor="white"
          name={"Back"}
          href="/admin"
        />
      </div>
      <Container className=" my-4">
        <h4 className="text-left my-3 fs-3 fw-bold">Managers</h4>

        <div>
          {userlist.map((u) => {
            return (
              <Accordion flush open={open} toggle={toggle}>
                {" "}
                <AccordionItem>
                  <AccordionHeader targetId={u.user_id}>
                    <p className="h4 fs-5 fw-bold">{u.first_name}</p>
                  </AccordionHeader>
                  <AccordionBody accordionId={u.user_id}>
                  { 
                    userlistBymanagerId.length>0?userlistBymanagerId.map((user) => {
                      return (
                        <div>
                          <div className="row mx-4">
                            <div className="col fs-5 fw-bold">Name</div>
                            <div className="col fs-5 fw-bold">Email</div>
                            <div className="col fs-5 fw-bold">Status</div>
                            <hr className="mx-2 my-2" />
                          </div>
                          <div className="row mx-4 my-2" key={user.user_id}>
                            <div className="col mt-3 ">{user.first_name}</div>
                            <div className="col mt-3">{user.email}</div>
                            <div className="col mt-3">{user.status}</div>
                          </div>
                        </div>
                      );
                    }):<p className='text-center my-2 fs-5 fw-bold'>No User Under {u.first_name}</p>

                  }
                
                  </AccordionBody>
                </AccordionItem>{" "}
              </Accordion>
            );
          })}
        </div>
      </Container>
    </Container>
  );
};

export default Managers;
