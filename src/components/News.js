import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from './Spinner';

const News = (props) => {

    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const updateNews = async () => {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        props.setProgress(100);
    }

    useEffect(() => {
        updateNews()
        document.title = `Khabar - ${capitalizeFirstLetter(props.category)}`
        //eslint-disable-next-line
    }, [])


    const fetchMoreData = async () => {
        setPage(page + 1)
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
    };

    return (
        <>
            <h2 className="text-center " style={{ margin: '35px 0px', marginTop: '90px' }}> {capitalizeFirstLetter(props.category)} Top Headlines </h2>
            {loading && <Spinner />}
            <InfiniteScroll dataLength={articles.length} next={fetchMoreData} hasMore={articles.length !== totalResults} loader={<Spinner />}>

                <div className="container">
                    <div className="row" >
                        {articles.map((el) => {
                            return <div className="col-md-4" key={el.url}>
                                <NewsItem title={el.title ? el.title.slice(0, 45) : ""} description={el.description ? el.description.slice(0, 88) : ""} imageUrl={el.urlToImage ? el.urlToImage : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5AYmGYqIl_jt8nFL6F3cyyMFlJUVgF5e_E0hmbXlNLQ&s"} newsUrl={el.url} author={el.author} date={el.publishedAt} source={el.source.name} />
                            </div>
                        })}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    )

}

News.defaultProps = {
    country: 'in',
    pageSize: 15,
    category: 'general'
}
News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
}

export default News
