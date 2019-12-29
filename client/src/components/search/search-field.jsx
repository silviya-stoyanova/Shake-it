import React from 'react'
import '../../static/css/search.css'

function SearchField(products) {
    return (
        <div className="search">
            <label htmlFor="search">Find milkshake: </label>
            <input onChange={(e) => this.onSearchChange(e, products)} name="search" placeholder="e.g.: chocolate" type="text" id="search" />
        </div>
    )
}

export default SearchField