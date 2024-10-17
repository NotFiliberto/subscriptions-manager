import { Fragment, useState } from "react"
import { Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/20/solid"
import { CountdownCircleTimer } from "react-countdown-circle-timer"

export type NotificationProps = {
    text: string
    callback?: {
        fn: Function
        text: string
        closeOnFire?: boolean
    }
    countdown?: {
        show?: boolean
        duration?: number
        onCountdownEnd?: Function
    }
}

type NotificationState = {
    show: boolean
    callbackCalled: boolean
    stopCountdown: boolean
}

export default function Notification({
    text,
    callback,
    countdown,
}: NotificationProps) {
    const [state, setState] = useState<NotificationState>({
        show: true,
        callbackCalled: false,
        stopCountdown: false,
    })

    const countdownDuration = countdown?.duration ?? 5

    // called when the user click on the callback
    function handleCallback() {
        callback!.fn() //execute callback

        setState({
            callbackCalled: true,
            show:
                callback?.closeOnFire !== undefined
                    ? !callback.closeOnFire
                    : false, //by default close the notificaiton if the callback is called
            stopCountdown: true,
        })
    }

    return (
        <>
            <div className="flex flex-col items-center w-full space-y-4 sm:items-end">
                {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
                <Transition
                    show={state.show}
                    as={Fragment}
                    enter="transform ease-out duration-500 transition"
                    enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                    enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                    leave="transition ease-in duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
                        <div className="p-4">
                            <div className="flex items-center gap-4">
                                {
                                    <div
                                        className={`${
                                            countdown === undefined ||
                                            countdown.show === false
                                                ? "hidden"
                                                : ""
                                        }`}
                                    >
                                        <CountdownCircleTimer
                                            isPlaying={!state.stopCountdown}
                                            duration={countdownDuration}
                                            size={40}
                                            strokeWidth={4}
                                            colors={[
                                                "#F7B801",
                                                "#A30000",
                                                "#A30000",
                                            ]}
                                            colorsTime={[
                                                countdownDuration,
                                                countdownDuration / 2,
                                                0,
                                            ]}
                                            trailColor="#fff"
                                            onComplete={(totalElapsedTime) => {
                                                //call if defined
                                                countdown?.onCountdownEnd &&
                                                    countdown?.onCountdownEnd()
                                                const { show, ...rest } = state
                                                setState({
                                                    show: false,
                                                    ...rest,
                                                })
                                            }}
                                        />
                                    </div>
                                }

                                <div className="flex justify-between flex-1 w-0">
                                    <p className="flex-1 w-0 text-sm font-medium text-gray-900">
                                        {text}
                                    </p>
                                    {callback && (
                                        <button
                                            type="button"
                                            className="flex-shrink-0 ml-3 text-sm font-medium text-indigo-600 bg-white rounded-md hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={handleCallback}
                                        >
                                            {callback.text}
                                        </button>
                                    )}
                                </div>
                                {/* <div className="flex flex-shrink-0 ml-4">
                                    <button
                                        type="button"
                                        className="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        onClick={() => {
                                            setShow(false)
                                        }}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </>
    )
}
