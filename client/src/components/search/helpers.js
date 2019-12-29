async function filterProducts(products, query) {
    const filteredProducts = products.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))

    await this.setState({
        filteredProducts
    })
}

function onSearchChange (e, products) {
    const querySearch = e.target.value
    this.filterProducts(products, querySearch)
}


export { filterProducts, onSearchChange }