const Footer: React.FC = () => (
  <footer className="bg-black text-white py-12 border-t border-gray-800">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Product</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-400 hover:text-white">
                Quick Mails
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white">
                Bulk Mails
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-400 hover:text-white">
                About
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Connect</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-400 hover:text-white">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white">
                GitHub
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white">
                Discord
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-400">
        <p>&copy; 2024 Mailfu. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
export default Footer;
