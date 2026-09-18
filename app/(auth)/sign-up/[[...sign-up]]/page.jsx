import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <SignUp
            appearance={{
                elements: {
                    card: "shadow-sm border border-slate-200 rounded-xl bg-white p-6",
                    headerTitle: "text-xl font-bold text-slate-900",
                    headerSubtitle: "text-slate-500 text-sm",
                    formButtonPrimary: "bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg py-2.5 shadow-none transition-colors",
                    socialButtonsBlockButton: "border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors",
                    formFieldInput: "border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-slate-900 focus:border-slate-900",
                    footerActionLink: "text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                }
            }}
        />
    );
}