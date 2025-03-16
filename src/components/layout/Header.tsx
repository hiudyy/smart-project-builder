
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, User, Github } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b h-16 flex items-center px-6 sticky top-0 bg-background z-10">
      <div className="flex-1 flex items-center">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold ml-2">AI Project Generator</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="hidden md:flex">
          <Github className="mr-2 h-4 w-4" />
          Connect to GitHub
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              {user?.email}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
