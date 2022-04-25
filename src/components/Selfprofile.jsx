import axios from "axios";
import React, { useEffect, useState } from "react";
import { APIUPDATEUSERDETAILS_URL,APIUSERDP_URL } from "../config";
import UserlistWidget from "./UserlistWidget";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./Spinner";
import { postData } from "../services/userservice";

export default function Selfprofile({ user, suggestFriend ,refresh }) {
  const [toogle, setToogle] = useState(false);
  const [userdata, setUserData] = useState("");
  const [Refresh, setRfresh] = useState(0);
  const [inputs, setInputs] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    designation: user.designation,
    website: user.website,
    gender: user.gender,
    birthday: user.birthday,
    city: user.city,
    state: user.state,
    zip: user.zip,
  });

  useEffect(() => {
    axios
      .get(`${APIUSERDP_URL}${user._id}`, { withCredentials: true })
      .then((res) => {        
        setUserData(res.data.picture_url);       
      })
      .catch((err) => console.log(err.message));
  }, [Refresh]);

  const OnInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const updateData = () => postData(inputs,user,refresh,setRfresh,Refresh)

  // const postData = async (e) => {
  //   e.preventDefault();
  //   if (
  //     inputs.firstname == undefined ||
  //     inputs.lastname === undefined ||
  //     inputs.gender === undefined ||
  //     inputs.birthday === undefined
  //   ) {
  //     toast.warn("Please fill the details");
  //   } else if (
  //     inputs.firstname == "" ||
  //     inputs.lastname === "" ||
  //     inputs.gender === "" ||
  //     inputs.birthday === ""
  //   ) {
  //     toast.warn("Please fill the details");
  //   } else {
  //     const {
  //       firstname,
  //       lastname,
  //       designation,
  //       website,
  //       gender,
  //       birthday,
  //       city,
  //       state,
  //       zip,
  //     } = inputs;
  //     console.log(inputs);
  //     const res = await fetch(`${APIUPDATEUSERDETAILS_URL}${user._id}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         firstname,
  //         lastname,
  //         designation,
  //         website,
  //         gender,
  //         birthday,
  //         city,
  //         state,
  //         zip,
  //       }),
  //     })
  //       .then((res) => {
  //         toast.success("data updated successfully");
  //         setRfresh(Refresh + 1);
  //         refresh()
  //       })
  //       .catch((err) => {
  //         toast.error("Something wents wrong!!!");
  //       });

  //     const result = await res.json();
  //     if (result.status === 422 || !result) {
  //       console.log("success");
  //     } else {
  //       console.log("failed");
  //     }
  //   }
  // };

  const maleToggle = () => {
    document.getElementById("female").checked = false;
    document.getElementById("male").checked = true;
    document.getElementById("labelMale").className += " bg-success";
    document.getElementById("labelFemale").classList.remove("bg-success");
    const setMale = "Male";
    setInputs({ ...inputs, gender: setMale });
  };
  const femaleToggle = () => {
    document.getElementById("male").checked = false;
    document.getElementById("female").checked = true;
    document.getElementById("labelFemale").className += " bg-success";
    document.getElementById("labelMale").classList.remove("bg-success");
    const setFemale = "Female";
    setInputs({ ...inputs, gender: setFemale });
  };
  const reset = () => {
    setInputs({
      firstname: "",
      lastname: "",
      designation: "",
      website: "",
      gender: "",
      birthday: "",
      city: "",
      state: "",
      zip: "",
    });
  };
  const inputpic = (e) => {    
    setToogle(true);
    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("upload_preset", "buzz-app-pic");
    data.append("cloud_name", "buzz-social-app");
    fetch("https://api.cloudinary.com/v1_1/buzz-social-app/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        fetch(`${APIUPDATEUSERDETAILS_URL}${user._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pic_url: data.url,           
          }),
        }).then((r) =>{
          refresh();
          setRfresh(Refresh + 1)});

        toast.success("Picture change successfully");
       
        setToogle(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div style={{ backgroundColor: "#F0F2F5" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-9 bg-white mt-3 p-2 shadow-lg  bg-body rounded">
              <div className="">
                <div className="">
                  <img
                    src="https://images.unsplash.com/photo-1495277493816-4c359911b7f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1165&q=80"
                    className="coverpic"
                  />
                </div>
                <div className="position-relative profilepic mid">
                  <div className="">
                    {"picture_url" in user ? (
                      <img src={userdata} className="profilepic" />
                    ) : (
                      <i className="fa-solid fa-user fa-5x profilepic d-flex justify-content-center align-items-center bg-warning"></i>
                    )}
                  </div>

                  <div className="position-absolute bottom-0 end-0">
                    <input
                      type="file"
                      className="camera"
                      onChange={(e) => {
                        inputpic(e);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex ">
                <div>
                  <h1 className="mt-2">
                  {"firstname" in user?user.firstname + ' ' + user.lastname:"Edit Profile"}
                  </h1>
                </div>
                <div className="d-flex align-items-center">
                  {toogle ? <Spinner></Spinner> : ""}
                </div>
              </div>

              <div>
                <form method="POST">
                  {/* 1st Row  */}
                  <div className="row mt-4">
                    <div className="col-md-4 ">
                      <label htmlFor="floatingInput">First Name</label>
                      <input
                        type="text"
                        value={inputs.firstname}
                        className="form-control mt-2"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        name="firstname"
                        placeholder="First Name"
                        onChange={(e) => OnInputChange(e)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="floatingInput">Last Name</label>
                      <input
                        type="text"
                        value={inputs.lastname}
                        className="form-control mt-2"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        name="lastname"
                        placeholder="Last Name"
                        onChange={(e) => OnInputChange(e)}
                      />
                    </div>
                  </div>

                  {/* 2nd Row  */}

                  <div className="row mt-4">
                    <div className="col-md-4">
                      <label htmlFor="floatingInput">Designation</label>
                      <br />
                      <select
                        name="designation"
                        value={inputs.designation}
                        onChange={(e) => OnInputChange(e)}
                        className="form-control mt-2"
                      >
                        <option value="" disabled="true" selected="true">
                          Select Designation
                        </option>
                        <option value="Co-Founder">Co-Founder</option>
                        <option value="Co-Founder">
                          Cheif-Technical-Officer
                        </option>
                        <option value="Co-Founder">
                          Cheif-finecial-officer
                        </option>
                        <option value="Software-Developer">
                          Software-Developer
                        </option>
                        <option value="Tech Support">Tech Support</option>
                        <option value="HR-Depatment">HR-Depatment</option>
                        <option value="Account-Department">
                          Account-Department
                        </option>
                        <option value="Sales-Department">
                          Sales-Department
                        </option>
                        <option value="OTT-Department">OTT-Department</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="floatingInput">My Website</label>
                      <input
                        type="text"
                        value={inputs.website}
                        className="form-control mt-2"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        name="website"
                        placeholder="www.domain.com"
                        onChange={(e) => OnInputChange(e)}
                      />
                    </div>
                  </div>

                  {/* 3rd Row  */}
                  <div className="row mt-4">
                    <div className="col-md-4">
                      <label htmlFor="floatingInput">Gender</label>
                      <div className="border p-1 mt-2">
                        <input
                          type="radio"
                          className="btn-check"
                          name="gender"
                          id="male"
                          onChange={(e) => OnInputChange(e)}
                          value="Male"
                        />
                        <label
                          className="btn border-success w-50 "
                          id="labelMale"
                          value="Male"
                          onClick={maleToggle}
                        >
                          Male
                        </label>

                        <input
                          type="radio"
                          className="btn-check"
                          name="gender"
                          id="female"
                          onChange={(e) => OnInputChange(e)}
                          value="Female"
                        />
                        <label
                          className="btn border-success w-50"
                          id="labelFemale"
                          value="Female"
                          onClick={femaleToggle}
                        >
                          Female
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="floatingInput">Birthday</label>

                      <input
                        type="date"
                        className="form-control mt-2"
                        value={inputs.birthday}
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        name="birthday"
                        placeholder="website"
                        onChange={(e) => OnInputChange(e)}
                      />
                    </div>
                  </div>

                  {/* 4th Row  */}
                  <div className="row mt-4">
                    <div className="col-md-4">
                      <label htmlFor="floatingInput">City</label>
                      <input
                        type="text"
                        value={inputs.city}
                        className="form-control mt-2"
                        id="exampleInputEmail1"
                        name="city"
                        aria-describedby="emailHelp"
                        placeholder="City"
                        onChange={(e) => OnInputChange(e)}
                      />
                    </div>
                    <div className=" d-flex col-md-4">
                      <div className="col">
                        <label htmlFor="floatingInput">state</label>
                        <select
                          name="state"
                          id="state"
                          value={inputs.state}
                          onChange={(e) => OnInputChange(e)}
                          className="form-control mt-2"
                        >
                          <option value="" disabled="true" selected="true">
                            Select State
                          </option>
                          <option value="Andaman and Nicobar (UT)">
                            Andaman and Nicobar (UT)
                          </option>
                          <option value="Andhra Pradesh">
                            Andhra Pradesh
                          </option>
                          <option value="Arunachal Pradesh">
                            Arunachal Pradesh
                          </option>
                          <option value="Assam">Assam</option>
                          <option value="Chandigarh (UT)">
                            Chandigarh (UT)
                          </option>
                          <option value="Chhattisgarh">Chhattisgarh</option>
                          <option value="Dadra and Nagar Haveli (UT)">
                            Dadra and Nagar Haveli (UT)
                          </option>
                          <option value="Bihar">Bihar</option>
                          <option value="Daman and Diu (UT)">
                            Daman and Diu (UT)
                          </option>
                          <option value="Delhi">Delhi</option>
                          <option value="Goa">Goa</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Haryana">Haryana</option>
                          <option value="Himachal Pradesh">
                            Himachal Pradesh
                          </option>
                          <option value="Jammu and Kashmir">
                            Jammu and Kashmir
                          </option>
                          <option value="Jharkhand">Jharkhand</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Lakshadweep (UT)">
                            Lakshadweep (UT)
                          </option>
                          <option value="Madhya Pradesh">
                            Madhya Pradesh
                          </option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Manipur">Manipur</option>
                          <option value="Meghalaya">Meghalaya</option>
                          <option value="Mizoram">Mizoram</option>
                          <option value="Nagaland">Nagaland</option>
                          <option value="Orissa">Orissa</option>
                          <option value="Puducherry (UT)">
                            Puducherry (UT)
                          </option>
                          <option value="Punjab">Punjab</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Sikkim">Sikkim</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Tripura">Tripura</option>
                          <option value="Uttar Pradesh">
                            Uttar Pradesh
                          </option>
                          <option value="Uttarakhand">Uttarakhand</option>
                          <option value="West Bengal">West Bengal</option>
                        </select>
                      </div>
                      <div className="col">
                        <label htmlFor="floatingInput">Zip</label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          id="exampleInputEmail1"
                          name="zip"
                          value={inputs.zip}
                          aria-describedby="emailHelp"
                          placeholder="Zip"
                          onChange={(e) => OnInputChange(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex mt-5">
                    <button
                      type="submit"
                      className="btn btn-success me-3"
                      onClick={updateData}
                    >
                      Save
                    </button>
                    <div className="btn border border-primary " onClick={reset}>
                      ResetAll
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {/**part for suggestion */}
            <div className="col-md-3 profile-sidebar mt-3">
              <UserlistWidget
                title="Friends Sugesstion"
                friendList={suggestFriend}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer theme="colored" />
    </>
  );
}