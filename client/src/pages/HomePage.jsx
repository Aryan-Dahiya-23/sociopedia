/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Header, NewPost, Posts, Navigation, Pulse } from "./index"
import { AuthContext } from "../contexts/AuthContext";

const HomePage = () => {

    const { loggedIn, setLoggedIn } = useContext(AuthContext);
    const { userId, setUserId } = useContext(AuthContext);
    const { user, setUser } = useContext(AuthContext);
    const { posts, setPosts } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true)

    const VITE_URL = import.meta.env.VITE_URL;

    useEffect(() => {
        const delay = 1000;

        const fetchPostsDelayed = async () => {
            if (!loggedIn) {
                try {
                    const response = await axios.get(
                        `${VITE_URL}/fetchposts?id=${0}`
                    );
                    if (response.status === 200) {
                        setPosts(response.data);
                        setIsLoading(false)
                    } else {
                        alert("Error in loading posts");
                    }
                } catch (err) {
                    alert("Error in loading posts");
                }
            }
        };

        const timerId = setTimeout(fetchPostsDelayed, delay);

        return () => clearTimeout(timerId);
    }, [loggedIn]);

    useEffect(() => {

        const fetchPosts = async () => {
            if (userId) {
                try {
                    const response = await axios.get(
                        `${VITE_URL}/fetchposts?id=${userId}`
                    );
                    if (response.status === 200) {
                        setPosts(response.data);
                        setIsLoading(false)
                    } else {
                        alert("Error in loading posts");
                    }
                } catch (err) {
                    alert("Error in loading posts");
                }
            }
        };

        fetchPosts();

    }, [userId]);

    return (
        <div>
            <Header />
            <NewPost />

            {isLoading &&
                <div className="max-h-screen w-[95%] m-auto mt-[7.5%] space-y-5 lg:w-2/5 lg:ml-[32.5%] lg:mt-44 ">
                    <Pulse imageHeight="h-14" imageWidth="w-14" height="h-4" />
                    <Pulse imageHeight="h-14" imageWidth="w-14" height="h-4" />
                    <Pulse imageHeight="h-14" imageWidth="w-14" height="h-4" />
                    <div className="lg:hidden">
                        <Pulse imageHeight="h-14" imageWidth="w-14" height="h-4" />
                    </div>
                </div>
            }

            {posts && !isLoading &&
                <Posts posts={posts} />
            }

            <Navigation />
        </div>
    );
}

export default HomePage;



