import { useCallback, useContext, useEffect, useState } from "react";
import apiClient from "@/services/api-client.ts";
import { AxiosError } from "axios";
import SlidePage from "@/components/SlidePage.tsx";
import ErrorContext from "@/context/ErrorContext.tsx";
import LoaderContext from "@/context/LoaderContext.tsx";
import OnboardingContext from "@/context/OnboardingContext.tsx";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input.tsx";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import useOnboardingNavigation from "@/hooks/useOnboardingNavigation.ts";

const TIMEOUT_SECONDS = 15;
export const CODE_LENGTH = 6;

interface FormData {
  code: string;
}

const VerifyEmail = () => {
  const { goToStep, goBack } = useOnboardingNavigation();
  const { setError } = useContext(ErrorContext);
  const { loading, setLoading } = useContext(LoaderContext);
  const { formData, updateFormData } = useContext(OnboardingContext);
  const [timeoutSeconds, setTimeoutSeconds] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const disabledButton = () => {
    setTimeoutSeconds(TIMEOUT_SECONDS);
  };

  useEffect(() => {
    if (timeoutSeconds <= 0) return;

    const secondsInterval = setInterval(() => {
      setTimeoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(secondsInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(secondsInterval);
  }, [timeoutSeconds]);

  const resendOTP = useCallback(async () => {
    setLoading(true);
    try {
      await apiClient.post("/user/resend-confirmation-email", {
        email: formData.email,
      });
      disabledButton();
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [formData.email, setError]);

  useEffect(() => {
    if (formData.email === "") {
      goBack();
    } else {
      (async () => {
        await resendOTP();
      })();
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await apiClient.post("/user/confirm-email", {
        email: formData.email,
        code: data.code,
      });
      updateFormData({ code: parseInt(data.code), isAccountConfirmed: true });
      goToStep("account");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SlidePage className="grid gap-4">
      <div>
        <h1 className="text-3xl font-medium mb-2">Lets verify your email</h1>
        <p>
          We've sent you a code to your email address. Please enter it below to
          continue.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-4">
          <div className="w-full px-3 py-2.5 text-sm text-muted-foreground bg-muted rounded-lg border border-neutral-300 cursor-not-allowed">
            <p>{formData.email}</p>
          </div>
          <div>
            <div className="relative">
              <Input
                type="text"
                label="Code"
                autoCorrect="off"
                autoComplete="off"
                disabled={loading}
                {...register("code", {
                  required: "Required",
                  validate: {
                    minLength: (value: string) => value.length === CODE_LENGTH,
                  },
                })}
                className={`${errors.code && "border-red-500"}`}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 felx flex gap-2 focus:outline-none text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={timeoutSeconds > 0}
                onClick={resendOTP}
              >
                {timeoutSeconds > 0 && <label>{timeoutSeconds}</label>}
                <RotateCcw />
              </button>
            </div>
            <p className="w-full h-3 text-xs text-red-500">
              {errors.code?.message}
            </p>
          </div>
        </div>
        <Button type="submit">Continue</Button>
      </form>
    </SlidePage>
  );
};

export default VerifyEmail;
