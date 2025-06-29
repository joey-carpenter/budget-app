import React from 'react'

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
	NavigationMenuViewport,
} from "~/components/ui/navigation-menu"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Button } from "~/components/ui/button"
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"

import { UserRound } from "lucide-react";

import ModeToggle from "~/components/mode-toggle"

function Navbar() {
    return (
        <nav className="flex items-center justify-between p-4">
            {/* Left Side: Logo and Navigation Links */}
            <div className="flex items-center space-x-4">
                {/* Logo */}
                <Link className="font-bold cursor-pointer" href="/">budget.</Link>

                {/* Navigation Menu */}
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/dashboard">Dashboard</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/settings">Settings</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Right Side: Profile Dropdown */}
            <div className="flex items-center space-x-4">
                <ModeToggle />

                {/* Placeholder Profile Picture */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {/* <Button variant="ghost" size="icon" className="p-0">
										<UserRound
											size={128}
											className="rounded-full"
										/>
									</Button> */}
                        <Avatar>
                            <AvatarImage src="https://github.com/joey-carpenter.png" />
                            <AvatarFallback>
                                <UserRound
                                    size={32}
                                    className="rounded-full"
                                />
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Account Settings</DropdownMenuItem>
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}

export default Navbar