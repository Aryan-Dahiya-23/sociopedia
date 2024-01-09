import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { toast } from "react-toastify";

const SignUp = () => {
    const navigate = useNavigate();

    const [profileImage, setProfileImage] = useState(null);
    const [fName, setfName] = useState("");
    const [lName, setlName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [hover, setHover] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const VITE_URL = import.meta.env.VITE_URL;

    const handleProfileImage = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handlefName = (e) => {
        setfName(e.target.value);
    };

    const handlelName = (e) => {
        setlName(e.target.value);
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleUsername = (e) => {
        setUsername(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleMouseEnter = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!profileImage) return toast.error("Please choose a profile picture.")
        if (!fName || !lName || !email || !username || !password) return toast.error("Please fill the entries properly")

        setIsLoading(true)

        const formData = new FormData();
        formData.append("image", profileImage);

        const imgbbKey = import.meta.env.VITE_BB_SECRET_KEY;
        const imgbbResponse = await fetch(
            `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
            {
                method: "POST",
                body: formData,
            }
        );
        const imgbbData = await imgbbResponse.json();
        const imageUrl = imgbbData.data.url;
        let userData = {
            fName: fName,
            lName: lName,
            email: email,
            username: username,
            password: password,
            profileImageUrl: imageUrl,
        };

        try {
            const response = await axios.post(
                VITE_URL + "/register",
                userData,
                {}
            );

            if (response.status === 201) {
                toast.success("Congratulations! You've successfully signed up.");
                navigate("/signin");
            } else {
                toast.error("An error occurred during registration, Please Try Again!");
            }
        } catch (error) {
            if (error.response.data.error === "Email already exists") {
                toast.error("Email already exists");
            } else if (error.response.data.error === "Username already exists") {
                toast.error("Username already exists");
            } else {
                toast.error("An error occurred during registration, Please Try Again!");
            }
            console.log(error.response);
        }

        setIsLoading(false);
    };

    return (
        <div className="bg-white flex flex-col items-center w-[95%] m-auto mt-6 rounded-lg lg:w-1/2 lg:mt-6">
            <div className="w-11/12 text-[.75rem] font-semibold py-4 md:text-base">
                Welcome To Sociopedia, the Social Media for Sociopaths!
            </div>

            <div className="w-11/12 flex flex-col mt-2 space-y-6">
                <form className="flex flex-col space-y-6">
                    <div className="flex flex-row m-auto">
                        <label
                            className="relative cursor-pointer"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleProfileImage}
                            />

                            {/* {fName && lName && !profileImage ? (
                                <Avatar
                                    {...stringAvatar(fName + " " + lName)}
                                    alt="User"
                                    className={`m-auto ${hover ? "opacity-70" : ""} `}
                                />
                            ) : (
                                <Avatar
                                    alt="User"
                                    src={profileImage ? URL.createObjectURL(profileImage) : ""}
                                    sx={{ width: 150, height: 150 }}
                                    className={`m-auto ${hover ? "opacity-70" : ""} `}
                                />
                            )} */}

                            <Avatar
                                alt="User"
                                src={profileImage ? URL.createObjectURL(profileImage) : ""}
                                sx={{ width: 150, height: 150 }}
                                className={`m-auto ${hover ? "opacity-70" : ""} `}
                            />

                            <div
                                className={`absolute inset-0 flex justify-center items-center font-semibold ${profileImage ? "text-white" : "text-primary-500"
                                    } ${hover ? "inline-block" : "hidden"} `}
                            >
                                <EditOutlinedIcon />
                                <h1>Add Photo</h1>
                            </div>
                        </label>
                    </div>

                    <div className="flex flex-col space-y-6 lg:flex-row lg:justify-between lg:space-y-0">
                        <input
                            className="py-2 pl-1 border border-gray-400 rounded-md lg:w-[47%] focus:border-primary-500 focus:outline-none"
                            type="text"
                            name="firstname"
                            placeholder="First Name"
                            onChange={handlefName}
                        />

                        <input
                            className="py-2 pl-1 border border-gray-400 rounded-md lg:w-[47%] focus:border-primary-500 focus:outline-none"
                            type="text"
                            name="lastname"
                            placeholder="Last Name"
                            onChange={handlelName}
                        />
                    </div>

                    <div className="flex flex-col space-y-6">
                        <input
                            className="py-2 pl-1 border border-gray-400 rounded-md focus:border-primary-500 focus:outline-none"
                            type="text"
                            name="email"
                            placeholder="Email Address"
                            onChange={handleEmail}
                        />

                        <input
                            className="py-2 pl-1 border border-gray-400 rounded-md focus:border-primary-500 focus:outline-none"
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={handleUsername}
                        />

                        <input
                            className="py-2 pl-1 border border-gray-400 rounded-md focus:border-primary-500 focus:outline-none"
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handlePassword}
                        />
                    </div>
                </form>

                {isLoading ?
                    <button className="bg-primary-400 w-full py-2 text-white rounded-md hover:bg-primary-300">
                        Processing...
                    </button>
                    :
                    <button className="bg-primary-400 w-full py-2 text-white rounded-md hover:bg-primary-300" onClick={handleSubmit} >
                        Sign Up
                    </button>
                }

            </div>

            <div className="w-11/12 py-4 text-primary-400 text-sm  hover:text-primary-500">
                <Link
                    to="/signin"
                    className="border-b-2 border-primary-400 hover:border-primary-500"
                >
                    Already have an Account? Sign In here
                </Link>
            </div>
        </div>
    );
};

export default SignUp;
