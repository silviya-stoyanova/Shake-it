import { useEffect } from 'react'

// Custom React Hook
// It allows combining Hooks provided by React into your own abstractions,
// and reuse common stateful logic between different components.
const useTitle = (title) => {
    // useEffect hook can be used only within a funtional component
    // it is an alternative for componentDidMount, componentDidUpdate, and componentWillUnmount
    useEffect(() => {
        document.title = `${title} - Shake it`
        // adding [title] as a second argument will cause a component re-render
        // only when <title> is changed
    }, [title])
}

export default useTitle