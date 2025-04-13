import { Link } from "wouter";

interface HeaderProps {
  currentPath: string;
}

export default function Header({ currentPath }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <span className="text-primary font-bold text-xl cursor-pointer">GermanAI Writer</span>
              </Link>
            </div>
            <nav className="ml-6 hidden sm:flex space-x-8">
              <Link href="/">
                <a className={`${currentPath === "/" ? "text-primary border-b-2 border-primary" : "text-secondary hover:text-primary border-transparent border-b-2 hover:border-accent"} px-1 pt-1 font-medium`}>
                  Inhaltsangabe
                </a>
              </Link>
              <Link href="/worksheets">
                <a className={`${currentPath === "/worksheets" ? "text-primary border-b-2 border-primary" : "text-secondary hover:text-primary border-transparent border-b-2 hover:border-accent"} px-1 pt-1 font-medium`}>
                  Worksheets
                </a>
              </Link>
              <Link href="/templates">
                <a className={`${currentPath === "/templates" ? "text-primary border-b-2 border-primary" : "text-secondary hover:text-primary border-transparent border-b-2 hover:border-accent"} px-1 pt-1 font-medium`}>
                  Templates
                </a>
              </Link>
              <Link href="/guide">
                <a className={`${currentPath === "/guide" ? "text-primary border-b-2 border-primary" : "text-secondary hover:text-primary border-transparent border-b-2 hover:border-accent"} px-1 pt-1 font-medium`}>
                  Guide
                </a>
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium">
              Anmelden
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
