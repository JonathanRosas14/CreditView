import type { Metadata } from "next"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = { title: "Login" }

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col-reverse lg:flex-row">
      <div className="flex w-full flex-col bg-[#FCF9F8] px-4 pb-10 sm:px-8 lg:w-[512px] lg:px-16 lg:pb-0">
        <div className="pt-8 pb-8 lg:pt-12 lg:pb-12">
          <span
            className="text-2xl leading-[31.2px]"
            style={{ fontFamily: "var(--font-literata)", color: "#002434" }}
          >
            CreditView
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <LoginForm />
        </div>
      </div>
      <div className="relative flex h-[240px] shrink-0 items-center justify-center overflow-hidden bg-[#002434] lg:h-auto lg:flex-1">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url(/assets/login-bg.png)" }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            className="mx-auto w-full max-w-[384px] rounded-xl p-6 sm:p-[41px]"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
            }}
          >
            <svg
              width="33"
              height="26"
              viewBox="0 0 33 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.5 0L20.4084 10.0916L30.5 14L20.4084 17.9084L16.5 28L12.5916 17.9084L2.5 14L12.5916 10.0916L16.5 0Z"
                fill="#C7E7FC"
              />
            </svg>
            <p
              className="mt-2 text-lg leading-[28px] lg:mt-[8px] lg:text-2xl lg:leading-[31.2px]"
              style={{ fontFamily: "var(--font-literata)", fontStyle: "italic", color: "#fff" }}
            >
              Track smarter, spend wiser — your credit dashboard reimagined.
            </p>
            <div className="my-3 h-px w-12 bg-[#C7E7FC] lg:my-4" />
            <p
              className="text-[10px] uppercase tracking-[1px] lg:text-xs lg:tracking-[1.2px]"
              style={{ color: "#C7E7FC", opacity: 0.8 }}
            >
              MARKET INTELLIGENCE 2026
            </p>
          </div>
        </div>
        <span
          className="absolute bottom-4 right-4 text-xs leading-[16px] tracking-[0.3px] lg:bottom-8 lg:right-8 lg:text-sm lg:leading-[18.2px] lg:tracking-[0.325px]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          &copy; CreditView 2026
        </span>
      </div>
    </div>
  )
}
