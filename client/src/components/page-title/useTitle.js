import { useEffect } from 'react'

// Custom React Hook
// It allows combining Hooks provided by React into your own abstractions,
// and reuse common stateful logic between different components.
const useTitle = (title) => {
    useEffect(() => {
        document.title = `Shake it - ${title}`
    })
}

export default useTitle