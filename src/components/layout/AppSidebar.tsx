
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useProject } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Home, FolderPlus, Settings, Cpu, HelpCircle, Code } from "lucide-react";

export function AppSidebar() {
  const { projects } = useProject();
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center p-4">
        <Cpu className="h-6 w-6 mr-2 text-sidebar-foreground" />
        <span className="text-xl font-bold text-sidebar-foreground">AI Generator</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard">
                    <Home className="h-4 w-4 mr-2" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/new-project">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    <span>New Project</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/ai-models">
                    <Cpu className="h-4 w-4 mr-2" />
                    <span>AI Models</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/help">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <span>Help & Tutorial</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {projects.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton 
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      <span>{project.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-sidebar-foreground opacity-60">
          AI Project Generator v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
