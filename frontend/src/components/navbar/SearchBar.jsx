import React from 'react'
import { Search } from 'lucide-react'

function SearchBar() {
  return (
    <div>
      <div className="relative w-full max-w-sm ring-gray-500">
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full pl-10 pr-4 py-2 border  border-gray-500 rounded-2xl"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
    </div>
  )
}

export default SearchBar