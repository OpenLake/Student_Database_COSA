import GoogleIcon from "@mui/icons-material/Google";
import cosa from "../../assets/COSA.png";
import backgroundImage from "../../assets/iitbh.jpg";

export default function Register() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Blur Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          zIndex: 0,
        }}
      />
      {/* Shade Overlay */}
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }} />

      {/* Main container */}
      <div
        className="flex flex-wrap flex-col-reverse lg:flex-row items-center justify-center gap-12 lg:gap-16 w-full max-w-7xl relative"
        style={{ zIndex: 2 }}
      >
        <div className="w-full max-w-md">
          <div
            className="bg-white p-12 rounded-xl shadow-md"
            style={{
              boxShadow: `
                0 20px 40px rgba(0, 0, 0, 0.15),
                0 10px 20px rgba(0, 0, 0, 0.1)
              `,
            }}
          >
            <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
            <hr className="mb-6" />

            {/* Google Register */}
            <a
              href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}
              className="block"
            >
              <button
                type="button"
                className="w-full bg-[#23659C] text-white py-3 rounded-md flex items-center justify-center space-x-2 hover:opacity-90 font-medium transition-all"
              >
                <span>Sign up with Google</span>
                <GoogleIcon />
              </button>
            </a>

            <p className="text-center text-sm mt-6 p-2">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#23659C] hover:underline font-medium"
              >
                Login
              </a>
            </p>
          </div>
        </div>

        {/* CoSA Logo */}
        <div className="flex flex-col items-center text-white w-full max-w-xs mb-8 lg:mb-0">
          <img src={cosa} alt="CoSA Logo" className="w-52 h-52 mb-6" />
          <h1 className="text-2xl font-semibold">CoSA</h1>
        </div>
      </div>
    </div>
  );
}
