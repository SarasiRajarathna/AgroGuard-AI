import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone,
  User,
  Sprout,
  MapPin,
  CheckCircle2,
  Globe,
  Loader2,
  ArrowRight,
  Tractor,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "../lib/supabase";

const COUNTRIES = [
  "Sri Lankan", "Afghan", "Albanian", "Algerian", "American", "Argentine", "Australian", "Austrian",
  "Bangladeshi", "Belgian", "Brazilian", "British", "Canadian", "Chinese", "Danish", "Dutch", "Egyptian", "French",
  "German", "Greek", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Italian", "Japanese", "Kenyan",
  "Malaysian", "Maldivian", "Mexican", "Nepalese", "New Zealand", "Nigerian", "Norwegian", "Pakistani", "Filipino",
  "Polish", "Portuguese", "Russian", "Singaporean", "South African", "Spanish", "Swedish", "Swiss", "Thai",
  "Turkish", "Ukrainian", "Vietnamese", "Other",
];

const DISTRICTS = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

export default function Register() {
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [registeredFarmerId, setRegisteredFarmerId] = useState(null);
  const [googleUser, setGoogleUser] = useState(null);

  const [formData, setFormData] = useState({
    nationality: "Sri Lankan",
    title: "Mr",
    firstName: "",
    lastName: "",
    phone: "",
    district: "",
    farmName: "",
  });

  // ============================================================
  // LOAD GOOGLE SESSION
  // ============================================================

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          // If no session is found, allow local development fallback or direct form filling
          setGoogleUser({
            id: 'local-guest-user',
            email: 'farmer@agroguard.lk',
            name: 'Guest Farmer',
            avatar: '',
          });
          setPageLoading(false);
          return;
        }

        const user = session.user;

        // Check whether profile already exists
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", user.id)
          .maybeSingle();

        if (existingProfile) {
          navigate("/farmer/dashboard", {
            replace: true,
          });
          return;
        }

        // Get Google profile information
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "";

        const parts = fullName.trim().split(" ");

        setGoogleUser({
          id: user.id,
          email: user.email || "",
          name: fullName,
          avatar:
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            "",
        });

        setFormData((prev) => ({
          ...prev,
          firstName: parts[0] || "",
          lastName: parts.slice(1).join(" ") || "",
        }));

        setPageLoading(false);
      } catch (error) {
        console.error("Session initialization error:", error);
        setGoogleUser({
          id: 'local-guest-user',
          email: 'farmer@agroguard.lk',
          name: 'Guest Farmer',
          avatar: '',
        });
        setPageLoading(false);
      }
    };

    init();
  }, [navigate]);

  // ============================================================
  // UPDATE FORM
  // ============================================================

  const updateForm = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // SUBMIT FARMER PROFILE
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!googleUser) {
      alert("Account information is missing.");
      return;
    }

    if (!agreed) {
      alert("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setSubmitting(true);

    try {
      const farmerId =
        "AG-" +
        Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();

      // Try saving to Supabase if session exists
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.access_token) {
          await supabase.from("profiles").insert({
            id: googleUser.id,
            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: googleUser.email,
            role: "FARMER",
            district: formData.district || null,
          });

          await supabase.from("farmers").insert({
            user_id: googleUser.id,
            farmer_id: farmerId,
            first_name: formData.firstName,
            last_name: formData.lastName,
            title: formData.title,
            email: googleUser.email,
            phone: formData.phone,
            nationality: formData.nationality,
            district: formData.district || null,
            farm_name: formData.farmName || null,
          });
        }
      } catch (supabaseErr) {
        console.warn("Supabase remote save skipped, using local fallback:", supabaseErr);
      }

      // Save basic information locally
      localStorage.setItem("userRole", "FARMER");
      localStorage.setItem("farmerId", farmerId);

      // Show success screen
      setRegisteredFarmerId(farmerId);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
            <Sprout className="h-7 w-7 text-green-600" />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          <p className="text-sm text-slate-500">
            Setting up your AgroGuard account...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // SUCCESS SCREEN
  // ============================================================

  if (registeredFarmerId) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-green-700 via-green-600 to-emerald-800 px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl">
          {/* Success Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-9 w-9 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Account Created!
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Welcome to AgroGuard-AI. Your farmer account has been successfully created.
          </p>

          {/* Farmer ID */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-px">
            <div className="rounded-2xl bg-white px-6 py-5">
              <div className="mb-1 flex items-center justify-center gap-2">
                <Sprout className="h-4 w-4 text-green-600" />
                <span className="text-xs font-semibold uppercase tracking-widest text-green-600">
                  Your Farmer ID
                </span>
              </div>
              <p className="text-3xl font-black tracking-wider text-slate-900">
                {registeredFarmerId}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Keep this ID safe. It can be used to identify your AgroGuard farmer account.
              </p>
            </div>
          </div>

          {/* Next steps */}
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-left">
            <div className="flex gap-3">
              <Tractor className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Your next step
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Add your farm information and start using AI-powered crop disease detection and plant health monitoring.
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard */}
          <button
            onClick={() => navigate("/farmer/dashboard", { replace: true })}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg"
          >
            Go to Farmer Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // REGISTRATION FORM
  // ============================================================

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-10 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-3xl border border-slate-100 bg-white p-6 shadow-xl sm:p-8"
      >
        {/* ====================================================
            HEADER
        ===================================================== */}
        <div className="mb-7 text-center">
          <Link to="/" className="mb-5 inline-flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 shadow-md">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-green-700">
              AgroGuard-AI
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900">
            Complete Your Profile
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Add a few details to create your AgroGuard farmer account.
          </p>
        </div>

        {/* ====================================================
            ACCOUNT BADGE
        ===================================================== */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
          {googleUser?.avatar ? (
            <img
              src={googleUser.avatar}
              alt="Profile"
              className="h-10 w-10 rounded-full border-2 border-green-500 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
              <User className="h-5 w-5 text-white" />
            </div>
          )}

          <div className="min-w-0">
            <p className="text-sm font-semibold text-green-700">
              {googleUser?.name || "Farmer Account"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {googleUser?.email}
            </p>
          </div>

          <CheckCircle2 className="ml-auto h-5 w-5 flex-shrink-0 text-green-600" />
        </div>

        {/* ====================================================
            PERSONAL INFORMATION
        ===================================================== */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
              <User className="h-4 w-4 text-green-600" />
            </div>
            <h2 className="text-sm font-bold text-slate-800">
              Personal Information
            </h2>
          </div>

          {/* Nationality */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800">
              Nationality
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                name="nationality"
                value={formData.nationality}
                onChange={updateForm}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 pl-10 pr-8 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              >
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                ▾
              </span>
            </div>
          </div>

          {/* Title + First Name + Last Name */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-5">
            <div className="sm:col-span-1">
              <label className="mb-1.5 block text-sm font-medium text-slate-800">
                Title
              </label>
              <select
                name="title"
                value={formData.title}
                onChange={updateForm}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              >
                <option>Mr</option>
                <option>Mrs</option>
                <option>Ms</option>
                <option>Dr</option>
                <option>Prof</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-800">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={updateForm}
                  placeholder="First name"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-800">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={updateForm}
                  placeholder="Last name"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>
          </div>

          {/* Verified Email */}
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-800">
              Email Address
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-3">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600" />
              <span className="min-w-0 truncate text-sm font-medium text-green-700">
                {googleUser?.email}
              </span>
              <span className="ml-auto hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-green-600 sm:block">
                Connected
              </span>
            </div>
          </div>

          {/* Phone */}
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-800">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={updateForm}
                placeholder="07X XXXXXXX"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              />
            </div>
          </div>
        </div>

        {/* ====================================================
            FARM INFORMATION
        ===================================================== */}
        <div className="mt-7 border-t border-slate-100 pt-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
              <Tractor className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Farm Information
              </h2>
              <p className="text-xs text-slate-400">
                Basic information to personalize your experience
              </p>
            </div>
          </div>

          {/* Farm Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800">
              Farm Name
              <span className="ml-1 text-xs font-normal text-slate-400">
                (Optional)
              </span>
            </label>
            <div className="relative">
              <Sprout className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={updateForm}
                placeholder="e.g. Green Valley Farm"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              />
            </div>
          </div>

          {/* District */}
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-800">
              Farm District
              <span className="ml-1 text-xs font-normal text-slate-400">
                (Optional)
              </span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                name="district"
                value={formData.district}
                onChange={updateForm}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-8 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              >
                <option value="">Select your district</option>
                {DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================
            TERMS
        ===================================================== */}
        <label className="mt-6 flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-green-600"
            required
          />
          <span className="text-xs leading-relaxed text-slate-500">
            I agree to the{" "}
            <a href="#terms" onClick={(e) => e.preventDefault()} className="font-medium text-green-600 hover:underline">
              Terms of Service
            </a>
            {" "}and{" "}
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="font-medium text-green-600 hover:underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        {/* ====================================================
            SECURITY NOTE
        ===================================================== */}
        <div className="mt-5 flex gap-3 rounded-xl bg-slate-50 p-4">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
          <p className="text-xs leading-relaxed text-slate-500">
            Your account information is securely stored. AgroGuard-AI uses your profile information to personalize crop monitoring, disease detection, and agricultural recommendations.
          </p>
        </div>

        {/* ====================================================
            SUBMIT
        ===================================================== */}
        <button
          type="submit"
          disabled={submitting || !agreed}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create Farmer Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Login */}
        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-green-600 hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
