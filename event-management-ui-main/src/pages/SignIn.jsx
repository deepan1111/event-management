
// import { useState } from "react";
// import { FcGoogle } from "react-icons/fc";
// import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { auth } from "../firebase";
// import { useNavigate, Link } from "react-router-dom";  // ✅ FIXED (Link added)
// import { toast } from "react-hot-toast";

// export default function SignIn() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) =>
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   // Email/Password Sign-In
//   const handleEmailSignIn = async (e) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, formData.email, formData.password);
//       toast.success("Signed in successfully!");
//       navigate("/");
//     } catch (error) {
//       toast.error("Invalid credentials");
//       console.error(error.message);
//     }
//   };

//   // Google Sign-In
//   const handleGoogleSignIn = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       await signInWithPopup(auth, provider);
//       toast.success("Signed in with Google");
//       navigate("/");
//     } catch (error) {
//       toast.error("Google sign-in failed");
//       console.error(error.message);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen items-center justify-center bg-blue-800">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
//         <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign In</h1>

//         {/* Email/Password Form */}
//         <form className="space-y-4" onSubmit={handleEmailSignIn}>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               placeholder="youremail@email.com"
//               className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               placeholder="********"
//               className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Remember + Forgot */}
//           <div className="flex items-center justify-between text-sm text-gray-500">
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" />
//               Remember me
//             </label>
//             <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
//           >
//             Sign In
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="flex items-center my-4">
//           <div className="flex-grow border-t border-gray-300"></div>
//           <span className="mx-4 text-gray-500 font-medium">OR</span>
//           <div className="flex-grow border-t border-gray-300"></div>
//         </div>

//         {/* Google OAuth */}
//         <div className="flex flex-col gap-4 my-4">
//           <button
//             type="button"
//             onClick={handleGoogleSignIn}
//             className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-500 text-black p-3 rounded-lg transition shadow-sm hover:shadow-md font-medium"
//           >
//             <FcGoogle className="text-xl" />
//             Sign in with Google
//           </button>
//         </div>

//         {/* Signup Link */}
//         <p className="mt-6 text-center text-sm text-gray-500">
//           Don’t have an account?{" "}
//           <Link to="/sign-up" className="text-blue-600 hover:underline">
//             Sign up
//           </Link>
//         </p>

//         {/* Admin Signup */}
//         <p className="text-sm font-light text-gray-500 text-center p-4">
//           Are you an Admin?
//           <Link to="/admin/sign-up">
//             <span className="font-medium inline text-blue-600 hover:underline ml-1">
//               Admin Signup
//             </span>
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Check if user is admin
  const checkUserRole = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.role === "admin" || userData.isAdmin === true;
      }
      return false;
    } catch (error) {
      console.error("Error checking user role:", error);
      return false;
    }
  };

  // Email/Password Sign-In
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const isAdmin = await checkUserRole(userCredential.user.uid);
      
      toast.success("Signed in successfully!");
      
      // Redirect based on role
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Invalid credentials");
      console.error(error.message);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const isAdmin = await checkUserRole(userCredential.user.uid);
      
      toast.success("Signed in with Google");
      
      // Redirect based on role
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Google sign-in failed");
      console.error(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-blue-800">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign In</h1>

        {/* Email/Password Form */}
        <form className="space-y-4" onSubmit={handleEmailSignIn}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="youremail@email.com"
              className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="********"
              className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google OAuth */}
        <div className="flex flex-col gap-4 my-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-500 text-black p-3 rounded-lg transition shadow-sm hover:shadow-md font-medium"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>
        </div>

        {/* Signup Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>

        {/* Admin Signup */}
        <p className="text-sm font-light text-gray-500 text-center p-4">
          Are you an Admin?
          <Link to="/admin/sign-up">
            <span className="font-medium inline text-blue-600 hover:underline ml-1">
              Admin Signup
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
