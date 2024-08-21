import React from "react";
import Layout from "../components/Layout";
import { NavLink } from "react-router-dom";
function Home() {
  return (
    <Layout title="">
      {" "}
      <div className="p-4  min-h-[99vh] flex items-center justify-center ">
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
    </Layout>
  );
}
export default Home;
