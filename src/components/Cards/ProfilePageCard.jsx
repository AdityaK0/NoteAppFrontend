import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { MdEmail, MdPerson, MdNote } from 'react-icons/md';

function ProfilePageCard() {
  const { username } = useParams();
  const location = useLocation();
  const userInfo = location.state?.userInfo;

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={() => {}} onSearchClear={() => {}} />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        {userInfo ? (
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden p-6">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-500 text-white text-2xl font-bold">
                {userInfo.fullname.charAt(0)}
              </div>

              <h2 className="text-xl font-semibold mt-3">{userInfo.fullname}</h2>
              <p className="text-gray-500">@{userInfo.username}</p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-3">
                <MdEmail className="text-blue-500 text-xl" />
                <span className="text-gray-700">{userInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MdNote className="text-green-500 text-xl" />
                <span className="text-gray-700">Total Notes: {userInfo.total_notes}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MdPerson className="text-purple-500 text-xl" />
                <span className="text-gray-700">Joined: {new Date(userInfo.date_joined).toDateString()}</span>
              </div>
            </div>

            {/* Logout Button */}
            {/* <button className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
              Logout
            </button> */}
          </div>
        ) : (
          <p className="text-center text-gray-600">No user data found</p>
        )}
      </div>
    </>
  );
}

export default ProfilePageCard;
