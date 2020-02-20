import React, { Component } from 'react'
import { toast } from 'react-toastify'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'
import { articleValidations } from '../hocs/validations'

class EditArticle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            _id: '',
            title: '',
            content: '',
            articleTitleClass: '',
            articleContentClass: '',
        }
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value

        }, () => {
            const isValid = articleValidations.validateData(this.state)

            this.setState({
                articleTitleClass: isValid.title === 'valid' ? 'correct' : 'error',
                articleContentClass: isValid.content === 'valid' ? 'correct' : 'error'
            })
        })
    }

    handleFormSubmit = (e) => {
        e.preventDefault()
        const isValid = articleValidations.validateOnSubmit(this.state)
        const articleId = this.props.match.params.articleId
        const jwtToken = sessionManager.getUserInfo().authtoken
        const { title, content } = this.state

        if (!isValid) {
            return
        }

        requester.editArticle({ title, content }, articleId, jwtToken)
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
                this.props.history.goBack()
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

    render() {
        const { title, content, articleTitleClass, articleContentClass } = this.state

        return (
            <form onSubmit={this.handleFormSubmit}>
                <div className="form-type">Edit the following article</div>
                <hr />

                <label htmlFor="article-name">Title:</label>
                <input autoFocus onChange={this.handleInputChange} defaultValue={title} className={articleTitleClass} name="title" id="article-name" type="text" />

                <label htmlFor="article-content">Content:</label>
                <textarea onChange={this.handleInputChange} value={content} className={articleContentClass} name="content" id="article-content"></textarea>

                <hr />
                <button className="button" type="submit">Edit me <span role="img">😊</span></button>
            </form>
        )
    }

    componentDidMount() {
        const articleId = this.props.match.params.articleId

        requester.detailsArticle(articleId)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(({ title, content }) => {
                this.setState({ title, content })
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
}

export default EditArticle