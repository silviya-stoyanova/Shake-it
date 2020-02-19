import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { UserInfoConsumer } from '../../App'
import allArticlesStyle from '../../static/css/article/all-articles.module.css'

class Articles extends Component {
    constructor(props) {
        super(props)
        this.state = {
            articles: []
        }
    }

    CreateArticleField = () => (
        <section className={allArticlesStyle.createArticleField}>
            <Link to="/blog/create-article" className={allArticlesStyle.link}>
                <span className={allArticlesStyle.plusSign}>+</span>
                <span>Add new article</span>
            </Link>
        </section>
    )

    render() {
        const { articles } = this.state

        return (
            <Fragment>
                <UserInfoConsumer>
                    {data => data.role === 'Admin' && this.CreateArticleField()}
                </UserInfoConsumer>

                {articles.map(a => (
                    <article>
                        <Link to={`/article/details/${a._id}`}>
                            <h3>{a.title}</h3>
                        </Link>
                        <div>{a.content.split(' ').slice(0, 20).join(' ')} ...</div>
                    </article>
                ))}
            </Fragment>
        )
    }

    componentDidMount() {
        // fetch articles

    }

}
export default Articles