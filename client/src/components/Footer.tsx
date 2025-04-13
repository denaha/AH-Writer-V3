export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-primary font-bold">GermanAI Writer</span>
            <span className="text-secondary text-sm ml-2">© {new Date().getFullYear()} Alle Rechte vorbehalten</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-secondary hover:text-primary text-sm">Datenschutz</a>
            <a href="#" className="text-secondary hover:text-primary text-sm">Impressum</a>
            <a href="#" className="text-secondary hover:text-primary text-sm">Hilfe</a>
            <a href="#" className="text-secondary hover:text-primary text-sm">Kontakt</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
