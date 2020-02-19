import React, { useState } from 'react'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'
import { toast } from 'react-toastify'

const CreateArticle = function () {

    const [articleName, setArticleName] = useState('')
    const [articleContent, setArticleContent] = useState('')

    const handleInputChange = (e) => {
        // this['set' + e.target.name](e.target.value)

        e.target.name.includes('Name')
            ? setArticleName(e.target.value)
            : setArticleContent(e.target.value)
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        const jwtToken = sessionManager.getUserInfo().authtoken

        requester.createArticle({ articleName, articleContent }, jwtToken)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject()
                }
                return res.json()
            })
            .then(res => {
                toast.info(res.success, {
                    className: 'success-toast'
                })
            })
            .catch(error => {
                error.json(err => {
                    toast.info(err.message, {
                        className: 'error-toast'
                    })
                })
            })
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="form-type">Add an article</div>
            <hr />

            <label htmlFor="article-name">Title:</label>
            <input onChange={handleInputChange} autoFocus type="text" name="ArticleName" id="article-name" />

            <label htmlFor="article-content">Content:</label>
            <textarea onChange={handleInputChange} name="ArticleContent" id="article-content"></textarea>

            <hr />
            <button className="button" type="submit">Publish me 😊</button>
        </form>
    )
}

export default CreateArticle