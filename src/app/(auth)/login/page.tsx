"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  })

  const rememberMe = useWatch({ control, name: "rememberMe" })

  async function onSubmit(data: LoginForm) {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      toast.error("Invalid email or password")
      return
    }

    router.push("/timesheets")
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left — form */}
      <div className="flex flex-1 items-center justify-center bg-white px-5 py-10 sm:px-6 sm:py-12">
        <div className="w-full max-w-[400px] space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-10"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  className="h-10 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute top-1/2 right-3 inline-flex -translate-y-1/2 items-center justify-center rounded text-slate-500 transition-colors hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) =>
                  setValue("rememberMe", checked === true)
                }
              />
              <Label htmlFor="rememberMe" className="cursor-pointer font-normal">
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Right — brand panel */}
      <div className="hidden flex-none items-center bg-blue-600 px-5 py-10 sm:px-8 md:flex md:min-h-screen md:flex-1 md:px-12 md:py-12">
        <div className="max-w-sm space-y-4 text-white">
          <p className="text-3xl font-bold tracking-tight sm:text-4xl">
            ticktock
          </p>
          <p className="text-base leading-relaxed text-blue-100">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any
            internet-connected device.
          </p>
        </div>
      </div>
    </div>
  )
}
