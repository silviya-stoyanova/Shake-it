import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserInfoConsumer } from '../../App'
import { toast } from 'react-toastify'
import allArticlesStyle from '../../static/css/article/all-articles.module.css'
import requester from '../../utilities/requests-util'
import useTitle from '../page-title/useTitle.js'

const Articles = (props) => {
    useTitle('Blog')
    const [articles, setArticles] = useState([])

    useEffect(() => {
        requester.getBlog()
            .then(res => {
                if (!res.ok) {
                    return Promise.reject()
                }
                return res.json()
            })
            .then(res => {
                setArticles(res)
            })
            .catch(error => {
                error.json()
                    .then(err => {
                        toast.info(err.message, {
                            className: 'error-toast'
                        })
                    })
            })
    }, [])

    const CreateArticleField = () => (
        <section className={allArticlesStyle.createArticleField}>
            <Link to="/blog/article/create" className={allArticlesStyle.link}>
                <span className={allArticlesStyle.plusSign}>+</span>
                <span>Add new article</span>
            </Link>
        </section>
    )

    return (
        <Fragment>
            <UserInfoConsumer>
                {data => data.role === 'Admin' && CreateArticleField()}
            </UserInfoConsumer>

            {articles.map(a => (

                <article key={a._id}>
                    <Link to={`/blog/article/${a._id}`}>
                        <h3>{a.title}</h3>
                    </Link>
                    <div>{a.content.split(' ').slice(0, 20).join(' ')} ...</div>
                </article>
            ))}
        </Fragment>
    )

}

export default Articles