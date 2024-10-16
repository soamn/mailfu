import React from 'react'

const Header = () => {
  return (
      <div>
            <header className=" py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="text-2xl  font-Kablammo">
            <h1
              className="bg-gradient-to-r from-white  to-gray-400 inline-block text-transparent bg-clip-text 
            
            "
            >
              Mailfu
            </h1>
          </a>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-white">
                  Pricing
                </a>
              </li>

              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="/quickmail" className="text-gray-400 hover:text-white">
                  Test The Product
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <a
              href="/auth/login"
              className="text-gray-400 hover:text-white mr-4"
            >
              Sign In
            </a>
            <a
              href="/auth/signup"
              className="bg-white text-black py-2 px-4 rounded-md hover:bg-gray-200 transition duration-300"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>
    </div>

  )
}

export default Header