import React from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
function KickOut() {
  let navigate = useNavigate();
  sessionStorage.clear();
  return (
    <Layout>
      <div className="flex flex-col space-y-4 min-h-[60vh] items-center justify-center">
        <p>
          You have been removed from the quiz session by the teacher. You will
          no longer have access to this session.
        </p>
        <button
          className="bg-gray-800 text-white w-max text-center m-auto auto p-4 py-2"
          onClick={() => {
            navigate("/");
          }}
        >
          Register
        </button>
      </div>
    </Layout>
  );
}

export default KickOut;
