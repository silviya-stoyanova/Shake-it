import React, { useEffect, useState } from 'react'
import requester from '../../utilities/requests-util'
import { toast } from 'react-toastify'

const ArticleDetails = (props) => {
    const [article, setArticle] = useState({})

    useEffect(() => {
        requester.detailsArticle(props.match.params.articleId)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(res => {
                setArticle(res)
            })
            .catch(error => {
                error.json()
                    .then(err => {
                        props.history.push('/')

                        toast.info(err.message, {
                            className: 'error-toast'
                        })
                    })
            })

    }, [])

    return (
        <section>
            <header>{article.title}</header>
            <main>{article.content}</main>
        </section>
    )
}

export default ArticleDetails