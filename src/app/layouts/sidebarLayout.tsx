import { classNames } from "@/components/utils"
import { Dialog, Menu, Transition } from "@headlessui/react"
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { ForwardRefExoticComponent, Fragment, SVGProps } from "react"

export type HeroIcon = ForwardRefExoticComponent<
    SVGProps<SVGSVGElement> & {
        title?: string | undefined
        titleId?: string | undefined
    }
>

export type NavigationItem = {
    name: string
    href: string
    icon: HeroIcon
    current: boolean
}

export type UserNavigationItem = {
    name: string
    href: string
}

export type SidebarLayoutProps = {
    navigationItems: NavigationItem[]
    userNavigationItems: UserNavigationItem[]
    logoLocalPath?: string
    children: React.ReactNode
    onSelectedNavigationItem: (itemIndex: number) => void
    sidebarOpen: boolean
    onSideBarOpen: (open: boolean) => void
}

export type SidebarState = {
    navigationItems: NavigationItem[]
    userNavigationItems: UserNavigationItem[]
    sidebarOpen: boolean
}

export default function SidebarLayout({
    navigationItems,
    userNavigationItems,
    logoLocalPath,
    children,
    onSelectedNavigationItem,
    sidebarOpen,
    onSideBarOpen,
}: SidebarLayoutProps) {
    return (
        <>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-40 lg:hidden"
                    onClose={onSideBarOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex ">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-gray-800">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 pt-2 -mr-12">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() => onSideBarOpen(false)}
                                        >
                                            <span className="sr-only">
                                                Close sidebar
                                            </span>
                                            <XMarkIcon
                                                className="w-6 h-6 text-white"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex items-center flex-shrink-0 px-4">
                                    <Image
                                        className="w-auto h-8"
                                        src={logoLocalPath ?? ""}
                                        alt="Errore nel caricamento del logo"
                                        width={512}
                                        height={512}
                                    />
                                </div>
                                <div className="flex-1 h-0 mt-5 overflow-y-auto">
                                    <nav className="px-2 space-y-1">
                                        {navigationItems.map(
                                            (item, itemIndex) => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className={classNames(
                                                        /*  item.current
                                                            ? "bg-gray-900 text-white"
                                                            :  */ "text-gray-300 hover:bg-gray-700 hover:text-white",
                                                        "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                                                    )}
                                                    onClick={() =>
                                                        onSelectedNavigationItem(
                                                            itemIndex
                                                        )
                                                    }
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            /*  item.current
                                                                ? "text-gray-300"
                                                                : */ "text-gray-400 group-hover:text-gray-300",
                                                            "mr-4 h-6 w-6 flex-shrink-0"
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </a>
                                            )
                                        )}
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                        <div className="flex-shrink-0 w-14" aria-hidden="true">
                            {/* Dummy element to force sidebar to shrink to fit close icon */}
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex flex-col flex-1 min-h-0 bg-gray-800">
                    <div className="flex items-center flex-shrink-0 h-16 px-4 bg-gray-900">
                        <Image
                            className="w-auto h-8"
                            src={logoLocalPath ?? ""}
                            alt="Errore nel caricamento del logo"
                            width={512}
                            height={512}
                        />
                    </div>
                    <div className="flex flex-col flex-1 overflow-y-auto">
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            {navigationItems.map((item, itemIndex) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        /* item.current
                                            ? "bg-gray-900 text-white"
                                            : */ "text-gray-300 hover:bg-gray-700 hover:text-white",
                                        "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                                    )}
                                    onClick={
                                        () =>
                                            onSelectedNavigationItem(itemIndex)
                                        /* handleSwapActiveItem(itemIndex) */
                                    }
                                >
                                    <item.icon
                                        className={classNames(
                                            /* item.current
                                                ? "text-gray-300"
                                                : */ "text-gray-400 group-hover:text-gray-300",
                                            "mr-3 h-6 w-6 flex-shrink-0"
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:pl-64 h-full">
                <div className="relative h-full">
                    <div className="fixed inset-x-0 lg:left-64 z-10 flex flex-shrink-0 h-16 bg-white shadow ">
                        <button
                            type="button"
                            className="px-4 text-gray-500  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                            onClick={() => onSideBarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3BottomLeftIcon
                                className="w-6 h-6"
                                aria-hidden="true"
                            />
                        </button>

                        <div className="relative flex justify-between flex-1 px-4 ">
                            <div className="flex flex-1"></div>
                            <div className="flex items-center ml-4 lg:ml-6">
                                {/* <button
                                type="button"
                                className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <span className="sr-only">
                                    View notifications
                                </span>
                                <BellIcon
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                />
                            </button> */}

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                            <span className="sr-only">
                                                Open user menu
                                            </span>
                                            <Image
                                                className="w-auto h-8"
                                                src="/defaultUserLogo.avif"
                                                alt="Errore nel caricamento del logo"
                                                width={512}
                                                height={512}
                                            />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            {userNavigationItems.map((item) => (
                                                <Menu.Item key={item.name}>
                                                    {({ active }) => (
                                                        <a
                                                            href={item.href}
                                                            className={classNames(
                                                                active
                                                                    ? "bg-gray-100"
                                                                    : "",
                                                                "block px-4 py-2 text-sm text-gray-700"
                                                            )}
                                                        >
                                                            {item.name}
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    {/* content */}
                    <div className="pt-16 h-full">{children}</div>
                </div>
            </div>
        </>
    )
}
