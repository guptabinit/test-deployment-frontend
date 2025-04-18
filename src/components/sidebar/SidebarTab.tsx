import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

interface SidebarTabProps {
  icon: React.ReactNode;
  text: string;
  href: string;
  isActive: boolean;
  className?: string;
};

export const SidebarTab = ({ icon, text, href, isActive }: SidebarTabProps) => {
  const router = useRouter();

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start px-3 font-normal text-[13px] h-auto py-2 text-left"
      onClick={() => router.push(href)}
    >
      <div className="min-w-[20px] flex items-center justify-center">
        {icon}
      </div>
      <span className="ml-3 flex-1 truncate">{text}</span>
    </Button>
  );
};
