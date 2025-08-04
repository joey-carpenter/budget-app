import React from "react";

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
} from "~/components/ui/navigation-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import { UserRound } from "lucide-react";

import ModeToggle from "~/components/mode-toggle";

import { auth } from "~/server/auth";

async function Navbar() {
	const session = await auth();

	return (
		<nav className="flex items-center justify-between p-4">
			{/* Left Side: Logo and Navigation Links */}
			<div className="flex items-center space-x-4">
				{/* Logo */}
				<Link className="cursor-pointer font-bold" href="/">
					Jacks Lab
				</Link>

				{/* Navigation Menu */}
				<Button asChild variant="ghost" className="text-sm">
					<Link href="/dashboard">Dashboard</Link>
				</Button>
				{/* <Button asChild variant="ghost" className="text-sm">
					<Link href="/settings">Settings</Link>
				</Button> */}
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
							<AvatarImage src={session?.user.image || ""} />
							<AvatarFallback>
								<UserRound size={32} className="rounded-full p-1.5" />
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					{session && (
						<DropdownMenuContent>
							<DropdownMenuItem>Account Settings</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/api/auth/signout">Logout</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					)}
				</DropdownMenu>
			</div>
		</nav>
	);
}

export default Navbar;
