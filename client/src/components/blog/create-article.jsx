import React, { useState } from 'react'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'
import { toast } from 'react-toastify'
import { articleValidations } from '../hocs/validations'

const CreateArticle = function (props) {

    const [articleTitle, setArticleTitle] = useState('')
    const [articleContent, setArticleContent] = useState('')

    const [articleTitleClass, setArticleTitleClass] = useState('')
    const [articleContentClass, setArticleContentClass] = useState('')

    const handleInputChange = (e) => {
        // this['set' + e.target.name](e.target.value)
        e.target.name.includes('Title')
            ? setArticleTitle(e.target.value)
            : setArticleContent(e.target.value)

        const isValid = articleValidations.validateData({ title: articleTitle, content: articleContent })

        if (isValid.title === 'valid') {
            setArticleTitleClass('correct')
        } else {
            // console.log(isValid)
            setArticleTitleClass('error')
        }

        if (isValid.content === 'valid') {
            setArticleContentClass('correct')
        } else {
            // console.log(isValid)
            setArticleContentClass('error')
        }
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        const jwtToken = sessionManager.getUserInfo().authtoken
        const isValid = articleValidations.validateOnSubmit({ title: articleTitle, content: articleContent })

        if (!isValid) {
            return
        }

        requester.createArticle({ articleTitle, articleContent }, jwtToken)
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

                props.history.goBack()
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
            <input onChange={handleInputChange} autoFocus className={articleTitleClass} type="text" name="ArticleTitle" id="article-name" />

            <label htmlFor="article-content">Content:</label>
            <textarea onChange={handleInputChange} className={articleContentClass} name="ArticleContent" id="article-content"></textarea>

            <hr />
            <button className="button" type="submit">Publish me <span role="img">😊</span></button>
        </form>
    )
}

export default CreateArticle