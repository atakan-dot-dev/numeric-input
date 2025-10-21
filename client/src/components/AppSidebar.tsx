import { Home, Book, Code2, TestTube2, Settings, Github } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

const navigationItems = [
  {
    title: 'Getting Started',
    icon: Home,
    id: 'getting-started',
  },
  {
    title: 'Attributes',
    icon: Settings,
    id: 'attributes',
  },
  {
    title: 'Examples',
    icon: Code2,
    id: 'examples',
  },
  {
    title: 'Tests',
    icon: TestTube2,
    id: 'tests',
  },
  {
    title: 'API Reference',
    icon: Book,
    id: 'api',
  },
];

export function AppSidebar() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold">NumericInput.js</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              v1.0.0
            </Badge>
            <Badge variant="outline" className="text-xs">
              Beta
            </Badge>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => scrollToSection(item.id)}
                    data-testid={`link-nav-${item.id}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Attribute Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => scrollToSection('attr-validation')}
                  className="text-sm"
                  data-testid="link-attr-validation"
                >
                  <span>Validation</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => scrollToSection('attr-formatting')}
                  className="text-sm"
                  data-testid="link-attr-formatting"
                >
                  <span>Formatting</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => scrollToSection('attr-display')}
                  className="text-sm"
                  data-testid="link-attr-display"
                >
                  <span>Display</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => scrollToSection('attr-locale')}
                  className="text-sm"
                  data-testid="link-attr-locale"
                >
                  <span>Locale</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild data-testid="link-github">
              <a
                href="https://github.com/yourusername/numeric-input"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                <span>View on GitHub</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
