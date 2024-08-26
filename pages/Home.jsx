import React from "react";
import Layout from "../components/Layout";
import { NavLink } from "react-router-dom";
function Home() {
  return (
    <div className="p-4  flex flex-col items-center justify-center h-[100vh] bg-blue-500 text-white">
      <h1 className="font-bold text-2xl w-[60%] text-center">
        Empowering educators and students with seamless quiz experiences.
      </h1>
      <h2 className="py-2 text-lg ">
        Please choose one of the options below to proceed
      </h2>
      <div className="mt-8 mx-auto flex justify-center">
        <NavLink to="/student">
          <button className="p-4  text-sm bg-gray-800 text-white w-52 m-4">
            I am a Student
          </button>
        </NavLink>
        <NavLink to="/teacher">
          <button className="p-4  text-sm bg-gray-800 text-white w-52 m-4">
            I am a Teacher
          </button>
        </NavLink>
      </div>
    </div>
  );
}
export default Home;
