import React from 'react'
import { Search } from 'lucide-react'

function SearchBar() {
  return (
    <div className="hidden md:flex items-center gap-2 rounded-md px-2 py-1 shadow-2">
      <Search className="w-4 h-4 text-gray-500"/>
      <input
        className="placeholder:text-gray-500 placeholder:italic"
        placeholder="Rechercher..."
        type="text"
        name="search"
      />    
    </div>
  )
}

export default SearchBar