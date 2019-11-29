import { useEffect } from 'react'

// Custom React Hook
// It allows combining Hooks provided by React into your own abstractions,
// and reuse common stateful logic between different components.
const useTitle = (title) => {
    // since useEffect hook can be used only within a funtional component
    // and is an alternative for componentDidMount, componentDidUpdate, and componentWillUnmount,
    // adding an empty array as a second argument will act like componentDidMount
    useEffect(() => {
        document.title = `Shake it - ${title}`
    }, [])
}

export default useTitle