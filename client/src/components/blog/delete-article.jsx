import React, { useEffect, useState } from 'react'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'
import { toast } from 'react-toastify'

const DeleteArticle = (props) => {
    const { articleId } = props.match.params
    const jwtToken = sessionManager.getUserInfo().authtoken

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    useEffect(() => {
        requester.detailsArticle(articleId)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(res => {
                setTitle(res.title)
                setContent(res.content)
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

    const handleFormSubmit = (e) => {
        e.preventDefault()

        requester.deleteArticle(articleId, jwtToken)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(res => {
                toast.info(res.success, {
                    className: 'success-toast'
                })
                props.history.goBack()
            })
            .catch(error => {
                
                error.json()
                    .then(err => {
                        toast.info(err.message, {
                            className: 'error-toast'
                        })
                    })
            })
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="form-type">You are about to delete the following article</div>
            <hr />

            <label htmlFor="article-name">Title:</label>
            <input defaultValue={title} id="article-name" disabled />

            <label htmlFor="article-content">Content:</label>
            <textarea value={content} id="article-content" disabled></textarea>

            <hr />
            <button className="button" type="submit">Delete me <span role="img">😭</span></button>
        </form>
    )
}

export default DeleteArticle