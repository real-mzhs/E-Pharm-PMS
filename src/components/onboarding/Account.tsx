import SlidePage from "@/components/SlidePage.tsx";
import Logo from "@/assets/logo.png";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import OnboardingContext from "@/context/OnboardingContext.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import useOnboardingNavigation from "@/hooks/useOnboardingNavigation.ts";

interface FormData {
  firstName: string;
  lastName: string;
  password: string;
}

const Account = () => {
  const navigate = useNavigate();
  const goToStep = useOnboardingNavigation();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { formData, updateFormData } = useContext(OnboardingContext);
  const from = location.state?.from?.pathname || "/onboarding";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // useEffect(() => {
  //   if (formData.email === "") {
  //     navigate(from);
  //   }
  // }, []);

  const onSubmit = async (data: FormData) => {
    updateFormData({
      accountCreated: true,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    });

    goToStep("pharmacy");
  }

  return (
    <SlidePage>
      <div className="grid gap-4">
        <div className="text-center">
          <img src={Logo} alt="Logo" className="mx-auto" />
          <h1 className="text-3xl font-medium">Create your account</h1>
          <p>
            Let's start by setting up your personal account. This will be used
            to manage your pharmacy on E-Pharm.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-12">
          <div className="grid gap-4">
            <div className="flex gap-4">
              <div className="w-full">
                <Input
                  type="text"
                  label="First name"
                  autoComplete="given-name"
                  autoCorrect="off"
                  autoCapitalize="on"
                  {...register("firstName", { required: "Required" })}
                  className={`${errors.firstName && "border-red-500 "}`}
                />
                <p className="w-full h-3 text-xs text-red-500">
                  {errors.firstName?.message}
                </p>
              </div>
              <div className="w-full">
                <Input
                  type="text"
                  label="Last name"
                  autoComplete="family-name"
                  autoCorrect="off"
                  autoCapitalize="on"
                  {...register("lastName", { required: "Required" })}
                  className={`${errors.lastName && "border-red-500 "}`}
                />
                <p className="w-full h-3 text-xs text-red-500">
                  {errors.lastName?.message}
                </p>
              </div>
            </div>
            <div className="grid gap-1">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  autoCorrect="off"
                  autoComplete="new-password"
                  {...register("password", {
                    required: true,
                    validate: {
                      minLength: (value: string) => value.length >= 8,
                      complex: (value: string) =>
                        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(value),
                    },
                  })}
                  className={`${errors.password && "border-red-500"}`}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 focus:outline-none text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              <div
                className={`ml-2 flex gap-1 ${errors.password?.type === "required" || errors.password?.type === "minLength" ? "text-red-500" : "text-muted-foreground"}`}
              >
                <X className="h-4 w-4" />
                <label className="text-xs">Minimum 8 characters</label>
              </div>
              <div
                className={`ml-2 flex gap-1 ${errors.password?.type === "required" || errors.password?.type === "complex" ? "text-red-500" : "text-muted-foreground"}`}
              >
                <X className="h-4 w-4" />
                <label className="text-xs">
                  Uppercase, lowercase letters, and one number
                </label>
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </SlidePage>
  );
};
export default Account;
