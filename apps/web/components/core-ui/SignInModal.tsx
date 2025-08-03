import { Button } from "@repo/ui";

export default function SignInModal() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-black/20 shadow-2xl backdrop-blur-lg border border-white/10 p-6 rounded-2xl w-full max-w-md flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Sign In at Avadhi</h1>
                <p className="text-sm text-gray-400">Sign in to your account to continue</p>
                </div>
                <div className="flex flex-col gap-4">
                    {/* <Input type="email" placeholder="Email" />
                    <Input type="password" placeholder="Password" /> */}
                    <Button variant={"default"} className="w-full cursor-pointer hover:bg-white/60">Continue with Google</Button>
                    <Button variant={"default"} className="w-full cursor-pointer hover:bg-white/60">Continue with GitHub</Button>
                </div>
            </div>
        </div>
    )   
}