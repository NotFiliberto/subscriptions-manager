"use client"

import { authenticate } from "@/server/actions/auth"
import { LockClosedIcon } from "@heroicons/react/20/solid"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useFormState, useFormStatus } from "react-dom"
import { useForm } from "react-hook-form"

export default function SignIn() {
	const [errorMessage, dispatch] = useFormState(authenticate, undefined)
	const router = useRouter()

	const { register } = useForm()

	return (
		<>
			<div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8">
					<div>
						<Image
							className="w-auto h-12 mx-auto"
							src="/subscription-managerLogo.png"
							alt="Your Company"
							width={512}
							height={512}
						/>
						<h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
							Accedi al tuo account
						</h2>
						<p className="text-center text-red-600">
							{errorMessage}
						</p>
					</div>
					<form className="mt-8 space-y-6" action={dispatch}>
						<input
							type="hidden"
							name="remember"
							defaultValue="true"
						/>
						<div className="-space-y-px rounded-md shadow-sm">
							<div>
								<label
									htmlFor="email-address"
									className="sr-only"
								>
									Email address
								</label>
								<input
									id="email-address"
									{...register("email")} // name property
									type="text"
									autoComplete="email"
									required
									className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									placeholder="Email o username"
								/>
							</div>
							<div>
								<label htmlFor="password" className="sr-only">
									Password
								</label>
								<input
									id="password"
									{...register("password")} // name property
									type="password"
									autoComplete="current-password"
									required
									className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									placeholder="Password"
								/>
							</div>
						</div>

						{/*  <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    {...register("remember-me")} // name property
                                    type="checkbox"
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="block ml-2 text-sm text-gray-900"
                                >
                                    Ricordami
                                </label>
                            </div>
                        </div> */}

						<div>
							<LoginButton />
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

function LoginButton() {
	const { pending } = useFormStatus()

	return (
		<button
			type="submit"
			className="relative flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md group hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			aria-disabled={pending}
		>
			<span className="absolute inset-y-0 left-0 flex items-center pl-3">
				<LockClosedIcon
					className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400"
					aria-hidden="true"
				/>
			</span>
			Accedi
		</button>
	)
}
